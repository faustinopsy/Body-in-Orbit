import { describe, expect, it } from 'vitest';
import { buildChartModel, CHART_SIZE } from '../../../src/features/dashboard/buildChartModel.js';

const metric = { baseline: 100, warning: 90, critical: 80 };
const series = [100, 98, 96, 94, 92, 90, 88, 86, 84, 82];
const base = { series, metric, value: 92, day: 5, missionDays: 10 };
const count = (points) => points.split(' ').length;

describe('buildChartModel', () => {
  it('draws the observed days up to today and the projection after it', () => {
    const model = buildChartModel({ ...base, today: 4 });
    expect(count(model.observed)).toBe(4);
    expect(count(model.projected)).toBe(7);
    expect(model.projectionArea.x).toBeCloseTo(model.today.x);
  });

  it('has no projection when today is the last day', () => {
    const model = buildChartModel({ ...base, today: 10 });
    expect(count(model.observed)).toBe(10);
    expect(model.projected).toBeNull();
    expect(model.projectionArea).toBeNull();
  });

  it('puts the critical limit below the warning limit when values fall', () => {
    const { limits } = buildChartModel({ ...base, today: 10 });
    expect(limits.critical.y).toBeGreaterThan(limits.warning.y);
    expect(limits.warning.y).toBeGreaterThan(limits.baseline.y);
  });

  it('places the cursor on the chosen day and value', () => {
    const model = buildChartModel({ ...base, today: 10 });
    const fifth = model.observed.split(' ')[4].split(',').map(Number);
    expect(model.cursor.x).toBeCloseTo(fifth[0], 0);
    expect(model.cursor.y).toBeCloseTo(fifth[1], 0);
  });

  it('keeps every tick and point inside the drawing area', () => {
    const model = buildChartModel({ ...base, today: 6 });
    const xs = `${model.observed} ${model.projected}`.split(' ').map((point) => Number(point.split(',')[0]));
    expect(Math.max(...xs)).toBeLessThanOrEqual(CHART_SIZE.width - CHART_SIZE.right);
    expect(Math.min(...model.yTicks.map((tick) => tick.y))).toBeGreaterThanOrEqual(CHART_SIZE.top - 0.01);
    expect(model.xTicks[0].day).toBe(1);
  });

  it('uses round numbers on the value axis', () => {
    const model = buildChartModel({ ...base, today: 10 });
    expect(model.yTicks.map((tick) => tick.value)).toEqual([80, 85, 90, 95, 100]);
  });
});