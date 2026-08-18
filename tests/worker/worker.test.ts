import { describe, expect, it, vi } from 'vitest';
import worker from '../../api/worker/src/index';
import type { Env } from '../../api/worker/src/index';
import { encodeChlPng, encodePngFixture } from '../fixtures/pngFixture';

function env(bucket?: Map<string, string>): Env {
  const r2 = bucket
    ? {
        async get(key: string) {
          const value = bucket.get(key);
          return value ? { json: async () => JSON.parse(value) } : null;
        },
        async put(key: string, value: string) {
          bucket.set(key, value);
        },
        async head() {
          return null;
        },
      }
    : undefined;
  return { FIND_BUCKET: r2 as Env['FIND_BUCKET'], ALLOWED_ORIGINS: 'http://localhost:3000' };
}

describe('worker routes', () => {
  it('serves health and rejects GET on generate', async () => {
    const health = await worker.fetch(new Request('https://finds.example/health'), env());
    expect(health.status).toBe(200);
    const body = await health.json();
    expect(body.checks.geminiKey).toBe('missing');
    const bad = await worker.fetch(new Request('https://finds.example/api/hotspots'), env());
    expect(bad.status).toBe(405);
  });

  it('allowlists the live Pages origin without extra ALLOWED_ORIGINS', async () => {
    const response = await worker.fetch(
      new Request('https://finds.example/health', {
        headers: { origin: 'https://finds-web-4j5.pages.dev' },
      }),
      {},
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe('https://finds-web-4j5.pages.dev');
  });

  it('rejects unknown regions', async () => {
    const response = await worker.fetch(
      new Request('http://localhost:3000/api/hotspots', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
        body: JSON.stringify({ region: 'Paris', n: 40 }),
      }),
      env(),
    );
    expect(response.status).toBe(400);
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
  });
});

describe('NASA adapter + cache', () => {
  it('returns NASA-derived coordinates and caches HIT after MISS', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('DescribeDomains')) {
        return new Response('<Domains><DimensionDomain><Domain>2026-08-14/2026-08-14/P1D</Domain></DimensionDomain></Domains>');
      }
      if (url.includes('Chlorophyll') || url.includes('PACE') || url.includes('VIIRS')) {
        return new Response(encodeChlPng(), { headers: { 'content-type': 'image/png' } });
      }
      return new Response(encodePngFixture(), { headers: { 'content-type': 'image/png' } });
    });
    vi.stubGlobal('fetch', fetchImpl);
    const bucket = new Map<string, string>();
    const req = () =>
      new Request('http://localhost:3000/api/hotspots', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
        body: JSON.stringify({ region: 'New York Bight', n: 10 }),
      });
    const miss = await worker.fetch(req(), env(bucket));
    expect(miss.status).toBe(200);
    expect(miss.headers.get('x-cache')).toBe('MISS');
    const missBody = await miss.json();
    expect(missBody.hotspots[0].lat).toBeGreaterThan(39);
    expect(missBody.hotspots[0].lat).toBeLessThan(42);
    expect(missBody.provenance.sourceAgency).toBe('NASA');
    const hit = await worker.fetch(req(), env(bucket));
    expect(hit.headers.get('x-cache')).toBe('HIT');
    vi.unstubAllGlobals();
  });

  it('does not persist transient Gemini failures when a key is configured', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('generativelanguage.googleapis.com')) {
        return new Response('unavailable', { status: 503 });
      }
      if (url.includes('DescribeDomains')) {
        return new Response('<Domains><DimensionDomain><Domain>2026-08-14/2026-08-14/P1D</Domain></DimensionDomain></Domains>');
      }
      if (url.includes('Chlorophyll') || url.includes('PACE') || url.includes('VIIRS')) {
        return new Response(encodeChlPng(), { headers: { 'content-type': 'image/png' } });
      }
      return new Response(encodePngFixture(), { headers: { 'content-type': 'image/png' } });
    });
    vi.stubGlobal('fetch', fetchImpl);
    const bucket = new Map<string, string>();
    const workerEnv = { ...env(bucket), GEMINI_API_KEY: 'test-placeholder' };
    const req = () =>
      new Request('http://localhost:3000/api/hotspots', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
        body: JSON.stringify({ region: 'New York Bight', n: 10 }),
      });
    const first = await worker.fetch(req(), workerEnv);
    expect(first.status).toBe(200);
    expect(first.headers.get('x-cache')).toBe('MISS');
    const body = await first.json();
    expect(body.provenance.model).toBeNull();
    expect(body.provenance.sourceAgency).toBe('NASA');
    expect(bucket.size).toBe(0);
    const second = await worker.fetch(req(), workerEnv);
    expect(second.headers.get('x-cache')).toBe('MISS');
    vi.unstubAllGlobals();
  });
});
