import { describe, expect, it } from 'vitest';
import { initialAnswers, validateAnswers } from '../../../src/domain/checkIn/questions.js';
import { advanceDay, applyCheckIn, checkInOf } from '../../../src/domain/checkIn/applyCheckIn.js';

const answers = { sleepHours: 6.5, sleepQuality: 4, disturbances: ['noise'], restingHeartRate: 58 };

function dataset() {
  const series = { 'sleep.hours': [7, 7, 7], 'sleep.quality': [3, 3, 3], 'cardio.restingHeartRate': [60, 60, 60], 'bone.hipDensity': [1, 1, 1] };
  return { missionDays: 3, today: 2, crew: [{ id: 'C01' }], series: { C01: series } };
}

describe('daily check-in', () => {
  it('asks for the sleep quality before anything is answered', () => {
    expect(validateAnswers(initialAnswers())).toEqual(['sleepQuality']);
    expect(validateAnswers(answers)).toEqual([]);
  });

  it('refuses values outside the scale or off the step', () => {
    expect(validateAnswers({ ...answers, sleepHours: 6.3 })).toEqual(['sleepHours']);
    expect(validateAnswers({ ...answers, restingHeartRate: 200 })).toEqual(['restingHeartRate']);
    expect(validateAnswers({ ...answers, disturbances: ['noise', 'noise'] })).toEqual(['disturbances']);
  });

  it('writes the answers into the series of the day and keeps one check-in per day', () => {
    const first = applyCheckIn(dataset(), { crewId: 'C01', day: 2, answers });
    const again = applyCheckIn(first, { crewId: 'C01', day: 2, answers: { ...answers, sleepHours: 8 } });
    expect(again.series.C01['sleep.hours']).toEqual([7, 8, 7]);
    expect(again.series.C01['sleep.quality']).toEqual([3, 4, 3]);
    expect(again.series.C01['bone.hipDensity']).toEqual([1, 1, 1]);
    expect(again.checkIns).toHaveLength(1);
    expect(checkInOf(again, 'C01', 2).answers.sleepHours).toBe(8);
  });

  it('moves to the next day and stops at the last one', () => {
    expect(advanceDay(dataset()).today).toBe(3);
    expect(advanceDay({ ...dataset(), today: 3 }).today).toBe(3);
  });
});