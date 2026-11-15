import { createElement } from '../../ui/createElement.js';
import { ADMIN_ACCOUNT } from '../../domain/access/accounts.js';
import { createPasswordField } from './createPasswordField.js';

const optionOf = (app, profile) => createElement('option', { value: profile }, profile === ADMIN_ACCOUNT ? app.t('access.profile.admin') : profile);

export function createSignInForm(app) {
  const profileText = createElement('span', { class: 'access__label' });
  const profile = createElement('select', { name: 'profile', class: 'access__input' });
  const password = createPasswordField('password', 'current-password');
  const submit = createElement('button', { type: 'submit', class: 'button button--primary' });
  const field = createElement('label', { class: 'access__field' }, profileText, profile);
  const element = createElement('form', { class: 'access__panel', 'data-mode': 'signIn' }, field, password.element, submit);
  element.addEventListener('submit', (event) => {
    event.preventDefault();
    app.commands.signIn(profile.value, password.control.value);
    password.control.value = '';
  });

  function update(state) {
    const chosen = profile.value;
    const profiles = [ADMIN_ACCOUNT, ...(state.dataset?.crew ?? []).map(({ id }) => id)];
    profile.replaceChildren(...profiles.map((item) => optionOf(app, item)));
    if (profiles.includes(chosen)) profile.value = chosen;
    profileText.textContent = app.t('access.profile');
    password.text.textContent = app.t('access.password');
    submit.textContent = app.t('access.signIn');
  }

  return { element, update };
}