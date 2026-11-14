import { mirrorPoint, mirrorPoints, mirrorTaper, smoothPath, taper } from './geometry.js';

export const path = (kind, d) => ({ tag: 'path', kind, attrs: { d } });
export const ellipse = (kind, [cx, cy], rx, ry) => ({ tag: 'ellipse', kind, attrs: { cx, cy, rx, ry } });
export const circle = (kind, [cx, cy], r) => ({ tag: 'circle', kind, attrs: { cx, cy, r } });

export const bothTapers = (kind, start, end, radii) => [
  path(kind, taper(start, end, radii)),
  path(kind, mirrorTaper(start, end, radii)),
];

export const bothLines = (kind, points) => [
  path(kind, smoothPath(points)),
  path(kind, smoothPath(mirrorPoints(points))),
];

export const bothShapes = (kind, points) => [
  path(kind, smoothPath(points, true)),
  path(kind, smoothPath(mirrorPoints(points), true)),
];

export const bothEllipses = (kind, centre, rx, ry) => [
  ellipse(kind, centre, rx, ry),
  ellipse(kind, mirrorPoint(centre), rx, ry),
];

export const region = (regionId, shapes) => ({ regionId, shapes });
export const detail = (shapes) => ({ regionId: null, shapes });