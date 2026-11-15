import { createElement } from '../../ui/createElement.js';
import { createIcon, swapIcon } from '../../ui/icons.js';

export function createPlayButton(app) {
  let icon = createIcon('play', 16);
  const label = createElement('span', {});
  const element = createElement('button', { type: 'button', class: 'timeline__play' }, icon, label);
  element.addEventListener('click', () => app.commands.togglePlayback());

  function update(state) {
    icon = swapIcon(icon, state.playing ? 'pause' : 'play');
    label.textContent = app.t(state.playing ? 'timeline.pause' : 'timeline.play');
    element.setAttribute('aria-pressed', String(state.playing));
  }

  return { element, update };
}