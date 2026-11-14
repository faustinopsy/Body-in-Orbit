export const AXIS_X = 100;

const round = (value) => Math.round(value * 10) / 10;
const point = ([x, y]) => `${round(x)},${round(y)}`;

export const mirrorPoint = ([x, y]) => [2 * AXIS_X - x, y];
export const mirrorPoints = (points) => points.map(mirrorPoint);

function controlPoints(p0, p1, p2, p3) {
  const first = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
  const second = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return `C${point(first)} ${point(second)} ${point(p2)}`;
}

export function smoothPath(points, closed = false) {
  const count = points.length;
  const at = (index) => (closed ? points[(index + count) % count] : points[Math.min(Math.max(index, 0), count - 1)]);
  const segments = closed ? count : count - 1;
  const curves = [];
  for (let index = 0; index < segments; index += 1) {
    curves.push(controlPoints(at(index - 1), at(index), at(index + 1), at(index + 2)));
  }
  return `M${point(points[0])} ${curves.join(' ')}${closed ? ' Z' : ''}`;
}

export function symmetricPath(halfPoints) {
  const inner = halfPoints.slice(1, -1);
  return smoothPath([...halfPoints, ...mirrorPoints(inner).reverse()], true);
}

function sideOf(start, end) {
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]) || 1;
  const along = [(end[0] - start[0]) / length, (end[1] - start[1]) / length];
  return { along, normal: [-along[1], along[0]] };
}

export function taper(start, end, radii) {
  const { along, normal } = sideOf(start, end);
  const last = radii.length - 1;
  const centre = (index) => {
    const t = index / last;
    return [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
  };
  const offset = (index, sign) => {
    const [x, y] = centre(index);
    return [x + normal[0] * radii[index] * sign, y + normal[1] * radii[index] * sign];
  };
  const left = radii.map((_, index) => offset(index, 1));
  const right = radii.map((_, index) => offset(index, -1)).reverse();
  const tip = [end[0] + along[0] * radii[last] * 0.7, end[1] + along[1] * radii[last] * 0.7];
  const base = [start[0] - along[0] * radii[0] * 0.7, start[1] - along[1] * radii[0] * 0.7];
  return smoothPath([...left, tip, ...right, base], true);
}

export const mirrorTaper = (start, end, radii) => taper(mirrorPoint(start), mirrorPoint(end), radii);