import { createElement } from '../../ui/createElement.js';

export function createTodayScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const body = createElement('p', { class: 'screen__text' });
  const element = createElement('section', { class: 'screen', 'data-screen': 'today' }, title, body);

  function update() {
    title.textContent = app.t('today.title');
    body.textContent = app.t('today.soon');
  }

  return { element, update };
}