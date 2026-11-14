import { createElement } from '../../ui/createElement.js';
import { layerById } from '../../domain/layers.js';
import '../../ui/chip.css';

function createRegionChip(app, regionId) {
  const name = createElement('span', {});
  const element = createElement('button', { type: 'button', class: 'region-chip', 'data-region': regionId }, createElement('span', { class: 'shape', 'aria-hidden': 'true' }), name);
  element.addEventListener('click', () => app.commands.selectRegion(regionId));
  return { regionId, element, name };
}

export function createRegionChips(app) {
  const element = createElement('div', { class: 'region-chips', role: 'group' });
  let chips = [];
  let builtFor = null;

  function build(layerId) {
    builtFor = layerId;
    chips = layerById(layerId).regions.map((regionId) => createRegionChip(app, regionId));
    element.replaceChildren(...chips.map((chip) => chip.element));
  }

  function update(state, view) {
    if (state.layerId !== builtFor) build(state.layerId);
    element.setAttribute('aria-label', app.t('layer.regions', { layer: app.t(`layer.${state.layerId}`) }));
    chips.forEach((chip) => {
      const status = view.snapshot.regions[chip.regionId] ?? 'none';
      chip.name.textContent = app.t(`region.${chip.regionId}`);
      chip.element.dataset.status = status;
      chip.element.firstChild.dataset.status = status;
      chip.element.title = `${chip.name.textContent} · ${app.t(`status.${status}`)}`;
      chip.element.setAttribute('aria-pressed', String(chip.regionId === state.regionId));
    });
  }

  return { element, update };
}