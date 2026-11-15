import { createElement } from '../../ui/createElement.js';
import { CHECK_IN_GROUPS, QUESTIONS } from '../../domain/checkIn/questions.js';
import { currentAnswers } from '../../app/checkInDraft.js';
import { createQuestion } from './createQuestion.js';

function createGroup(app, group) {
  const title = createElement('h3', { class: 'check-in__title' });
  const why = createElement('p', { class: 'check-in__why' });
  const questions = QUESTIONS.filter((question) => question.group === group).map((question) => createQuestion(app, question));
  const element = createElement('section', { class: 'check-in__group', 'data-group': group }, title, why, ...questions.map((question) => question.element));
  return { group, title, why, questions, element };
}

export function createCheckInForm(app) {
  const groups = CHECK_IN_GROUPS.map((group) => createGroup(app, group));
  const save = createElement('button', { type: 'button', class: 'button button--primary check-in__save' });
  const element = createElement('div', { class: 'check-in' }, createElement('div', { class: 'check-in__groups' }, ...groups.map((group) => group.element)), save);
  save.addEventListener('click', () => app.commands.saveCheckIn());

  function update(state) {
    const answers = currentAnswers(state);
    groups.forEach((group) => {
      group.title.textContent = app.t(`today.group.${group.group}`);
      group.why.textContent = app.t(`today.why.${group.group}`);
      group.questions.forEach((question) => question.update(state, answers));
    });
    save.textContent = app.t('today.save', { crew: state.crewId });
  }

  return { element, update };
}