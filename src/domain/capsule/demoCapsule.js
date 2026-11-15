const DEMO_ITEMS = {
  d1: { kind: 'image', url: 'capsule/earth.svg' },
  d2: { kind: 'message' },
  d3: { kind: 'image', url: 'capsule/garden.svg' },
  d4: { kind: 'message' },
  d5: { kind: 'image', url: 'capsule/drawing.svg' },
  d6: { kind: 'image', url: 'capsule/aurora.svg' },
};

const DEMO_ORDER = { C01: ['d1', 'd2', 'd3', 'd5'], C02: ['d2', 'd6', 'd4', 'd1'], C03: ['d5', 'd3', 'd6', 'd4'] };
const DEMO_ANSWERED = { C01: 8, C02: 5, C03: 2 };

export function demoCapsuleItems(datasetId) {
  return Object.entries(DEMO_ORDER).flatMap(([crewId, keys]) => keys.map((key, order) => ({
    datasetId,
    crewId,
    order,
    ...DEMO_ITEMS[key],
    titleKey: `capsule.demo.${key}.title`,
    fromKey: `capsule.demo.${key}.from`,
    textKey: `capsule.demo.${key}.text`,
  })));
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function answersFrom(series, day) {
  return {
    sleepHours: clamp(Math.round(series['sleep.hours'][day - 1] * 2) / 2, 0, 12),
    sleepQuality: clamp(Math.round(series['sleep.quality'][day - 1]), 1, 5),
    disturbances: [],
    restingHeartRate: clamp(Math.round(series['cardio.restingHeartRate'][day - 1]), 40, 120),
  };
}

export function withDemoHistory(dataset) {
  const today = dataset.today ?? dataset.missionDays;
  const checkIns = Object.entries(DEMO_ANSWERED)
    .filter(([crewId]) => dataset.series[crewId])
    .flatMap(([crewId, count]) => Array.from({ length: count }, (_, index) => {
      const day = today - count + index;
      return { crewId, day, answers: answersFrom(dataset.series[crewId], day) };
    }));
  return { ...dataset, demo: true, checkIns };
}