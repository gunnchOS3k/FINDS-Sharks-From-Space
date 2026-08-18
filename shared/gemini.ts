import { DEFAULT_GEMINI_MODEL, type Hotspot, type ObservationCell } from './types';
import { cellsToHotspots, scoreLabel } from './scoring';

export interface GeminiAnalysis {
  hotspots: Hotspot[];
  model: string;
  usedModel: boolean;
  qualityNotes: string[];
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    hotspots: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          score: { type: 'NUMBER' },
          rationale: { type: 'STRING' },
        },
        required: ['id', 'score', 'rationale'],
      },
    },
  },
  required: ['hotspots'],
};

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0.01;
  return Math.round(Math.min(0.99, Math.max(0.01, value)) * 1000) / 1000;
}

export function buildGeminiPrompt(region: string, cells: ObservationCell[]): string {
  const compact = cells.map((cell) => ({
    id: cell.id,
    lat: cell.lat,
    lon: cell.lon,
    sstC: cell.sstC,
    chlorophyllMgM3: cell.chlorophyllMgM3,
  }));
  return [
    'You are assisting FINDS, an exploratory ocean-research visualization.',
    'You MUST NOT invent coordinates or new observation ids.',
    'Score and explain only the provided NASA-derived observation cells.',
    `Region: ${region}`,
    'Return JSON { "hotspots": [{ "id", "score", "rationale" }] }.',
    'score is 0..1. rationale is one or two sentences about SST and chlorophyll context.',
    'Do not claim real-time shark presence or beach safety.',
    'Observation cells:',
    JSON.stringify(compact),
  ].join('\n');
}

export function mergeGeminiScores(
  cells: ObservationCell[],
  modelRows: Array<{ id?: string; score?: number; rationale?: string }>,
  allCells: ObservationCell[],
): Hotspot[] {
  const byId = new Map(cells.map((cell) => [cell.id, cell]));
  const fallback = cellsToHotspots(cells, allCells);
  const fallbackById = new Map(fallback.map((row) => [row.id, row]));
  const merged: Hotspot[] = [];
  const seen = new Set<string>();

  for (const row of modelRows) {
    if (!row.id || !byId.has(row.id) || seen.has(row.id)) continue;
    const cell = byId.get(row.id)!;
    const score = clampScore(Number(row.score));
    merged.push({
      id: cell.id,
      lat: cell.lat,
      lon: cell.lon,
      score,
      label: scoreLabel(score),
      rationale:
        typeof row.rationale === 'string' && row.rationale.trim()
          ? row.rationale.trim()
          : fallbackById.get(cell.id)?.rationale ?? '',
      sstC: cell.sstC,
      chlorophyllMgM3: cell.chlorophyllMgM3,
      qualityNotes: cell.qualityNotes,
    });
    seen.add(row.id);
  }

  for (const row of fallback) {
    if (!seen.has(row.id)) merged.push(row);
  }
  return merged;
}

export const GEMINI_TIMEOUT_MS = 45_000;
export const GEMINI_MAX_SCORED_CELLS = 40;

export async function analyzeWithGemini(
  region: string,
  cells: ObservationCell[],
  allCells: ObservationCell[],
  env: { GEMINI_API_KEY?: string; GEMINI_MODEL?: string },
  fetchImpl: typeof fetch = fetch,
): Promise<GeminiAnalysis> {
  const fallback = cellsToHotspots(cells, allCells);
  const model = env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const scoredCells = cells.slice(0, GEMINI_MAX_SCORED_CELLS);
  if (!env.GEMINI_API_KEY) {
    return {
      hotspots: fallback,
      model,
      usedModel: false,
      qualityNotes: ['Gemini key not configured; used deterministic NASA-derived scores only.'],
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: buildGeminiPrompt(region, scoredCells) }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  const capNote =
    cells.length > scoredCells.length
      ? `Gemini ranked ${scoredCells.length} of ${cells.length} NASA-derived candidates; remaining cells used deterministic scores.`
      : null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      return {
        hotspots: fallback,
        model,
        usedModel: false,
        qualityNotes: [`Gemini HTTP ${response.status}; used deterministic NASA-derived scores.`],
      };
    }
    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const parsed = JSON.parse(text) as { hotspots?: Array<{ id?: string; score?: number; rationale?: string }> };
    return {
      hotspots: mergeGeminiScores(cells, parsed.hotspots ?? [], allCells),
      model,
      usedModel: true,
      qualityNotes: [
        'Gemini scored and explained NASA-derived observation cells; it did not generate coordinates.',
        ...(capNote ? [capNote] : []),
      ],
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';
    return {
      hotspots: fallback,
      model,
      usedModel: false,
      qualityNotes: [`Gemini unavailable (${reason}); used deterministic NASA-derived scores.`],
    };
  } finally {
    clearTimeout(timeout);
  }
}
