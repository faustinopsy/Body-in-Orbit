import { createElement } from '../../ui/createElement.js';
import { LAYERS } from '../../domain/layers.js';

export function createLayerRail(app) {
  const buttons = LAYERS.map(({ id }) => {
    const button = createElement('button', { type: 'button', class: 'rail__button', 'data-layer': id });
    button.addEventListener('click', () => app.commands.selectLayer(id));
    return button;
  });
  const element = createElement('div', { class: 'rail', role: 'group' }, ...buttons);

  function update(state, view) {
    element.setAttribute('aria-label', app.t('layers.label'));
    buttons.forEach((button) => {
      const id = button.dataset.layer;
      const status = view.snapshot.layers[id];
      button.textContent = `${app.t(`layer.${id}`)} · ${app.t(`status.${status}`)}`;
      button.setAttribute('class', `rail__button status--${status}`);
      button.setAttribute('aria-pressed', String(id === state.layerId));
    });
  }

  return { element, update };
}