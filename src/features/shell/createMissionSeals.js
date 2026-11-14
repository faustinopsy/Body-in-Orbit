import { createElement } from '../../ui/createElement.js';

export function createMissionSeals(app) {
  const mission = createElement('span', { class: 'seal', 'data-seal': 'mission' });
  const data = createElement('span', { class: 'seal', 'data-seal': 'data' });
  const element = createElement('div', { class: 'shell__seals' }, mission, data);

  function update(state) {
    const { dataset } = state;
    element.hidden = !dataset;
    if (!dataset) return;
    mission.textContent = app.t('seal.mission', { day: state.day, days: dataset.missionDays });
    data.textContent = app.t('seal.data', { name: dataset.name });
    data.title = data.textContent;
  }

  return { element, update };
}