import { CACHE_TTL_SECONDS, PIPELINE_VERSION, type BBox, type GenerateResponse } from './types';

export function roundCoord(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function stableCacheKey(input: {
  region: string;
  bbox: BBox;
  n: number;
  observationDate: string;
  variables: string[];
  model: string;
  pipelineVersion?: string;
}): string {
  const [west, south, east, north] = input.bbox.map(roundCoord);
  const vars = [...input.variables].sort().join('+');
  const region = input.region.trim().toLowerCase().replace(/\s+/g, '-');
  const pipeline = input.pipelineVersion ?? PIPELINE_VERSION;
  return [
    'finds',
    pipeline,
    region,
    `${west},${south},${east},${north}`,
    `n${input.n}`,
    input.observationDate,
    vars,
    input.model,
  ].join('|');
}

export function cacheObjectKey(cacheKey: string): string {
  return `hotspots/${encodeURIComponent(cacheKey)}.json`;
}

export function isCacheFresh(storedAt: string, ttlSeconds: number, now = Date.now()): boolean {
  const then = Date.parse(storedAt);
  if (Number.isNaN(then)) return false;
  return now - then < ttlSeconds * 1000;
}

/** Timeouts and Gemini HTTP errors must not be served as a sticky R2 HIT. */
export function isTransientGeminiFailure(qualityNotes: string[] | undefined): boolean {
  return (qualityNotes ?? []).some((note) => /Gemini unavailable|Gemini HTTP \d+/i.test(note));
}

export function shouldServeCachedHotspots(
  payload: Pick<GenerateResponse, 'provenance'> | { provenance?: GenerateResponse['provenance'] },
  now = Date.now(),
): boolean {
  const provenance = payload.provenance;
  if (!provenance) return false;
  if (isTransientGeminiFailure(provenance.qualityNotes)) return false;
  const ttl = provenance.cache?.ttlSeconds ?? CACHE_TTL_SECONDS;
  if (!provenance.generatedAt) return true;
  return isCacheFresh(provenance.generatedAt, ttl, now);
}
