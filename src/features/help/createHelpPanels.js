import { createElement } from '../../ui/createElement.js';
import { helpSections } from './content/helpContent.js';
import { createRiskFigures } from './createRiskFigures.js';
import { createWeightTable } from './createWeightTable.js';
import { createHelpSection } from './createHelpSection.js';

const visibleSections = (state, tab) => {
  const sections = helpSections(state.locale, tab);
  return tab === 'risks' ? sections.filter((section) => section.riskId === state.helpRiskId) : sections;
};

export function createHelpPanels(app) {
  const figures = createRiskFigures(app);
  const table = createWeightTable(app);
  const texts = { risks: createElement('div', {}), about: createElement('div', {}), method: createElement('div', {}), onboard: createElement('div', {}) };
  const panels = {
    risks: createElement('div', { class: 'help__panel', role: 'tabpanel', 'data-panel': 'risks' }, figures.element, texts.risks),
    about: createElement('div', { class: 'help__panel', role: 'tabpanel', 'data-panel': 'about' }, texts.about, createElement('div', { class: 'help__table' }, table.element)),
    method: createElement('div', { class: 'help__panel', role: 'tabpanel', 'data-panel': 'method' }, texts.method),
    onboard: createElement('div', { class: 'help__panel', role: 'tabpanel', 'data-panel': 'onboard' }, texts.onboard),
  };
  const element = createElement('div', { class: 'help__panels' }, ...Object.values(panels));
  let rendered = '';

  function renderTexts(state) {
    const key = `${state.locale}:${state.helpMissionTypeId}:${state.helpTab}:${state.helpRiskId}`;
    if (key === rendered) return;
    rendered = key;
    texts[state.helpTab].replaceChildren(...visibleSections(state, state.helpTab).map((section) => createHelpSection(app, section, state.helpMissionTypeId)));
  }

  function update(state) {
    Object.entries(panels).forEach(([tab, panel]) => {
      panel.hidden = tab !== state.helpTab;
    });
    figures.update(state);
    table.update(state);
    renderTexts(state);
  }

  return { element, update };
}