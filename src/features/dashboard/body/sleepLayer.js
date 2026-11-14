import { mirrorPoints, smoothPath } from './geometry.js';
import { bothLines, detail, ellipse, path, region } from './shapes.js';

const GYRI = [
  [[102, 18], [108, 21], [112, 18], [116, 24]],
  [[102, 27], [108, 25], [111, 30], [116, 31]],
  [[102, 36], [107, 34], [111, 38], [114, 36]],
];

const NERVES = [
  [[101, 80], [118, 84], [138, 96], [145, 140], [149, 190], [153, 240]],
  [[146, 150], [151, 190], [156, 230], [158, 254]],
  [[101, 196], [108, 212], [113, 240], [115, 300], [113, 340], [111, 384]],
  [[114, 296], [119, 330], [118, 380]],
  ...[98, 112, 126, 140, 154, 168].map((y) => [[101, y], [112, y + 2], [124, y + 8]]),
];

function nerves(kind) {
  return NERVES.flatMap((points) => [path(kind, smoothPath(points)), path(kind, smoothPath(mirrorPoints(points)))]);
}

export function sleepLayer() {
  return [
    detail([
      path('muscle', 'M136,20 A10,10 0 1 0 146,32 A8,8 0 1 1 136,20 Z'),
      path('contour', 'M150,10 h7 l-7,8 h7 M160,2 h5 l-5,6 h5'),
    ]),
    region('sleep-brain', [
      ...nerves('hit'),
      ...nerves('nerve'),
      path('line', smoothPath([[100, 44], [100, 120], [100, 200]])),
      ellipse('fill', [100, 28], 17, 15),
      path('contour', 'M100,14 V42'),
      ...GYRI.flatMap((points) => bothLines('contour', points)),
      path('fill', 'M96,42 Q100,50 104,42 Z'),
    ]),
  ];
}