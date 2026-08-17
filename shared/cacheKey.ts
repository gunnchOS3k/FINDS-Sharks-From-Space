import { PIPELINE_VERSION, type BBox } from './types';

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
