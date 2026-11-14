import { bothShapes, bothTapers, detail, path, region } from './shapes.js';

const PECTORAL = [[102, 92], [118, 87], [134, 92], [139, 104], [131, 118], [113, 122], [102, 116]];
const OBLIQUE = [[117, 140], [128, 146], [129, 170], [124, 192], [116, 186], [114, 160]];

function abdomen() {
  const blocks = [134, 150, 166].flatMap((y) => [
    path('fill', `M101.5,${y} h9 a3,3 0 0 1 3,3 v8 a3,3 0 0 1 -3,3 h-9 Z`),
    path('fill', `M98.5,${y} h-9 a3,3 0 0 0 -3,3 v8 a3,3 0 0 0 3,3 h9 Z`),
  ]);
  return [...blocks, path('fill', 'M88,183 H112 L108,204 Q100,212 92,204 Z'), ...bothShapes('fill', OBLIQUE)];
}

function context() {
  return [
    ...bothShapes('muscle', PECTORAL),
    ...bothTapers('muscle', [141, 84], [147, 120], [8, 9.5, 4]),
    ...bothTapers('muscle', [145, 120], [148, 158], [4, 6.2, 3]),
    ...bothTapers('muscle', [148, 166], [152, 214], [5, 5.2, 2.5]),
    ...bothTapers('muscle', [104, 64], [134, 82], [3, 4.5, 2.5]),
  ];
}

export function musclesLayer() {
  return [
    detail(context()),
    region('muscle-core', abdomen()),
    region('muscle-thigh', [
      ...bothTapers('fill', [123, 222], [119, 292], [5.5, 8, 6, 3]),
      ...bothTapers('fill', [114, 218], [114, 292], [5, 7, 5, 3]),
      ...bothTapers('fill', [106, 258], [110, 296], [3, 6, 4]),
    ]),
    region('muscle-calf', [
      ...bothTapers('fill', [114, 308], [113, 362], [3.5, 4, 2]),
      ...bothTapers('fill', [121, 308], [119, 352], [3, 5.6, 2.5]),
      ...bothTapers('fill', [106, 310], [107.5, 346], [3, 4.6, 2]),
    ]),
  ];
}