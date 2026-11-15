import { createElement } from '../../ui/createElement.js';
import { todayOf } from '../../domain/missionDay.js';

const MARKS = ['launch', 'today', 'end'];

function dayOfMark(mark, dataset) {
  if (mark === 'launch') return 1;
  return mark === 'today' ? todayOf(dataset) : dataset.missionDays;
}

export function createTimelineMarks(app) {
  const buttons = MARKS.map((mark) => {
    const button = createElement('button', { type: 'button', class: 'timeline__mark', 'data-mark': mark });
    button.addEventListener('click', () => app.commands.setDay(dayOfMark(mark, app.store.getState().dataset)));
    return button;
  });
  const element = createElement('div', { class: 'timeline__marks' }, ...buttons);

  function update(state) {
    buttons.forEach((button) => {
      const mark = button.dataset.mark;
      button.textContent = app.t(`timeline.${mark}`, { day: dayOfMark(mark, state.dataset) });
    });
  }

  return { element, update };
}