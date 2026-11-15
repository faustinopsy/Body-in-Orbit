import { valueAt } from '../../domain/series.js';
import { statusOf } from '../../domain/status.js';
import { phaseOf } from '../../domain/missionDay.js';

export const tableStep = (missionDays) => (missionDays > 60 ? 7 : 1);

export function tableDays(missionDays, today) {
  const step = tableStep(missionDays);
  const days = new Set([today, missionDays]);
  for (let day = 1; day <= missionDays; day += step) days.add(day);
  return [...days].sort((first, second) => first - second);
}

export function tableRows({ series, metric, missionDays, today }) {
  return tableDays(missionDays, today).map((day) => {
    const value = valueAt(series, day);
    return { day, value, status: statusOf(metric, value), phase: phaseOf(day, today) };
  });
}