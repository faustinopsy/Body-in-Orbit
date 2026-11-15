import { missionTypeById } from './missionTypes.js';

export const CREW_ROLES = ['commander', 'pilot', 'flightEngineer', 'missionSpecialist'];
export const MAX_CREW = 6;
export const MEMBER_LIMITS = { age: [21, 70], weightKg: [40, 150], heightCm: [140, 210] };

const inside = (value, [min, max]) => Number.isFinite(value) && value >= min && value <= max;

export function validateMember(member) {
  const errors = Object.entries(MEMBER_LIMITS)
    .filter(([field, limits]) => !inside(member[field], limits))
    .map(([field]) => field);
  return CREW_ROLES.includes(member.role) ? errors : ['role', ...errors];
}

export function missionFieldErrors(mission) {
  const errors = [];
  const type = missionTypeById(mission.typeId);
  const name = String(mission.name ?? '').trim();
  if (name.length === 0 || name.length > 60) errors.push('name');
  if (!type) errors.push('type');
  const days = mission.durationDays;
  if (type && (!Number.isInteger(days) || !inside(days, [type.minDays, type.maxDays]))) errors.push('duration');
  return errors;
}

function crewErrors(mission) {
  if (mission.crew.length === 0) return ['crew'];
  return mission.crew.length > MAX_CREW ? ['crewSize'] : [];
}

export function validateMission(mission) {
  const memberErrors = mission.crew.some((member) => validateMember(member).length > 0) ? ['member'] : [];
  return [...missionFieldErrors(mission), ...crewErrors(mission), ...memberErrors];
}

export const nextCrewCode = (crew) => `C${String(crew.length + 1).padStart(2, '0')}`;

export const createMissionDraft = () => ({ name: '', typeId: 'leo-long', durationDays: 180, crew: [] });