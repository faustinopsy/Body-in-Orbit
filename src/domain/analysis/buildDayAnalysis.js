import { buildSnapshot } from '../snapshot.js';
import { STATUS_ORDER, worstStatus } from '../status.js';
import { answersOf, approachingFindings, heartFindings, limitFindings, sleepFindings } from './dayRules.js';

const MAX_FINDINGS = 6;

const byLevel = (first, second) => STATUS_ORDER.indexOf(second.level) - STATUS_ORDER.indexOf(first.level);

function withoutRepeats(findings) {
  const seen = new Set();
  return findings.filter((finding) => {
    const key = finding.metricId && finding.kind !== 'heartRise' ? `${finding.metricId}` : `${finding.kind}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildDayAnalysis(dataset, crewId, day) {
  const snapshot = buildSnapshot(dataset, crewId, day);
  const answers = answersOf(dataset, crewId, day);
  const found = [
    ...limitFindings(snapshot),
    ...heartFindings(dataset.series[crewId]['cardio.restingHeartRate'], day),
    ...sleepFindings(answers),
    ...approachingFindings(snapshot, day),
  ].sort(byLevel);
  const findings = withoutRepeats(found).slice(0, MAX_FINDINGS);
  const level = worstStatus(findings.map((finding) => finding.level)) ?? 'ok';
  return { source: 'rules', crewId, day, level, answered: Boolean(answers), findings: findings.length > 0 ? findings : [{ kind: 'allGood', level: 'ok', metricId: null, params: {} }] };
}