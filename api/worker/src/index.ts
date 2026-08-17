import { CACHE_TTL_SECONDS, DISCLAIMER, PIPELINE_VERSION, SCHEMA_VERSION, type GenerateResponse } from '../../../shared/types';
import { cacheObjectKey, stableCacheKey } from '../../../shared/cacheKey';
import { analyzeWithGemini } from '../../../shared/gemini';
import { fetchNasaObservations, NASA_PRODUCTS } from '../../../shared/nasa';
import { buildProvenance } from '../../../shared/provenance';
import { findRegion, regionToBBox } from '../../../shared/regions';
import { selectCandidates } from '../../../shared/scoring';
import { HttpError, assertMethod, parseJsonBody, validateGenerateRequest } from '../../../shared/validation';

interface R2ObjectBody {
  json(): Promise<unknown>;
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: string, options?: unknown): Promise<unknown>;
  head(key: string): Promise<unknown>;
}

export interface Env {
  FIND_BUCKET?: R2Bucket;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  ALLOWED_ORIGINS?: string;
  RATE_LIMITER?: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
}

const LOCAL_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5173',
  'http://localhost:8787',
  'https://localhost',
  'capacitor://localhost',
  'http://localhost',
];

function allowedOrigins(env: Env): string[] {
  const extra = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return [
    ...LOCAL_ORIGINS,
    'https://finds-web.pages.dev',
    'https://gunnchos3k.github.io',
    ...extra,
  ];
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') ?? '';
  const allow = allowedOrigins(env);
  const match = allow.includes(origin) ? origin : '';
  const headers: Record<string, string> = {
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-request-id',
    'Access-Control-Max-Age': '86400',
  };
  if (match) headers['Access-Control-Allow-Origin'] = match;
  return headers;
}

function json(data: unknown, status: number, request: Request, env: Env, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders(request, env),
      ...extra,
    },
  });
}

function requestId(request: Request): string {
  return request.headers.get('x-request-id') || crypto.randomUUID();
}

function log(event: string, fields: Record<string, unknown>): void {
  const safe = { ...fields };
  for (const key of Object.keys(safe)) {
    if (/key|token|authorization|secret|password/i.test(key)) delete safe[key];
  }
  console.log(JSON.stringify({ event, ...safe }));
}

async function handleHealth(request: Request, env: Env): Promise<Response> {
  let r2: 'ok' | 'missing' | 'error' = env.FIND_BUCKET ? 'ok' : 'missing';
  if (env.FIND_BUCKET) {
    try {
      await env.FIND_BUCKET.head('healthcheck');
    } catch {
      r2 = 'error';
    }
  }
  const status = r2 === 'error' ? 'degraded' : 'ok';
  return json(
    {
      status,
      service: 'finds-worker',
      time: new Date().toISOString(),
      checks: {
        r2,
        geminiKey: env.GEMINI_API_KEY ? 'configured' : 'missing',
        nasaColormaps: 'ok',
      },
    },
    status === 'ok' ? 200 : 503,
    request,
    env,
  );
}

async function handleVersion(request: Request, env: Env): Promise<Response> {
  return json(
    {
      name: 'finds-worker',
      schemaVersion: SCHEMA_VERSION,
      pipelineVersion: PIPELINE_VERSION,
      geminiModelDefault: env.GEMINI_MODEL || 'gemini-2.5-flash',
    },
    200,
    request,
    env,
  );
}

async function handleGenerate(request: Request, env: Env, id: string): Promise<Response> {
  const raw = await request.text();
  const parsed = validateGenerateRequest(parseJsonBody(raw));
  const region = findRegion(parsed.region)!;
  const bbox = regionToBBox(parsed.region, parsed.bbox);
  const model = env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

  if (env.RATE_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'anonymous';
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      throw new HttpError(429, 'rate_limited', 'Too many hotspot requests. Please retry later.');
    }
  }

  const nasa = await fetchNasaObservations(bbox);
  const cacheKey = stableCacheKey({
    region: region.id,
    bbox,
    n: parsed.n,
    observationDate: nasa.observationDate,
    variables: ['sst', 'chlorophyll_a'],
    model,
  });

  if (env.FIND_BUCKET) {
    const cached = await env.FIND_BUCKET.get(cacheObjectKey(cacheKey));
    if (cached) {
      const payload = (await cached.json()) as GenerateResponse;
      payload.provenance.mode = 'cache';
      payload.provenance.cache.status = 'HIT';
      payload.requestId = id;
      log('cache_hit', { requestId: id, region: region.id, cacheKey });
      return json(payload, 200, request, env, { 'x-request-id': id, 'x-cache': 'HIT' });
    }
  }

  const candidates = selectCandidates(nasa.cells, parsed.n);
  if (!candidates.length) {
    throw new HttpError(
      422,
      'no_observations',
      'NASA GIBS returned no usable SST or chlorophyll cells for this region and date.',
    );
  }

  const analysis = await analyzeWithGemini(region.name, candidates, nasa.cells, env);
  const payload: GenerateResponse = {
    schemaVersion: SCHEMA_VERSION,
    requestId: id,
    region: region.name,
    params: { n: analysis.hotspots.length, bbox, requestedN: parsed.n },
    hotspots: analysis.hotspots,
    provenance: buildProvenance({
      mode: 'live',
      region: region.name,
      observationDate: nasa.observationDate,
      retrievedAt: nasa.retrievedAt,
      model: analysis.usedModel ? analysis.model : null,
      cacheKey,
      cacheStatus: 'MISS',
      ttlSeconds: CACHE_TTL_SECONDS,
      qualityNotes: [...nasa.qualityNotes, ...analysis.qualityNotes],
      layersUsed: nasa.layersUsed,
    }),
    disclaimer: DISCLAIMER,
  };

  if (env.FIND_BUCKET) {
    await env.FIND_BUCKET.put(cacheObjectKey(cacheKey), JSON.stringify(payload), {
      httpMetadata: { contentType: 'application/json' },
      customMetadata: { storedAt: payload.provenance.generatedAt, pipelineVersion: PIPELINE_VERSION },
    });
  }

  log('cache_miss', {
    requestId: id,
    region: region.id,
    cacheKey,
    cells: nasa.cells.length,
    hotspots: payload.hotspots.length,
    gemini: analysis.usedModel,
    products: NASA_PRODUCTS.sst.dataset,
  });

  return json(payload, 200, request, env, { 'x-request-id': id, 'x-cache': 'MISS' });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = requestId(request);
    try {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders(request, env) });
      }
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, '') || '/';

      if (path === '/health' || path === '/api/health') {
        assertMethod(request.method, ['GET']);
        return handleHealth(request, env);
      }
      if (path === '/version' || path === '/api/version') {
        assertMethod(request.method, ['GET']);
        return handleVersion(request, env);
      }
      if (path === '/generate' || path === '/api/hotspots' || path === '/api/generate') {
        assertMethod(request.method, ['POST']);
        return await handleGenerate(request, env, id);
      }
      throw new HttpError(404, 'not_found', 'Unknown route.');
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        return json(
          { error: error.code, message: error.message, requestId: id },
          error.status,
          request,
          env,
          { 'x-request-id': id },
        );
      }
      log('unhandled_error', { requestId: id, name: error instanceof Error ? error.name : 'error' });
      return json(
        { error: 'internal_error', message: 'Unexpected worker error.', requestId: id },
        500,
        request,
        env,
        { 'x-request-id': id },
      );
    }
  },
};
