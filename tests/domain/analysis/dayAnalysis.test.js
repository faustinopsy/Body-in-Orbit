import { describe, expect, it } from 'vitest';
import { buildSampleDataset } from '../../../src/domain/dataset/simulate.js';
import { buildDayAnalysis } from '../../../src/domain/analysis/buildDayAnalysis.js';
import { checkAnalysis } from '../../../src/domain/analysis/checkAnalysis.js';
import { heartFindings, sleepFindings } from '../../../src/domain/analysis/dayRules.js';
import { applyCheckIn } from '../../../src/domain/checkIn/applyCheckIn.js';

const dataset = buildSampleDataset();
const answers = { sleepHours: 5, sleepQuality: 2, disturbances: ['noise'], restingHeartRate: 60 };

describe('analysis of the day by rules', () => {
  it('lists the measurements past the limits, the worst first', () => {
    const analysis = buildDayAnalysis(dataset, 'C02', 180);
    expect(analysis).toMatchObject({ source: 'rules', crewId: 'C02', day: 180, level: 'critical', answered: false });
    expect(analysis.findings[0]).toMatchObject({ kind: 'limit', level: 'critical' });
    expect(analysis.findings.length).toBeLessThanOrEqual(6);
  });

  it('warns about measurements that will cross a limit soon', () => {
    const kinds = buildDayAnalysis(dataset, 'C02', 90).findings.map((finding) => finding.kind);
    expect(kinds).toContain('approaching');
  });

  it('reads the answers of the check-in', () => {
    expect(sleepFindings(answers).map((finding) => finding.kind)).toEqual(['shortSleep', 'poorSleep', 'disturbed']);
    expect(sleepFindings(null)).toEqual([]);
    const answered = applyCheckIn(dataset, { crewId: 'C01', day: 180, answers });
    expect(buildDayAnalysis(answered, 'C01', 180).answered).toBe(true);
  });

  it('notices a resting heart rate above the weekly average', () => {
    const series = [60, 60, 61, 60, 59, 60, 60, 70];
    expect(heartFindings(series, 8)).toEqual([{ kind: 'heartRise', level: 'warning', metricId: 'cardio.restingHeartRate', params: { value: 70, average: 60 } }]);
    expect(heartFindings([60, 60, 61, 60, 59, 60, 60, 63], 8)).toEqual([]);
  });

  it('accepts its own numbers and refuses changed ones', () => {
    const analysis = buildDayAnalysis(dataset, 'C03', 180);
    expect(checkAnalysis(analysis, dataset)).toEqual([]);
    const changed = { ...analysis, findings: analysis.findings.map((finding, index) => (index === 0 ? { ...finding, params: { ...finding.params, value: 12 } } : finding)) };
    expect(checkAnalysis(changed, dataset)).toEqual(['number']);
    expect(checkAnalysis({ ...analysis, source: 'internet' }, dataset)).toEqual(['source']);
  });
});