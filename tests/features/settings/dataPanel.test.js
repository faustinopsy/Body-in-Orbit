import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';

let root;
let app;
let services;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  services = await createTestServices();
  app = await createApp(root, services);
  app.commands.closeWelcome();
  app.commands.goTo('settings');
  app.commands.setSettingsTab('data');
});

const one = (selector) => root.querySelector(selector);

describe('settings: data and backup', () => {
  it('shows only Dashboard, Today, Help and Settings in the menu', () => {
    expect([...root.querySelectorAll('.nav__button')].map((button) => button.dataset.route)).toEqual(['dashboard', 'today', 'help', 'settings']);
    expect(one('[data-panel="data"]').hidden).toBe(false);
  });

  it('opens the demo from the data tab', async () => {
    one('.data-demo').click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(app.store.getState().dataset.crew).toHaveLength(3);
  });

  it('saves a backup file and restores it into an empty browser', async () => {
    await app.commands.openSample();
    await app.commands.saveBackup();
    expect(services.downloads[0].name).toBe('body-in-orbit-backup-2026-11-15.json');
    expect(one('.data-message').textContent).toBe('Backup saved as body-in-orbit-backup-2026-11-15.json.');
    const other = await createTestServices();
    const fresh = await createApp(root, other);
    await fresh.commands.restoreBackup(services.downloads[0].text);
    expect(fresh.store.getState().dataset.crew).toHaveLength(3);
    expect(await other.datasets.list()).toHaveLength(1);
  });

  it('refuses a file that is not a backup', async () => {
    await app.commands.restoreBackup('not json');
    expect(one('.data-error').textContent).toBe('This file could not be read as JSON.');
    await app.commands.restoreBackup('{"format":"other"}');
    expect(one('.data-error').textContent).toBe('This file is not a Body in Orbit backup.');
  });

  it('prepares the downlink package of the chosen day', async () => {
    expect(one('.data-downlink').disabled).toBe(true);
    await app.commands.openSample();
    app.commands.setDay(90);
    one('.data-downlink').click();
    const packet = JSON.parse(services.downloads[0].text);
    expect(packet.day).toBe(90);
    expect(one('.data-message').textContent).toBe('Downlink package for day 90 saved as body-in-orbit-downlink-d90.json.');
  });
});