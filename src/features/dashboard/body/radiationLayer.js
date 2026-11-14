import { SILHOUETTE } from './silhouette.js';
import { detail, path, region } from './shapes.js';

const AURA_BANDS = ['aura-outer', 'aura-middle', 'aura-inner'];

function rays() {
  return [[18, 40], [30, 120], [170, 70], [182, 160], [20, 250], [176, 300]]
    .map(([x, y]) => path('contour', `M${x},${y} l10,8`));
}

const aura = () => AURA_BANDS.flatMap((kind) => SILHOUETTE.map((shape) => ({ ...shape, kind, back: true })));

export function radiationLayer() {
  return [
    detail(rays()),
    region('radiation-body', [
      ...aura(),
      ...SILHOUETTE.map((shape) => ({ ...shape, kind: 'area' })),
    ]),
  ];
}