import { openDatabase } from '../../src/data/openDatabase.js';
import { createPreferenceRepository } from '../../src/data/preferenceRepository.js';
import { createDatasetRepository } from '../../src/data/datasetRepository.js';
import { buildSampleDataset } from '../../src/domain/dataset/simulate.js';
import { createMissionRepository } from '../../src/data/missionRepository.js';
let counter = 0;

export async function createTestServices(overrides = {}) {
  counter += 1;
  const database = await openDatabase({ name: `app-test-${counter}-${Math.random()}` });
  return {
    preferences: createPreferenceRepository(database),
    datasets: createDatasetRepository(database),
    loadSample: async () => buildSampleDataset(),
    missions: createMissionRepository(database),
    ...overrides,
  };
}