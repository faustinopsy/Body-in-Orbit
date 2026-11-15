import { createElement } from '../../ui/createElement.js';
import { phaseOf, todayOf } from '../../domain/missionDay.js';
import { createPlayButton } from './createPlayButton.js';
import { createTimelineMarks } from './createTimelineMarks.js';
import './timeline.css';

export function createTimeline(app) {
  const play = createPlayButton(app);
  const marks = createTimelineMarks(app);
  const dayNumber = createElement('span', { class: 'timeline__day' });
  const dayOf = createElement('span', { class: 'timeline__of' });
  const phase = createElement('span', { class: 'timeline__phase' });
  const label = createElement('label', { class: 'timeline__label sr-only', for: 'timeline-day' });
  const input = createElement('input', { id: 'timeline-day', class: 'timeline__input', type: 'range', min: 1, step: 1 });
  const track = createElement('div', { class: 'timeline__track' }, label, input);
  const element = createElement(
    'div',
    { class: 'timeline' },
    createElement('div', { class: 'timeline__top' }, play.element, createElement('span', { class: 'timeline__reading' }, dayNumber, dayOf), phase),
    track,
    marks.element,
  );
  input.addEventListener('input', () => app.commands.setDay(input.value));

  function update(state) {
    const { missionDays } = state.dataset;
    const today = todayOf(state.dataset);
    const current = phaseOf(state.day, today);
    dayNumber.textContent = app.t('timeline.dayNumber', { day: state.day });
    dayOf.textContent = app.t('timeline.of', { days: missionDays });
    phase.textContent = app.t(`timeline.phase.${current}`);
    phase.dataset.phase = current;
    label.textContent = app.t('timeline.day', { day: state.day, days: missionDays });
    input.max = String(missionDays);
    if (input.value !== String(state.day)) input.value = String(state.day);
    track.style.setProperty('--today', `${((today - 1) / Math.max(missionDays - 1, 1)) * 100}%`);
    play.update(state);
    marks.update(state);
  }

  return { element, update };
}