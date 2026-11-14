import { createElement } from '../../ui/createElement.js';
import { RATINGS } from '../../domain/missions/riskRatings.js';
import { levelOf, riskWeight } from '../../domain/missions/riskWeights.js';

const text = (tag, value, attributes = {}) => {
  const element = createElement(tag, attributes);
  element.textContent = value;
  return element;
};

function sourceList(sources) {
  const items = sources.map(({ label, url }) => createElement(
    'li',
    {},
    text('a', label, { href: url, target: '_blank', rel: 'noopener noreferrer' }),
  ));
  return createElement('ul', { class: 'help-section__sources' }, ...items);
}

function ratingLine(app, riskId, typeId) {
  const rating = RATINGS[riskId]?.[typeId];
  const weight = riskWeight(riskId, typeId);
  const params = {
    mission: app.t(`missionType.${typeId}`),
    weight: Math.round(weight * 100),
    level: app.t(`level.${levelOf(weight)}`),
  };
  if (!rating) return text('p', app.t('help.ratingShared', params), { class: 'help-section__rating' });
  const ratings = { ops: rating.ops.join('x'), health: rating.health.join('x') };
  return text('p', app.t('help.rating', { ...params, ...ratings }), { class: 'help-section__rating' });
}

export function createHelpSection(app, section, typeId) {
  const children = [text('h3', section.title)];
  if (section.riskId) children.push(ratingLine(app, section.riskId, typeId));
  section.paragraphs.forEach((paragraph) => children.push(text('p', paragraph)));
  if (section.items) children.push(createElement('ul', {}, ...section.items.map((item) => text('li', item))));
  if (section.sources) children.push(text('h4', app.t('help.sources')), sourceList(section.sources));
  return createElement('section', { class: 'help-section', id: `help-${section.id}` }, ...children);
}