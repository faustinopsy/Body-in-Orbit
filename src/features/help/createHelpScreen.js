import { createElement } from '../../ui/createElement.js';
import { createChoiceGroup } from '../../ui/createChoiceGroup.js';
import { MISSION_TYPES } from '../../domain/missions/missionTypes.js';
import { MISSION_ICONS } from '../missions/missionIcons.js';
import { helpSections } from './content/helpContent.js';
import { createRiskFigures } from './createRiskFigures.js';
import { createWeightTable } from './createWeightTable.js';
import { createHelpSection } from './createHelpSection.js';
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
  const figures = createRiskFigures(app);
  const table = createWeightTable(app);
  const sections = createElement('div', { class: 'help__sections' });
  const element = createElement(
    'section',
    { class: 'screen help', 'data-screen': 'help' },
    title,
    intro,
    createElement('div', { class: 'form__field help__mission' }, selectText, missions.element),
    figures.element,
    createElement('div', { class: 'help__table' }, table.element),
    sections,
  );
  let rendered = '';

  function renderSections(state) {
    const key = `${state.locale}:${state.helpMissionTypeId}`;
    if (key === rendered) return;
    rendered = key;
    sections.replaceChildren(...helpSections(state.locale).map((section) => createHelpSection(app, section, state.helpMissionTypeId)));
  }

  function update(state) {
    title.textContent = app.t('help.title');
    intro.textContent = app.t('help.intro');
    selectText.textContent = app.t('help.mission');
    missions.update({
      selected: state.helpMissionTypeId,
      label: app.t('help.mission'),
      labelOf: (typeId) => app.t(`missionType.${typeId}`),
    });
    figures.update(state);
    table.update(state);
    renderSections(state);
  }

  return { element, update };
}