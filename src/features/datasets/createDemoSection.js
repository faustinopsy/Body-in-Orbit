import { createElement } from '../../ui/createElement.js';

export function createDemoSection(app) {
  const title = createElement('h3', { class: 'data-section__title' });
  const current = createElement('p', { class: 'data-section__text' });
  const button = createElement('button', { type: 'button', class: 'button data-demo' });
  const hint = createElement('p', { class: 'data-section__text screen__text--soft' });
  const element = createElement('section', { class: 'data-section' }, title, current, button, hint);
  button.addEventListener('click', () => app.commands.openSample());

  function update(state) {
    title.textContent = app.t('data.title');
    current.textContent = state.dataset ? app.t('data.current', { name: state.dataset.name }) : app.t('data.none');
    button.textContent = app.t(state.busy ? 'data.loading' : 'data.openDemo');
    button.disabled = state.busy;
    hint.textContent = app.t('data.hint');
  }

  return { element, update };
}