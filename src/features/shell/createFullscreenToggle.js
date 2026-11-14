import { createElement } from '../../ui/createElement.js';

export function createFullscreenToggle(app) {
  const element = createElement('button', { type: 'button', class: 'switch__button fullscreen-toggle' });
  element.hidden = !app.services.fullscreen?.isSupported();
  element.addEventListener('click', () => app.commands.toggleFullscreen());

  function update(state) {
    element.textContent = app.t(state.fullscreen ? 'fullscreen.exit' : 'fullscreen.enter');
    element.setAttribute('aria-pressed', String(state.fullscreen));
  }

  return { element, update };
}