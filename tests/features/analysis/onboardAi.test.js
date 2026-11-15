import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../src/app/createApp.js';
import { createFakeOllama, createTestServices } from '../../helpers/createTestServices.js';

let root;
let app;
let reply;
let ollama;

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.querySelector('#app');
  reply = () => JSON.stringify({ summary: 'Day 1 looks calm.', focus: [0], tips: ['Keep the routine.'] });
  ollama = createFakeOllama((request) => reply(request));
  app = await createApp(root, await createTestServices({ ollama }));
});

const one = (selector) => root.querySelector(selector);
const state = () => app.store.getState();

async function createMission() {
  app.commands.updateMissionDraft({ name: 'Mars 2040', typeId: 'mars-planetary' });
  app.commands.confirmMission();
  app.commands.addCrewMember({ role: 'commander', age: 45, weightKg: 80, heightCm: 180 });
  await app.commands.saveMission();
  app.commands.goTo('today');
  app.commands.setTodayTab('analysis');
}

describe('onboard superintelligence', () => {
  it('uses a prepared, checked analysis in the demo without calling any model', async () => {
    await app.commands.openSample();
    app.commands.signInDemo('C02');
    app.commands.setTodayTab('analysis');
    one('.onboard-ai__ask').click();
    await Promise.resolve();
    expect(state().aiRun).toMatchObject({ status: 'ready', source: 'demo', crewId: 'C02' });
    expect(one('.onboard-ai__source').textContent).toBe('Source: prepared demo analysis (no model was called)');
    expect(one('.onboard-ai__summary').textContent).toMatch(/^C02, there are \d+ point\(s\) that need attention today\./);
    expect(one('.onboard-ai__checked').textContent).toBe('✓ Numbers checked against the measurements');
    expect(root.querySelectorAll('.finding[data-focus]').length).toBe(2);
    expect(ollama.calls).toHaveLength(0);
  });

  it('stays quiet until the administrator turns it on', async () => {
    await createMission();
    await app.commands.askOnboardAi();
    expect(one('.onboard-ai__status').textContent).toContain('is off');
    expect(ollama.calls).toHaveLength(0);
  });

  it('shows the answer of the local model after the check', async () => {
    await createMission();
    await app.commands.setAiSettings({ enabled: true, model: 'qwen2.5' });
    await app.commands.askOnboardAi();
    expect(state().aiRun).toMatchObject({ status: 'ready', source: 'ollama', model: 'qwen2.5' });
    expect(one('.onboard-ai__source').textContent).toBe('Source: onboard superintelligence · local model qwen2.5');
    expect(ollama.calls[0].messages[0].content).toContain('English');
    expect(ollama.calls[0].format.required).toEqual(['summary', 'focus', 'tips']);
  });

  it('discards an answer with an invented number', async () => {
    reply = () => JSON.stringify({ summary: 'Your heart is at 95 bpm.', focus: [], tips: [] });
    await createMission();
    await app.commands.setAiSettings({ enabled: true });
    await app.commands.askOnboardAi();
    expect(state().aiRun).toMatchObject({ status: 'error', errorKey: 'superAi.error.check' });
    expect(one('.onboard-ai__result').hidden).toBe(true);
  });

  it('tests the connection only after the option is on', async () => {
    app.commands.goTo('settings');
    app.commands.setSettingsTab('onboard');
    expect(one('[data-tab="onboard"]').textContent).toBe('Onboard superintelligence');
    expect(one('.onboard-settings__test').disabled).toBe(true);
    one('[name="aiEnabled"]').click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    await app.commands.testOnboardAi();
    expect(one('.onboard-settings__result').textContent).toBe('Connected. Models on this computer: llama3.2, qwen2.5.');
    expect(await app.services.preferences.get('onboardAi', null)).toEqual({ enabled: true, model: 'llama3.2' });
  });

  it('explains the onboard technology in the help', () => {
    app.commands.goTo('help');
    app.commands.setHelpTab('onboard');
    expect(one('[data-panel="onboard"] h3').textContent).toBe('Onboard superintelligence');
  });
});