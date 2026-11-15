import { createElement } from '../../ui/createElement.js';
import { MIN_PASSWORD } from '../../domain/access/accounts.js';

function createRow(app, crewId) {
  const status = createElement('span', { class: 'crew-access__status' });
  const control = createElement('input', { type: 'password', name: `password-${crewId}`, autocomplete: 'new-password', class: 'access__input' });
  const save = createElement('button', { type: 'button', class: 'button crew-access__save', 'data-crew': crewId });
  const element = createElement('li', { class: 'crew-access__row' }, createElement('strong', {}, crewId), status, control, save);
  save.addEventListener('click', async () => {
    await app.commands.setCrewPassword(crewId, control.value);
    control.value = '';
  });
  return { crewId, element, status, control, save };
}

export function createCrewAccessPanel(app) {
  const text = createElement('p', { class: 'screen__text' });
  const list = createElement('ul', { class: 'crew-access' });
  const message = createElement('p', { class: 'crew-access__message', role: 'status' });
  const element = createElement('div', { class: 'crew-access__panel' }, text, list, message);
  let rows = [];

  function build(crew) {
    rows = crew.map(({ id }) => createRow(app, id));
    list.replaceChildren(...rows.map((row) => row.element));
  }

  function update(state) {
    if (!state.dataset) return;
    if (rows.map((row) => row.crewId).join(',') !== state.dataset.crew.map(({ id }) => id).join(',')) build(state.dataset.crew);
    text.textContent = app.t('access.crew.text', { min: MIN_PASSWORD });
    rows.forEach((row) => {
      const done = state.crewAccounts.includes(row.crewId);
      row.status.textContent = app.t(done ? 'access.crew.set' : 'access.crew.unset');
      row.element.dataset.done = String(done);
      row.control.setAttribute('aria-label', app.t('access.crew.new', { crew: row.crewId }));
      row.save.textContent = app.t(done ? 'access.crew.change' : 'access.crew.save');
    });
    const info = state.passwordMessage;
    message.hidden = !info;
    message.classList.toggle('screen__error', Boolean(info?.error));
    message.textContent = info ? app.t(info.key, info.params) : '';
  }

  return { element, update };
}