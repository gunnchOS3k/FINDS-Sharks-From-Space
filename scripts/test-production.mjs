#!/usr/bin/env node
/**
 * Production smoke tests for FINDS Worker + Pages.
 * Usage:
 *   FINDS_WORKER_URL=https://... FINDS_PAGES_URL=https://... npm run test:production
 *   npm run test:production -- --worker https://... --pages https://...
 * Never prints secrets.
 */
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    worker: { type: 'string', short: 'w' },
    pages: { type: 'string', short: 'p' },
    cache: { type: 'boolean', default: false },
  },
});

function arg(name, envName) {
  return values[name] || process.env[envName] || '';
}

const WORKER = arg('worker', 'FINDS_WORKER_URL').replace(/\/+$/, '');
const PAGES = arg('pages', 'FINDS_PAGES_URL').replace(/\/+$/, '');
const RUN_CACHE = values.cache || process.argv.includes('--cache');

if (!WORKER) {
  console.error('FINDS_WORKER_URL (or --worker) is required');
  process.exit(1);
}

const FORBIDDEN = [/localhost/i, /127\.0\.0\.1/, /GEMINI_API_KEY/, /CLOUDFLARE_API_TOKEN/];

function assertNoSecrets(text, label) {
  for (const pattern of FORBIDDEN) {
    if (pattern.test(text)) throw new Error(`${label} contains forbidden pattern ${pattern}`);
  }
}

async function getJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  assertNoSecrets(text, url);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${url} returned non-JSON (${response.status})`);
  }
  if (!response.ok) throw new Error(`${url} HTTP ${response.status}: ${data.message || text.slice(0, 200)}`);
  return { data, headers: response.headers, status: response.status };
}

function assertHealth(data) {
  if (data.status !== 'ok') throw new Error(`health status ${data.status}`);
  if (data.checks?.geminiKey !== 'configured') throw new Error(`geminiKey=${data.checks?.geminiKey}`);
  if (data.checks?.r2 !== 'ok') throw new Error(`r2=${data.checks?.r2}`);
}

function assertVersion(data) {
  if (!String(data.geminiModelDefault || '').includes('gemini-3.6-flash')) {
    throw new Error(`unexpected model default ${data.geminiModelDefault}`);
  }
}

function assertHotspot(data, headers, expectCache) {
  if (data.schemaVersion !== '1.0.0') throw new Error('schemaVersion mismatch');
  if (data.provenance?.sourceAgency !== 'NASA') throw new Error('missing NASA provenance');
  if (!data.provenance?.model?.includes('gemini-3.6-flash')) {
    throw new Error(`provenance model ${data.provenance?.model}`);
  }
  const notes = data.provenance?.qualityNotes || [];
  if (notes.some((n) => /deterministic NASA-derived scores only|Gemini key not configured|Gemini unavailable|Gemini HTTP/i.test(n))) {
    throw new Error(`Gemini fallback: ${notes.join('; ')}`);
  }
  if (!Array.isArray(data.hotspots) || !data.hotspots.length) throw new Error('empty hotspots');
  if (expectCache) {
    const cache = headers.get('x-cache');
    if (cache !== expectCache) throw new Error(`expected x-cache ${expectCache}, got ${cache}`);
  }
}

async function testPages() {
  if (!PAGES) {
    console.log('SKIP Pages (FINDS_PAGES_URL not set)');
    return;
  }
  for (const path of ['/', '/manifest.webmanifest', '/pwa-192x192.png']) {
    const response = await fetch(`${PAGES}${path}`);
    if (!response.ok) throw new Error(`Pages ${path} HTTP ${response.status}`);
    const text = path.endsWith('.png') ? '' : await response.text();
    assertNoSecrets(text, `Pages ${path}`);
  }
  const index = await (await fetch(`${PAGES}/`)).text();
  if (!/FINDS/i.test(index)) throw new Error('Pages index missing FINDS title');
  console.log('PASS Pages shell', PAGES);
}

async function testWorker() {
  const health = await getJson(`${WORKER}/health`);
  assertHealth(health.data);
  console.log('PASS Worker /health');

  const version = await getJson(`${WORKER}/version`);
  assertVersion(version.data);
  console.log('PASS Worker /version', version.data.geminiModelDefault);

  const body = JSON.stringify({
    region: 'new-york-bight',
    n: 37,
    bbox: [-74.48, 39.52, -71.52, 41.18],
  });
  const miss = await getJson(`${WORKER}/api/hotspots`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-request-id': `prod-smoke-${Date.now()}` },
    body,
  });
  assertHotspot(miss.data, miss.headers, RUN_CACHE ? 'MISS' : undefined);
  console.log('PASS Worker hotspot', miss.headers.get('x-cache') || 'no-cache-header');

  if (RUN_CACHE) {
    const hit = await getJson(`${WORKER}/api/hotspots`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    assertHotspot(hit.data, hit.headers, 'HIT');
    console.log('PASS R2 cache HIT');
  }
}

async function main() {
  console.log('Production smoke against Worker', WORKER);
  await testWorker();
  await testPages();
  console.log('All production smoke checks passed.');
}

main().catch((error) => {
  console.error('FAIL', error.message || error);
  process.exit(1);
});
