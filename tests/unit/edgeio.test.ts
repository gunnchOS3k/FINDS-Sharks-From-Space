import { describe, expect, it } from 'vitest';
import { classifyPinch, GESTURE_MATRIX } from '../../src/services/edgeio';

describe('edge io', () => {
  it('classifies two-pointer pinch and spread from distance deltas', () => {
    expect(classifyPinch(200, 140)).toBe('pinch');
    expect(classifyPinch(200, 260)).toBe('spread');
    expect(classifyPinch(200, 210)).toBeNull();
  });

  it('documents keyboard, tap, map pinch, panel pinch, and shake separately', () => {
    const names = GESTURE_MATRIX.map((row) => row.gesture);
    expect(names).toContain('Arrow keys');
    expect(names).toContain('Pinch / spread on map');
    expect(names).toContain('Pinch / spread on control panel');
    expect(names).toContain('Shake');
  });
});
