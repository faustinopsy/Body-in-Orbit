import { describe, expect, it } from 'vitest';
import { buildSnapshot } from '../../src/domain/snapshot.js';
import { buildSampleDataset } from '../../src/domain/dataset/simulate.js';

const dataset = buildSampleDataset();

describe('buildSnapshot', () => {
  it('keeps the healthy crew member normal on the last day', () => {
    const snapshot = buildSnapshot(dataset, 'C01', 180);
    expect(snapshot.overall).toBe('ok');
    expect(Object.keys(snapshot.metrics)).toHaveLength(12);
  });

  it('shows the worst status of each region and layer', () => {
    const snapshot = buildSnapshot(dataset, 'C02', 180);
    expect(snapshot.overall).toBe('critical');
    expect(snapshot.layers.muscles).toBe('critical');
    expect(snapshot.regions['muscle-calf']).toBe('critical');
  });

  it('flags only sleep and radiation for the third crew member on day 120', () => {
    const snapshot = buildSnapshot(dataset, 'C03', 120);
    expect(snapshot.layers.sleep).toBe('warning');
    expect(snapshot.layers.radiation).toBe('warning');
    expect(snapshot.layers.skeleton).toBe('ok');
  });

  it('projects a crossing day for a metric that is getting worse', () => {
    const snapshot = buildSnapshot(dataset, 'C02', 120);
    expect(snapshot.metrics['muscle.calfStrength'].crossingDay).toBeGreaterThan(120);
  });
});