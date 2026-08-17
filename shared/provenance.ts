import { DISCLAIMER, PIPELINE_VERSION, type GenerateResponse, type Mode } from './types';
import { NASA_PRODUCTS } from './nasa';

export function buildProvenance(input: {
  mode: Mode;
  region: string;
  observationDate: string;
  retrievedAt: string;
  model: string | null;
  cacheKey: string;
  cacheStatus: 'HIT' | 'MISS' | 'BYPASS';
  ttlSeconds: number;
  qualityNotes: string[];
  layersUsed: string[];
}): GenerateResponse['provenance'] {
  return {
    mode: input.mode,
    sourceAgency: 'NASA',
    sourceProduct: input.layersUsed,
    sourceDataset: [NASA_PRODUCTS.sst.dataset, NASA_PRODUCTS.chlorophyll.dataset],
    observationStart: `${input.observationDate}T00:00:00Z`,
    observationEnd: `${input.observationDate}T23:59:59Z`,
    retrievedAt: input.retrievedAt,
    variables: [
      { name: 'sea_surface_temperature', units: NASA_PRODUCTS.sst.units },
      { name: 'chlorophyll_a', units: NASA_PRODUCTS.chlorophyll.units },
    ],
    qualityNotes: input.qualityNotes,
    model: input.model,
    pipelineVersion: PIPELINE_VERSION,
    generatedAt: new Date().toISOString(),
    cache: {
      key: input.cacheKey,
      status: input.cacheStatus,
      ttlSeconds: input.ttlSeconds,
    },
  };
}

export { DISCLAIMER };
