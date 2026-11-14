import { createElement } from '../../ui/createElement.js';
import './welcome.css';

function createChoice(choice, className) {
  const label = createElement('span', { class: 'welcome__label' });
  const hint = createElement('span', { class: 'welcome__hint' });
  const button = createElement('button', { type: 'button', class: `button welcome__choice ${className}`, 'data-choice': choice }, label, hint);
  return { button, label, hint };
}

export function createWelcomeDialog(app) {
  const title = createElement('h2', { class: 'welcome__title', id: 'welcome-title' });
  const text = createElement('p', { class: 'welcome__text' });
  const demo = createChoice('demo', 'button--primary');
  const crew = createChoice('crew', '');
  const error = createElement('p', { class: 'screen__error', role: 'alert' });
  const choices = createElement('div', { class: 'welcome__choices' }, demo.button, crew.button);
  const element = createElement('dialog', { class: 'welcome', 'aria-labelledby': 'welcome-title' }, title, text, choices, error);
  demo.button.addEventListener('click', () => app.commands.startDemo());
  crew.button.addEventListener('click', () => app.commands.startCrewSetup());
  element.addEventListener('cancel', (event) => {
    event.preventDefault();
    app.commands.closeWelcome();
  });

  function sync(open) {
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }

  function update(state) {
    title.textContent = app.t('welcome.title');
    text.textContent = app.t('welcome.text');
    demo.label.textContent = app.t(state.busy ? 'welcome.loading' : 'welcome.demo');
    demo.hint.textContent = app.t('welcome.demoHint');
    demo.button.disabled = state.busy;
    crew.label.textContent = app.t('welcome.crew');
    crew.hint.textContent = app.t('welcome.crewHint');
    error.textContent = state.welcomeOpen && state.errorKey ? app.t(state.errorKey) : '';
    sync(state.welcomeOpen);
  }

  return { element, update };
}