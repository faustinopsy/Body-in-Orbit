import { describe, expect, it } from 'vitest';
import { parseHeartRatePacket, validReading } from '../../../src/domain/heartRate/heartRatePacket.js';
import { REST_RULES, summarizeRest } from '../../../src/domain/heartRate/restMeasurement.js';

const series = (values, from = 0) => values.map((bpm, index) => ({ t: from + index, bpm, contact: 'yes' }));
const steady = (bpm) => [...series(Array(60).fill(bpm + 20)), ...series(Array(60).fill(bpm), 60)];

describe('heart rate packet', () => {
  it('reads 8-bit and 16-bit values and the skin contact bits', () => {
    expect(parseHeartRatePacket([0x06, 62])).toEqual({ bpm: 62, contact: 'yes' });
    expect(parseHeartRatePacket([0x04, 62])).toEqual({ bpm: 62, contact: 'no' });
    expect(parseHeartRatePacket([0x01, 0x2c, 0x01])).toEqual({ bpm: 300, contact: 'unknown' });
  });

  it('rejects short packets', () => {
    expect(parseHeartRatePacket([0x00])).toBeNull();
    expect(parseHeartRatePacket([0x01, 60])).toBeNull();
  });

  it('keeps only plausible readings with skin contact', () => {
    expect(validReading({ bpm: 60, contact: 'yes' })).toBe(true);
    expect(validReading({ bpm: 60, contact: 'unknown' })).toBe(true);
    expect(validReading({ bpm: 60, contact: 'no' })).toBe(false);
    expect(validReading({ bpm: 300, contact: 'yes' })).toBe(false);
  });
});

describe('rest measurement', () => {
  it('uses the median of the last minute only', () => {
    expect(summarizeRest(steady(58))).toEqual({ ok: true, bpm: 58, min: 58, max: 58, count: 60 });
  });

  it('asks again with too few good readings', () => {
    const samples = steady(58).map((sample) => (sample.t >= 70 ? { ...sample, contact: 'no' } : sample));
    expect(summarizeRest(samples)).toMatchObject({ ok: false, reason: 'fewReadings', count: 10 });
  });

  it('asks again when the rate does not settle', () => {
    const climbing = series(Array.from({ length: 60 }, (_, index) => 60 + Math.floor(index / 2)), 60);
    expect(summarizeRest(climbing)).toMatchObject({ ok: false, reason: 'unstable', min: 60, max: 89 });
  });

  it('refuses a value outside the question range', () => {
    expect(summarizeRest(steady(35))).toMatchObject({ ok: false, reason: 'outOfRange', bpm: 35 });
  });

  it('measures for two minutes', () => {
    expect(REST_RULES.durationSeconds).toBe(120);
  });
});