import { createElement } from '../../ui/createElement.js';

export function createStepInput(app, question) {
  const value = createElement('output', { class: 'step-input__value', 'aria-live': 'polite' });
  const less = createElement('button', { type: 'button', class: 'step-input__button', 'data-step': 'less' }, '−');
  const more = createElement('button', { type: 'button', class: 'step-input__button', 'data-step': 'more' }, '+');
  const element = createElement('div', { class: 'step-input', 'data-question': question.id }, less, value, more);
  let current = question.initial;

  const change = (direction) => {
    const next = Math.round((current + direction * question.step) * 100) / 100;
    if (next >= question.min && next <= question.max) app.commands.updateCheckIn({ [question.id]: next });
  };
  less.addEventListener('click', () => change(-1));
  more.addEventListener('click', () => change(1));

  function update(state, answer) {
    current = answer;
    value.textContent = `${new Intl.NumberFormat(state.locale).format(answer)} ${question.unit}`;
    less.setAttribute('aria-label', app.t('today.decrease'));
    more.setAttribute('aria-label', app.t('today.increase'));
    less.disabled = answer <= question.min;
    more.disabled = answer >= question.max;
  }

  return { element, update };
}