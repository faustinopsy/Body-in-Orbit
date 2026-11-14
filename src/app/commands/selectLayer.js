import { layerById } from '../../domain/layers.js';
import { metricsOfLayer } from '../../domain/metrics.js';

export const selectLayer = (app) => (layerId) => {
  if (!layerById(layerId)) return;
  app.store.update({ layerId, regionId: null, metricId: metricsOfLayer(layerId)[0].id });
};