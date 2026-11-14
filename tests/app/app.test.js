import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app/createApp.js';
import { createTestServices } from '../helpers/createTestServices.js';

let root;

beforeEach(() => {
  vi.stubGlobal('navigator', { language: 'en-US' });
  document.body.innerHTML = '<div id="app"></div>';
  document.documentElement.removeAttribute('data-theme');
  root = document.querySelector('#app');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const text = (selector) => root.querySelector(selector).textContent;

describe('app shell', () => {
  it('renders the title and the three navigation buttons', async () => {
    await createApp(root, await createTestServices());
    expect(text('.shell__title')).toBe('Body in Orbit');
    expect(root.querySelectorAll('.nav__button')).toHaveLength(3);
  });

  it('switches language and remembers it', async () => {
    const services = await createTestServices();
    const app = await createApp(root, services);
    await app.commands.setLocale('pt');
    expect(text('.shell__title')).toBe('Corpo em Órbita');
    expect(document.documentElement.lang).toBe('pt');
    expect(await services.preferences.get('locale')).toBe('pt');
  });

  it('switches theme on the document', async () => {
    const app = await createApp(root, await createTestServices());
    await app.commands.setTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('navigates between screens', async () => {
    const app = await createApp(root, await createTestServices());
    app.commands.goTo('today');
    expect(root.querySelector('[data-screen="today"]')).not.toBeNull();
    expect(root.querySelector('[data-screen="dashboard"]')).toBeNull();
  });

  it('opens the demo mission and shows it on the dashboard', async () => {
    const app = await createApp(root, await createTestServices());
    await app.commands.openSample();
    app.commands.goTo('dashboard');
    expect(text('[data-screen="dashboard"] .screen__text')).toContain('3 crew members and 180 mission days');
  });

  it('shows an error when the demo cannot be loaded', async () => {
    const services = await createTestServices({ loadSample: async () => { throw new Error('offline'); } });
    const app = await createApp(root, services);
    app.commands.goTo('data');
    await app.commands.openSample();
    expect(text('.screen__error')).toBe('The demo could not be loaded.');
  });

  it('rejects a demo that fails validation', async () => {
    const services = await createTestServices({ loadSample: async () => ({ format: 'wrong' }) });
    const app = await createApp(root, services);
    app.commands.goTo('data');
    await app.commands.openSample();
    expect(text('.screen__error')).toBe('The demo file failed validation.');
  });

  it('restores language, theme and dataset in a new session', async () => {
    const services = await createTestServices();
    const first = await createApp(root, services);
    await first.commands.setLocale('pt');
    await first.commands.setTheme('dark');
    await first.commands.openSample();
    const second = await createApp(root, services);
    expect(second.store.getState().locale).toBe('pt');
    expect(second.store.getState().theme).toBe('dark');
    expect(second.store.getState().dataset.crew).toHaveLength(3);
  });
});