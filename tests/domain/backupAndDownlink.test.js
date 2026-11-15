import { describe, expect, it } from 'vitest';
import { buildBackup, validateBackup, backupFileName } from '../../src/domain/backup/backupFormat.js';
import { buildDownlink, downlinkFileName } from '../../src/domain/downlink/buildDownlink.js';
import { buildSampleDataset } from '../../src/domain/dataset/simulate.js';

const sample = buildSampleDataset();
const content = { preferences: [{ key: 'theme', value: 'dark' }], datasets: [{ id: 1, name: sample.name, data: sample }], missions: [] };

describe('backup format', () => {
  it('accepts a backup it built itself', () => {
    expect(validateBackup(buildBackup(content, '2026-11-15T09:00:00.000Z'))).toEqual([]);
    expect(backupFileName('2026-11-15T09:00:00.000Z')).toBe('body-in-orbit-backup-2026-11-15.json');
  });

  it('rejects other files, missing stores and broken datasets', () => {
    expect(validateBackup({ format: 'something else' })).toEqual(['format']);
    expect(validateBackup({ ...buildBackup(content, 'now'), missions: 'none' })).toEqual(['missions']);
    const broken = { ...content, datasets: [{ id: 1, data: { format: 'wrong' } }] };
    expect(validateBackup(buildBackup(broken, 'now'))).toEqual(['datasets']);
  });
});

describe('downlink package', () => {
  it('has every crew member and metric of the day, without personal measures', () => {
    const packet = buildDownlink(sample, 180, '2026-11-15T09:00:00.000Z');
    expect(packet).toMatchObject({ format: 'orbit-crew-health-downlink', day: 180, missionDays: 180, simulated: true });
    expect(packet.crew.map((member) => member.id)).toEqual(['C01', 'C02', 'C03']);
    expect(Object.keys(packet.crew[0].metrics)).toHaveLength(12);
    expect(packet.crew[1].metrics['muscle.calfStrength'].status).toBe('critical');
    expect(JSON.stringify(packet)).not.toMatch(/age|weightKg|heightCm/);
    expect(downlinkFileName(120)).toBe('body-in-orbit-downlink-d120.json');
  });
});