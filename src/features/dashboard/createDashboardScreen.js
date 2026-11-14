import { createElement } from '../../ui/createElement.js';
import { buildSnapshot } from '../../domain/snapshot.js';
import { createCrewPicker } from './createCrewPicker.js';
import { createTimeline } from './createTimeline.js';
import { createLayerRail } from './createLayerRail.js';
import { createMetricCards } from './createMetricCards.js';
import { createMetricChart } from './createMetricChart.js';
import { createAvatar2D } from './createAvatar2D.js';
import './dashboard.css';

function buildView(state) {
  const { dataset, day } = state;
  const crewStatuses = Object.fromEntries(
    dataset.crew.map(({ id }) => [id, buildSnapshot(dataset, id, day).overall]),
  );
  return { snapshot: buildSnapshot(dataset, state.crewId, day), crewStatuses };
}

export function createDashboardScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const summary = createElement('p', { class: 'screen__text' });
  const notice = createElement('p', { class: 'screen__text screen__text--soft' });
  const parts = [createCrewPicker(app), createTimeline(app), createLayerRail(app), createAvatar2D(app), createMetricCards(app), createMetricChart(app)];
  const [crew, timeline, layers, avatar, cards, chart] = parts;
  const board = createElement(
    'div',
    { class: 'board' },
    createElement('div', { class: 'board__controls' }, crew.element, timeline.element),
    createElement('div', { class: 'board__layers' }, layers.element),
    createElement('div', { class: 'board__avatar' }, avatar.element),
    createElement('div', { class: 'board__details' }, cards.element, chart.element),
  );
  const element = createElement('section', { class: 'screen', 'data-screen': 'dashboard' }, title, summary, board, notice);

  function update(state) {
    title.textContent = app.t('dashboard.title');
    const { dataset } = state;
    board.hidden = !dataset;
    notice.textContent = app.t('dashboard.notice');
    if (!dataset) {
      summary.textContent = app.t('dashboard.empty');
      return;
    }
    summary.textContent = app.t('dashboard.summary', { crew: dataset.crew.length, days: dataset.missionDays, name: dataset.name });
    const view = buildView(state);
    parts.forEach((part) => part.update(state, view));
  }

  return { element, update };
}