import { createElement } from '../../ui/createElement.js';
import { createTabs } from '../../ui/createTabs.js';
import { SETTINGS_TABS, settingsTabLocked } from '../../app/commands/setSettingsTab.js';
import { createMissionStep } from '../missions/createMissionStep.js';
import { createCrewStep } from '../missions/createCrewStep.js';
import { createDataPanel } from '../datasets/createDataPanel.js';
import { createCrewAccessPanel } from '../access/createCrewAccessPanel.js';
import { createCapsuleSettings } from '../capsule/createCapsuleSettings.js';
import { createOnboardSettings } from '../analysis/createOnboardSettings.js';
import '../capsule/capsule.css';
import '../analysis/analysis.css';
import '../missions/missions.css';

function tabLabel(app, state, tab) {
  if (tab === 'crew') return app.t('crew.legend', { count: state.missionDraft.crew.length });
  return tab === 'mission' ? app.t('mission.legend') : app.t(`settings.tab.${tab}`);
}

export function createSettingsScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const intro = createElement('p', { class: 'screen__text' });
  const tabs = createTabs({ name: 'settingsTab', ids: SETTINGS_TABS, onSelect: (tab) => app.commands.setSettingsTab(tab) });
  const hint = createElement('p', { class: 'screen__text screen__text--soft mission-hint' });
  const errors = createElement('ul', { class: 'screen__error mission-errors', role: 'alert' });
  const panels = { mission: createMissionStep(app), crew: createCrewStep(app), access: createCrewAccessPanel(app), capsule: createCapsuleSettings(app), onboard: createOnboardSettings(app), data: createDataPanel(app) };
  const element = createElement('section', { class: 'screen', 'data-screen': 'settings' }, title, intro, tabs.element, hint, ...Object.values(panels).map((panel) => panel.element), errors);

  function update(state) {
    title.textContent = app.t('settings.title');
    intro.textContent = app.t('settings.intro');
    hint.textContent = app.t('mission.crewLocked');
    hint.hidden = state.missionConfirmed || state.settingsTab !== 'mission';
    tabs.update({
      selected: state.settingsTab,
      label: app.t('settings.tabs'),
      labelOf: (tab) => tabLabel(app, state, tab),
      disabled: (tab) => settingsTabLocked(state, tab),
    });
    errors.hidden = !['mission', 'crew'].includes(state.settingsTab);
    errors.replaceChildren(...state.missionErrors.map((code) => createElement('li', {}, app.t(`mission.error.${code}`))));
    Object.entries(panels).forEach(([tab, panel]) => {
      panel.element.hidden = tab !== state.settingsTab;
      panel.update(state);
    });
  }

  return { element, update };
}