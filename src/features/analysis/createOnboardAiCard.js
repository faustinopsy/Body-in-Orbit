import { createElement } from '../../ui/createElement.js';
import { todayOf } from '../../domain/missionDay.js';

const currentRun = (state) => {
  const run = state.aiRun;
  return run.crewId === state.crewId && run.day === todayOf(state.dataset) ? run : { status: 'idle' };
};

function sourceText(app, run) {
  if (run.source === 'ollama') return app.t('superAi.source.ollama', { model: run.model });
  return app.t('superAi.source.demo');
}

export function createOnboardAiCard(app) {
  const title = createElement('h4', { class: 'onboard-ai__title' });
  const ask = createElement('button', { type: 'button', class: 'button button--primary onboard-ai__ask' });
  const status = createElement('p', { class: 'onboard-ai__status', role: 'status' });
  const source = createElement('p', { class: 'analysis__source onboard-ai__source' });
  const summary = createElement('p', { class: 'onboard-ai__summary' });
  const tips = createElement('ul', { class: 'onboard-ai__tips' });
  const checked = createElement('p', { class: 'onboard-ai__checked' });
  const result = createElement('div', { class: 'onboard-ai__result' }, source, summary, tips, checked);
  const element = createElement('section', { class: 'onboard-ai' }, createElement('div', { class: 'onboard-ai__head' }, title, ask), status, result);
  ask.addEventListener('click', () => app.commands.askOnboardAi());

  function update(state) {
    const run = currentRun(state);
    title.textContent = app.t('superAi.title');
    ask.textContent = app.t(run.status === 'ready' ? 'superAi.again' : 'superAi.ask');
    ask.disabled = run.status === 'loading';
    element.dataset.status = run.status;
    status.hidden = !['loading', 'error', 'idle'].includes(run.status);
    status.textContent = run.status === 'error' ? app.t(run.errorKey) : app.t(`superAi.status.${run.status}`);
    result.hidden = run.status !== 'ready';
    if (run.status !== 'ready') return;
    source.textContent = sourceText(app, run);
    summary.textContent = run.narrative.summary;
    tips.replaceChildren(...run.narrative.tips.map((tip) => createElement('li', {}, tip)));
    checked.textContent = app.t('superAi.checked');
  }

  return { element, update, currentRun };
}