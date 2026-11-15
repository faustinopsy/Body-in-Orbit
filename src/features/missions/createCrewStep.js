import { createElement } from '../../ui/createElement.js';
import { createCrewForm } from './createCrewForm.js';
import { createCrewList } from './createCrewList.js';

export function createCrewStep(app) {
  const summary = createElement('span', { class: 'mission-summary__text' });
  const edit = createElement('button', { type: 'button', class: 'button mission-summary__edit' });
  const crewForm = createCrewForm(app);
  const crewList = createCrewList(app);
  const privacy = createElement('p', { class: 'screen__text screen__text--soft' });
  const save = createElement('button', { type: 'button', class: 'button button--primary mission-save' });
  const element = createElement(
    'div',
    { class: 'mission-panel', role: 'tabpanel', 'data-panel': 'crew' },
    createElement('p', { class: 'mission-summary' }, summary, edit),
    crewForm.element,
    crewList.element,
    privacy,
    save,
  );
  edit.addEventListener('click', () => app.commands.setSettingsTab('mission'));
  save.addEventListener('click', () => app.commands.saveMission());

  function update(state) {
    const draft = state.missionDraft;
    summary.textContent = app.t('mission.summary', { name: draft.name.trim(), type: app.t(`missionType.${draft.typeId}`), days: draft.durationDays });
    edit.textContent = app.t('mission.edit');
    privacy.textContent = app.t('mission.privacy');
    save.textContent = app.t('mission.save');
    crewForm.update(state);
    crewList.update(state);
  }

  return { element, update };
}