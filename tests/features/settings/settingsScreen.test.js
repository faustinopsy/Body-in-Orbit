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
});

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];
const crewMember = { role: 'commander', age: 45, weightKg: 80, heightCm: 180 };

function choose(group, value) {
  one(`[data-group="${group}"] [data-choice="${value}"]`).dispatchEvent(new Event('click'));
}

function fill(name, value, eventName = 'input') {
  const control = one(`[name="${name}"]`);
  control.value = String(value);
  control.dispatchEvent(new Event(eventName));
}

function createMission(name = 'Mars 2040', typeId = 'mars-planetary') {
  app.commands.updateMissionDraft({ name, typeId });
  one('.mission-next').click();
}

describe('settings: mission and crew', () => {
  it('shows the six risk weights of the chosen mission type', () => {
    expect(all('.risk-row')).toHaveLength(6);
    choose('missionType', 'mars-planetary');
    expect(app.store.getState().missionDraft.durationDays).toBe(900);
    expect(one('[data-risk="sans"]').getAttribute('class')).toContain('status--critical');
  });

  it('keeps the crew tab locked until the mission is created', () => {
    expect(one('[data-tab="crew"]').disabled).toBe(true);
    expect(one('[data-panel="crew"]').hidden).toBe(true);
    app.commands.addCrewMember(crewMember);
    expect(app.store.getState().missionErrors).toEqual(['missionFirst']);
    one('.mission-next').click();
    expect(app.store.getState().missionErrors).toEqual(['name']);
    createMission();
    expect(app.store.getState().settingsTab).toBe('crew');
    expect(one('[data-tab="crew"]').disabled).toBe(false);
    expect(one('.mission-summary__text').textContent).toBe('Mars 2040 · Mars planetary · 900 days');
  });

  it('adds crew members from the form with sequential codes', () => {
    createMission();
    choose('role', 'pilot');
    fill('age', 38);
    fill('weightKg', 72);
    fill('heightCm', 176);
    one('.crew-form__add').click();
    app.commands.addCrewMember(crewMember);
    expect(app.store.getState().missionDraft.crew.map((member) => member.code)).toEqual(['C01', 'C02']);
    expect(app.store.getState().missionDraft.crew[0].role).toBe('pilot');
    expect(all('.crew-list__item')).toHaveLength(2);
  });

  it('shows the reasons when a crew member is out of range', () => {
    createMission();
    app.commands.addCrewMember({ ...crewMember, age: 12 });
    expect(one('.mission-errors').textContent).toContain('Age must be between 21 and 70.');
  });

  it('renumbers the crew after a removal and goes back to edit the mission', () => {
    createMission();
    app.commands.addCrewMember(crewMember);
    app.commands.addCrewMember(crewMember);
    one('[data-code="C01"]').click();
    expect(app.store.getState().missionDraft.crew.map((member) => member.code)).toEqual(['C01']);
    one('.mission-summary__edit').click();
    expect(app.store.getState().settingsTab).toBe('mission');
  });

  it('saves the mission and opens its projected timeline', async () => {
    createMission();
    app.commands.addCrewMember(crewMember);
    await app.commands.saveMission();
    const state = app.store.getState();
    expect(state).toMatchObject({ route: 'dashboard', crewId: 'C01', day: 1, missionConfirmed: false, settingsTab: 'mission' });
    expect(state.dataset.missionTypeId).toBe('mars-planetary');
    expect(await services.missions.list()).toHaveLength(1);
  });

  it('does not save a mission without a name or crew', async () => {
    await app.commands.saveMission();
    expect(app.store.getState().missionErrors).toEqual(['name', 'crew']);
    expect(await services.missions.list()).toHaveLength(0);
  });
});