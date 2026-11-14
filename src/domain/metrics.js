export const METRICS = [
  { id: 'bone.spineDensity', layerId: 'skeleton', regionId: 'bone-spine', unit: '%', baseline: 100, worse: 'down', warning: 96, critical: 92 },
  { id: 'bone.hipDensity', layerId: 'skeleton', regionId: 'bone-hip', unit: '%', baseline: 100, worse: 'down', warning: 95, critical: 90 },
  { id: 'bone.tibiaDensity', layerId: 'skeleton', regionId: 'bone-tibia', unit: '%', baseline: 100, worse: 'down', warning: 96, critical: 92 },
  { id: 'muscle.coreStrength', layerId: 'muscles', regionId: 'muscle-core', unit: '%', baseline: 100, worse: 'down', warning: 90, critical: 80 },
  { id: 'muscle.thighStrength', layerId: 'muscles', regionId: 'muscle-thigh', unit: '%', baseline: 100, worse: 'down', warning: 88, critical: 78 },
  { id: 'muscle.calfStrength', layerId: 'muscles', regionId: 'muscle-calf', unit: '%', baseline: 100, worse: 'down', warning: 85, critical: 75 },
  { id: 'cardio.restingHeartRate', layerId: 'cardiovascular', regionId: 'cardio-heart', unit: 'bpm', baseline: 60, worse: 'up', warning: 75, critical: 90 },
  { id: 'cardio.recoveryHeartRate', layerId: 'cardiovascular', regionId: 'cardio-vessels', unit: 'bpm', baseline: 30, worse: 'down', warning: 22, critical: 15 },
  { id: 'sleep.hours', layerId: 'sleep', regionId: 'sleep-brain', unit: 'h', baseline: 7.5, worse: 'down', warning: 6, critical: 5 },
  { id: 'sleep.quality', layerId: 'sleep', regionId: 'sleep-brain', unit: '1-5', baseline: 4, worse: 'down', warning: 3, critical: 2 },
  { id: 'radiation.dose', layerId: 'radiation', regionId: 'radiation-body', unit: 'mSv', baseline: 0, worse: 'up', warning: 120, critical: 180 },
];

export const metricById = (metricId) => METRICS.find((metric) => metric.id === metricId) ?? null;

export const metricsOfLayer = (layerId) => METRICS.filter((metric) => metric.layerId === layerId);

export const metricsOfRegion = (regionId) => METRICS.filter((metric) => metric.regionId === regionId);