import { createElement } from '../../ui/createElement.js';
import { checkInOf } from '../../domain/checkIn/applyCheckIn.js';
import { todayOf } from '../../domain/missionDay.js';
import { visibleCrew } from '../../domain/access/permissions.js';

function createItem(app, crewId, done) {
  const status = createElement('span', { class: 'day-list__status' }, app.t(done ? 'today.done' : 'today.pending'));
  const button = createElement('button', { type: 'button', class: 'day-list__crew', 'data-crew': crewId, 'data-done': String(done) }, createElement('strong', {}, crewId), status);
  button.addEventListener('click', () => app.commands.selectCrew(crewId));
  return createElement('li', {}, button);
}

export function createDayList(app) {
  const title = createElement('h3', { class: 'day-list__title' });
  const list = createElement('ul', { class: 'day-list__items' });
  const element = createElement('section', { class: 'day-list' }, title, list);

  function update(state) {
    const day = todayOf(state.dataset);
    title.textContent = app.t('today.list', { day });
    list.replaceChildren(...visibleCrew(state.user, state.dataset.crew).map(({ id }) => {
      const item = createItem(app, id, Boolean(checkInOf(state.dataset, id, day)));
      item.firstChild.setAttribute('aria-pressed', String(id === state.crewId));
      return item;
    }));
  }

  return { element, update };
}