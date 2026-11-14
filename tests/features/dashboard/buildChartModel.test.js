import { describe, expect, it } from 'vitest';
import { buildChartModel, CHART_SIZE } from '../../../src/features/dashboard/buildChartModel.js';

const metric = { warning: 90, critical: 80 };
const values = [100, 98, 96, 94, 92];
const base = { values, metric, trend: { slopePerDay: -2, lastValue: 92 }, day: 5, missionDays: 10 };

describe('buildChartModel', () => {
  it('draws one point per day', () => {
    const model = buildChartModel({ ...base, crossingDay: null });
    expect(model.points.split(' ')).toHaveLength(5);
  });

  it('puts the critical limit below the warning limit when values fall', () => {
    const model = buildChartModel({ ...base, crossingDay: null });
    expect(model.criticalY).toBeGreaterThan(model.warningY);
  });

  it('has no projection without a crossing day', () => {
    expect(buildChartModel({ ...base, crossingDay: null }).projection).toBeNull();
  });

  it('draws a projection that starts at the marker and ends on the limit', () => {
    const model = buildChartModel({ ...base, crossingDay: 6 });
    expect(model.projection.x1).toBeCloseTo(model.marker.x, 1);
    expect(model.projection.y2).toBeCloseTo(model.warningY, 1);
  });

  it('ignores a crossing that is too far away', () => {
    expect(buildChartModel({ ...base, crossingDay: 500 }).projection).toBeNull();
  });

  it('keeps every point inside the drawing area', () => {
    const model = buildChartModel({ ...base, crossingDay: 12 });
    const xs = model.points.split(' ').map((point) => Number(point.split(',')[0]));
    expect(Math.max(...xs)).toBeLessThanOrEqual(CHART_SIZE.width - CHART_SIZE.right);
    expect(model.projection.x2).toBeLessThanOrEqual(CHART_SIZE.width - CHART_SIZE.right);
  });
});