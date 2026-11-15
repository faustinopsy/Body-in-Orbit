import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { imageSource, itemText } from './capsuleText.js';

function createOpened(app, item) {
  const title = createElement('h4', { class: 'capsule-card__title' }, itemText(app, item, 'title'));
  const from = createElement('p', { class: 'capsule-card__from' }, app.t('capsule.from', { from: itemText(app, item, 'from') }));
  const text = createElement('p', { class: 'capsule-card__text' }, itemText(app, item, 'text'));
  const media = item.kind === 'image' ? [createElement('img', { class: 'capsule-card__image', src: imageSource(item), alt: itemText(app, item, 'title') })] : [];
  return createElement('article', { class: 'capsule-card', 'data-kind': item.kind, 'data-item': String(item.id) }, ...media, title, from, text);
}

function createLocked(app, item) {
  const lock = createElement('span', { class: 'capsule-card__lock', 'aria-hidden': 'true' }, createIcon('lock', 22));
  const text = createElement('p', { class: 'capsule-card__text' }, app.t('capsule.locked', { days: item.daysLeft }));
  return createElement('article', { class: 'capsule-card capsule-card--locked', 'data-item': String(item.id) }, lock, text);
}

export const createCapsuleCard = (app, item, locked = false) => (locked ? createLocked(app, item) : createOpened(app, item));