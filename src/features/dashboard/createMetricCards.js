import { createElement } from '../../ui/createElement.js';
import { METRICS } from '../../domain/metrics.js';
import { formatValue } from './formatValue.js';

function createCard(app, metric) {
  const name = createElement('span', { class: 'card__name' });
  const value = createElement('span', { class: 'card__value' });
  const note = createElement('span', { class: 'card__note' });
  const element = createElement('button', { type: 'button', class: 'card', 'data-metric': metric.id }, name, value, note);
  element.addEventListener('click', () => app.commands.selectMetric(metric.id));
  return { metric, element, name, value, note };
}

export function createMetricCards(app) {
  const cards = METRICS.map((metric) => createCard(app, metric));
  const element = createElement('div', { class: 'cards' }, ...cards.map((card) => card.element));

  function updateCard(card, state, view) {
    const entry = view.snapshot.metrics[card.metric.id];
    card.element.hidden = card.metric.layerId !== state.layerId;
    card.element.setAttribute('class', `card status--${entry.status}`);
    card.element.setAttribute('aria-pressed', String(card.metric.id === state.metricId));
    card.name.textContent = app.t(`metric.${card.metric.id}`);
    card.value.textContent = `${formatValue(entry.value, state.locale)} ${card.metric.unit} · ${app.t(`status.${entry.status}`)}`;
    card.note.textContent = entry.crossingDay === null
      ? app.t('card.stable')
      : app.t('card.crossing', { day: entry.crossingDay });
  }

  function update(state, view) {
    cards.forEach((card) => updateCard(card, state, view));
  }

  return { element, update };
}