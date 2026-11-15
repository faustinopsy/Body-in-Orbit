import { openDatabase } from '../../src/data/openDatabase.js';
import { createPreferenceRepository } from '../../src/data/preferenceRepository.js';
import { createDatasetRepository } from '../../src/data/datasetRepository.js';
import { createMissionRepository } from '../../src/data/missionRepository.js';
import { createBackupRepository } from '../../src/data/backupRepository.js';
import { createAccountRepository } from '../../src/data/accountRepository.js';
import { createCapsuleRepository } from '../../src/data/capsuleRepository.js';
import { createPasswordHasher } from '../../src/app/adapters/passwordHasher.js';
import { buildSampleDataset } from '../../src/domain/dataset/simulate.js';

let counter = 0;

export function createMemorySession(user = { role: 'admin' }) {
  let saved = user;
  return {
    load: () => saved,
    save: (next) => {
      saved = next;
    },
    clear: () => {
      saved = null;
    },
  };
}

export function createFakeOllama(reply = () => '{}') {
  const calls = [];
  return {
    calls,
    listModels: async () => ['llama3.2', 'qwen2.5'],
    chat: async (request) => {
      calls.push(request);
      return reply(request);
    },
  };
}

export async function createTestServices(overrides = {}) {
  counter += 1;
  const database = await openDatabase({ name: `app-test-${counter}-${Math.random()}` });
  const downloads = [];
  return {
    preferences: createPreferenceRepository(database),
    datasets: createDatasetRepository(database),
    missions: createMissionRepository(database),
    backup: createBackupRepository(database),
    accounts: createAccountRepository(database),
    capsule: createCapsuleRepository(database),
    hasher: createPasswordHasher(1000),
    session: createMemorySession(),
    readImage: async (file) => file,
    ollama: createFakeOllama(),
    loadSample: async () => buildSampleDataset(),
    downloads,
    download: (name, text) => downloads.push({ name, text }),
    now: () => '2026-11-15T09:00:00.000Z',
    ...overrides,
  };
}