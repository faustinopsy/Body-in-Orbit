import { METRICS, clampToMetric } from '../metrics.js';
import { createRandom } from './random.js';
import { CREW_PROFILES, MISSION_DAYS, NOISE } from './profiles.js';

const round = (value) => Math.round(value * 100) / 100;

function seedOf(crewId, metricId) {
  return [...`${crewId}:${metricId}`].reduce((seed, char) => (seed * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function dailyValues(metric, change, random) {
  const noise = NOISE[metric.id];
  const values = [];
  let total = metric.baseline;
  for (let day = 1; day <= MISSION_DAYS; day += 1) {
    if (metric.id === 'radiation.dose') {
      total += Math.max(0, (change / MISSION_DAYS) * (1 + noise * random.gaussian() * 5));
      values.push(round(total));
    } else {
      const trend = metric.baseline + (change * day) / MISSION_DAYS;
      values.push(round(clampToMetric(metric, trend + noise * random.gaussian())));
    }
  }
  return values;
}

export function simulateCrewSeries(crewId) {
  const profile = CREW_PROFILES[crewId];
  const series = {};
  for (const metric of METRICS) {
    const random = createRandom(seedOf(crewId, metric.id));
    series[metric.id] = dailyValues(metric, profile[metric.id], random);
  }
  return series;
}

export function buildSampleDataset() {
  const crewIds = Object.keys(CREW_PROFILES);
  return {
    format: 'orbit-crew-health',
    version: 1,
    name: 'Simulated mission, 180 days',
    simulated: true,
    missionDays: MISSION_DAYS,
    crew: crewIds.map((id) => ({ id })),
    series: Object.fromEntries(crewIds.map((id) => [id, simulateCrewSeries(id)])),
  };
}