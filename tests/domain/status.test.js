import { describe, expect, it } from 'vitest';
import { metricById } from '../../src/domain/metrics.js';
import { statusOf, worstStatus } from '../../src/domain/status.js';

describe('statusOf', () => {
  const sleep = metricById('sleep.hours');
  const heart = metricById('cardio.restingHeartRate');

  it('treats lower values as worse for metrics that fall', () => {
    expect(statusOf(sleep, 7)).toBe('ok');
    expect(statusOf(sleep, 6)).toBe('warning');
    expect(statusOf(sleep, 4.9)).toBe('critical');
  });

  it('treats higher values as worse for metrics that rise', () => {
    expect(statusOf(heart, 70)).toBe('ok');
    expect(statusOf(heart, 75)).toBe('warning');
    expect(statusOf(heart, 91)).toBe('critical');
  });

  it('returns null when there is no value', () => {
    expect(statusOf(sleep, NaN)).toBeNull();
  });
});

describe('worstStatus', () => {
  it('picks the most severe status', () => {
    expect(worstStatus(['ok', 'critical', 'warning'])).toBe('critical');
    expect(worstStatus(['ok', 'ok'])).toBe('ok');
    expect(worstStatus([])).toBeNull();
  });
});