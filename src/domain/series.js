export function valuesUntil(series, day) {
  return series.slice(0, Math.min(day, series.length));
}

export function valueAt(series, day, window = 7) {
  const recent = valuesUntil(series, day).slice(-window);
  if (recent.length === 0) return null;
  const total = recent.reduce((sum, value) => sum + value, 0);
  return total / recent.length;
}