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
  await app.commands.openSample();
});

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];
const state = () => app.store.getState();
const click = (selector) => one(selector).dispatchEvent(new Event('click'));

async function answerToday() {
  click('[data-question="sleepQuality"] [data-option="4"]');
  await app.commands.saveCheckIn();
}

describe('mission capsule', () => {
  it('shows the opened and locked items of the crew member', () => {
    app.commands.signInDemo('C01');
    app.commands.setTodayTab('capsule');
    expect(one('.capsule__progress').textContent).toBe('Streak: 8 day(s) in a row · 8 day(s) answered · next item in 1 answered day(s)');
    expect(all('.capsule__gallery .capsule-card:not(.capsule-card--locked)')).toHaveLength(2);
    expect(all('.capsule-card--locked')).toHaveLength(2);
    expect(one('.capsule-card img').getAttribute('src')).toBe('/capsule/earth.svg');
  });

  it('reveals the next item when the answer completes the rhythm', async () => {
    app.commands.signInDemo('C01');
    await answerToday();
    expect(one('.reveal').hidden).toBe(false);
    expect(one('.reveal .capsule-card__title').textContent).toBe('The garden is growing');
    click('.reveal__open');
    expect(state()).toMatchObject({ todayTab: 'capsule', capsuleReveal: null });
    expect(all('.capsule__gallery .capsule-card:not(.capsule-card--locked)')).toHaveLength(3);
  });

  it('lets the administrator add, remove items and change the rhythm', async () => {
    app.commands.goTo('settings');
    app.commands.setSettingsTab('capsule');
    await app.commands.addCapsuleItem({ crewId: 'C02', kind: 'message', title: '', text: 'Hi' });
    expect(state().capsuleErrors).toEqual(['title']);
    await app.commands.addCapsuleItem({ crewId: 'C02', kind: 'message', title: 'Good luck', from: 'Ana', text: 'See you soon' });
    await app.commands.addCapsuleItem({ crewId: 'C03', kind: 'image', title: 'Photo', file: 'data:image/jpeg;base64,eA==' });
    expect(state().capsule.filter((item) => item.crewId === 'C02')).toHaveLength(5);
    const photo = state().capsule.find((item) => item.title === 'Photo');
    expect(photo.image).toBe('data:image/jpeg;base64,eA==');
    click(`[data-remove="${photo.id}"]`);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(state().capsule.some((item) => item.title === 'Photo')).toBe(false);
    await app.commands.setUnlockEvery(1);
    expect(state().dataset.capsuleEvery).toBe(1);
    await app.commands.setUnlockEvery(0);
    expect(state().capsuleErrors).toEqual(['every']);
  });

  it('keeps the capsule in the backup but never sends it to Earth', async () => {
    await app.commands.addCapsuleItem({ crewId: 'C01', kind: 'image', title: 'Photo', file: 'data:image/jpeg;base64,YWJj' });
    await app.commands.saveBackup();
    const backup = JSON.parse(services.downloads.at(-1).text);
    expect(backup.capsule.find((item) => item.title === 'Photo').image).toBe('data:image/jpeg;base64,YWJj');
    await app.commands.restoreBackup(services.downloads.at(-1).text);
    expect(state().capsule.find((item) => item.title === 'Photo').image).toBe('data:image/jpeg;base64,YWJj');
    await app.commands.sendDownlink();
    expect(services.downloads.at(-1).text).not.toContain('Photo');
    expect(services.downloads.at(-1).text).not.toContain('capsule');
  });
});