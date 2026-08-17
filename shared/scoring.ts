import type { Hotspot, ObservationCell } from './types';

export function scoreLabel(score: number): Hotspot['label'] {
  if (score >= 0.75) return 'high';
  if (score >= 0.55) return 'elevated';
  if (score >= 0.35) return 'moderate';
  return 'low';
}

/**
 * Exploratory heuristic only. Coastal shark habitat literature often notes
 * thermal envelopes and forage proxies; this is not a species occupancy model.
 */
export function sstSuitability(sstC: number | null): number {
  if (sstC === null) return 0.2;
  if (sstC < 10 || sstC > 32) return 0.05;
  if (sstC >= 18 && sstC <= 26) return 1;
  if (sstC >= 16 && sstC < 18) return 0.7;
  if (sstC > 26 && sstC <= 29) return 0.75;
  if (sstC >= 14 && sstC < 16) return 0.45;
  return 0.25;
}

export function chlorophyllSuitability(chl: number | null): number {
  if (chl === null) return 0.25;
  if (chl <= 0) return 0.05;
  const logChl = Math.log10(Math.min(Math.max(chl, 0.03), 20));
  const scaled = (logChl - Math.log10(0.03)) / (Math.log10(20) - Math.log10(0.03));
  return Math.min(1, Math.max(0, scaled));
}

export function gradientBoost(cells: ObservationCell[], index: number): number {
  const cell = cells[index];
  if (!cell || cell.sstC === null) return 0;
  let neighborDiff = 0;
  let count = 0;
  for (let i = 0; i < cells.length; i += 1) {
    if (i === index || cells[i].sstC === null) continue;
    const dlat = cells[i].lat - cell.lat;
    const dlon = cells[i].lon - cell.lon;
    const dist = Math.hypot(dlat, dlon);
    if (dist > 0 && dist < 0.6) {
      neighborDiff += Math.abs((cells[i].sstC as number) - cell.sstC);
      count += 1;
    }
  }
  if (!count) return 0;
  return Math.min(0.2, (neighborDiff / count) / 8);
}

export function deterministicScore(cells: ObservationCell[], index: number): number {
  const cell = cells[index];
  const sst = sstSuitability(cell.sstC);
  const chl = chlorophyllSuitability(cell.chlorophyllMgM3);
  const gradient = gradientBoost(cells, index);
  const raw = 0.55 * sst + 0.35 * chl + gradient;
  return Math.round(Math.min(0.99, Math.max(0.01, raw)) * 1000) / 1000;
}

export function selectCandidates(cells: ObservationCell[], n: number): ObservationCell[] {
  const usable = cells.filter((cell) => cell.sstC !== null || cell.chlorophyllMgM3 !== null);
  const ranked = usable
    .map((cell, index) => ({ cell, score: deterministicScore(usable, index) }))
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, n).map((row) => row.cell);
}

export function cellsToHotspots(cells: ObservationCell[], allCells: ObservationCell[]): Hotspot[] {
  return cells.map((cell) => {
    const index = allCells.findIndex((candidate) => candidate.id === cell.id);
    const score = deterministicScore(allCells, index === -1 ? 0 : index);
    return {
      id: cell.id,
      lat: cell.lat,
      lon: cell.lon,
      score,
      label: scoreLabel(score),
      rationale:
        'Deterministic exploratory score from NASA SST suitability, chlorophyll-a productivity proxy, and local SST gradient.',
      sstC: cell.sstC,
      chlorophyllMgM3: cell.chlorophyllMgM3,
      qualityNotes: cell.qualityNotes,
    };
  });
}
