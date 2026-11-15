import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { ROUTES } from '../../app/routes.js';

const ROUTE_ICONS = {
  dashboard: 'layout-dashboard',
  today: 'calendar-days',
  help: 'circle-help',
  settings: 'settings',
};

function createButton(app, route) {
  const label = createElement('span', { class: 'nav__label' });
  const button = createElement('button', { type: 'button', class: 'nav__button', 'data-route': route }, createIcon(ROUTE_ICONS[route]), label);
  button.addEventListener('click', () => app.commands.goTo(route));
  return { route, button, label };
}

export function createNav(app) {
  const buttons = ROUTES.map((route) => createButton(app, route));
  const element = createElement('nav', { class: 'nav' }, ...buttons.map((item) => item.button));

  function update(state) {
    element.setAttribute('aria-label', app.t('nav.label'));
    buttons.forEach(({ route, button, label }) => {
      label.textContent = app.t(`nav.${route}`);
      button.title = label.textContent;
      button.setAttribute('aria-current', route === state.route ? 'page' : 'false');
    });
  }

  return { element, update };
}