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

const all = (selector) => [...root.querySelectorAll(selector)];
const one = (selector) => root.querySelector(selector);

describe('layer header and rail', () => {
  it('heads the layer with its status, alerts, regions and NASA risk', () => {
    app.commands.selectCrew('C02');
    app.commands.selectLayer('muscles');
    expect(one('.layer-head__title').textContent).toBe('Muscles');
    expect(one('.layer-head__meta').textContent).toMatch(/^\d+ in alert · C02$/);
    expect(one('.layer-head .chip').dataset.status).toBe('critical');
    expect(all('.region-chip')).toHaveLength(3);
    expect(one('.nasa-line__link').getAttribute('href')).toContain('nasa.gov');
  });

  it('counts the alerts of each layer on the rail', () => {
    app.commands.selectCrew('C02');
    const count = one('[data-layer="muscles"] .rail__count');
    expect(count.hidden).toBe(false);
    expect(Number(count.textContent)).toBeGreaterThan(0);
  });

  it('selects a region from the layer header chips', () => {
    one('.region-chip[data-region="bone-hip"]').click();
    expect(app.store.getState()).toMatchObject({ regionId: 'bone-hip', metricId: 'bone.hipDensity' });
  });
});