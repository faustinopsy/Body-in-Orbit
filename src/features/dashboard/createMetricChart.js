import { createElement } from '../../ui/createElement.js';
import { createSvgElement } from '../../ui/createSvgElement.js';
import { metricById } from '../../domain/metrics.js';
import { todayOf } from '../../domain/missionDay.js';
import { buildChartModel, CHART_SIZE } from './buildChartModel.js';
import { drawChart } from './drawChart.js';
import { formatValue } from './formatValue.js';
import { createMetricPills } from './createMetricPills.js';
import { createChartLegend } from './createChartLegend.js';

function chartTexts(app, state, metric, value) {
  const number = (limit) => formatValue(limit, state.locale);
  return {
    baseline: app.t('chart.baseline', { value: number(metric.baseline) }),
    warning: app.t('chart.warning', { value: number(metric.warning) }),
    critical: app.t('chart.critical', { value: number(metric.critical) }),
    today: app.t('chart.today'),
    projection: app.t('chart.projection'),
    cursor: `d${state.day} · ${number(value)} ${metric.unit}`,
  };
}

export function createMetricChart(app) {
  const pills = createMetricPills(app);
  const legend = createChartLegend(app);
  const svg = createSvgElement('svg', { viewBox: `0 0 ${CHART_SIZE.width} ${CHART_SIZE.height}`, class: 'chart__svg', role: 'img' });
  const element = createElement('section', { class: 'chart' }, pills.element, legend.element, svg);

  function update(state, view) {
    const metric = metricById(state.metricId);
    const { value } = view.snapshot.metrics[metric.id];
    const series = state.dataset.series[state.crewId][metric.id];
    const model = buildChartModel({ series, metric, value, day: state.day, today: todayOf(state.dataset), missionDays: state.dataset.missionDays });
    svg.replaceChildren(...drawChart(model, chartTexts(app, state, metric, value), state.locale));
    svg.setAttribute('aria-label', app.t('chart.label', { metric: app.t(`metric.${metric.id}`), crew: state.crewId, day: state.day, value: formatValue(value, state.locale), unit: metric.unit }));
    pills.update(state);
    legend.update(state);
  }

  return { element, update };
}