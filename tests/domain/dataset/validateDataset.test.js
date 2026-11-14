import { describe, expect, it } from 'vitest';
import { buildSampleDataset } from '../../../src/domain/dataset/simulate.js';
import { validateDataset } from '../../../src/domain/dataset/validateDataset.js';

describe('validateDataset', () => {
  it('accepts the sample dataset', () => {
    expect(validateDataset(buildSampleDataset())).toEqual([]);
  });

  it('rejects something that is not an object', () => {
    expect(validateDataset(null)).toEqual([{ code: 'notObject' }]);
    expect(validateDataset('text')).toEqual([{ code: 'notObject' }]);
  });

  it('reports a wrong format and version', () => {
    const codes = validateDataset({ format: 'other', version: 9 }).map((error) => error.code);
    expect(codes).toContain('format');
    expect(codes).toContain('version');
  });

  it('names the crew member and metric with a broken series', () => {
    const data = buildSampleDataset();
    data.series.C02['sleep.hours'] = [1, 2, 3];
    expect(validateDataset(data)).toEqual([
      { code: 'metricSeries', crewId: 'C02', metricId: 'sleep.hours' },
    ]);
  });
});