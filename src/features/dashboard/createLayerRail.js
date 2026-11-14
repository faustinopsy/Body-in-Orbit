import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { LAYERS } from '../../domain/layers.js';
import { worstStatus } from '../../domain/status.js';
import { LAYER_ICONS } from './layerIcons.js';
import { layerEntries, isAlert } from './layerEntries.js';
import { createZoomControls } from './createZoomControls.js';

function createRailButton(app, id) {
  const name = createElement('span', { class: 'sr-only' });
  const count = createElement('span', { class: 'rail__count' });
  const element = createElement('button', { type: 'button', class: 'rail__button', 'data-layer': id }, createIcon(LAYER_ICONS[id], 22), name, count);
  element.addEventListener('click', () => app.commands.selectLayer(id));
  return { id, element, name, count };
}

export function createLayerRail(app) {
  const items = LAYERS.map(({ id }) => createRailButton(app, id));
  const list = createElement('div', { class: 'rail__list', role: 'group' }, ...items.map((item) => item.element));
  const zoom = createZoomControls(app);
  const element = createElement('div', { class: 'rail glass' }, list, zoom.element);

  function updateItem(item, state, view) {
    const alerts = layerEntries(view.snapshot, item.id).filter((entry) => isAlert(entry.status));
    const label = app.t(`layer.${item.id}`);
    item.name.textContent = `${label}, ${app.t('layers.alerts', { count: alerts.length })}`;
    item.element.title = label;
    item.element.setAttribute('aria-pressed', String(item.id === state.layerId));
    item.count.hidden = alerts.length === 0;
    item.count.textContent = String(alerts.length);
    item.count.dataset.status = worstStatus(alerts.map((entry) => entry.status)) ?? 'none';
  }

  function update(state, view) {
    list.setAttribute('aria-label', app.t('layers.label'));
    items.forEach((item) => updateItem(item, state, view));
    zoom.update(state);
  }

  return { element, update };
}