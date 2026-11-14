import { createElement } from '../../ui/createElement.js';
import { ROUTES } from '../../app/routes.js';

export function createNav(app) {
  const element = createElement('nav', { class: 'nav' });
  const buttons = ROUTES.map((route) => {
    const button = createElement('button', { type: 'button', class: 'nav__button', 'data-route': route });
    button.addEventListener('click', () => app.commands.goTo(route));
    return button;
  });
  element.append(...buttons);

  function update(state) {
    element.setAttribute('aria-label', app.t('nav.label'));
    buttons.forEach((button) => {
      const route = button.dataset.route;
      button.textContent = app.t(`nav.${route}`);
      button.setAttribute('aria-current', route === state.route ? 'page' : 'false');
    });
  }

  return { element, update };
}