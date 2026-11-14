export const LAYERS = [
  { id: 'skeleton', regions: ['bone-spine', 'bone-hip', 'bone-tibia'] },
  { id: 'muscles', regions: ['muscle-core', 'muscle-thigh', 'muscle-calf'] },
  { id: 'cardiovascular', regions: ['cardio-heart', 'cardio-vessels'] },
  { id: 'neuroOcular', regions: ['eye-optic'] },
  { id: 'sleep', regions: ['sleep-brain'] },
  { id: 'radiation', regions: ['radiation-body'] },
];

export const layerById = (layerId) => LAYERS.find((layer) => layer.id === layerId) ?? null;

export const layerOfRegion = (regionId) =>
  LAYERS.find((layer) => layer.regions.includes(regionId))?.id ?? null;