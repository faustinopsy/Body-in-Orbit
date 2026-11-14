import { createElement } from '../../ui/createElement.js';
import { bodyMassIndex } from '../../domain/missions/crewFactors.js';

function createItem(app, member, locale) {
  const bmi = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bodyMassIndex(member));
  const text = createElement('span', { class: 'crew-list__text' });
  text.textContent = app.t('crew.summary', { code: member.code, role: app.t(`role.${member.role}`), age: member.age, weight: member.weightKg, height: member.heightCm, bmi });
  const remove = createElement('button', { type: 'button', class: 'button crew-list__remove', 'data-code': member.code });
  remove.textContent = app.t('crew.remove');
  remove.addEventListener('click', () => app.commands.removeCrewMember(member.code));
  return createElement('li', { class: 'crew-list__item' }, text, remove);
}

export function createCrewList(app) {
  const element = createElement('ul', { class: 'crew-list' });

  function update(state) {
    const items = state.missionDraft.crew.map((member) => createItem(app, member, state.locale));
    const empty = createElement('li', { class: 'crew-list__empty' });
    empty.textContent = app.t('crew.empty');
    element.replaceChildren(...(items.length > 0 ? items : [empty]));
  }

  return { element, update };
}