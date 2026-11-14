import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app/createApp.js';
import { createTestServices } from '../helpers/createTestServices.js';

let app;
let services;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  services = await createTestServices();
  app = await createApp(document.querySelector('#app'), services);
});

describe('changeZoom', () => {
  it('changes the text size in steps, inside the limits, and saves it', async () => {
    await app.commands.changeZoom(1);
    expect(app.store.getState().zoom).toBe(1.1);
    expect(document.documentElement.style.getPropertyValue('--zoom')).toBe('1.1');
    await app.commands.changeZoom(1);
    await app.commands.changeZoom(1);
    expect(app.store.getState().zoom).toBe(1.25);
    expect(await services.preferences.get('zoom', 1)).toBe(1.25);
  });

  it('goes down to the smallest step and is restored on the next start', async () => {
    for (let step = 0; step < 5; step += 1) await app.commands.changeZoom(-1);
    expect(app.store.getState().zoom).toBe(0.8);
    const again = await createApp(document.querySelector('#app'), services);
    expect(again.store.getState().zoom).toBe(0.8);
  });

  it('disables the buttons at the ends of the scale', async () => {
    await app.commands.openSample();
    for (let step = 0; step < 5; step += 1) await app.commands.changeZoom(1);
    expect(document.querySelector('.zoom__button[data-zoom="big"]').disabled).toBe(true);
    expect(document.querySelector('.zoom__button[data-zoom="small"]').disabled).toBe(false);
  });
});