import { createElement } from '../../ui/createElement.js';
import { ADMIN_ACCOUNT } from '../../domain/access/accounts.js';

function createShortcut(app, profile) {
  const button = createElement('button', { type: 'button', class: 'button access__shortcut', 'data-profile': profile });
  button.addEventListener('click', () => app.commands.signInDemo(profile));
  return button;
}

export function createDemoShortcuts(app) {
  const text = createElement('p', { class: 'access__text' });
  const list = createElement('div', { class: 'access__shortcuts' });
  const element = createElement('div', { class: 'access__panel', 'data-mode': 'demo' }, text, list);
  let builtFor = '';

  function update(state) {
    text.textContent = app.t('access.demo.text');
    const profiles = [ADMIN_ACCOUNT, ...(state.dataset?.crew ?? []).map(({ id }) => id)];
    if (profiles.join(',') !== builtFor) {
      builtFor = profiles.join(',');
      list.replaceChildren(...profiles.map((profile) => createShortcut(app, profile)));
    }
    [...list.children].forEach((button) => {
      const { profile } = button.dataset;
      button.textContent = profile === ADMIN_ACCOUNT ? app.t('access.demo.admin') : app.t('access.demo.crew', { crew: profile });
      button.classList.toggle('button--primary', profile === ADMIN_ACCOUNT);
    });
  }

  return { element, update };
}