import { createElement } from '../../ui/createElement.js';
import { createTabs } from '../../ui/createTabs.js';
import { DETAIL_TABS } from '../../app/commands/setDetailTab.js';
import { createMetricChart } from './createMetricChart.js';
import { createMetricTable } from './createMetricTable.js';
import { createActionsPanel } from './createActionsPanel.js';
import './detail.css';

export function createDetailPanel(app) {
  const tabs = createTabs({ name: 'detailTab', ids: DETAIL_TABS, onSelect: (tab) => app.commands.setDetailTab(tab) });
  const parts = { chart: createMetricChart(app), table: createMetricTable(app), actions: createActionsPanel(app) };
  const panels = Object.fromEntries(Object.entries(parts).map(([tab, part]) => [tab, createElement('div', { class: 'detail__panel', role: 'tabpanel', 'data-panel': tab }, part.element)]));
  const notice = createElement('p', { class: 'dashboard__notice' });
  const element = createElement('section', { class: 'board__chart detail glass' }, tabs.element, ...Object.values(panels), notice);

  function update(state, view) {
    tabs.update({ selected: state.detailTab, label: app.t('detail.tabs'), labelOf: (tab) => app.t(`detail.tab.${tab}`) });
    notice.textContent = app.t('dashboard.notice');
    Object.entries(panels).forEach(([tab, panel]) => {
      panel.hidden = tab !== state.detailTab;
    });
    parts[state.detailTab].update(state, view);
  }

  return { element, update };
}