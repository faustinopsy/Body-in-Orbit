import { mirrorPoints, smoothPath } from './geometry.js';
import { bothEllipses, circle, detail, ellipse, path, region } from './shapes.js';

const OPTIC_NERVE = [[107.5, 35], [104, 31], [100, 29]];
const FLUID_ARROWS = [[80, 190], [120, 190], [100, 160], [86, 120], [114, 120]];

function arrows() {
  return FLUID_ARROWS.map(([x, y]) => path('contour', `M${x},${y} v-22 m-4,5 l4,-5 l4,5`));
}

function nerves(kind) {
  return [
    path(kind, smoothPath(OPTIC_NERVE)),
    path(kind, smoothPath(mirrorPoints(OPTIC_NERVE))),
    path(kind, smoothPath([[100, 29], [100, 22], [96, 16]])),
    path(kind, smoothPath([[100, 22], [104, 16]])),
  ];
}

export function neuroOcularLayer() {
  return [
    detail([
      ellipse('contour', [100, 26], 17, 16),
      ...bothEllipses('bone', [92.5, 35], 5, 3.8),
      ...arrows(),
    ]),
    region('eye-optic', [
      ...nerves('hit'),
      ...nerves('nerve'),
      ...bothEllipses('line', [92.5, 35], 6.2, 4.8),
      circle('fill', [92.5, 35], 2.3),
      circle('fill', [107.5, 35], 2.3),
    ]),
  ];
}