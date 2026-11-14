import { describe, expect, it } from 'vitest';
import { MISSION_TYPES } from '../../../src/domain/missions/missionTypes.js';
import { RISKS } from '../../../src/domain/missions/riskRatings.js';
import { levelOf, riskWeight, weightFactor, weightTable } from '../../../src/domain/missions/riskWeights.js';
import { LAYERS } from '../../../src/domain/layers.js';

describe('risk weights', () => {
  it('has one risk for every body layer', () => {
    expect(RISKS.map((risk) => risk.layerId).sort()).toEqual(LAYERS.map((layer) => layer.id).sort());
  });

  it('has a weight between 0 and 1 for every risk and mission type', () => {
    weightTable().forEach(({ weights }) => {
      Object.values(weights).forEach((weight) => {
        expect(weight).toBeGreaterThan(0);
        expect(weight).toBeLessThanOrEqual(1);
      });
    });
    expect(weightTable()).toHaveLength(MISSION_TYPES.length);
  });

  it('uses the larger of the operations and long-term ratings', () => {
    expect(riskWeight('sans', 'mars-planetary')).toBeCloseTo(20 / 25);
    expect(riskWeight('radiation', 'leo-short')).toBeCloseTo(3 / 12);
  });

  it('makes the Mars mission heavier than a short orbit for radiation, SANS and the heart', () => {
    ['radiation', 'sans', 'cardiovascular'].forEach((riskId) => {
      expect(riskWeight(riskId, 'mars-planetary')).toBeGreaterThan(riskWeight(riskId, 'leo-short'));
    });
  });

  it('gives muscles the same weight as bone', () => {
    expect(riskWeight('fitness', 'mars-planetary')).toBe(riskWeight('bone', 'mars-planetary'));
  });

  it('turns weights into levels and factors relative to a long low-orbit mission', () => {
    expect(levelOf(0.2)).toBe('low');
    expect(levelOf(0.5)).toBe('moderate');
    expect(levelOf(0.8)).toBe('high');
    expect(weightFactor('sans', 'leo-long')).toBe(1);
    expect(weightFactor('sans', 'mars-planetary')).toBeCloseTo(0.8 / 0.48);
  });
});