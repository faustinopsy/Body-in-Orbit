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
  app.commands.goTo('mission');
});

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];
const crewMember = { role: 'commander', age: 45, weightKg: 80, heightCm: 180 };

function fill(name, value, eventName = 'input') {
  const control = one(`[name="${name}"]`);
  control.value = String(value);
  control.dispatchEvent(new Event(eventName));
}

describe('mission screen', () => {
  it('shows the six risk weights of the chosen mission type', () => {
    expect(all('.risk-row')).toHaveLength(6);
    fill('missionType', 'mars-planetary', 'change');
    expect(app.store.getState().missionDraft.durationDays).toBe(900);
    expect(one('[data-risk="sans"]').getAttribute('class')).toContain('status--critical');
  });

  it('adds crew members from the form with sequential codes', () => {
    fill('role', 'pilot', 'change');
    fill('age', 38);
    fill('weightKg', 72);
    fill('heightCm', 176);
    one('.crew-form__add').dispatchEvent(new Event('click'));
    app.commands.addCrewMember(crewMember);
    expect(app.store.getState().missionDraft.crew.map((member) => member.code)).toEqual(['C01', 'C02']);
    expect(all('.crew-list__item')).toHaveLength(2);
  });

  it('shows the reasons when a crew member is out of range', () => {
    app.commands.addCrewMember({ ...crewMember, age: 12 });
    expect(one('.mission-errors').textContent).toContain('Age must be between 21 and 70.');
  });

  it('renumbers the crew after a removal', () => {
    app.commands.addCrewMember(crewMember);
    app.commands.addCrewMember(crewMember);
    one('[data-code="C01"]').dispatchEvent(new Event('click'));
    expect(app.store.getState().missionDraft.crew.map((member) => member.code)).toEqual(['C01']);
  });

  it('creates the mission, saves it and opens its projected timeline', async () => {
    app.commands.updateMissionDraft({ name: 'Mars 2040', typeId: 'mars-planetary' });
    app.commands.addCrewMember(crewMember);
    await app.commands.saveMission();
    const state = app.store.getState();
    expect(state).toMatchObject({ route: 'dashboard', crewId: 'C01', day: 900 });
    expect(state.dataset.missionTypeId).toBe('mars-planetary');
    expect(await services.missions.list()).toHaveLength(1);
  });

  it('does not save a mission without a name or crew', async () => {
    await app.commands.saveMission();
    expect(app.store.getState().missionErrors).toEqual(['name', 'crew']);
    expect(await services.missions.list()).toHaveLength(0);
  });
});