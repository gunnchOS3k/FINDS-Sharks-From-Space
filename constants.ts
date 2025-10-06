import type { ApiResponse } from './types';
import { Type } from '@google/genai';

export const GEMINI_PROMPT_TEMPLATE = `
You are generating geospatial "hotspot" candidates for likely shark activity for a single ocean region.

OUTPUT FORMAT (JSON only; no markdown, no extra text)
{
  "region": "<string e.g. NYC>",
  "params": {
    "n": <int>,
    "bbox": [west, south, east, north] | null,
    "seed": <int|null>
  },
  "hotspots": [
    { "lat": <number>, "lon": <number>, "score": <number 0..1> },
    ...
  ]
}

REQUIREMENTS
- Return VALID JSON only (no comments, no trailing commas, no code fences).
- 1 ≤ hotspots.length ≤ params.n (target ~params.n points).
- Coordinates must be within the ocean area of the given region/bbox.
- If the region is landlocked (e.g., a city far from the coast), you MUST return an empty 'hotspots' array. DO NOT generate points on land, rivers, or lakes.
- Use 5-6 decimal places for lat/lon; use 3 decimals for score (0..1).
- Distribute points sensibly along coasts or likely habitats; avoid placing points on land.
- If a bounding box (bbox) is provided, stay inside it strictly.
- If region is ambiguous, assume the coastal area of the most common interpretation.
- Do not include any personal data.
- If you cannot produce results, return:
  { "region":"<region>", "params":{"n":0,"bbox":null,"seed":null}, "hotspots": [] }

CONTEXT HINTS (optional; do not include in the output)
- Consider broad oceanographic cues: coastal proximity, continental shelves, upwelling zones.
- For a quick demo, it's OK to distribute plausible synthetic points; weight closer to shorelines.

INPUT
region="{REGION}"
n={N}
bbox=null
seed=42

TASK
Generate the JSON object as specified.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    region: { type: Type.STRING },
    params: {
      type: Type.OBJECT,
      properties: {
        n: { type: Type.INTEGER },
        bbox: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        seed: { type: Type.INTEGER }
      }
    },
    hotspots: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          lat: { type: Type.NUMBER },
          lon: { type: Type.NUMBER },
          score: { type: Type.NUMBER }
        }
      }
    }
  }
};

export const DEMO_DATA: ApiResponse = {
  region: "New York Bight",
  params: { n: 200, bbox: null, seed: 42 },
  hotspots: [
    { id: "demo-1", lat: 40.7128, lon: -74.0060, score: 0.95 },
    { id: "demo-2", lat: 40.7589, lon: -73.9851, score: 0.87 },
    { id: "demo-3", lat: 40.6892, lon: -74.0445, score: 0.92 },
    { id: "demo-4", lat: 40.7505, lon: -73.9934, score: 0.78 },
    { id: "demo-5", lat: 40.6782, lon: -73.9442, score: 0.85 }
  ]
};

export const LOADING_MESSAGES = [
  'Initializing AI model...',
  'Analyzing historical ocean patterns...',
  'Cross-referencing satellite telemetry...',
  'Simulating marine life migration...',
  'Generating predictive hotspot coordinates...',
  'Finalizing geospatial data...'
];