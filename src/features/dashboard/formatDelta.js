import { formatValue } from './formatValue.js';

const SCALE_UNIT = /\d-\d/;

export function formatDelta(value, metric, locale) {
  if (!Number.isFinite(value)) return '-';
  const delta = Math.round((value - metric.baseline) * 10) / 10;
  const unit = SCALE_UNIT.test(metric.unit) ? '' : ` ${metric.unit}`;
  if (delta === 0) return `±0${unit}`;
  const sign = delta > 0 ? '+' : '−';
  return `${sign}${formatValue(Math.abs(delta), locale)}${unit}`;
}