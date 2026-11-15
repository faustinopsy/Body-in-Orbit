import { createElement } from '../../ui/createElement.js';
import { createTabs } from '../../ui/createTabs.js';
import { todayOf } from '../../domain/missionDay.js';
import { createCheckInForm } from './createCheckInForm.js';
import { createDayList } from './createDayList.js';
import { createCloseDay } from './createCloseDay.js';
import { createCapsulePanel } from '../capsule/createCapsulePanel.js';
import { createRevealCard } from '../capsule/createRevealCard.js';
import './today.css';

const TODAY_TABS = ['checkIn', 'capsule'];

function introKey(state) {
  if (!state.dataset) return 'today.none';
  return state.user?.role === 'crew' ? 'today.introCrew' : 'today.intro';
}

export function createTodayScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const intro = createElement('p', { class: 'screen__text' });
  const message = createElement('p', { class: 'today-message', role: 'status' });
  const error = createElement('p', { class: 'screen__error today-error', role: 'alert' });
  const notice = createElement('p', { class: 'screen__text screen__text--soft' });
  const tabs = createTabs({ name: 'todayTab', ids: TODAY_TABS, onSelect: (tab) => app.commands.setTodayTab(tab) });
  const parts = [createCheckInForm(app), createDayList(app), createCloseDay(app), createCapsulePanel(app), createRevealCard(app)];
  const [form, dayList, closeDay, capsule, reveal] = parts;
  const checkIn = createElement('div', { class: 'today' }, form.element, createElement('aside', { class: 'today__side' }, dayList.element, closeDay.element));
  const content = createElement('div', { class: 'today__content' }, reveal.element, tabs.element, checkIn, capsule.element);
  const element = createElement('section', { class: 'screen', 'data-screen': 'today' }, title, intro, message, error, content, notice);

  function update(state) {
    const { dataset } = state;
    content.hidden = !dataset;
    notice.textContent = app.t('today.notice');
    title.textContent = dataset ? app.t('today.heading', { day: todayOf(dataset), days: dataset.missionDays, mission: dataset.name }) : app.t('today.title');
    intro.textContent = app.t(introKey(state));
    message.hidden = !state.todayMessage;
    message.textContent = state.todayMessage ? app.t(state.todayMessage.key, state.todayMessage.params) : '';
    error.hidden = state.todayErrors.length === 0;
    error.textContent = state.todayErrors.length > 0 ? app.t('today.error') : '';
    if (!dataset) return;
    tabs.update({ selected: state.todayTab, label: app.t('today.tabs'), labelOf: (tab) => app.t(`today.tab.${tab}`) });
    checkIn.hidden = state.todayTab !== 'checkIn';
    capsule.element.hidden = state.todayTab !== 'capsule';
    parts.forEach((part) => part.update(state));
  }

  return { element, update };
}