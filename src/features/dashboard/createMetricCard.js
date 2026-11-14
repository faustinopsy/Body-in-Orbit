import { createElement } from '../../ui/createElement.js';
import { createStatusChip, setStatusChip } from '../../ui/createStatusChip.js';
import { formatValue } from './formatValue.js';
import { formatDelta } from './formatDelta.js';
import { rulerPositions } from './rulerPositions.js';
import { limitText } from './limitText.js';

export function createMetricCard(app, metric) {
  const parts = {
    name: createElement('span', { class: 'metric-card__name' }),
    chip: createStatusChip(),
    number: createElement('span', {}),
    unit: createElement('small', {}, metric.unit),
    delta: createElement('span', { class: 'metric-card__delta' }),
    ruler: createElement('span', { class: 'ruler', 'aria-hidden': 'true' }, createElement('i', {})),
    limit: createElement('span', { class: 'metric-card__limit' }),
  };
  const element = createElement(
    'button',
    { type: 'button', class: 'metric-card', 'data-metric': metric.id },
    createElement('span', { class: 'metric-card__top' }, parts.name, parts.chip),
    createElement('span', { class: 'metric-card__line' }, createElement('span', { class: 'metric-card__value' }, parts.number, parts.unit), parts.delta),
    parts.ruler,
    parts.limit,
  );
  element.addEventListener('click', () => app.commands.selectMetric(metric.id));

  function placeRuler(value) {
    const positions = rulerPositions(metric, value);
    parts.ruler.hidden = !positions;
    if (!positions) return;
    parts.ruler.style.setProperty('--warning', `${positions.warning.toFixed(1)}%`);
    parts.ruler.style.setProperty('--critical', `${positions.critical.toFixed(1)}%`);
    parts.ruler.style.setProperty('--value', `${positions.value.toFixed(1)}%`);
  }

  function update(state, entry) {
    element.dataset.status = entry.status ?? 'none';
    element.setAttribute('aria-pressed', String(metric.id === state.metricId));
    element.toggleAttribute('data-region-selected', metric.regionId === state.regionId);
    parts.name.textContent = app.t(`metric.${metric.id}`);
    setStatusChip(parts.chip, app, entry.status);
    parts.number.textContent = formatValue(entry.value, state.locale);
    parts.delta.textContent = formatDelta(entry.value, metric, state.locale);
    parts.limit.textContent = limitText(app, entry);
    placeRuler(entry.value);
  }

  return { metric, element, update };
}