import { createElement } from '../../ui/createElement.js';
import { ZOOM_STEPS, zoomPercent } from '../../app/zoomSteps.js';

function createZoomButton(app, step, size, sign) {
  const letter = createElement('span', { class: `zoom__letter zoom__letter--${size}`, 'aria-hidden': 'true' }, 'A');
  const element = createElement('button', { type: 'button', class: 'zoom__button', 'data-zoom': size }, letter, createElement('span', { 'aria-hidden': 'true' }, sign));
  element.addEventListener('click', () => app.commands.changeZoom(step));
  return element;
}

export function createZoomControls(app) {
  const bigger = createZoomButton(app, 1, 'big', '+');
  const smaller = createZoomButton(app, -1, 'small', '−');
  const element = createElement('div', { class: 'zoom', role: 'group' }, bigger, smaller);

  function label(button, key, zoom) {
    const text = app.t(key, { percent: zoomPercent(zoom) });
    button.title = text;
    button.setAttribute('aria-label', text);
  }

  function update(state) {
    element.setAttribute('aria-label', app.t('zoom.label'));
    label(bigger, 'zoom.bigger', state.zoom);
    label(smaller, 'zoom.smaller', state.zoom);
    bigger.disabled = state.zoom >= ZOOM_STEPS.at(-1);
    smaller.disabled = state.zoom <= ZOOM_STEPS[0];
  }

  return { element, update };
}