import { describe, expect, it } from 'vitest';
import { metricById } from '../../src/domain/metrics.js';
import { linearFit, projectCrossingDay, trendOf } from '../../src/domain/trend.js';

describe('linearFit', () => {
  it('finds the slope of a straight line', () => {
    const fit = linearFit([10, 12, 14, 16]);
    expect(fit.slope).toBeCloseTo(2);
    expect(fit.intercept).toBeCloseTo(10);
  });

  it('needs at least two points', () => {
    expect(linearFit([5])).toBeNull();
  });
});

describe('projectCrossingDay', () => {
  const sleep = metricById('sleep.hours');

  it('projects when a falling metric reaches its warning limit', () => {
    const series = Array.from({ length: 100 }, (_, index) => 8 - index * 0.02);
    const trend = trendOf(series, 100);
    expect(projectCrossingDay(sleep, trend, 'ok', 100)).toBe(101);
  });

  it('returns null when the metric moves away from the limit', () => {
    const series = Array.from({ length: 100 }, (_, index) => 7 + index * 0.01);
    expect(projectCrossingDay(sleep, trendOf(series, 100), 'ok', 100)).toBeNull();
  });

  it('returns null once the metric is already critical', () => {
    const series = Array.from({ length: 100 }, (_, index) => 5 - index * 0.01);
    expect(projectCrossingDay(sleep, trendOf(series, 100), 'critical', 100)).toBeNull();
  });
});