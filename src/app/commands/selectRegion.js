import { layerOfRegion } from '../../domain/layers.js';
import { metricsOfRegion } from '../../domain/metrics.js';

export const selectRegion = (app) => (regionId) => {
  const layerId = layerOfRegion(regionId);
  if (!layerId) return;
  app.store.update({ layerId, regionId, metricId: metricsOfRegion(regionId)[0].id });
};