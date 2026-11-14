import { createElement } from '../../ui/createElement.js';

export function createThemeToggle(app) {
  const element = createElement('button', { type: 'button', class: 'switch__button theme-toggle' });
  let theme = 'light';
  element.addEventListener('click', () => app.commands.setTheme(theme === 'light' ? 'dark' : 'light'));

  function update(state) {
    theme = state.theme;
    element.textContent = app.t(`theme.${theme}`);
    element.setAttribute('aria-label', app.t('theme.toggle'));
  }

  return { element, update };
}