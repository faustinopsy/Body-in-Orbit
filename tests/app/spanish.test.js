import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app/createApp.js';
import { createTestServices } from '../helpers/createTestServices.js';

let root;
let app;
let services;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  services = await createTestServices();
  app = await createApp(root, services);
  await app.commands.startDemo();
});

const text = (selector) => root.querySelector(selector).textContent;

describe('Spanish', () => {
  it('offers English, Spanish and Portuguese in the language switch', () => {
    const buttons = [...root.querySelectorAll('.switch__button')].map((button) => button.dataset.locale);
    expect(buttons).toEqual(['en', 'es', 'pt']);
  });

  it('switches the whole app to Spanish and keeps it on the next start', async () => {
    root.querySelector('[data-locale="es"]').click();
    await Promise.resolve();
    expect(document.documentElement.lang).toBe('es');
    expect(text('[data-route="dashboard"] .nav__label')).toBe('Panel');
    expect(text('.layer-head__title')).toBe('Esqueleto');
    expect(text('.timeline__label')).toBe('Día 180 de 180 de la misión');
    const again = await createApp(root, services);
    expect(again.store.getState().locale).toBe('es');
  });

  it('shows the help text in Spanish', async () => {
    await app.commands.setLocale('es');
    app.commands.goTo('help');
    app.commands.setHelpRisk('sleep');
    expect(text('#help-sleep h3')).toBe('Sueño y carga de trabajo');
  });
});