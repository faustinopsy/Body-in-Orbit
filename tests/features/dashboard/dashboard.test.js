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
});

const all = (selector) => [...root.querySelectorAll(selector)];
const one = (selector) => root.querySelector(selector);

describe('dashboard', () => {
  it('shows the crew picker, the five layers and the avatar regions', () => {
    expect(all('.picker__button')).toHaveLength(3);
    expect(all('.rail__button')).toHaveLength(6);
    expect(all('.avatar__region').length).toBeGreaterThanOrEqual(10);
  });

  it('shows only the cards of the selected layer', () => {
    expect(all('.card:not([hidden])')).toHaveLength(3);
    app.commands.selectLayer('sleep');
    expect(all('.card:not([hidden])')).toHaveLength(2);
  });

  it('colours the avatar from the crew member status', () => {
    app.commands.selectCrew('C02');
    app.commands.selectLayer('muscles');
    expect(one('[data-region="muscle-calf"]').getAttribute('class')).toContain('status--critical');
    app.commands.selectCrew('C01');
    expect(one('[data-region="muscle-calf"]').getAttribute('class')).toContain('status--ok');
  });

  it('shows only the drawing of the selected layer', () => {
    const shown = () => all('.avatar__layer').filter((layer) => layer.getAttribute('display') === 'inline');
    expect(shown().every((layer) => layer.dataset.layer === 'skeleton')).toBe(true);
    app.commands.selectLayer('sleep');
    expect(shown().every((layer) => layer.dataset.layer === 'sleep')).toBe(true);
  });

  it('selects a region by click and by keyboard', () => {
    one('[data-region="bone-hip"]').dispatchEvent(new Event('click'));
    expect(app.store.getState().regionId).toBe('bone-hip');
    one('[data-region="bone-tibia"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(app.store.getState().regionId).toBe('bone-tibia');
  });

  it('moves through the mission with the timeline', () => {
    const input = one('.timeline__input');
    input.value = '60';
    input.dispatchEvent(new Event('input'));
    expect(app.store.getState().day).toBe(60);
    expect(one('.timeline__label').textContent).toBe('Mission day 60 of 180');
  });

  it('draws the chart of the selected metric', () => {
    expect(one('.chart__title').textContent).toContain('Spine bone density');
    expect(one('.chart__series').getAttribute('points').split(' ')).toHaveLength(180);
    app.commands.setDay(30);
    expect(one('.chart__series').getAttribute('points').split(' ')).toHaveLength(30);
  });

  it('describes the selected region in words, not only in colour', () => {
    app.commands.selectCrew('C02');
    app.commands.selectRegion('muscle-calf');
    expect(one('.avatar__caption').textContent).toBe('Calf muscles: Critical');
  });

  it('shows the projection note for a metric getting worse', async () => {
    app.commands.selectCrew('C02');
    app.commands.setDay(120);
    app.commands.selectMetric('muscle.calfStrength');
    expect(one('.card[aria-pressed="true"] .card__note').textContent).toMatch(/around day \d+/);
  });
});