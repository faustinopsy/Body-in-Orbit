import { createElement } from '../../ui/createElement.js';

export function createTimeline(app) {
  const label = createElement('label', { class: 'timeline__label', for: 'timeline-day' });
  const input = createElement('input', { id: 'timeline-day', class: 'timeline__input', type: 'range', min: 1, step: 1 });
  const element = createElement('div', { class: 'timeline' }, label, input);
  input.addEventListener('input', () => app.commands.setDay(input.value));

  function update(state) {
    const { missionDays } = state.dataset;
    label.textContent = app.t('timeline.day', { day: state.day, days: missionDays });
    input.max = String(missionDays);
    if (input.value !== String(state.day)) input.value = String(state.day);
  }

  return { element, update };
}