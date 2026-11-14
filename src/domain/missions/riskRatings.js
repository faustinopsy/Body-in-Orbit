const short = { leo: 'leo-short', orbit: 'lunar-orbit-short', surface: 'lunar-surface-short' };
const long = { leo: 'leo-long', orbit: 'lunar-orbit-long', surface: 'lunar-surface-long' };

function same(ids, rating) {
  return Object.fromEntries(Object.values(ids).map((id) => [id, rating]));
}

const rate = (ops, health) => ({ ops, health });

export const RISKS = [
  { id: 'bone', layerId: 'skeleton', matrix: [3, 4], approved: '2017-11', mapped: true },
  { id: 'fitness', layerId: 'muscles', matrix: null, approved: null, sameAs: 'bone' },
  { id: 'cardiovascular', layerId: 'cardiovascular', matrix: [5, 5], approved: '2024-05' },
  { id: 'sans', layerId: 'neuroOcular', matrix: [5, 5], approved: '2022-07' },
  { id: 'sleep', layerId: 'sleep', matrix: [5, 5], approved: '2022-03' },
  { id: 'radiation', layerId: 'radiation', matrix: [3, 4], approved: null },
];

export const RATINGS = {
  bone: {
    'leo-short': rate([1, 4], [2, 3]),
    'leo-long': rate([1, 4], [2, 3]),
    ...same({ orbit: 'lunar-orbit-short', surface: 'lunar-surface-short' }, rate([1, 4], [1, 3])),
    ...same({ orbit: 'lunar-orbit-long', surface: 'lunar-surface-long' }, rate([1, 4], [2, 3])),
    'mars-preparatory': rate([1, 4], [2, 3]),
    'mars-planetary': rate([1, 4], [3, 3]),
  },
  cardiovascular: {
    ...same(short, rate([3, 3], [1, 2])),
    ...same(long, rate([4, 3], [1, 2])),
    'mars-preparatory': rate([4, 3], [1, 2]),
    'mars-planetary': rate([4, 4], [2, 4]),
  },
  sans: {
    ...same(short, rate([4, 1], [2, 2])),
    ...same(long, rate([4, 3], [4, 3])),
    'mars-preparatory': rate([4, 3], [4, 3]),
    'mars-planetary': rate([4, 4], [4, 5]),
  },
  sleep: {
    ...same(short, rate([5, 2], [3, 1])),
    ...same(long, rate([5, 2], [3, 1])),
    'mars-preparatory': rate([5, 2], [4, 2]),
    'mars-planetary': rate([5, 2], [4, 2]),
  },
  radiation: {
    ...same(short, rate([1, 1], [3, 1])),
    ...same(long, rate([1, 1], [3, 2])),
    'mars-preparatory': rate([1, 1], [3, 3]),
    'mars-planetary': rate([1, 1], [3, 3]),
  },
};

export const riskById = (riskId) => RISKS.find((risk) => risk.id === riskId) ?? null;
export const riskOfLayer = (layerId) => RISKS.find((risk) => risk.layerId === layerId) ?? null;