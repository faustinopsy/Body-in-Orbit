import { createElement } from '../../ui/createElement.js';
import { SCREENS } from '../../app/screens.js';
import { createNav } from './createNav.js';
import { createLocaleSwitch } from './createLocaleSwitch.js';
import { createThemeToggle } from './createThemeToggle.js';
import './shell.css';

export function createShell(app) {
  const title = createElement('h1', { class: 'shell__title' });
  const nav = createNav(app);
  const localeSwitch = createLocaleSwitch(app);
  const themeToggle = createThemeToggle(app);
  const header = createElement(
    'header',
    { class: 'shell__header' },
    title,
    nav.element,
    createElement('div', { class: 'shell__tools' }, localeSwitch.element, themeToggle.element),
  );
  const main = createElement('main', { class: 'shell__main' });
  const element = createElement('div', { class: 'shell' }, header, main);
  const screens = new Map(SCREENS.map(({ id, create }) => [id, create(app)]));
  let shownRoute = null;

  function showRoute(route) {
    if (route === shownRoute) return;
    shownRoute = route;
    main.replaceChildren(screens.get(route).element);
  }

  function update(state) {
    title.textContent = app.t('app.title');
    showRoute(state.route);
    [nav, localeSwitch, themeToggle, screens.get(state.route)].forEach((part) => part.update(state));
  }

  return { element, update };
}