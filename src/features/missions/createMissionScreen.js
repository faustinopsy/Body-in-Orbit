import { createElement } from '../../ui/createElement.js';
import { createMissionForm } from './createMissionForm.js';
import { createRiskPreview } from './createRiskPreview.js';
import { createCrewForm } from './createCrewForm.js';
import { createCrewList } from './createCrewList.js';
import './missions.css';

export function createMissionScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const intro = createElement('p', { class: 'screen__text' });
  const privacy = createElement('p', { class: 'screen__text screen__text--soft' });
  const errors = createElement('ul', { class: 'screen__error mission-errors', role: 'alert' });
  const save = createElement('button', { type: 'button', class: 'button button--primary mission-save' });
  const parts = [createMissionForm(app), createRiskPreview(app), createCrewForm(app), createCrewList(app)];
  const [form, risks, crewForm, crewList] = parts;
  const element = createElement(
    'section',
    { class: 'screen', 'data-screen': 'mission' },
    title,
    intro,
    createElement('div', { class: 'mission-grid' }, form.element, risks.element),
    crewForm.element,
    crewList.element,
    privacy,
    errors,
    save,
  );
  save.addEventListener('click', () => app.commands.saveMission());

  function update(state) {
    title.textContent = app.t('mission.title');
    intro.textContent = app.t('mission.intro');
    privacy.textContent = app.t('mission.privacy');
    save.textContent = app.t('mission.save');
    errors.replaceChildren(...state.missionErrors.map((code) => {
      const item = createElement('li');
      item.textContent = app.t(`mission.error.${code}`);
      return item;
    }));
    parts.forEach((part) => part.update(state));
  }

  return { element, update };
}