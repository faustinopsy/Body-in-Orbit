import { createElement } from '../../ui/createElement.js';

export function createDashboardScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const body = createElement('p', { class: 'screen__text' });
  const element = createElement('section', { class: 'screen', 'data-screen': 'dashboard' }, title, body);

  function update(state) {
    title.textContent = app.t('dashboard.title');
    const { dataset } = state;
    body.textContent = dataset
      ? app.t('dashboard.summary', { crew: dataset.crew.length, days: dataset.missionDays, name: dataset.name })
      : app.t('dashboard.empty');
  }

  return { element, update };
}