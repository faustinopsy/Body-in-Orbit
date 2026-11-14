import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';

let root;
let app;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  app = await createApp(root, await createTestServices());
});

const one = (selector) => root.querySelector(selector);

describe('shell header', () => {
  it('hides the mission seals while no dataset is open', () => {
    expect(one('.shell__seals').hidden).toBe(true);
  });

  it('shows the mission day and the dataset name in the seals', async () => {
    await app.commands.startDemo();
    app.commands.setDay(15);
    expect(one('[data-seal="mission"]').textContent).toBe('Mission · day 15 of 180');
    expect(one('[data-seal="data"]').textContent).toBe('Data: Simulated mission, 180 days');
  });

  it('gives every navigation button an accessible name with an icon', () => {
    const buttons = [...root.querySelectorAll('.nav__button')];
    expect(buttons.every((button) => button.title && button.querySelector('svg.icon'))).toBe(true);
  });

  it('keeps the theme button usable without visible text', async () => {
    one('.theme-toggle').dispatchEvent(new Event('click'));
    await Promise.resolve();
    expect(app.store.getState().theme).toBe('dark');
    expect(one('.theme-toggle').getAttribute('aria-label')).toBe('Toggle theme');
  });
});