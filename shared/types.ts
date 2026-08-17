export type Mode = 'live' | 'cache' | 'demo' | 'offline';

export type BBox = [west: number, south: number, east: number, north: number];

export interface RegionDefinition {
  id: string;
  name: string;
  description: string;
  bbox: BBox;
  view: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

export interface ObservationVariable {
  name: 'sst' | 'chlorophyll_a';
  value: number | null;
  units: string;
  quality: 'ok' | 'nodata' | 'out_of_range';
}

export interface ObservationCell {
  id: string;
  lat: number;
  lon: number;
  sstC: number | null;
  chlorophyllMgM3: number | null;
  qualityNotes: string[];
}

export interface Hotspot {
  id: string;
  lat: number;
  lon: number;
  score: number;
  label: 'low' | 'moderate' | 'elevated' | 'high';
  rationale: string;
  sstC: number | null;
  chlorophyllMgM3: number | null;
  qualityNotes: string[];
}

export interface Provenance {
  mode: Mode;
  sourceAgency: 'NASA';
  sourceProduct: string[];
  sourceDataset: string[];
  observationStart: string;
  observationEnd: string;
  retrievedAt: string;
  variables: Array<{ name: string; units: string }>;
  qualityNotes: string[];
  model: string | null;
  pipelineVersion: string;
  generatedAt: string;
  cache: {
    key: string;
    status: 'HIT' | 'MISS' | 'BYPASS';
    ttlSeconds: number;
  };
}

export interface GenerateRequest {
  region: string;
  n: number;
  bbox?: BBox;
}

export interface GenerateResponse {
  schemaVersion: '1.0.0';
  requestId: string;
  region: string;
  params: {
    n: number;
    bbox: BBox;
    requestedN: number;
  };
  hotspots: Hotspot[];
  provenance: Provenance;
  disclaimer: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: 'finds-worker';
  time: string;
  checks: {
    r2: 'ok' | 'missing' | 'error';
    geminiKey: 'configured' | 'missing';
    nasaColormaps: 'ok' | 'error';
  };
}

export const DISCLAIMER =
  'FINDS is an exploratory research and visualization project. Hotspot scores are not real-time shark warnings and should not be used as a substitute for official marine-safety guidance.';

export const PIPELINE_VERSION = '2026.08.1';
export const SCHEMA_VERSION = '1.0.0' as const;
export const MAX_POINTS = 200;
export const MIN_POINTS = 10;
export const DEFAULT_POINTS = 80;
export const MAX_BODY_BYTES = 8_192;
export const CACHE_TTL_SECONDS = 6 * 60 * 60;
export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';
