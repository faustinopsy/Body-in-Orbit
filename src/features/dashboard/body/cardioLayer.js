import { bothLines, detail, path, region } from './shapes.js';
import { mirrorPoints, smoothPath } from './geometry.js';

const HEART = 'M95,104 C91,98 97,93 103,97 C106,92 113,92 117,98 C123,105 122,117 118,126 C116,131 113,134 110,136 C102,132 94,125 92,117 C91,112 92,107 95,104 Z';
const LEG_ARTERY = [[100, 200], [110, 214], [114, 240], [114, 300], [113, 340], [112, 378]];
const ARM_ARTERY = [[104, 92], [126, 86], [142, 104], [147, 150], [151, 200], [154, 240]];
const NECK_ARTERY = [[103, 94], [104, 72], [106, 50]];

function arteries(kind) {
  const aorta = smoothPath([[104, 96], [104, 86], [99, 84], [96, 92], [98, 140], [99, 200]]);
  const lines = [LEG_ARTERY, ARM_ARTERY, NECK_ARTERY].flatMap((points) => [smoothPath(points), smoothPath(mirrorPoints(points))]);
  return [aorta, ...lines].map((d) => path(kind, d));
}

const shift = (points, dx) => points.map(([x, y]) => [x + dx, y]);

export function cardioLayer() {
  return [
    detail([
      ...bothLines('vein', shift(LEG_ARTERY, -3)),
      ...bothLines('vein', shift(ARM_ARTERY, 3)),
      path('vein', smoothPath([[102, 104], [102, 140], [102, 198]])),
    ]),
    region('cardio-vessels', [...arteries('hit'), ...arteries('line')]),
    region('cardio-heart', [
      path('fill', HEART),
      path('contour', 'M104,98 C106,108 108,120 111,134 M95,110 C99,112 103,111 106,107'),
      path('fill', 'M101,101 C100,94 101,90 104,88 L108,88 C106,92 106,96 107,100 Z'),
    ]),
  ];
}