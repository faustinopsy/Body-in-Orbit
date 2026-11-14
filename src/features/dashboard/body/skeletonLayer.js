import { symmetricPath, taper } from './geometry.js';
import { bothEllipses, bothLines, bothTapers, circle, detail, ellipse, path, region } from './shapes.js';

const RIB_WIDTHS = [20, 26, 30, 32, 32, 30, 27];
const PELVIS = [
  [100, 194], [110, 190], [124, 186], [136, 192], [138, 206], [130, 214], [121, 222], [111, 226], [104, 232], [100, 232],
];

function vertebrae() {
  return Array.from({ length: 18 }, (_, index) => {
    const y = 60 + index * 8;
    const width = index < 6 ? 3.6 : 5;
    return path('fill', `M${100 - width},${y} h${width * 2} a2,2 0 0 1 2,2 v2.6 a2,2 0 0 1 -2,2 h${-width * 2} a2,2 0 0 1 -2,-2 v-2.6 a2,2 0 0 1 2,-2 Z`);
  });
}

function ribs() {
  return RIB_WIDTHS.flatMap((width, index) => {
    const y = 90 + index * 8.5;
    const rib = [[104, y], [100 + width * 0.8, y - 2], [100 + width, y + 6], [100 + width * 0.9, y + 15], [100 + width * 0.55, y + 19]];
    return [...bothLines('bone-edge', rib), ...bothLines('bone-line', rib)];
  });
}

function skull() {
  return [
    ellipse('bone', [100, 31], 17, 19),
    path('bone', 'M88,40 C88,52 93,58 100,59 C107,58 112,52 112,40 Z'),
    ...bothEllipses('socket', [93.5, 35], 4.6, 4.2),
    path('socket', 'M100,40 L97.5,46 L102.5,46 Z'),
    path('contour', 'M92,51 H108 M95,49 V53 M100,49 V53 M105,49 V53'),
  ];
}

function limbs() {
  return [
    ...bothLines('bone-edge', [[102, 79], [118, 77], [134, 83]]),
    ...bothLines('bone-line', [[102, 79], [118, 77], [134, 83]]),
    path('bone', taper([100, 86], [100, 132], [3.5, 3, 2])),
    ...bothTapers('bone', [139, 90], [147, 158], [4.2, 2.4, 2.4, 3.8]),
    ...bothTapers('bone', [145, 165], [149, 224], [2.4, 1.6, 1.6, 2.2]),
    ...bothTapers('bone', [150, 165], [155, 224], [2, 1.4, 1.4, 2]),
    ...bothTapers('bone', [152, 230], [156, 256], [3.4, 2.6, 1.6]),
    ...bothTapers('bone', [119, 220], [114, 295], [4.6, 2.7, 2.7, 4.8]),
    circle('bone', [120, 215], 4.4),
    circle('bone', [80, 215], 4.4),
    ...bothEllipses('bone', [114, 300], 3.4, 3.4),
    ...bothTapers('bone', [119, 307], [117, 374], [2, 1.2, 1.2, 1.8]),
    ...bothEllipses('bone', [115, 393], 7, 4),
  ];
}

export function skeletonLayer() {
  return [
    detail([...skull(), ...limbs(), ...ribs()]),
    region('bone-spine', vertebrae()),
    region('bone-hip', [
      path('fill', symmetricPath(PELVIS)),
      ...bothEllipses('socket', [110, 221], 4, 3),
    ]),
    region('bone-tibia', bothTapers('fill', [113, 305], [111, 377], [5, 3, 2.6, 3.8])),
  ];
}