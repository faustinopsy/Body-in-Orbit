import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';

const nameOf = (app, user) => (user.role === 'admin' ? app.t('access.profile.admin') : user.crewId);

export function createUserBadge(app) {
  const name = createElement('span', { class: 'user-badge__name' });
  const leave = createElement('button', { type: 'button', class: 'user-badge__leave' }, createIcon('log-out', 16));
  const element = createElement('div', { class: 'user-badge' }, name, leave);
  leave.addEventListener('click', () => app.commands.signOut());

  function update(state) {
    element.hidden = !state.user;
    if (!state.user) return;
    const demo = state.user.demo ? ` · ${app.t('access.demo.tag')}` : '';
    name.textContent = `${nameOf(app, state.user)}${demo}`;
    leave.setAttribute('aria-label', app.t('access.signOut'));
    leave.title = app.t('access.signOut');
  }

  return { element, update };
}