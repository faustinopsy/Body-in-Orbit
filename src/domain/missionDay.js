export const todayOf = (dataset) => dataset.today ?? dataset.missionDays;

export function phaseOf(day, today) {
  if (day < today) return 'observed';
  return day === today ? 'today' : 'projection';
}