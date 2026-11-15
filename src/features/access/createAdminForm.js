import { createElement } from '../../ui/createElement.js';
import { MIN_PASSWORD } from '../../domain/access/accounts.js';
import { createPasswordField } from './createPasswordField.js';

export function createAdminForm(app) {
  const text = createElement('p', { class: 'access__text' });
  const password = createPasswordField('adminPassword', 'new-password');
  const confirm = createPasswordField('adminConfirm', 'new-password');
  const submit = createElement('button', { type: 'submit', class: 'button button--primary' });
  const element = createElement('form', { class: 'access__panel', 'data-mode': 'create' }, text, password.element, confirm.element, submit);
  element.addEventListener('submit', (event) => {
    event.preventDefault();
    app.commands.createAdmin(password.control.value, confirm.control.value);
  });

  function update() {
    text.textContent = app.t('access.create.text', { min: MIN_PASSWORD });
    password.text.textContent = app.t('access.password');
    confirm.text.textContent = app.t('access.confirm');
    submit.textContent = app.t('access.create.button');
  }

  return { element, update };
}