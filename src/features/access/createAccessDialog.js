import { createElement } from '../../ui/createElement.js';
import { accessMode } from './accessMode.js';
import { createDemoShortcuts } from './createDemoShortcuts.js';
import { createAdminForm } from './createAdminForm.js';
import { createSignInForm } from './createSignInForm.js';
import { createIdleWatch } from './createIdleWatch.js';
import './access.css';

export function createAccessDialog(app) {
  const title = createElement('h2', { class: 'access__title', id: 'access-title' });
  const message = createElement('p', { class: 'access__message', role: 'status' });
  const error = createElement('p', { class: 'screen__error', role: 'alert' });
  const note = createElement('p', { class: 'access__note' });
  const panels = { demo: createDemoShortcuts(app), create: createAdminForm(app), signIn: createSignInForm(app) };
  const idle = createIdleWatch(app);
  const element = createElement('dialog', { class: 'access', 'aria-labelledby': 'access-title' }, title, message, ...Object.values(panels).map((panel) => panel.element), error, note);
  element.addEventListener('cancel', (event) => event.preventDefault());

  function sync(open) {
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }

  function update(state) {
    const mode = accessMode(state);
    idle.update(state);
    title.textContent = app.t(`access.title.${mode ?? 'signIn'}`);
    message.hidden = !state.accessMessage;
    message.textContent = state.accessMessage ? app.t(state.accessMessage) : '';
    error.hidden = !state.accessError;
    error.textContent = state.accessError ? app.t(state.accessError) : '';
    note.textContent = app.t('access.note');
    Object.entries(panels).forEach(([id, panel]) => {
      panel.element.hidden = id !== mode;
      if (id === mode) panel.update(state);
    });
    sync(mode !== null);
  }

  return { element, update };
}