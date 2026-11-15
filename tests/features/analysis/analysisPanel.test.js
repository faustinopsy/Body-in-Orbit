import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';

let root;
let app;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  app = await createApp(root, await createTestServices());
  await app.commands.openSample();
  app.commands.goTo('today');
});

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];

describe('analysis tab', () => {
  it('shows where the analysis came from and the findings of the crew member', () => {
    app.commands.selectCrew('C02');
    app.commands.setTodayTab('analysis');
    expect(one('.analysis').hidden).toBe(false);
    expect(one('.analysis__source').textContent).toBe('Source: app rules, calculated on this computer');
    expect(one('.analysis .chip').dataset.status).toBe('critical');
    expect(one('.finding').textContent).toContain('past the limit');
    expect(one('.finding__help').textContent).toMatch(/^What can help: /);
    expect(one('.analysis__missing').hidden).toBe(false);
  });

  it('adds the answers of the day after the check-in', async () => {
    app.commands.signInDemo('C03');
    one('[data-question="sleepQuality"] [data-option="4"]').dispatchEvent(new Event('click'));
    one('[data-question="disturbances"] [data-option="noise"]').dispatchEvent(new Event('click'));
    await app.commands.saveCheckIn();
    app.commands.setTodayTab('analysis');
    expect(one('.analysis__missing').hidden).toBe(true);
    expect(all('.finding').map((item) => item.dataset.kind)).toContain('disturbed');
    expect(one('[data-kind="disturbed"] .finding__text').textContent).toBe('Your sleep was disturbed by: noise.');
  });

  it('writes scale values without a unit', () => {
    app.commands.selectCrew('C03');
    app.commands.setTodayTab('analysis');
    expect(one('[data-kind="limit"]:last-of-type .finding__text').textContent).not.toContain('1-5');
  });
});