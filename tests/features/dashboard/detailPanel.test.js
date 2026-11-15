import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';

let root;
let app;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  app = await createApp(root, await createTestServices());
  await app.commands.openSample();
});

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];

describe('detail panel', () => {
  it('opens on the chart with one pill per metric of the layer', () => {
    expect(one('[data-panel="chart"]').hidden).toBe(false);
    expect(all('.metric-pill')).toHaveLength(3);
    one('.metric-pill[data-metric="bone.hipDensity"]').click();
    expect(app.store.getState().metricId).toBe('bone.hipDensity');
  });

  it('shows the metric as a table, one row a week, marking the chosen day', () => {
    one('[data-tab="table"]').click();
    expect(one('[data-panel="chart"]').hidden).toBe(true);
    expect(all('.metric-table tbody tr')).toHaveLength(27);
    expect(all('.metric-table th').map((cell) => cell.textContent)).toContain('Change from baseline');
    app.commands.setDay(20);
    expect(one('.metric-table tr[aria-current]').dataset.day).toBe('15');
  });

  it('lists what can help for the layer and links to the help', () => {
    app.commands.selectCrew('C02');
    app.commands.selectLayer('muscles');
    one('[data-tab="actions"]').click();
    expect(one('.actions__title').textContent).toBe('What can help · Muscles');
    expect(one('.actions__status').textContent).toBe('C02 · Muscles: Critical on day 180.');
    expect(all('.actions__list li')).toHaveLength(3);
    one('.actions__more').click();
    expect(app.store.getState()).toMatchObject({ route: 'help', helpTab: 'risks', helpRiskId: 'fitness' });
  });
});