import { metricById } from '../domain/metrics.js';
import { findingText } from '../features/analysis/findingText.js';

const MAX_TIPS = 3;

export function demoNarrative(app, analysis) {
  const alerts = analysis.findings.filter((finding) => finding.level !== 'ok');
  const first = alerts[0] ?? analysis.findings[0];
  const summary = app.t(`superAi.demo.summary.${analysis.level}`, { crew: analysis.crewId, count: alerts.length, first: findingText(app, first) });
  const focus = alerts.slice(0, 2).map((finding) => analysis.findings.indexOf(finding));
  const layers = [...new Set(alerts.map((finding) => metricById(finding.metricId)?.layerId).filter(Boolean))];
  const tips = layers.slice(0, 2).map((layerId) => app.t(`actions.${layerId}.2`));
  if (!analysis.answered) tips.push(app.t('superAi.demo.answer'));
  return { summary, focus, tips: tips.slice(0, MAX_TIPS) };
}