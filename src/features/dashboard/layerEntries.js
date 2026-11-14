import { metricsOfLayer } from '../../domain/metrics.js';
import { STATUS_ORDER } from '../../domain/status.js';

const ALERTS = ['warning', 'critical'];

export const isAlert = (status) => ALERTS.includes(status);

export function layerEntries(snapshot, layerId) {
  return metricsOfLayer(layerId).map((metric) => ({ metric, ...snapshot.metrics[metric.id] }));
}

export function worstFirst(entries) {
  const rank = (entry) => STATUS_ORDER.indexOf(entry.status);
  return [...entries].sort((first, second) => rank(second) - rank(first));
}