import { createElement } from '../../ui/createElement.js';
import { todayOf } from '../../domain/missionDay.js';

export function createCloseDay(app) {
  const title = createElement('h3', { class: 'close-day__title' });
  const text = createElement('p', { class: 'close-day__text' });
  const button = createElement('button', { type: 'button', class: 'button close-day__button' });
  const element = createElement('section', { class: 'close-day' }, title, text, button);
  button.addEventListener('click', () => app.commands.closeDay());

  function update(state) {
    const day = todayOf(state.dataset);
    const last = day >= state.dataset.missionDays;
    title.textContent = app.t('today.close.title');
    text.textContent = app.t(last ? 'today.close.last' : 'today.close.text');
    button.textContent = app.t('today.close.button', { day, next: day + 1 });
    button.hidden = last;
  }

  return { element, update };
}