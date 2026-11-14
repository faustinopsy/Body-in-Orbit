import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createTestServices } from '../../helpers/createTestServices.js';
import { HELP_CONTENT } from '../../../src/features/help/content/helpContent.js';

let root;
let app;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  app = await createApp(root, await createTestServices());
  app.commands.closeWelcome();
  app.commands.goTo('help');
});

const one = (selector) => root.querySelector(selector);
const all = (selector) => [...root.querySelectorAll(selector)];

describe('help screen', () => {
  it('has the same sections in English and Portuguese', () => {
    expect(HELP_CONTENT.pt.map((section) => section.id)).toEqual(HELP_CONTENT.en.map((section) => section.id));
  });

  it('draws one body figure per risk, coloured by the mission weight', () => {
    expect(all('.risk-figure')).toHaveLength(6);
    app.commands.setHelpMission('leo-short');
    expect(one('.risk-figure[data-risk="sans"]').getAttribute('class')).toContain('status--ok');
    app.commands.setHelpMission('mars-planetary');
    expect(one('.risk-figure[data-risk="sans"]').getAttribute('class')).toContain('status--critical');
  });

  it('shows the weight table for every mission type', () => {
    expect(all('.weight-table tbody tr')).toHaveLength(8);
  });

  it('shows the NASA rating of each risk for the chosen mission', () => {
    app.commands.setHelpMission('mars-planetary');
    expect(one('#help-sans .help-section__rating').textContent).toContain('operations 4x4, long-term health 4x5');
  });

  it('switches the whole help to Portuguese', async () => {
    await app.commands.setLocale('pt');
    expect(one('#help-sleep h3').textContent).toBe('Sono e carga de trabalho');
  });

  it('opens source links in a new tab without giving the page access to the app', () => {
    const anchor = one('#help-radiation a');
    expect(anchor.getAttribute('href')).toContain('nasa.gov');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  });
});