import { describe, expect, it } from 'vitest';
import { buildSampleDataset } from '../../../src/domain/dataset/simulate.js';
import { validateDataset } from '../../../src/domain/dataset/validateDataset.js';
import { METRICS } from '../../../src/domain/metrics.js';
import { valueAt } from '../../../src/domain/series.js';
import { statusOf } from '../../../src/domain/status.js';

const dataset = buildSampleDataset();

function countByStatus(crewId, day) {
  const counts = { ok: 0, warning: 0, critical: 0 };
  for (const metric of METRICS) {
    counts[statusOf(metric, valueAt(dataset.series[crewId][metric.id], day))] += 1;
  }
  return counts;
}

describe('sample dataset', () => {
  it('is valid and has 3 crew members with 180 days of every metric', () => {
    expect(validateDataset(dataset)).toEqual([]);
    expect(dataset.crew.map((member) => member.id)).toEqual(['C01', 'C02', 'C03']);
    expect(dataset.series.C01['sleep.hours']).toHaveLength(180);
  });

  it('is the same every time it is generated', () => {
    expect(buildSampleDataset()).toEqual(dataset);
  });

  it('keeps C01 healthy for the whole mission', () => {
    expect(countByStatus('C01', 120)).toEqual({ ok: 11, warning: 0, critical: 0 });
    expect(countByStatus('C01', 180)).toEqual({ ok: 11, warning: 0, critical: 0 });
  });

  it('shows C02 with 8 metrics in warning on day 120', () => {
    expect(countByStatus('C02', 120)).toEqual({ ok: 3, warning: 8, critical: 0 });
  });

  it('shows C02 with 3 metrics in critical on day 180', () => {
    expect(countByStatus('C02', 180)).toEqual({ ok: 3, warning: 5, critical: 3 });
  });

  it('shows C03 with sleep and radiation in warning on day 120', () => {
    expect(countByStatus('C03', 120)).toEqual({ ok: 8, warning: 3, critical: 0 });
  });
});