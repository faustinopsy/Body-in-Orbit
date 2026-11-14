import { describe, expect, it } from 'vitest';
import { rulerPositions } from '../../../src/features/dashboard/rulerPositions.js';
import { formatDelta } from '../../../src/features/dashboard/formatDelta.js';
import { metricById } from '../../../src/domain/metrics.js';

describe('rulerPositions', () => {
  it('places the limits and the value from the baseline to the critical limit', () => {
    const spine = metricById('bone.spineDensity');
    expect(rulerPositions(spine, 98)).toEqual({ warning: 40, critical: 80, value: 20 });
  });

  it('works when higher is worse and keeps the value inside the ruler', () => {
    const heart = metricById('cardio.restingHeartRate');
    expect(rulerPositions(heart, 75).warning).toBeCloseTo(40);
    expect(rulerPositions(heart, 200).value).toBe(100);
    expect(rulerPositions(heart, 40).value).toBe(0);
  });

  it('has no ruler without a value', () => {
    expect(rulerPositions(metricById('sleep.hours'), null)).toBeNull();
  });
});

describe('formatDelta', () => {
  it('writes the change from the baseline with its sign and unit', () => {
    expect(formatDelta(97.66, metricById('bone.spineDensity'), 'en')).toBe('−2.3 %');
    expect(formatDelta(71, metricById('cardio.restingHeartRate'), 'en')).toBe('+11 bpm');
    expect(formatDelta(60, metricById('cardio.restingHeartRate'), 'en')).toBe('±0 bpm');
    expect(formatDelta(3.5, metricById('sleep.quality'), 'en')).toBe('−0.5');
  });
});