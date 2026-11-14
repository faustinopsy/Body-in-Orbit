import { createElement } from '../../ui/createElement.js';

export function createDataScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const current = createElement('p', { class: 'screen__text' });
  const hint = createElement('p', { class: 'screen__text screen__text--soft' });
  const error = createElement('p', { class: 'screen__error', role: 'alert' });
  const button = createElement('button', { type: 'button', class: 'button button--primary' });
  button.addEventListener('click', () => app.commands.openSample());
  const element = createElement('section', { class: 'screen', 'data-screen': 'data' }, title, current, button, error, hint);

  function update(state) {
    title.textContent = app.t('data.title');
    current.textContent = state.dataset
      ? app.t('data.current', { name: state.dataset.name })
      : app.t('data.none');
    button.textContent = app.t(state.busy ? 'data.loading' : 'data.openDemo');
    button.disabled = state.busy;
    error.textContent = state.errorKey ? app.t(state.errorKey) : '';
    hint.textContent = app.t('data.hint');
  }

  return { element, update };
}