import { describe, expect, it } from 'vitest';
import { phaseOf, todayOf } from '../../src/domain/missionDay.js';
import { validateDataset } from '../../src/domain/dataset/validateDataset.js';
import { buildSampleDataset } from '../../src/domain/dataset/simulate.js';

describe('mission day', () => {
  it('uses the last day as today when the dataset does not say', () => {
    expect(todayOf({ missionDays: 180 })).toBe(180);
    expect(todayOf({ missionDays: 180, today: 20 })).toBe(20);
  });

  it('tells observed days, today and projection apart', () => {
    expect(phaseOf(5, 10)).toBe('observed');
    expect(phaseOf(10, 10)).toBe('today');
    expect(phaseOf(11, 10)).toBe('projection');
  });

  it('accepts only a today inside the mission', () => {
    const data = buildSampleDataset();
    expect(validateDataset({ ...data, today: 90 })).toEqual([]);
    expect(validateDataset({ ...data, today: 0 })).toEqual([{ code: 'today' }]);
    expect(validateDataset({ ...data, today: 181 })).toEqual([{ code: 'today' }]);
  });
});