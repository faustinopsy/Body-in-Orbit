import { createElement } from '../../ui/createElement.js';
import { METRICS } from '../../domain/metrics.js';
import { layerEntries, worstFirst } from './layerEntries.js';
import { createMetricCard } from './createMetricCard.js';

export function createMetricCards(app) {
  const cards = new Map(METRICS.map((metric) => [metric.id, createMetricCard(app, metric)]));
  const title = createElement('h3', { class: 'label' });
  const list = createElement('div', { class: 'metrics__list' }, ...[...cards.values()].map((card) => card.element));
  const element = createElement('section', { class: 'metrics glass' }, title, list);
  let order = '';

  function arrange(entries) {
    const next = entries.map((entry) => entry.metric.id).join(',');
    if (next === order) return;
    order = next;
    list.append(...entries.map((entry) => cards.get(entry.metric.id).element));
  }

  function update(state, view) {
    const entries = worstFirst(layerEntries(view.snapshot, state.layerId));
    const shown = new Set(entries.map((entry) => entry.metric.id));
    title.textContent = app.t('dashboard.metricsOf', { layer: app.t(`layer.${state.layerId}`) });
    cards.forEach((card, id) => {
      card.element.hidden = !shown.has(id);
    });
    entries.forEach((entry) => cards.get(entry.metric.id).update(state, entry));
    arrange(entries);
  }

  return { element, update };
}