import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { capsuleOf } from '../../domain/capsule/unlockRules.js';
import { itemText } from './capsuleText.js';

function createRow(app, item, status) {
  const remove = createElement('button', { type: 'button', class: 'capsule-list__remove', 'data-remove': String(item.id) }, createIcon('trash-2', 16));
  remove.setAttribute('aria-label', app.t('capsule.remove', { title: itemText(app, item, 'title') }));
  remove.addEventListener('click', () => app.commands.removeCapsuleItem(item.id));
  const kind = createElement('span', { class: 'capsule-list__kind' }, app.t(`capsule.kind.${item.kind}`));
  return createElement('li', { class: 'capsule-list__row', 'data-item': String(item.id) }, kind, createElement('span', {}, itemText(app, item, 'title')), createElement('span', { class: 'capsule-list__status' }, status), remove);
}

function createCrewGroup(app, state, crewId) {
  const capsule = capsuleOf(state.capsule, state.dataset, crewId);
  const rows = [
    ...capsule.opened.map((item) => createRow(app, item, app.t('capsule.status.open'))),
    ...capsule.locked.map((item) => createRow(app, item, app.t('capsule.locked', { days: item.daysLeft }))),
  ];
  const title = createElement('h4', { class: 'capsule-list__crew' }, app.t('capsule.listCrew', { crew: crewId, count: rows.length }));
  return createElement('section', { class: 'capsule-list__group' }, title, createElement('ul', { class: 'capsule-list' }, ...rows));
}

export function createItemList(app) {
  const element = createElement('div', { class: 'capsule-list__groups' });

  function update(state) {
    element.replaceChildren(...state.dataset.crew.map(({ id }) => createCrewGroup(app, state, id)));
  }

  return { element, update };
}