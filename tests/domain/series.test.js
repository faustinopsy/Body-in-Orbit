import { describe, expect, it } from 'vitest';
import { valueAt, valuesUntil } from '../../src/domain/series.js';

describe('series helpers', () => {
  const series = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('cuts the series at the chosen day', () => {
    expect(valuesUntil(series, 3)).toEqual([1, 2, 3]);
    expect(valuesUntil(series, 99)).toHaveLength(10);
  });

  it('averages the last days', () => {
    expect(valueAt(series, 10, 5)).toBe(8);
    expect(valueAt(series, 2, 7)).toBe(1.5);
    expect(valueAt([], 5)).toBeNull();
  });
});