import { isAdmin } from '../../domain/access/permissions.js';
import { buildDayAnalysis } from '../../domain/analysis/buildDayAnalysis.js';
import { checkAnalysis } from '../../domain/analysis/checkAnalysis.js';
import { buildPrompt, NARRATIVE_SCHEMA } from '../../domain/analysis/buildPrompt.js';
import { narrativeErrors, parseNarrative } from '../../domain/analysis/narrative.js';
import { todayOf } from '../../domain/missionDay.js';
import { findingText } from '../../features/analysis/findingText.js';
import { demoNarrative } from '../demoNarrative.js';

export const DEFAULT_AI = { enabled: false, model: 'llama3.2' };

export const setAiSettings = (app) => async (patch) => {
  const { user, aiSettings } = app.store.getState();
  if (!isAdmin(user)) return;
  const model = String(patch.model ?? aiSettings.model).trim() || DEFAULT_AI.model;
  const next = { enabled: Boolean(patch.enabled ?? aiSettings.enabled), model };
  await app.services.preferences.set('onboardAi', next);
  app.store.update({ aiSettings: next, aiTest: { status: 'idle', models: [] } });
};

export const testOnboardAi = (app) => async () => {
  if (!app.store.getState().aiSettings.enabled) return;
  app.store.update({ aiTest: { status: 'loading', models: [] } });
  try {
    const models = await app.services.ollama.listModels();
    app.store.update({ aiTest: { status: 'ok', models } });
  } catch {
    app.store.update({ aiTest: { status: 'error', models: [] } });
  }
};

function finish(app, analysis, result) {
  const errors = [...checkAnalysis({ ...analysis, source: result.source }, app.store.getState().dataset), ...narrativeErrors(result.narrative, analysis)];
  const run = { crewId: analysis.crewId, day: analysis.day, source: result.source, model: result.model ?? null };
  if (errors.length > 0) return app.store.update({ aiRun: { ...run, status: 'error', errorKey: 'superAi.error.check' } });
  app.store.update({ aiRun: { ...run, status: 'ready', narrative: result.narrative } });
}

async function askModel(app, analysis, model) {
  const texts = analysis.findings.map((finding) => findingText(app, finding));
  const messages = buildPrompt(analysis, { locale: app.i18n.getLocale(), texts });
  const content = await app.services.ollama.chat({ model, messages, format: NARRATIVE_SCHEMA });
  return parseNarrative(content);
}

export const askOnboardAi = (app) => async () => {
  const { dataset, crewId, aiSettings } = app.store.getState();
  if (!dataset) return;
  const analysis = buildDayAnalysis(dataset, crewId, todayOf(dataset));
  const run = { crewId, day: analysis.day };
  if (dataset.demo) return finish(app, analysis, { source: 'demo', narrative: demoNarrative(app, analysis) });
  if (!aiSettings.enabled) return app.store.update({ aiRun: { ...run, status: 'error', errorKey: 'superAi.error.off' } });
  app.store.update({ aiRun: { ...run, status: 'loading' } });
  try {
    const narrative = await askModel(app, analysis, aiSettings.model);
    finish(app, analysis, { source: 'ollama', model: aiSettings.model, narrative });
  } catch {
    app.store.update({ aiRun: { ...run, status: 'error', errorKey: 'superAi.error.connect' } });
  }
};