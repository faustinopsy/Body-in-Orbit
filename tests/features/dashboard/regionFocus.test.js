import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';
import { FULL_VIEW, focusViewBox } from '../../../src/features/dashboard/body/regionFocus.js';

let root;
let app;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  app = await createApp(root, await createTestServices());
  await app.commands.openSample();
});

const one = (selector) => root.querySelector(selector);

describe('zoom on a body region', () => {
  it('frames a region inside the body and keeps the shape of the figure', () => {
    const [x, y, width, height] = focusViewBox('bone-hip');
    expect(width).toBeLessThan(200);
    expect(height / width).toBeCloseTo(410 / 200, 1);
    expect(x).toBeLessThanOrEqual(61);
    expect(y + height).toBeGreaterThanOrEqual(233);
    expect(focusViewBox('eye-optic')[1]).toBe(0);
    expect(focusViewBox('radiation-body')).toEqual(FULL_VIEW);
  });

  it('zooms in on click and shows the whole body on a second click', () => {
    app.commands.selectLayer('skeleton');
    expect(one('.avatar__whole').hidden).toBe(true);
    one('[data-region="bone-hip"][tabindex]').dispatchEvent(new Event('click'));
    expect(app.store.getState().regionId).toBe('bone-hip');
    expect(one('.avatar__svg').hasAttribute('data-zoomed')).toBe(true);
    expect(one('.avatar__whole').hidden).toBe(false);
    one('[data-region="bone-hip"][tabindex]').dispatchEvent(new Event('click'));
    expect(app.store.getState()).toMatchObject({ regionId: null, layerId: 'skeleton' });
    expect(one('.avatar__svg').hasAttribute('data-zoomed')).toBe(false);
  });

  it('goes back to the whole body with the button', () => {
    app.commands.selectRegion('muscle-calf');
    one('.avatar__whole').click();
    expect(app.store.getState().regionId).toBe(null);
    expect(one('.avatar__whole').hidden).toBe(true);
  });
});