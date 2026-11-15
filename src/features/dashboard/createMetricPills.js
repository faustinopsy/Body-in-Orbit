import { createElement } from '../../ui/createElement.js';
import { metricsOfLayer } from '../../domain/metrics.js';

export function createMetricPills(app) {
  const element = createElement('div', { class: 'metric-pills', role: 'group' });
  let builtFor = null;

  function build(layerId) {
    builtFor = layerId;
    element.replaceChildren(...metricsOfLayer(layerId).map((metric) => {
      const button = createElement('button', { type: 'button', class: 'metric-pill', 'data-metric': metric.id });
      button.addEventListener('click', () => app.commands.selectMetric(metric.id));
      return button;
    }));
  }

  function update(state) {
    if (state.layerId !== builtFor) build(state.layerId);
    element.setAttribute('aria-label', app.t('chart.pick'));
    [...element.children].forEach((button) => {
      button.textContent = app.t(`metric.${button.dataset.metric}`);
      button.setAttribute('aria-pressed', String(button.dataset.metric === state.metricId));
    });
  }

  return { element, update };
}