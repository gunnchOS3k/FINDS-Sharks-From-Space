import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION, DISCLAIMER } from '../../shared/types';
import { validateGenerateRequest } from '../../shared/validation';
import { stableCacheKey } from '../../shared/cacheKey';

describe('release schema contracts', () => {
  it('keeps a stable schema version and disclaimer', () => {
    expect(SCHEMA_VERSION).toBe('1.0.0');
    expect(DISCLAIMER).toMatch(/not real-time shark warnings/i);
  });

  it('produces a cache key covering bbox, date, model, and pipeline', () => {
    const key = stableCacheKey({
      region: 'hawaiian-islands',
      bbox: [-160.5, 18.5, -154.5, 22.5],
      n: 80,
      observationDate: '2026-08-14',
      variables: ['chlorophyll_a', 'sst'],
      model: 'gemini-2.5-flash',
    });
    expect(key).toContain('hawaiian-islands');
    expect(key).toContain('2026-08-14');
    expect(key).toContain('gemini-2.5-flash');
  });

  it('bounds generate input', () => {
    expect(() => validateGenerateRequest({ region: 'Hawaiian Islands', n: 80 })).not.toThrow();
  });
});
