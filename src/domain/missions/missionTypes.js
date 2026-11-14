export const MISSION_TYPES = [
  { id: 'leo-short', environment: 'leo', minDays: 1, maxDays: 29, defaultDays: 14 },
  { id: 'leo-long', environment: 'leo', minDays: 30, maxDays: 365, defaultDays: 180 },
  { id: 'lunar-orbit-short', environment: 'lunarOrbit', minDays: 1, maxDays: 29, defaultDays: 21 },
  { id: 'lunar-orbit-long', environment: 'lunarOrbit', minDays: 30, maxDays: 365, defaultDays: 180 },
  { id: 'lunar-surface-short', environment: 'lunarSurface', minDays: 1, maxDays: 29, defaultDays: 21 },
  { id: 'lunar-surface-long', environment: 'lunarSurface', minDays: 30, maxDays: 365, defaultDays: 180 },
  { id: 'mars-preparatory', environment: 'deepSpace', minDays: 30, maxDays: 364, defaultDays: 300 },
  { id: 'mars-planetary', environment: 'mars', minDays: 730, maxDays: 1224, defaultDays: 900 },
];

export const REFERENCE_MISSION_ID = 'leo-long';

export const missionTypeById = (typeId) => MISSION_TYPES.find((type) => type.id === typeId) ?? null;