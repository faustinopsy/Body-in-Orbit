import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createMemorySession, createTestServices } from '../../helpers/createTestServices.js';

let root;
let app;
let services;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  services = await createTestServices({ session: createMemorySession(null) });
  app = await createApp(root, services);
});

afterEach(() => vi.useRealTimers());

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];
const state = () => app.store.getState();
const shownNav = () => all('.nav__button:not([hidden])').map((button) => button.dataset.route);

async function createMission() {
  app.commands.startCrewSetup();
  await app.commands.createAdmin('admin-pass', 'admin-pass');
  app.commands.updateMissionDraft({ name: 'Mars 2040', typeId: 'mars-planetary' });
  app.commands.confirmMission();
  app.commands.addCrewMember({ role: 'commander', age: 45, weightKg: 80, heightCm: 180 });
  app.commands.addCrewMember({ role: 'pilot', age: 38, weightKg: 72, heightCm: 176 });
  await app.commands.saveMission();
}

describe('access by profile', () => {
  it('asks for the administrator password before the first mission', async () => {
    app.commands.startCrewSetup();
    expect(one('.access [data-mode="create"]').hidden).toBe(false);
    await app.commands.createAdmin('123', '123');
    expect(one('.access .screen__error').textContent).toBe('The password needs at least 6 characters.');
    await app.commands.createAdmin('admin-pass', 'admin-pass');
    expect(state()).toMatchObject({ user: { role: 'admin' }, route: 'settings', hasAdmin: true });
    const saved = await services.accounts.get('admin');
    expect(JSON.stringify(saved)).not.toContain('admin-pass');
  });

  it('signs a crew member in with their own password and limits what they see', async () => {
    await createMission();
    app.commands.goTo('settings');
    app.commands.setSettingsTab('access');
    await app.commands.setCrewPassword('C01', 'crew-one');
    expect(one('.crew-access__row[data-done="true"] strong').textContent).toBe('C01');
    app.commands.signOut();
    expect(one('.access [data-mode="signIn"]').hidden).toBe(false);
    await app.commands.signIn('C01', 'wrong-pass');
    expect(state().accessError).toBe('access.error.wrong');
    await app.commands.signIn('C01', 'crew-one');
    expect(state()).toMatchObject({ user: { role: 'crew', crewId: 'C01' }, crewId: 'C01', route: 'today' });
    expect(shownNav()).toEqual(['dashboard', 'today', 'help']);
    app.commands.goTo('settings');
    app.commands.selectCrew('C02');
    expect(state()).toMatchObject({ route: 'today', crewId: 'C01' });
    expect(all('.day-list__crew').map((item) => item.dataset.crew)).toEqual(['C01']);
    expect(one('.close-day').hidden).toBe(true);
    app.commands.goTo('dashboard');
    expect(all('.crew__tab:not([hidden])').map((tab) => tab.dataset.crew)).toEqual(['C01']);
  });

  it('lets the evaluator enter the demo with one click', async () => {
    await app.commands.startDemo();
    expect(all('.access__shortcut').map((button) => button.dataset.profile)).toEqual(['admin', 'C01', 'C02', 'C03']);
    one('[data-profile="C02"]').click();
    expect(state().user).toEqual({ role: 'crew', crewId: 'C02', demo: true });
    expect(one('.user-badge__name').textContent).toBe('C02 · demo');
    expect(one('.access').open).toBe(false);
  });

  it('signs out after 3 minutes without activity', async () => {
    await app.commands.startDemo();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    app.commands.signInDemo('admin');
    vi.advanceTimersByTime(2 * 60 * 1000);
    document.dispatchEvent(new Event('keydown'));
    vi.advanceTimersByTime(2 * 60 * 1000);
    expect(state().user).toEqual({ role: 'admin', demo: true });
    vi.advanceTimersByTime(60 * 1000);
    expect(state().user).toBe(null);
    expect(one('.access__message').textContent).toBe('You were signed out after 3 minutes without activity.');
  });
});