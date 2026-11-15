import { QUESTIONS } from './questions.js';
import { todayOf } from '../missionDay.js';

function seriesWithAnswers(series, day, answers) {
  const updated = { ...series };
  QUESTIONS.filter((question) => question.metricId).forEach(({ id, metricId }) => {
    const values = [...updated[metricId]];
    values[day - 1] = answers[id];
    updated[metricId] = values;
  });
  return updated;
}

export const checkInOf = (dataset, crewId, day) =>
  (dataset.checkIns ?? []).find((entry) => entry.crewId === crewId && entry.day === day) ?? null;

export function applyCheckIn(dataset, { crewId, day, answers }) {
  const others = (dataset.checkIns ?? []).filter((entry) => !(entry.crewId === crewId && entry.day === day));
  return {
    ...dataset,
    series: { ...dataset.series, [crewId]: seriesWithAnswers(dataset.series[crewId], day, answers) },
    checkIns: [...others, { crewId, day, answers }],
  };
}

export function advanceDay(dataset) {
  return { ...dataset, today: Math.min(todayOf(dataset) + 1, dataset.missionDays) };
}