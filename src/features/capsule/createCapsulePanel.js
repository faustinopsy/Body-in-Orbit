import { createElement } from '../../ui/createElement.js';
import { capsuleOf, streakOf } from '../../domain/capsule/unlockRules.js';
import { todayOf } from '../../domain/missionDay.js';
import { createCapsuleCard } from './createCapsuleCard.js';
import './capsule.css';

function progressText(app, capsule, streak) {
  const next = capsule.locked[0];
  const parts = [app.t('capsule.streak', { days: streak }), app.t('capsule.answered', { days: capsule.answered })];
  parts.push(next ? app.t('capsule.next', { days: next.daysLeft }) : app.t('capsule.allOpen'));
  return parts.join(' · ');
}

export function createCapsulePanel(app) {
  const title = createElement('h3', { class: 'capsule__title' });
  const progress = createElement('p', { class: 'capsule__progress' });
  const empty = createElement('p', { class: 'screen__text screen__text--soft' });
  const gallery = createElement('div', { class: 'capsule__gallery' });
  const element = createElement('section', { class: 'capsule' }, title, progress, empty, gallery);
  let signature = '';

  function update(state) {
    const capsule = capsuleOf(state.capsule, state.dataset, state.crewId);
    const streak = streakOf(state.dataset, state.crewId, todayOf(state.dataset));
    title.textContent = app.t('capsule.title', { crew: state.crewId });
    progress.textContent = progressText(app, capsule, streak);
    const total = capsule.opened.length + capsule.locked.length;
    empty.hidden = total > 0;
    empty.textContent = app.t('capsule.empty');
    const next = [state.locale, state.crewId, ...capsule.opened.map((item) => item.id), ...capsule.locked.map((item) => `${item.id}:${item.daysLeft}`)].join(',');
    if (next === signature) return;
    signature = next;
    gallery.replaceChildren(...capsule.opened.map((item) => createCapsuleCard(app, item)), ...capsule.locked.map((item) => createCapsuleCard(app, item, true)));
  }

  return { element, update };
}