import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { createCapsuleCard } from './createCapsuleCard.js';

export function createRevealCard(app) {
  const heading = createElement('p', { class: 'reveal__heading' });
  const body = createElement('div', { class: 'reveal__body' });
  const open = createElement('button', { type: 'button', class: 'button button--primary reveal__open' });
  const close = createElement('button', { type: 'button', class: 'button reveal__close' });
  const element = createElement('section', { class: 'reveal', role: 'status' }, createElement('span', { class: 'reveal__icon', 'aria-hidden': 'true' }, createIcon('gift', 24)), heading, body, createElement('div', { class: 'reveal__actions' }, open, close));
  open.addEventListener('click', () => {
    app.commands.setTodayTab('capsule');
    app.commands.dismissReveal();
  });
  close.addEventListener('click', () => app.commands.dismissReveal());
  let shownId = null;

  function update(state) {
    const item = state.capsule.find((entry) => entry.id === state.capsuleReveal && entry.crewId === state.crewId);
    element.hidden = !item;
    if (!item) return;
    heading.textContent = app.t('capsule.reveal', { crew: state.crewId });
    open.textContent = app.t('capsule.openCapsule');
    close.textContent = app.t('capsule.close');
    const key = `${item.id}:${state.locale}`;
    if (shownId !== key) {
      shownId = key;
      body.replaceChildren(createCapsuleCard(app, item));
    }
  }

  return { element, update };
}