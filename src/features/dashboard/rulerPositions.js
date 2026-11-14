const REACH = 1.25;

const percent = (fraction) => (Math.min(REACH, Math.max(0, fraction)) / REACH) * 100;

export function rulerPositions(metric, value) {
  const distance = metric.critical - metric.baseline;
  if (!Number.isFinite(value) || distance === 0) return null;
  const fraction = (point) => (point - metric.baseline) / distance;
  return { warning: percent(fraction(metric.warning)), critical: percent(1), value: percent(fraction(value)) };
}