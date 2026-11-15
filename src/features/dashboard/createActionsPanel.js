import { createElement } from '../../ui/createElement.js';
import { riskOfLayer } from '../../domain/missions/riskRatings.js';

const ITEMS_PER_LAYER = 3;

export function createActionsPanel(app) {
  const title = createElement('h3', { class: 'actions__title' });
  const status = createElement('p', { class: 'actions__status' });
  const list = createElement('ul', { class: 'actions__list' });
  const note = createElement('p', { class: 'actions__note' });
  const more = createElement('button', { type: 'button', class: 'button actions__more' });
  const element = createElement('div', { class: 'actions' }, title, status, list, note, more);
  more.addEventListener('click', () => {
    app.commands.setHelpRisk(riskOfLayer(app.store.getState().layerId).id);
    app.commands.goTo('help');
  });

  function update(state, view) {
    const layer = app.t(`layer.${state.layerId}`);
    const layerStatus = view.snapshot.layers[state.layerId] ?? 'none';
    title.textContent = app.t('actions.title', { layer });
    status.textContent = app.t('actions.status', { crew: state.crewId, layer, status: app.t(`status.${layerStatus}`), day: state.day });
    status.dataset.status = layerStatus;
    list.replaceChildren(...Array.from({ length: ITEMS_PER_LAYER }, (_, index) => createElement('li', {}, app.t(`actions.${state.layerId}.${index + 1}`))));
    note.textContent = app.t('actions.note');
    more.textContent = app.t('actions.more');
  }

  return { element, update };
}