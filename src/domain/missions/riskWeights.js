import { MISSION_TYPES, REFERENCE_MISSION_ID } from './missionTypes.js';
import { RATINGS, RISKS, riskById } from './riskRatings.js';

const LEVEL_LIMITS = [
  { level: 'low', below: 0.3 },
  { level: 'moderate', below: 0.6 },
];

function scoreOf([likelihood, consequence], [maxLikelihood, maxConsequence]) {
  return (likelihood * consequence) / (maxLikelihood * maxConsequence);
}

export function riskWeight(riskId, missionTypeId) {
  const risk = riskById(riskId);
  if (!risk) return null;
  if (risk.sameAs) return riskWeight(risk.sameAs, missionTypeId);
  const rating = RATINGS[riskId][missionTypeId];
  if (!rating) return null;
  return Math.max(scoreOf(rating.ops, risk.matrix), scoreOf(rating.health, risk.matrix));
}

export function levelOf(weight) {
  return LEVEL_LIMITS.find((limit) => weight < limit.below)?.level ?? 'high';
}

export function weightFactor(riskId, missionTypeId) {
  const factor = riskWeight(riskId, missionTypeId) / riskWeight(riskId, REFERENCE_MISSION_ID);
  return Math.min(Math.max(factor, 0.4), 2);
}

export function weightTable() {
  return MISSION_TYPES.map((type) => ({
    missionTypeId: type.id,
    weights: Object.fromEntries(RISKS.map((risk) => [risk.id, riskWeight(risk.id, type.id)])),
  }));
}