export const FULL_VIEW = [0, 0, 200, 410];

const REGION_BOUNDS = {
  'eye-optic': [86, 16, 114, 40],
  'cardio-heart': [91, 88, 122, 136],
  'bone-spine': [93, 60, 107, 203],
  'bone-hip': [61, 186, 139, 233],
  'bone-tibia': [82, 301, 118, 381],
  'muscle-core': [70, 134, 130, 208],
  'muscle-thigh': [70, 214, 130, 299],
  'muscle-calf': [74, 305, 126, 365],
};

const PADDING = 18;
const MIN_WIDTH = 70;
const clamp = (value, max) => Math.min(Math.max(value, 0), max);
const round = (value) => Math.round(value * 10) / 10;

export function focusViewBox(regionId) {
  const bounds = REGION_BOUNDS[regionId];
  if (!bounds) return FULL_VIEW;
  const [left, top, right, bottom] = bounds;
  const [, , fullWidth, fullHeight] = FULL_VIEW;
  const ratio = fullHeight / fullWidth;
  const width = Math.min(fullWidth, Math.max(MIN_WIDTH, right - left + 2 * PADDING, (bottom - top + 2 * PADDING) / ratio));
  const height = width * ratio;
  const x = clamp((left + right) / 2 - width / 2, fullWidth - width);
  const y = clamp((top + bottom) / 2 - height / 2, fullHeight - height);
  return [x, y, width, height].map(round);
}

export const isZoomed = (regionId) => Boolean(REGION_BOUNDS[regionId]);