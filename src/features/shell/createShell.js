import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { SCREENS } from '../../app/screens.js';
import { createNav } from './createNav.js';
import { createMissionSeals } from './createMissionSeals.js';
import { createLocaleSwitch } from './createLocaleSwitch.js';
import { createThemeToggle } from './createThemeToggle.js';
import { createFullscreenToggle } from './createFullscreenToggle.js';
import { createZoomControls } from './createZoomControls.js';
import { createUserBadge } from './createUserBadge.js';
import './shell.css';

function createBrand() {
  const title = createElement('h1', { class: 'shell__title' });
  const mark = createElement('span', { class: 'shell__mark', 'aria-hidden': 'true' }, createIcon('person-standing', 16));
  return { title, element: createElement('div', { class: 'shell__brand' }, mark, title) };
}

export function createShell(app) {
  const brand = createBrand();
  const parts = [createNav(app), createMissionSeals(app), createZoomControls(app), createLocaleSwitch(app), createThemeToggle(app), createFullscreenToggle(app), createUserBadge(app)];
  const [nav, seals, zoom, localeSwitch, themeToggle, fullscreenToggle, userBadge] = parts;
  const header = createElement(
    'header',
    { class: 'shell__header glass' },
    brand.element,
    nav.element,
    createElement('div', { class: 'shell__space' }),
    seals.element,
    createElement('div', { class: 'shell__tools' }, zoom.element, localeSwitch.element, themeToggle.element, fullscreenToggle.element, userBadge.element),
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
    brand.title.textContent = app.t('app.title');
    showRoute(state.route);
    [...parts, screens.get(state.route)].forEach((part) => part.update(state));
  }

  return { element, update };
}