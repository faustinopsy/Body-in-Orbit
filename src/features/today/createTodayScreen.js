import { createElement } from '../../ui/createElement.js';
import { todayOf } from '../../domain/missionDay.js';
import { createCheckInForm } from './createCheckInForm.js';
import { createDayList } from './createDayList.js';
import { createCloseDay } from './createCloseDay.js';
import './today.css';

export function createTodayScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const intro = createElement('p', { class: 'screen__text' });
  const message = createElement('p', { class: 'today-message', role: 'status' });
  const error = createElement('p', { class: 'screen__error today-error', role: 'alert' });
  const notice = createElement('p', { class: 'screen__text screen__text--soft' });
  const parts = [createCheckInForm(app), createDayList(app), createCloseDay(app)];
  const [form, dayList, closeDay] = parts;
  const layout = createElement('div', { class: 'today' }, form.element, createElement('aside', { class: 'today__side' }, dayList.element, closeDay.element));
  const element = createElement('section', { class: 'screen', 'data-screen': 'today' }, title, intro, message, error, layout, notice);

  function update(state) {
    const { dataset } = state;
    layout.hidden = !dataset;
    notice.textContent = app.t('today.notice');
    title.textContent = dataset ? app.t('today.heading', { day: todayOf(dataset), days: dataset.missionDays, mission: dataset.name }) : app.t('today.title');
    intro.textContent = app.t(dataset ? 'today.intro' : 'today.none');
    message.hidden = !state.todayMessage;
    message.textContent = state.todayMessage ? app.t(state.todayMessage.key, state.todayMessage.params) : '';
    error.hidden = state.todayErrors.length === 0;
    error.textContent = state.todayErrors.length > 0 ? app.t('today.error') : '';
    if (dataset) parts.forEach((part) => part.update(state));
  }

  return { element, update };
}