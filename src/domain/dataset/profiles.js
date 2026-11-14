export const MISSION_DAYS = 180;

export const NOISE = {
  'bone.spineDensity': 0.25,
  'bone.hipDensity': 0.25,
  'bone.tibiaDensity': 0.25,
  'muscle.coreStrength': 0.6,
  'muscle.thighStrength': 0.6,
  'muscle.calfStrength': 0.6,
  'cardio.restingHeartRate': 0.8,
  'cardio.recoveryHeartRate': 0.7,
  'sleep.hours': 0.3,
  'sleep.quality': 0.15,
  'radiation.dose': 0.04,
};

export const CREW_PROFILES = {
  C01: {
    'bone.spineDensity': -2, 'bone.hipDensity': -2, 'bone.tibiaDensity': -1.5,
    'muscle.coreStrength': -3, 'muscle.thighStrength': -3, 'muscle.calfStrength': -3,
    'cardio.restingHeartRate': 3, 'cardio.recoveryHeartRate': -2,
    'sleep.hours': -0.2, 'sleep.quality': -0.1, 'radiation.dose': 85,
  },
  C02: {
    'bone.spineDensity': -9, 'bone.hipDensity': -9, 'bone.tibiaDensity': -7,
    'muscle.coreStrength': -18, 'muscle.thighStrength': -24, 'muscle.calfStrength': -28,
    'cardio.restingHeartRate': 24, 'cardio.recoveryHeartRate': -13,
    'sleep.hours': -0.8, 'sleep.quality': -0.5, 'radiation.dose': 100,
  },
  C03: {
    'bone.spineDensity': -3, 'bone.hipDensity': -4, 'bone.tibiaDensity': -3,
    'muscle.coreStrength': -5, 'muscle.thighStrength': -6, 'muscle.calfStrength': -7,
    'cardio.restingHeartRate': 6, 'cardio.recoveryHeartRate': -4,
    'sleep.hours': -2.6, 'sleep.quality': -1.8, 'radiation.dose': 195,
  },
};