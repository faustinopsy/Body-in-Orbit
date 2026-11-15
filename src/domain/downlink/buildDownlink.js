import { METRICS } from '../metrics.js';
import { buildSnapshot } from '../snapshot.js';

export const DOWNLINK_FORMAT = 'orbit-crew-health-downlink';

const round = (value) => (Number.isFinite(value) ? Math.round(value * 10) / 10 : null);

function crewReport(dataset, crewId, day) {
  const snapshot = buildSnapshot(dataset, crewId, day);
  const metrics = Object.fromEntries(METRICS.map((metric) => {
    const entry = snapshot.metrics[metric.id];
    return [metric.id, { value: round(entry.value), unit: metric.unit, status: entry.status }];
  }));
  return { id: crewId, overall: snapshot.overall, metrics };
}

export function buildDownlink(dataset, day, createdAt) {
  return {
    format: DOWNLINK_FORMAT,
    version: 1,
    createdAt,
    mission: dataset.name,
    missionTypeId: dataset.missionTypeId ?? null,
    simulated: Boolean(dataset.simulated),
    day,
    missionDays: dataset.missionDays,
    crew: dataset.crew.map(({ id }) => crewReport(dataset, id, day)),
  };
}

export const downlinkFileName = (day) => `body-in-orbit-downlink-d${day}.json`;