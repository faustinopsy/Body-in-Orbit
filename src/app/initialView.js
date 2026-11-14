import { LAYERS } from '../domain/layers.js';
import { metricsOfLayer } from '../domain/metrics.js';

export function initialView(dataset) {
  const layerId = LAYERS[0].id;
  return {
    crewId: dataset.crew[0].id,
    day: dataset.missionDays,
    layerId,
    regionId: null,
    metricId: metricsOfLayer(layerId)[0].id,
  };
}