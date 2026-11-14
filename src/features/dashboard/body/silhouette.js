import { symmetricPath, taper } from './geometry.js';
import { bothEllipses, bothTapers, ellipse, path } from './shapes.js';

const TORSO = [
  [100, 70], [116, 72], [132, 78], [145, 90], [143, 112], [137, 134], [130, 160],
  [127, 180], [132, 200], [138, 216], [131, 232], [100, 238],
];

export const SILHOUETTE = [
  ellipse('skin', [100, 36], 21, 26),
  path('skin', taper([100, 54], [100, 80], [9, 9.5, 12])),
  path('skin', symmetricPath(TORSO)),
  ...bothTapers('skin', [139, 86], [147, 162], [11, 10.5, 8.5, 7]),
  ...bothTapers('skin', [147, 162], [152, 228], [7, 7.5, 6, 4.5]),
  ...bothTapers('skin', [152, 226], [156, 260], [5, 6.5, 6, 3.5]),
  ...bothTapers('skin', [116, 212], [114, 300], [17, 16, 13, 9]),
  ...bothTapers('skin', [114, 300], [112, 382], [9, 10, 8, 5]),
  ...bothEllipses('skin', [116, 394], 10, 6),
];