import { METRICS } from '../metrics.js';
import { valuesUntil } from '../series.js';
import { checkInOf } from '../checkIn/applyCheckIn.js';

const SOON_DAYS = 30;
const HEART_RISE_BPM = 8;
const HEART_WINDOW_DAYS = 7;
const SHORT_SLEEP_HOURS = 6;
const POOR_SLEEP = 2;

export const round = (value) => Math.round(value * 10) / 10;

export function limitFindings(snapshot) {
  return METRICS.filter(({ id }) => ['warning', 'critical'].includes(snapshot.metrics[id].status)).map((metric) => {
    const { status, value } = snapshot.metrics[metric.id];
    return { kind: 'limit', level: status, metricId: metric.id, params: { value: round(value), limit: metric[status] } };
  });
}

export function approachingFindings(snapshot, day) {
  return METRICS.filter(({ id }) => {
    const { status, crossingDay } = snapshot.metrics[id];
    return status === 'ok' && crossingDay !== null && crossingDay - day <= SOON_DAYS;
  }).map((metric) => {
    const { value, crossingDay } = snapshot.metrics[metric.id];
    return { kind: 'approaching', level: 'warning', metricId: metric.id, params: { value: round(value), days: crossingDay - day } };
  });
}

export function sleepFindings(answers) {
  if (!answers) return [];
  const findings = [];
  if (answers.sleepHours < SHORT_SLEEP_HOURS) findings.push({ kind: 'shortSleep', level: 'warning', metricId: 'sleep.hours', params: { value: answers.sleepHours } });
  if (answers.sleepQuality <= POOR_SLEEP) findings.push({ kind: 'poorSleep', level: 'warning', metricId: 'sleep.quality', params: { value: answers.sleepQuality } });
  if (answers.disturbances.length > 0) findings.push({ kind: 'disturbed', level: 'ok', metricId: null, params: { items: answers.disturbances } });
  return findings;
}

export function heartFindings(series, day) {
  const values = valuesUntil(series, day);
  const previous = values.slice(-HEART_WINDOW_DAYS - 1, -1).filter(Number.isFinite);
  const today = values.at(-1);
  if (previous.length < HEART_WINDOW_DAYS || !Number.isFinite(today)) return [];
  const average = round(previous.reduce((sum, value) => sum + value, 0) / previous.length);
  if (today - average < HEART_RISE_BPM) return [];
  return [{ kind: 'heartRise', level: 'warning', metricId: 'cardio.restingHeartRate', params: { value: round(today), average } }];
}

export const answersOf = (dataset, crewId, day) => checkInOf(dataset, crewId, day)?.answers ?? null;