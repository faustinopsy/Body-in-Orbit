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
  it('shows the crew tabs, the six layers and the avatar regions', () => {
    expect(all('.crew__tab')).toHaveLength(3);
    expect(all('.rail__button')).toHaveLength(6);
    expect(all('.avatar__region').length).toBeGreaterThanOrEqual(10);
  });

  it('shows only the cards of the selected layer, the worst first', () => {
    expect(all('.metric-card:not([hidden])')).toHaveLength(3);
    app.commands.selectCrew('C02');
    app.commands.selectLayer('muscles');
    const shown = all('.metric-card:not([hidden])');
    expect(shown).toHaveLength(3);
    expect(shown[0].dataset.status).toBe('critical');
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

  it('draws the chart of the selected metric up to today', () => {
    expect(one('.chart__svg').getAttribute('aria-label')).toContain('Spine bone density for C01');
    expect(one('.chart__series').getAttribute('points').split(' ')).toHaveLength(180);
    expect(one('.chart__projected')).toBeNull();
    app.commands.setDay(30);
    expect(one('.chart__svg').getAttribute('aria-label')).toContain('on day 30');
  });

  it('describes the selected region in words, not only in colour', () => {
    app.commands.selectCrew('C02');
    app.commands.selectRegion('muscle-calf');
    expect(one('.avatar__caption').textContent).toBe('Calf muscles: Critical');
  });

  it('shows when a metric getting worse will cross the next limit', () => {
    app.commands.selectCrew('C02');
    app.commands.setDay(120);
    app.commands.selectMetric('muscle.thighStrength');
    expect(one('.metric-card[aria-pressed="true"] .metric-card__limit').textContent).toMatch(/around day \d+|limit reached/);
  });
});