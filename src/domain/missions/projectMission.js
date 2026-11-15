import { METRICS, clampToMetric } from '../metrics.js';
import { createRandom } from '../dataset/random.js';
import { NOISE } from '../dataset/profiles.js';
import { missionTypeById } from './missionTypes.js';
import { riskOfLayer } from './riskRatings.js';
import { weightFactor } from './riskWeights.js';
import { personalFactor } from './crewFactors.js';
import { DAILY_DOSE_MSV, DAYS_PER_MONTH, MONTHLY_CHANGE, STEP_CHANGE } from './missionRates.js';

const round = (value) => Math.round(value * 100) / 100;

function seedOf(text) {
  return [...text].reduce((seed, char) => (seed * 31 + char.charCodeAt(0)) >>> 0, 11);
}

function expectedValue(metric, day, scale, type) {
  if (metric.id === 'radiation.dose') return metric.baseline + DAILY_DOSE_MSV[type.environment] * day;
  const step = STEP_CHANGE[metric.id];
  if (step) return metric.baseline + step.change * scale * Math.min(day / step.rampDays, 1);
  return metric.baseline + MONTHLY_CHANGE[metric.id] * scale * (day / DAYS_PER_MONTH);
}

function scaleOf(metric, type, member) {
  const risk = riskOfLayer(metric.layerId);
  return weightFactor(risk.id, type.id) * personalFactor(member, metric.layerId);
}

function projectMetric(metric, type, member, days) {
  const random = createRandom(seedOf(`${member.code}:${metric.id}`));
  const scale = scaleOf(metric, type, member);
  const noise = metric.id === 'radiation.dose' ? 0 : NOISE[metric.id];
  return Array.from({ length: days }, (_, index) => {
    const value = expectedValue(metric, index + 1, scale, type) + noise * random.gaussian();
    return round(clampToMetric(metric, value));
  });
}

export function projectMember(type, member, days) {
  return Object.fromEntries(METRICS.map((metric) => [metric.id, projectMetric(metric, type, member, days)]));
}

export function buildMissionDataset(mission) {
  const type = missionTypeById(mission.typeId);
  return {
    format: 'orbit-crew-health',
    version: 1,
    name: mission.name,
    simulated: true,
    projected: true,
    missionTypeId: type.id,
    missionDays: mission.durationDays,
    today: 1,
    crew: mission.crew.map(({ code, role }) => ({ id: code, role })),
    series: Object.fromEntries(mission.crew.map((member) => [member.code, projectMember(type, member, mission.durationDays)])),
  };
}