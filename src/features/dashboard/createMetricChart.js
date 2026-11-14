import { createElement } from '../../ui/createElement.js';
import { createSvgElement } from '../../ui/createSvgElement.js';
import { metricById } from '../../domain/metrics.js';
import { valuesUntil } from '../../domain/series.js';
import { buildChartModel, CHART_SIZE } from './buildChartModel.js';
import { formatValue } from './formatValue.js';

const line = (className) => createSvgElement('line', { class: className });

export function createMetricChart(app) {
  const title = createElement('h3', { class: 'chart__title' });
  const warning = line('chart__limit chart__limit--warning');
  const critical = line('chart__limit chart__limit--critical');
  const projection = line('chart__projection');
  const series = createSvgElement('polyline', { class: 'chart__series', fill: 'none' });
  const marker = createSvgElement('circle', { class: 'chart__marker', r: 5 });
  const top = createSvgElement('text', { class: 'chart__axis' });
  const bottom = createSvgElement('text', { class: 'chart__axis' });
  const svg = createSvgElement(
    'svg',
    { viewBox: `0 0 ${CHART_SIZE.width} ${CHART_SIZE.height}`, class: 'chart__svg', role: 'img' },
    warning, critical, series, projection, marker, top, bottom,
  );
  const element = createElement('section', { class: 'chart' }, title, svg);

  function place(target, x1, y1, x2, y2) {
    target.setAttribute('x1', x1);
    target.setAttribute('y1', y1);
    target.setAttribute('x2', x2);
    target.setAttribute('y2', y2);
  }

  function update(state, view) {
    const metric = metricById(state.metricId);
    const entry = view.snapshot.metrics[metric.id];
    const values = valuesUntil(state.dataset.series[state.crewId][metric.id], state.day);
    const model = buildChartModel({ values, metric, trend: entry.trend, crossingDay: entry.crossingDay, day: state.day, missionDays: state.dataset.missionDays });
    const { left, right, bottom: floor } = model.axis;
    title.textContent = `${app.t(`metric.${metric.id}`)} (${metric.unit})`;
    svg.setAttribute('aria-label', app.t('chart.label', { metric: app.t(`metric.${metric.id}`) }));
    series.setAttribute('points', model.points);
    place(warning, left, model.warningY, right, model.warningY);
    place(critical, left, model.criticalY, right, model.criticalY);
    marker.setAttribute('cx', model.marker.x);
    marker.setAttribute('cy', model.marker.y);
    projection.setAttribute('visibility', model.projection ? 'visible' : 'hidden');
    if (model.projection) place(projection, model.projection.x1, model.projection.y1, model.projection.x2, model.projection.y2);
    top.textContent = formatValue(model.axis.max, state.locale);
    bottom.textContent = formatValue(model.axis.min, state.locale);
    top.setAttribute('x', 2);
    top.setAttribute('y', CHART_SIZE.top + 8);
    bottom.setAttribute('x', 2);
    bottom.setAttribute('y', floor);
  }

  return { element, update };
}