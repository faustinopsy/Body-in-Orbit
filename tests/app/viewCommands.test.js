import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app/createApp.js';
import { createTestServices } from '../helpers/createTestServices.js';

let app;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  app = await createApp(document.querySelector('#app'), await createTestServices());
  await app.commands.openSample();
});

const state = () => app.store.getState();

describe('view commands', () => {
  it('starts on the first crew member, on the last day, on the first layer', () => {
    expect(state()).toMatchObject({ crewId: 'C01', day: 180, layerId: 'skeleton', regionId: null });
    expect(state().metricId).toBe('bone.spineDensity');
  });

  it('selects a crew member and ignores an unknown one', () => {
    app.commands.selectCrew('C02');
    app.commands.selectCrew('C99');
    expect(state().crewId).toBe('C02');
  });

  it('keeps the day inside the mission', () => {
    app.commands.setDay(0);
    expect(state().day).toBe(1);
    app.commands.setDay(999);
    expect(state().day).toBe(180);
    app.commands.setDay('45');
    expect(state().day).toBe(45);
  });

  it('selecting a layer clears the region and picks its first metric', () => {
    app.commands.selectRegion('bone-hip');
    app.commands.selectLayer('muscles');
    expect(state()).toMatchObject({ layerId: 'muscles', regionId: null, metricId: 'muscle.coreStrength' });
  });

  it('selecting a region moves to its layer and metric', () => {
    app.commands.selectRegion('cardio-vessels');
    expect(state()).toMatchObject({ layerId: 'cardiovascular', regionId: 'cardio-vessels' });
    expect(state().metricId).toBe('cardio.recoveryHeartRate');
  });

  it('selecting a metric follows its region and layer', () => {
    app.commands.selectMetric('sleep.quality');
    expect(state()).toMatchObject({ layerId: 'sleep', regionId: 'sleep-brain', metricId: 'sleep.quality' });
  });

  it('restores the view when the app opens again with the saved dataset', async () => {
    const services = await createTestServices();
    const first = await createApp(document.querySelector('#app'), services);
    await first.commands.openSample();
    const second = await createApp(document.querySelector('#app'), services);
    expect(second.store.getState()).toMatchObject({ crewId: 'C01', day: 180 });
  });
});