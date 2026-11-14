import { valuesUntil } from './series.js';

const TREND_WINDOW_DAYS = 60;

export function linearFit(values) {
  const count = values.length;
  if (count < 2) return null;
  const meanX = (count - 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / count;
  let covariance = 0;
  let variance = 0;
  values.forEach((value, index) => {
    covariance += (index - meanX) * (value - meanY);
    variance += (index - meanX) ** 2;
  });
  const slope = covariance / variance;
  return { slope, intercept: meanY - slope * meanX };
}

function nextLimit(metric, status) {
  if (status === 'ok') return metric.warning;
  if (status === 'warning') return metric.critical;
  return null;
}

export function trendOf(series, day, window = TREND_WINDOW_DAYS) {
  const values = valuesUntil(series, day).slice(-window);
  const fit = linearFit(values);
  if (!fit) return null;
  return { slopePerDay: fit.slope, lastValue: fit.intercept + fit.slope * (values.length - 1) };
}

export function projectCrossingDay(metric, trend, status, day) {
  const limit = nextLimit(metric, status);
  if (!trend || limit === null || trend.slopePerDay === 0) return null;
  const towardLimit = metric.worse === 'down' ? trend.slopePerDay < 0 : trend.slopePerDay > 0;
  if (!towardLimit) return null;
  return Math.ceil(day + (limit - trend.lastValue) / trend.slopePerDay);
}