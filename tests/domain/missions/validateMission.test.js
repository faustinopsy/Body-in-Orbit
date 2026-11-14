import { describe, expect, it } from 'vitest';
import { createMissionDraft, nextCrewCode, validateMember, validateMission } from '../../../src/domain/missions/validateMission.js';

const member = { code: 'C01', role: 'commander', age: 45, weightKg: 80, heightCm: 180 };

describe('validateMission', () => {
  it('accepts a complete mission', () => {
    expect(validateMission({ ...createMissionDraft(), name: 'Artemis test', crew: [member] })).toEqual([]);
  });

  it('asks for a name and at least one crew member', () => {
    expect(validateMission(createMissionDraft())).toEqual(['name', 'crew']);
  });

  it('keeps the duration inside the range of the mission type', () => {
    const draft = { ...createMissionDraft(), name: 'Mars', typeId: 'mars-planetary', durationDays: 300, crew: [member] };
    expect(validateMission(draft)).toEqual(['duration']);
  });

  it('checks the role, age, weight and height of a crew member', () => {
    expect(validateMember({ ...member, role: 'cook', age: 15, heightCm: 300 })).toEqual(['role', 'age', 'heightCm']);
  });

  it('numbers crew members in order', () => {
    expect(nextCrewCode([member])).toBe('C02');
  });
});