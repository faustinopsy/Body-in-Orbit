import { openDatabase } from '../../src/data/openDatabase.js';
import { createPreferenceRepository } from '../../src/data/preferenceRepository.js';
import { createDatasetRepository } from '../../src/data/datasetRepository.js';
import { createMissionRepository } from '../../src/data/missionRepository.js';
import { createBackupRepository } from '../../src/data/backupRepository.js';
import { buildSampleDataset } from '../../src/domain/dataset/simulate.js';

let counter = 0;

export async function createTestServices(overrides = {}) {
  counter += 1;
  const database = await openDatabase({ name: `app-test-${counter}-${Math.random()}` });
  const downloads = [];
  return {
    preferences: createPreferenceRepository(database),
    datasets: createDatasetRepository(database),
    missions: createMissionRepository(database),
    backup: createBackupRepository(database),
    loadSample: async () => buildSampleDataset(),
    downloads,
    download: (name, text) => downloads.push({ name, text }),
    now: () => '2026-11-15T09:00:00.000Z',
    ...overrides,
  };
}