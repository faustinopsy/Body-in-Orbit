import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createFakeHeartSensor, createTestServices } from '../../helpers/createTestServices.js';
import { currentAnswers } from '../../../src/app/checkInDraft.js';

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
const click = (selector) => one(selector).dispatchEvent(new Event('click'));
const heart = () => app.store.getState().heartSensor;

function feed(sensor, valueAt, seconds = 121) {
  for (let second = 0; second <= seconds; second += 1) {
    sensor.time = second * 1000;
    sensor.emit(valueAt(second));
  }
}

async function openToday() {
  await app.commands.openSample();
  app.commands.goTo('today');
}

describe('heart sensor', () => {
  it('measures at rest with the demo sensor and fills the answer', async () => {
    await openToday();
    expect(one('.heart-sensor__badge').hidden).toBe(false);
    click('.heart-sensor__connect');
    await Promise.resolve();
    expect(services.demoHeartSensor.connects).toBe(1);
    expect(heart().phase).toBe('connected');
    expect(one('.heart-sensor__steps').hidden).toBe(false);
    click('.heart-sensor__start');
    feed(services.demoHeartSensor, (second) => (second < 60 ? 80 : 57));
    expect(heart()).toMatchObject({ phase: 'ready', result: { bpm: 57, count: 61 } });
    expect(one('.heart-sensor__use').textContent).toBe('Use 57 bpm in the answer');
    click('.heart-sensor__use');
    expect(currentAnswers(app.store.getState()).restingHeartRate).toBe(57);
    expect(one('[data-question="restingHeartRate"] .step-input__value').textContent).toBe('57 bpm');
    expect(one('.heart-sensor__used').hidden).toBe(false);
    expect(services.demoHeartSensor.disconnects).toBeGreaterThan(0);
  });

  it('asks to measure again when the crew member was not at rest', async () => {
    await openToday();
    await app.commands.connectHeartSensor();
    app.commands.startHeartMeasurement();
    feed(services.demoHeartSensor, (second) => 60 + (second % 30));
    expect(heart()).toMatchObject({ phase: 'connected', errorKey: 'heart.error.unstable' });
    expect(one('.heart-sensor__error').textContent).toContain('not at rest');
  });

  it('explains a browser without Web Bluetooth', async () => {
    services.demoHeartSensor = createFakeHeartSensor({ failWith: 'unsupported' });
    await openToday();
    await app.commands.connectHeartSensor();
    expect(heart()).toMatchObject({ phase: 'error', errorKey: 'heart.error.unsupported' });
    expect(one('.heart-sensor__error').textContent).toContain('Chrome');
    expect(one('.heart-sensor__connect').textContent).toBe('Try again');
  });

  it('stops when the connection drops and when the user signs out', async () => {
    await openToday();
    await app.commands.connectHeartSensor();
    services.demoHeartSensor.lose();
    expect(heart()).toMatchObject({ phase: 'error', errorKey: 'heart.error.lost' });
    await app.commands.connectHeartSensor();
    const sensor = services.demoHeartSensor;
    const handlers = sensor.handlers;
    app.commands.signOut();
    handlers.onReading({ bpm: 60, contact: 'yes' });
    expect(heart().phase).toBe('idle');
  });

  it('cancels a measurement and keeps the sensor connected', async () => {
    await openToday();
    await app.commands.connectHeartSensor();
    app.commands.startHeartMeasurement();
    services.demoHeartSensor.emit(70);
    app.commands.cancelHeartMeasurement();
    expect(heart()).toMatchObject({ phase: 'connected', seconds: 0 });
    app.commands.disconnectHeartSensor();
    expect(heart().phase).toBe('idle');
  });
});