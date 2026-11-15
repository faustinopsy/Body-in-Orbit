import { describe, expect, it } from 'vitest';
import { buildSampleDataset } from '../../../src/domain/dataset/simulate.js';
import { buildDayAnalysis } from '../../../src/domain/analysis/buildDayAnalysis.js';
import { narrativeErrors, numbersIn, parseNarrative } from '../../../src/domain/analysis/narrative.js';
import { buildPrompt, NARRATIVE_SCHEMA } from '../../../src/domain/analysis/buildPrompt.js';

const analysis = buildDayAnalysis(buildSampleDataset(), 'C03', 180);
const good = { summary: 'C03, on day 180 the radiation dose is 191.5 mSv, past 180 mSv.', focus: [0], tips: ['Keep the dosimeter on.'] };

describe('narrative check', () => {
  it('reads numbers with point or comma and ignores crew codes', () => {
    expect(numbersIn('C03 · dia 180: 191,5 mSv e 2.4')).toEqual([180, 191.5, 2.4]);
  });

  it('accepts a summary that only uses the numbers of the analysis', () => {
    expect(narrativeErrors(good, analysis)).toEqual([]);
  });

  it('refuses invented numbers, bad indexes and long lists', () => {
    expect(narrativeErrors({ ...good, summary: 'Radiation is 250 mSv.' }, analysis)).toEqual(['numbers']);
    expect(narrativeErrors({ ...good, focus: [42] }, analysis)).toEqual(['focus']);
    expect(narrativeErrors({ ...good, tips: ['a', 'b', 'c', 'd'] }, analysis)).toEqual(['tips']);
    expect(narrativeErrors(null, analysis)).toEqual(['summary', 'tips', 'focus']);
    expect(parseNarrative('not json')).toBe(null);
  });

  it('asks the model for JSON in the language of the screen, with the facts', () => {
    const texts = analysis.findings.map((finding) => finding.kind);
    const [system, user] = buildPrompt(analysis, { locale: 'pt', texts });
    expect(system.content).toContain('Brazilian Portuguese');
    expect(system.content).toContain('Never invent a number');
    const content = JSON.parse(user.content);
    expect(content).toMatchObject({ crew: 'C03', day: 180, overall: 'critical' });
    expect(content.facts[0]).toEqual({ index: 0, level: 'critical', text: 'limit' });
    expect(NARRATIVE_SCHEMA.required).toEqual(['summary', 'focus', 'tips']);
  });
});