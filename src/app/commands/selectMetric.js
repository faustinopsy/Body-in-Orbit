import { metricById } from '../../domain/metrics.js';

export const selectMetric = (app) => (metricId) => {
  const metric = metricById(metricId);
  if (!metric) return;
  app.store.update({ metricId, layerId: metric.layerId, regionId: metric.regionId });
};