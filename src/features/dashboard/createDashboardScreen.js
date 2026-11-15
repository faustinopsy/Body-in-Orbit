import { createElement } from '../../ui/createElement.js';
import { buildSnapshot } from '../../domain/snapshot.js';
import { createCrewPicker } from './createCrewPicker.js';
import { createTimeline } from './createTimeline.js';
import { createLayerRail } from './createLayerRail.js';
import { createLayerHeader } from './createLayerHeader.js';
import { createMetricCards } from './createMetricCards.js';
import { createDetailPanel } from './createDetailPanel.js';
import { createAvatar2D } from './createAvatar2D.js';
import { createPlayback } from './createPlayback.js';
import './dashboard.css';

function buildView(state) {
  const { dataset, day } = state;
  const crewStatuses = Object.fromEntries(
    dataset.crew.map(({ id }) => [id, buildSnapshot(dataset, id, day).overall]),
  );
  return { snapshot: buildSnapshot(dataset, state.crewId, day), crewStatuses };
}

function createParts(app) {
  return {
    rail: createLayerRail(app),
    crew: createCrewPicker(app),
    avatar: createAvatar2D(app),
    timeline: createTimeline(app),
    header: createLayerHeader(app),
    cards: createMetricCards(app),
    detail: createDetailPanel(app),
  };
}

function buildBoard(parts) {
  const box = (className, ...children) => createElement('div', { class: className }, ...children);
  const stage = box('stage', box('stage__crew glass', parts.crew.element), box('stage__avatar', parts.avatar.element), box('stage__timeline glass', parts.timeline.element));
  const middle = box('board__middle', parts.cards.element, parts.detail.element);
  return box('board', box('board__body', parts.rail.element, stage), box('board__side', parts.header.element, middle));
}

export function createDashboardScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const summary = createElement('p', { class: 'screen__text' });
  const parts = createParts(app);
  const playback = createPlayback(app);
  const board = buildBoard(parts);
  const element = createElement('section', { class: 'screen dashboard', 'data-screen': 'dashboard' }, title, summary, board);

  function update(state) {
    const { dataset } = state;
    title.textContent = app.t('dashboard.title');
    board.hidden = !dataset;
    element.classList.toggle('dashboard--ready', Boolean(dataset));
    [title, summary].forEach((part) => part.classList.toggle('sr-only', Boolean(dataset)));
    playback.update(state);
    if (!dataset) {
      summary.textContent = app.t('dashboard.empty');
      return;
    }
    summary.textContent = app.t('dashboard.summary', { crew: dataset.crew.length, days: dataset.missionDays, name: dataset.name });
    const view = buildView(state);
    Object.values(parts).forEach((part) => part.update(state, view));
  }

  return { element, update };
}