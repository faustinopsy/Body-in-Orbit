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
});

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];
const click = (selector) => one(selector).dispatchEvent(new Event('click'));

async function createMission() {
  app.commands.updateMissionDraft({ name: 'Mars 2040', typeId: 'mars-planetary' });
  app.commands.confirmMission();
  app.commands.addCrewMember({ role: 'commander', age: 45, weightKg: 80, heightCm: 180 });
  await app.commands.saveMission();
  app.commands.goTo('today');
}

describe('today', () => {
  it('asks to open a mission when there is none', () => {
    app.commands.goTo('today');
    expect(one('[data-screen="today"] .screen__text').textContent).toContain('Open the demo mission');
    expect(one('.today__content').hidden).toBe(true);
  });

  it('marks the missing answer and does not save', async () => {
    await app.commands.openSample();
    app.commands.goTo('today');
    await app.commands.saveCheckIn();
    expect(app.store.getState().todayErrors).toEqual(['sleepQuality']);
    expect(one('[data-question="sleepQuality"]').hasAttribute('data-invalid')).toBe(true);
    expect(one('.today-error').hidden).toBe(false);
  });

  it('saves the answers into today and keeps them in the database', async () => {
    await app.commands.openSample();
    app.commands.goTo('today');
    click('.step-input [data-step="less"]');
    click('[data-question="sleepQuality"] [data-option="4"]');
    click('[data-question="disturbances"] [data-option="noise"]');
    await app.commands.saveCheckIn();
    const { dataset, datasetId } = app.store.getState();
    expect(dataset.series.C01['sleep.hours'][179]).toBe(6.5);
    expect(dataset.series.C01['sleep.quality'][179]).toBe(4);
    expect(one('.today-message').textContent).toBe('Answers of C01 saved for day 180.');
    expect(one('[data-crew="C01"]').dataset.done).toBe('true');
    expect(one('[data-crew="C02"]').dataset.done).toBe('false');
    const saved = (await services.datasets.list()).find((record) => record.id === datasetId);
    expect(saved.data.checkIns.find((entry) => entry.crewId === 'C01' && entry.day === 180).answers.disturbances).toEqual(['noise']);
    expect(one('.close-day__button').hidden).toBe(true);
  });

  it('closes the day of a created mission and starts the next one', async () => {
    await createMission();
    expect(one('[data-screen="today"] .screen__title').textContent).toBe('Day 1 of 900 · Mars 2040');
    expect(all('.day-list__crew')).toHaveLength(1);
    expect(one('.close-day__button').textContent).toBe('Close day 1 and start day 2');
    await app.commands.closeDay();
    expect(app.store.getState()).toMatchObject({ day: 2, dataset: { today: 2 } });
    expect(one('.today-message').textContent).toBe('Day 2 started.');
    expect(one('.close-day__button').textContent).toBe('Close day 2 and start day 3');
  });
});