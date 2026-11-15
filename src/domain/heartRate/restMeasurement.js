import { questionById } from '../checkIn/questions.js';
import { validReading } from './heartRatePacket.js';

export const REST_RULES = Object.freeze({ durationSeconds: 120, windowSeconds: 60, minSamples: 30, maxSpread: 15 });

function median(sorted) {
  const middle = sorted.length >> 1;
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function windowReadings(samples, rules = REST_RULES) {
  const start = rules.durationSeconds - rules.windowSeconds;
  return samples.filter((sample) => sample.t >= start && validReading(sample)).map((sample) => sample.bpm).sort((a, b) => a - b);
}

function inAnswerRange(bpm) {
  const question = questionById('restingHeartRate');
  return bpm >= question.min && bpm <= question.max;
}

export function summarizeRest(samples, rules = REST_RULES) {
  const readings = windowReadings(samples, rules);
  const count = readings.length;
  if (count < rules.minSamples) return { ok: false, reason: 'fewReadings', count };
  const min = readings[0];
  const max = readings[count - 1];
  if (max - min > rules.maxSpread) return { ok: false, reason: 'unstable', count, min, max };
  const bpm = Math.round(median(readings));
  if (!inAnswerRange(bpm)) return { ok: false, reason: 'outOfRange', count, bpm };
  return { ok: true, bpm, min, max, count };
}