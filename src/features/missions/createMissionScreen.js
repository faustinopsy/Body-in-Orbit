import { createElement } from '../../ui/createElement.js';
import { createTabs } from '../../ui/createTabs.js';
import { createMissionStep } from './createMissionStep.js';
import { createCrewStep } from './createCrewStep.js';
import './missions.css';

export function createMissionScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const intro = createElement('p', { class: 'screen__text' });
  const tabs = createTabs({ name: 'missionStep', ids: ['mission', 'crew'], onSelect: (step) => app.commands.setMissionStep(step) });
  const hint = createElement('p', { class: 'screen__text screen__text--soft mission-hint' });
  const errors = createElement('ul', { class: 'screen__error mission-errors', role: 'alert' });
  const steps = { mission: createMissionStep(app), crew: createCrewStep(app) };
  const element = createElement(
    'section',
    { class: 'screen', 'data-screen': 'mission' },
    title,
    intro,
    tabs.element,
    hint,
    steps.mission.element,
    steps.crew.element,
    errors,
  );

  function update(state) {
    title.textContent = app.t('mission.title');
    intro.textContent = app.t('mission.intro');
    hint.textContent = app.t('mission.crewLocked');
    hint.hidden = state.missionConfirmed;
    tabs.update({
      selected: state.missionStep,
      label: app.t('mission.steps'),
      labelOf: (step) => (step === 'crew' ? app.t('crew.legend', { count: state.missionDraft.crew.length }) : app.t('mission.legend')),
      disabled: (step) => step === 'crew' && !state.missionConfirmed,
    });
    errors.replaceChildren(...state.missionErrors.map((code) => createElement('li', {}, app.t(`mission.error.${code}`))));
    Object.entries(steps).forEach(([step, part]) => {
      part.element.hidden = step !== state.missionStep;
      part.update(state);
    });
  }

  return { element, update };
}