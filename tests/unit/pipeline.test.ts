import { describe, expect, it } from 'vitest';
import { isCacheFresh, stableCacheKey } from '../../shared/cacheKey';
import { parseColormapXml, lookupValue, buildLookup } from '../../shared/colormap';
import { findRegion, isValidBBox, regionToBBox } from '../../shared/regions';
import { cellsToHotspots, deterministicScore, selectCandidates } from '../../shared/scoring';
import { HttpError, parseJsonBody, validateGenerateRequest } from '../../shared/validation';
import { mergeGeminiScores } from '../../shared/gemini';
import type { ObservationCell } from '../../shared/types';

const xml = `<?xml version="1.0"?>
<ColorMaps>
  <ColorMap title="No Data"><Entries><ColorMapEntry rgb="0,0,0" transparent="true" nodata="true" ref="0"/></Entries></ColorMap>
  <ColorMap title="Sea Surface Temperature" units="°C">
    <Entries>
      <ColorMapEntry rgb="10,20,30" transparent="false" value="[18.00,20.00)" ref="1"/>
      <ColorMapEntry rgb="40,50,60" transparent="false" value="[20.00,22.00)" ref="2"/>
    </Entries>
  </ColorMap>
</ColorMaps>`;

describe('region mapping', () => {
  it('resolves New York Bight bbox', () => {
    const region = findRegion('New York Bight');
    expect(region?.id).toBe('new-york-bight');
    expect(regionToBBox('New York Bight')[0]).toBeLessThan(-73);
    expect(isValidBBox([-74.5, 39.5, -71.5, 41.2])).toBe(true);
    expect(isValidBBox([-74.5, 41.2, -71.5, 39.5])).toBe(false);
  });
});

describe('request validation', () => {
  it('accepts a preset region and bounded n', () => {
    expect(validateGenerateRequest({ region: 'Florida Keys', n: 40 }).n).toBe(40);
  });
  it('rejects oversized bodies and unknown regions', () => {
    expect(() => parseJsonBody('{"region":"x"}', 5)).toThrow(HttpError);
    expect(() => validateGenerateRequest({ region: 'Paris', n: 40 })).toThrow(/documented FINDS preset/);
    expect(() => validateGenerateRequest({ region: 'California Coast', n: 5000 })).toThrow(/between 10 and 200/);
  });
});

describe('colormap and scoring', () => {
  it('maps official colormap RGB to midpoint values', () => {
    const map = parseColormapXml(xml);
    const lookup = buildLookup(map);
    expect(lookupValue(lookup, map.entries, 10, 20, 30, 255)).toBe(19);
    expect(lookupValue(lookup, map.entries, 0, 0, 0, 0)).toBeNull();
  });

  it('scores NASA cells without inventing coordinates', () => {
    const cells: ObservationCell[] = [
      { id: 'a', lat: 40.2, lon: -73.1, sstC: 21, chlorophyllMgM3: 1.2, qualityNotes: [] },
      { id: 'b', lat: 40.4, lon: -72.8, sstC: 12, chlorophyllMgM3: 0.05, qualityNotes: [] },
    ];
    expect(deterministicScore(cells, 0)).toBeGreaterThan(deterministicScore(cells, 1));
    expect(selectCandidates(cells, 1)[0].id).toBe('a');
    expect(cellsToHotspots(cells, cells)[0].lat).toBe(40.2);
  });
});

describe('cache key', () => {
  it('changes when pipeline, date, or bbox change', () => {
    const base = {
      region: 'new-york-bight',
      bbox: [-74.5, 39.5, -71.5, 41.2] as [number, number, number, number],
      n: 80,
      observationDate: '2026-08-14',
      variables: ['sst', 'chlorophyll_a'],
      model: 'gemini-3.6-flash',
    };
    expect(stableCacheKey(base)).not.toEqual(stableCacheKey({ ...base, observationDate: '2026-08-15' }));
    expect(isCacheFresh(new Date().toISOString(), 3600)).toBe(true);
    expect(isCacheFresh('2000-01-01T00:00:00Z', 60)).toBe(false);
  });
});

describe('gemini merge', () => {
  it('keeps NASA coordinates and ignores unknown ids', () => {
    const cells: ObservationCell[] = [
      { id: 'obs-1', lat: 40.1, lon: -73.2, sstC: 20, chlorophyllMgM3: 0.4, qualityNotes: [] },
    ];
    const merged = mergeGeminiScores(cells, [{ id: 'invented', score: 0.9 }, { id: 'obs-1', score: 0.8, rationale: 'Warm shelf.' }], cells);
    expect(merged).toHaveLength(1);
    expect(merged[0].lat).toBe(40.1);
    expect(merged[0].score).toBe(0.8);
  });
});
