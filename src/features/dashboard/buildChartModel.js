export const CHART_SIZE = { width: 600, height: 220, left: 44, right: 16, top: 14, bottom: 26 };
const MAX_PROJECTION_FACTOR = 2;

function projectionEnd(crossingDay, missionDays) {
  if (crossingDay === null || crossingDay > missionDays * MAX_PROJECTION_FACTOR) return null;
  return crossingDay;
}

function valueRange(values, metric, projectedValue) {
  const all = [...values, metric.warning, metric.critical];
  if (projectedValue !== null) all.push(projectedValue);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const margin = (max - min || 1) * 0.08;
  return { min: min - margin, max: max + margin };
}

export function buildChartModel({ values, metric, trend, crossingDay, day, missionDays }) {
  const end = projectionEnd(crossingDay, missionDays);
  const projectedValue = end !== null && trend ? trend.lastValue + trend.slopePerDay * (end - day) : null;
  const xMax = Math.max(missionDays, end ?? 0);
  const { min, max } = valueRange(values, metric, projectedValue);
  const { width, height, left, right, top, bottom } = CHART_SIZE;
  const scaleX = (x) => left + ((x - 1) / (xMax - 1)) * (width - left - right);
  const scaleY = (y) => top + ((max - y) / (max - min)) * (height - top - bottom);
  const lastValue = values[values.length - 1];
  return {
    points: values.map((value, index) => `${scaleX(index + 1).toFixed(1)},${scaleY(value).toFixed(1)}`).join(' '),
    warningY: scaleY(metric.warning),
    criticalY: scaleY(metric.critical),
    marker: { x: scaleX(day), y: scaleY(lastValue) },
    projection: end === null ? null : { x1: scaleX(day), y1: scaleY(trend.lastValue), x2: scaleX(end), y2: scaleY(projectedValue) },
    axis: { min, max, left, right: width - right, bottom: height - bottom },
  };
}