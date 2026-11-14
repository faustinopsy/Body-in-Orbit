import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app/createApp.js';
import { createTestServices } from '../helpers/createTestServices.js';
import { buildSampleDataset } from '../../src/domain/dataset/simulate.js';

let root;

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
});

async function servicesWithSaved(data) {
  const services = await createTestServices();
  const id = await services.datasets.add({ name: data.name, data });
  await services.preferences.set('lastDatasetId', id);
  return services;
}

describe('restoreSession', () => {
  it('opens the saved dataset when it is still valid', async () => {
    const app = await createApp(root, await servicesWithSaved(buildSampleDataset()));
    expect(app.store.getState()).toMatchObject({ crewId: 'C01', day: 180, welcomeOpen: false });
  });

  it('ignores a saved dataset from an older version and opens the welcome dialog', async () => {
    const old = buildSampleDataset();
    delete old.series.C01['eye.sansSigns'];
    const app = await createApp(root, await servicesWithSaved(old));
    expect(app.store.getState().dataset).toBeNull();
    expect(app.store.getState().welcomeOpen).toBe(true);
  });
});