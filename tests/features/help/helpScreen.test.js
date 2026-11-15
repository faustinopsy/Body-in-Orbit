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
const ids = (locale) => Object.values(HELP_CONTENT[locale]).flat().map((section) => section.id);

describe('help screen', () => {
  it('has the same sections in every language', () => {
    Object.keys(HELP_CONTENT).forEach((locale) => expect(ids(locale)).toEqual(ids('en')));
  });

  it('draws one body figure per risk, coloured by the mission weight', () => {
    expect(all('.risk-figure')).toHaveLength(6);
    app.commands.setHelpMission('leo-short');
    expect(one('.risk-figure[data-risk="sans"]').getAttribute('class')).toContain('status--ok');
    app.commands.setHelpMission('mars-planetary');
    expect(one('.risk-figure[data-risk="sans"]').getAttribute('class')).toContain('status--critical');
  });

  it('shows only the text of the body system picked on the figures', () => {
    expect(all('[data-panel="risks"] .help-section')).toHaveLength(1);
    expect(one('#help-bone')).not.toBeNull();
    one('.risk-figure[data-risk="sans"]').click();
    expect(one('#help-bone')).toBeNull();
    expect(one('.risk-figure[data-risk="sans"]').getAttribute('aria-pressed')).toBe('true');
  });

  it('shows the NASA rating of the picked risk for the chosen mission', () => {
    app.commands.setHelpMission('mars-planetary');
    app.commands.setHelpRisk('sans');
    expect(one('#help-sans .help-section__rating').textContent).toContain('operations 4x4, long-term health 4x5');
  });

  it('splits the rest of the help in tabs', () => {
    expect(one('[data-panel="about"]').hidden).toBe(true);
    one('[data-tab="about"]').click();
    expect(one('[data-panel="risks"]').hidden).toBe(true);
    expect(all('.weight-table tbody tr')).toHaveLength(8);
    expect(one('#help-weights')).not.toBeNull();
    one('[data-tab="method"]').click();
    expect(one('#help-localAi')).not.toBeNull();
  });

  it('switches the help to Portuguese', async () => {
    await app.commands.setLocale('pt');
    app.commands.setHelpRisk('sleep');
    expect(one('#help-sleep h3').textContent).toBe('Sono e carga de trabalho');
  });

  it('opens source links in a new tab without giving the page access to the app', () => {
    app.commands.setHelpRisk('radiation');
    const anchor = one('#help-radiation a');
    expect(anchor.getAttribute('href')).toContain('nasa.gov');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  });
});