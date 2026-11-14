import { createElement } from '../../ui/createElement.js';
import { createIcon, swapIcon } from '../../ui/icons.js';

export function createFullscreenToggle(app) {
  const label = createElement('span', { class: 'switch__label sr-only' });
  let icon = createIcon('maximize');
  const element = createElement('button', { type: 'button', class: 'icon-button fullscreen-toggle' }, icon, label);
  element.hidden = !app.services.fullscreen?.isSupported();
  element.addEventListener('click', () => app.commands.toggleFullscreen());

  function update(state) {
    icon = swapIcon(icon, state.fullscreen ? 'minimize' : 'maximize');
    label.textContent = app.t(state.fullscreen ? 'fullscreen.exit' : 'fullscreen.enter');
    element.title = label.textContent;
    element.setAttribute('aria-pressed', String(state.fullscreen));
  }

  return { element, update };
}