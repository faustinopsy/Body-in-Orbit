import { createElement } from '../../ui/createElement.js';
import { createIcon, swapIcon } from '../../ui/icons.js';

export function createThemeToggle(app) {
  const label = createElement('span', { class: 'switch__label sr-only' });
  let icon = createIcon('sun');
  const element = createElement('button', { type: 'button', class: 'icon-button theme-toggle' }, icon, label);
  let theme = 'light';
  element.addEventListener('click', () => app.commands.setTheme(theme === 'light' ? 'dark' : 'light'));

  function update(state) {
    theme = state.theme;
    icon = swapIcon(icon, theme === 'light' ? 'sun' : 'moon');
    label.textContent = app.t(`theme.${theme}`);
    element.setAttribute('aria-label', app.t('theme.toggle'));
    element.title = label.textContent;
  }

  return { element, update };
}