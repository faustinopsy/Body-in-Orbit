import { METRICS } from './metrics.js';
import { statusOf, worstStatus } from './status.js';
import { valueAt } from './series.js';
import { trendOf, projectCrossingDay } from './trend.js';

function describeMetric(metric, series, day) {
  const value = valueAt(series, day);
  const status = statusOf(metric, value);
  const trend = trendOf(series, day);
  return { value, status, trend, crossingDay: projectCrossingDay(metric, trend, status, day) };
}

function worstBy(key, metrics) {
  const grouped = {};
  for (const metric of METRICS) {
    grouped[metric[key]] = [...(grouped[metric[key]] ?? []), metrics[metric.id].status];
  }
  return Object.fromEntries(Object.entries(grouped).map(([id, list]) => [id, worstStatus(list)]));
}

export function buildSnapshot(dataset, crewId, day) {
  const series = dataset.series[crewId];
  const metrics = Object.fromEntries(
    METRICS.map((metric) => [metric.id, describeMetric(metric, series[metric.id], day)]),
  );
  return {
    metrics,
    regions: worstBy('regionId', metrics),
    layers: worstBy('layerId', metrics),
    overall: worstStatus(Object.values(metrics).map((entry) => entry.status)),
  };
}