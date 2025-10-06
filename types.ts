export interface Hotspot {
  id: string;
  lat: number;
  lon: number;
  score: number;
}

export interface GenerationParams {
  n: number;
  bbox: [number, number, number, number] | null;
  seed: number | null;
}

export interface ApiResponse {
  region: string;
  params: GenerationParams;
  hotspots: Hotspot[];
}