import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';

let root;
let app;

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  app = await createApp(root, await createTestServices());
  await app.commands.openSample();
});

afterEach(() => vi.useRealTimers());

const one = (selector) => root.querySelector(selector);
const state = () => app.store.getState();

describe('timeline', () => {
  it('shows the day, the mission length and the phase', () => {
    expect(one('.timeline__day').textContent).toBe('Day 180');
    expect(one('.timeline__of').textContent).toBe('of 180');
    expect(one('.timeline__phase').textContent).toBe('Today');
    app.commands.setDay(40);
    expect(one('.timeline__phase').textContent).toBe('Observed');
  });

  it('jumps to launch and to the end with the marks', () => {
    one('[data-mark="launch"]').click();
    expect(state().day).toBe(1);
    expect(one('[data-mark="end"]').textContent).toBe('End · d180');
    one('[data-mark="end"]').click();
    expect(state().day).toBe(180);
  });

  it('plays the mission from the start and stops at the end', () => {
    one('.timeline__play').click();
    expect(state()).toMatchObject({ playing: true, day: 1 });
    expect(one('.timeline__play').textContent).toBe('Pause');
    vi.advanceTimersByTime(600);
    expect(state().day).toBeGreaterThan(5);
    vi.advanceTimersByTime(60000);
    expect(state()).toMatchObject({ playing: false, day: 180 });
  });

  it('pauses when the button is pressed again or the day is moved by hand', () => {
    app.commands.setDay(10);
    one('.timeline__play').click();
    expect(state()).toMatchObject({ playing: true, day: 10 });
    one('.timeline__play').click();
    expect(state().playing).toBe(false);
    one('.timeline__play').click();
    app.commands.setDay(50);
    expect(state().playing).toBe(false);
  });

  it('starts a new mission today and shows the rest as projection', async () => {
    app.commands.goTo('mission');
    app.commands.updateMissionDraft({ name: 'Mars 2040', typeId: 'mars-planetary' });
    app.commands.confirmMission();
    app.commands.addCrewMember({ role: 'pilot', age: 40, weightKg: 70, heightCm: 175 });
    await app.commands.saveMission();
    expect(state().day).toBe(1);
    app.commands.setDay(300);
    expect(one('.timeline__phase').textContent).toBe('Projection');
    expect(one('.chart__projected')).not.toBeNull();
  });
});