import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';

let root;

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
});

const dialog = () => root.querySelector('.welcome');
const choice = (name) => root.querySelector(`[data-choice="${name}"]`);

describe('welcome dialog', () => {
  it('opens on the first visit', async () => {
    await createApp(root, await createTestServices());
    expect(dialog().open).toBe(true);
    expect(root.querySelector('.welcome__title').textContent).toBe('Welcome to Body in Orbit');
  });

  it('opens the demo mission and closes', async () => {
    const app = await createApp(root, await createTestServices());
    await app.commands.startDemo();
    expect(dialog().open).toBe(false);
    expect(app.store.getState()).toMatchObject({ route: 'dashboard', crewId: 'C01' });
  });

  it('goes to the data screen to register the crew', async () => {
    const app = await createApp(root, await createTestServices());
    choice('crew').dispatchEvent(new Event('click'));
    expect(dialog().open).toBe(false);
    expect(app.store.getState()).toMatchObject({ route: 'settings', settingsTab: 'mission' });
  });

  it('stays open and shows the error when the demo cannot be loaded', async () => {
    const services = await createTestServices({ loadSample: async () => { throw new Error('offline'); } });
    const app = await createApp(root, services);
    await app.commands.startDemo();
    expect(dialog().open).toBe(true);
    expect(dialog().querySelector('.screen__error').textContent).toBe('The demo could not be loaded.');
  });

  it('does not open again when a dataset was saved', async () => {
    const services = await createTestServices();
    const first = await createApp(root, services);
    await first.commands.startDemo();
    await createApp(root, services);
    expect(dialog().open).toBe(false);
  });
});