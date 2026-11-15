import { createElement } from '../../ui/createElement.js';
import { createMissionForm } from './createMissionForm.js';
import { createRiskPreview } from './createRiskPreview.js';

export function createMissionStep(app) {
  const form = createMissionForm(app);
  const risks = createRiskPreview(app);
  const next = createElement('button', { type: 'button', class: 'button button--primary mission-next' });
  const element = createElement(
    'div',
    { class: 'mission-panel', role: 'tabpanel', 'data-panel': 'mission' },
    createElement('div', { class: 'mission-grid' }, form.element, risks.element),
    next,
  );
  next.addEventListener('click', () => app.commands.confirmMission());

  function update(state) {
    next.textContent = app.t(state.missionConfirmed ? 'mission.next' : 'mission.create');
    form.update(state);
    risks.update(state);
  }

  return { element, update };
}