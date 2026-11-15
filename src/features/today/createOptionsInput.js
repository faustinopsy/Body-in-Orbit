import { createElement } from '../../ui/createElement.js';
import { currentAnswers } from '../../app/checkInDraft.js';

const toggle = (list, option) => (list.includes(option) ? list.filter((item) => item !== option) : [...list, option]);

export function createOptionsInput(app, question) {
  const multiple = question.type === 'multiple';
  const buttons = question.options.map((option) => {
    const button = createElement('button', { type: 'button', class: 'answer-option', 'data-option': String(option) });
    button.addEventListener('click', () => {
      const answer = currentAnswers(app.store.getState())[question.id];
      app.commands.updateCheckIn({ [question.id]: multiple ? toggle(answer, option) : option });
    });
    return { option, button };
  });
  const element = createElement('div', { class: 'answer-options', role: 'group', 'data-question': question.id }, ...buttons.map((item) => item.button));

  function update(state, answer) {
    buttons.forEach(({ option, button }) => {
      button.textContent = app.t(`today.o.${question.id}.${option}`);
      const pressed = multiple ? answer.includes(option) : answer === option;
      button.setAttribute('aria-pressed', String(pressed));
    });
  }

  return { element, update };
}