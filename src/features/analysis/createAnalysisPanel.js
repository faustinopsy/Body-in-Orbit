import { createElement } from '../../ui/createElement.js';
import { createStatusChip, setStatusChip } from '../../ui/createStatusChip.js';
import { buildDayAnalysis } from '../../domain/analysis/buildDayAnalysis.js';
import { todayOf } from '../../domain/missionDay.js';
import { findingText, helpText } from './findingText.js';
import { createOnboardAiCard } from './createOnboardAiCard.js';
import './analysis.css';

function createFinding(app, finding, focused) {
  const shape = createElement('span', { class: 'shape', 'data-status': finding.level, 'aria-hidden': 'true' });
  const text = createElement('p', { class: 'finding__text' }, findingText(app, finding));
  const help = helpText(app, finding);
  const extra = help ? [createElement('p', { class: 'finding__help' }, app.t('analysis.helps', { help }))] : [];
  const item = createElement('li', { class: 'finding', 'data-kind': finding.kind, 'data-level': finding.level }, shape, createElement('div', {}, text, ...extra));
  item.toggleAttribute('data-focus', focused);
  return item;
}

export function createAnalysisPanel(app) {
  const title = createElement('h3', { class: 'analysis__title' });
  const chip = createStatusChip();
  const source = createElement('p', { class: 'analysis__source' });
  const headline = createElement('p', { class: 'analysis__headline' });
  const missing = createElement('p', { class: 'analysis__missing' });
  const list = createElement('ul', { class: 'analysis__list' });
  const notice = createElement('p', { class: 'analysis__notice' });
  const onboard = createOnboardAiCard(app);
  const head = createElement('div', { class: 'analysis__head' }, title, chip);
  const element = createElement('section', { class: 'analysis', 'data-source': 'rules' }, head, source, headline, missing, onboard.element, list, notice);

  function update(state) {
    const day = todayOf(state.dataset);
    const analysis = buildDayAnalysis(state.dataset, state.crewId, day);
    const count = analysis.findings.filter((finding) => finding.level !== 'ok').length;
    title.textContent = app.t('analysis.title', { crew: state.crewId, day });
    setStatusChip(chip, app, analysis.level);
    source.textContent = app.t(`analysis.source.${analysis.source}`);
    element.dataset.source = analysis.source;
    headline.textContent = app.t(`analysis.headline.${analysis.level}`, { count });
    missing.hidden = analysis.answered;
    missing.textContent = app.t('analysis.missing');
    const run = onboard.currentRun(state);
    const focus = run.status === 'ready' ? run.narrative.focus : [];
    list.replaceChildren(...analysis.findings.map((finding, index) => createFinding(app, finding, focus.includes(index))));
    onboard.update(state);
    notice.textContent = app.t('analysis.notice');
  }

  return { element, update };
}