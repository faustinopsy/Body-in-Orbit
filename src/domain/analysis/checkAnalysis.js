import { buildSnapshot } from '../snapshot.js';
import { STATUS_ORDER } from '../status.js';
import { round } from './dayRules.js';

export const ANALYSIS_SOURCES = ['rules', 'demo', 'ollama'];
export const FINDING_KINDS = ['limit', 'approaching', 'shortSleep', 'poorSleep', 'disturbed', 'heartRise', 'allGood'];
const TOLERANCE = 0.1;

function shapeErrors(analysis) {
  const errors = [];
  if (!ANALYSIS_SOURCES.includes(analysis?.source)) errors.push('source');
  if (!STATUS_ORDER.includes(analysis?.level)) errors.push('level');
  if (!Array.isArray(analysis?.findings) || analysis.findings.length === 0) errors.push('findings');
  return errors;
}

function findingErrors(finding, snapshot) {
  if (!FINDING_KINDS.includes(finding.kind) || !STATUS_ORDER.includes(finding.level)) return ['finding'];
  const checked = ['limit', 'approaching'].includes(finding.kind);
  if (!checked) return [];
  const real = snapshot.metrics[finding.metricId]?.value;
  return Number.isFinite(real) && Math.abs(round(real) - finding.params?.value) <= TOLERANCE ? [] : ['number'];
}

export function checkAnalysis(analysis, dataset) {
  const errors = shapeErrors(analysis);
  if (errors.length > 0) return errors;
  const snapshot = buildSnapshot(dataset, analysis.crewId, analysis.day);
  return [...new Set(analysis.findings.flatMap((finding) => findingErrors(finding, snapshot)))];
}