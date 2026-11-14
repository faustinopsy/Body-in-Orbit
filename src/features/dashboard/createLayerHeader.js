import { createElement } from '../../ui/createElement.js';
import { createIcon, swapIcon } from '../../ui/icons.js';
import { createStatusChip, setStatusChip } from '../../ui/createStatusChip.js';
import { LAYER_ICONS } from './layerIcons.js';
import { layerEntries, isAlert, worstFirst } from './layerEntries.js';
import { createRegionChips } from './createRegionChips.js';
import { createNasaLine } from './createNasaLine.js';

export function createLayerHeader(app) {
  const tile = createElement('span', { class: 'layer-head__tile', 'aria-hidden': 'true' }, createIcon('bone', 22));
  const title = createElement('h3', { class: 'layer-head__title' });
  const meta = createElement('p', { class: 'layer-head__meta' });
  const chip = createStatusChip();
  const risk = createElement('span', { class: 'layer-head__risk', 'aria-hidden': 'true' });
  const regions = createRegionChips(app);
  const nasa = createNasaLine(app);
  const element = createElement(
    'header',
    { class: 'layer-head glass' },
    createElement('div', { class: 'layer-head__row' }, tile, createElement('div', { class: 'layer-head__texts' }, title, meta), createElement('div', { class: 'layer-head__status' }, chip, risk)),
    regions.element,
    nasa.element,
  );

  function update(state, view) {
    const entries = worstFirst(layerEntries(view.snapshot, state.layerId));
    const alerts = entries.filter((entry) => isAlert(entry.status)).length;
    swapIcon(tile.firstChild, LAYER_ICONS[state.layerId]);
    title.textContent = app.t(`layer.${state.layerId}`);
    meta.textContent = app.t('layer.meta', { count: alerts, crew: state.crewId });
    setStatusChip(chip, app, view.snapshot.layers[state.layerId]);
    risk.replaceChildren(...entries.map((entry) => createElement('i', { 'data-status': entry.status ?? 'none' })));
    regions.update(state, view);
    nasa.update(state);
  }

  return { element, update };
}