export const CHART_SIZE = { width: 600, height: 260, left: 46, right: 14, top: 18, bottom: 26 };

function niceStep(range) {
  const raw = range / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / power;
  const nice = [1, 2, 5].find((candidate) => unit <= candidate) ?? 10;
  return nice * power;
}

function valueScale(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = niceStep(max - min || 1);
  return { min: Math.floor(min / step) * step, max: Math.ceil(max / step) * step, step };
}

function dayStep(missionDays) {
  if (missionDays > 400) return 90;
  if (missionDays > 120) return 30;
  return missionDays > 40 ? 10 : 5;
}

function ticksOf(from, to, step) {
  const ticks = [];
  for (let value = from; value <= to + step / 2; value += step) ticks.push(Math.round(value * 1000) / 1000);
  return ticks;
}

function pointsOf(series, fromDay, toDay, scale) {
  return series.slice(fromDay - 1, toDay).map((value, index) => `${scale.x(fromDay + index).toFixed(1)},${scale.y(value).toFixed(1)}`).join(' ');
}

function createScale({ series, metric, missionDays }) {
  const { width, height, left, right, top, bottom } = CHART_SIZE;
  const range = valueScale([...series, metric.warning, metric.critical, metric.baseline]);
  const x = (day) => left + ((day - 1) / Math.max(missionDays - 1, 1)) * (width - left - right);
  const y = (value) => top + ((range.max - value) / (range.max - range.min)) * (height - top - bottom);
  return { x, y, range };
}

export function buildChartModel({ series, metric, value, day, today, missionDays }) {
  const scale = createScale({ series, metric, missionDays });
  const end = Math.min(today, missionDays);
  const future = end < missionDays;
  const line = (limit) => ({ y: scale.y(limit), value: limit });
  return {
    frame: { left: CHART_SIZE.left, right: CHART_SIZE.width - CHART_SIZE.right, top: CHART_SIZE.top, bottom: CHART_SIZE.height - CHART_SIZE.bottom },
    xTicks: [1, ...ticksOf(dayStep(missionDays), missionDays, dayStep(missionDays))].map((tick) => ({ x: scale.x(tick), day: tick })),
    yTicks: ticksOf(scale.range.min, scale.range.max, scale.range.step).map((tick) => ({ y: scale.y(tick), value: tick })),
    observed: pointsOf(series, 1, end, scale),
    projected: future ? pointsOf(series, end, missionDays, scale) : null,
    projectionArea: future ? { x: scale.x(end), width: scale.x(missionDays) - scale.x(end) } : null,
    limits: { warning: line(metric.warning), critical: line(metric.critical), baseline: line(metric.baseline) },
    today: { x: scale.x(end), day: end },
    cursor: { x: scale.x(day), y: scale.y(Number.isFinite(value) ? value : series[day - 1]), day, value },
  };
}