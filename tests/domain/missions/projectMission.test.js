import { describe, expect, it } from 'vitest';
import { buildMissionDataset } from '../../../src/domain/missions/projectMission.js';
import { validateDataset } from '../../../src/domain/dataset/validateDataset.js';
import { valueAt } from '../../../src/domain/series.js';
import { ageFactor, bmiFactor, bodyMassIndex } from '../../../src/domain/missions/crewFactors.js';

const member = (code, extra = {}) => ({ code, role: 'pilot', age: 40, weightKg: 70, heightCm: 175, ...extra });
const mission = (typeId, durationDays, crew) => ({ name: 'Test', typeId, durationDays, crew });

describe('mission projection', () => {
  it('builds a valid dataset with one series per crew member', () => {
    const data = buildMissionDataset(mission('leo-long', 180, [member('C01'), member('C02')]));
    expect(validateDataset(data)).toEqual([]);
    expect(data.series.C02['bone.hipDensity']).toHaveLength(180);
    expect(data.crew).toEqual([{ id: 'C01', role: 'pilot' }, { id: 'C02', role: 'pilot' }]);
  });

  it('keeps the SANS signs inside the 0 to 4 scale on a long Mars mission', () => {
    const data = buildMissionDataset(mission('mars-planetary', 1224, [member('C01')]));
    expect(Math.max(...data.series.C01['eye.sansSigns'])).toBeLessThanOrEqual(4);
  });

  it('keeps age and body measures out of the dataset', () => {
    const data = buildMissionDataset(mission('leo-short', 14, [member('C01')]));
    expect(JSON.stringify(data)).not.toContain('weightKg');
  });

  it('loses about 1 to 1.5 percent of hip bone per month in low orbit', () => {
    const data = buildMissionDataset(mission('leo-long', 180, [member('C01')]));
    const lost = 100 - valueAt(data.series.C01['bone.hipDensity'], 180);
    expect(lost).toBeGreaterThan(6);
    expect(lost).toBeLessThan(9);
  });

  it('adds more radiation per day beyond the magnetosphere', () => {
    const leo = buildMissionDataset(mission('leo-long', 100, [member('C01')]));
    const mars = buildMissionDataset(mission('mars-preparatory', 100, [member('C01')]));
    expect(mars.series.C01['radiation.dose'][99]).toBeGreaterThan(leo.series.C01['radiation.dose'][99]);
  });

  it('makes an older crew member with a high body mass index change faster in the heart only', () => {
    const data = buildMissionDataset(mission('leo-long', 180, [member('C01'), member('C02', { age: 60, weightKg: 100 })]));
    const heart = (code) => valueAt(data.series[code]['cardio.restingHeartRate'], 180);
    expect(heart('C02')).toBeGreaterThan(heart('C01'));
    expect(ageFactor(60)).toBeCloseTo(1.2);
    expect(bodyMassIndex({ weightKg: 100, heightCm: 175 })).toBeCloseTo(32.7, 1);
    expect(bmiFactor({ weightKg: 70, heightCm: 175 })).toBe(1);
  });
});