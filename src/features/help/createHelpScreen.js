import { createElement } from '../../ui/createElement.js';
import { createChoiceGroup } from '../../ui/createChoiceGroup.js';
import { createTabs } from '../../ui/createTabs.js';
import { MISSION_TYPES } from '../../domain/missions/missionTypes.js';
import { HELP_TABS } from '../../app/commands/setHelpView.js';
import { MISSION_ICONS } from '../missions/missionIcons.js';
import { createHelpPanels } from './createHelpPanels.js';
import '../dashboard/avatar.css';
import './help.css';

export function createHelpScreen(app) {
  const title = createElement('h2', { class: 'screen__title' });
  const intro = createElement('p', { class: 'screen__text' });
  const missions = createChoiceGroup({
    name: 'helpMission',
    choices: MISSION_TYPES.map((type) => ({ value: type.id, icon: MISSION_ICONS[type.id] })),
    onChoose: (typeId) => app.commands.setHelpMission(typeId),
  });
  const selectText = createElement('span', { class: 'form__label' });
  const tabs = createTabs({ name: 'helpTab', ids: HELP_TABS, onSelect: (tab) => app.commands.setHelpTab(tab) });
  const panels = createHelpPanels(app);
  const element = createElement(
    'section',
    { class: 'screen help', 'data-screen': 'help' },
    title,
    intro,
    createElement('div', { class: 'form__field help__mission' }, selectText, missions.element),
    tabs.element,
    panels.element,
  );

  function update(state) {
    title.textContent = app.t('help.title');
    intro.textContent = app.t('help.intro');
    selectText.textContent = app.t('help.mission');
    missions.update({
      selected: state.helpMissionTypeId,
      label: app.t('help.mission'),
      labelOf: (typeId) => app.t(`missionType.${typeId}`),
    });
    tabs.update({ selected: state.helpTab, label: app.t('help.tabs'), labelOf: (tab) => app.t(`help.tab.${tab}`) });
    panels.update(state);
  }

  return { element, update };
}