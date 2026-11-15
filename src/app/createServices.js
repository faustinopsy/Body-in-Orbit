import { openDatabase } from '../data/openDatabase.js';
import { createPreferenceRepository } from '../data/preferenceRepository.js';
import { createDatasetRepository } from '../data/datasetRepository.js';
import { createMissionRepository } from '../data/missionRepository.js';
import { createBackupRepository } from '../data/backupRepository.js';
import { createAccountRepository } from '../data/accountRepository.js';
import { createCapsuleRepository } from '../data/capsuleRepository.js';
import { createFullscreen } from './adapters/createFullscreen.js';
import { fetchSampleDataset } from './adapters/fetchSampleDataset.js';
import { downloadFile } from './adapters/downloadFile.js';
import { createPasswordHasher } from './adapters/passwordHasher.js';
import { createSessionStore } from './adapters/sessionStore.js';
import { readImageFile } from './adapters/readImageFile.js';
import { createOllamaClient } from './adapters/ollamaClient.js';
import { createBluetoothHeartSensor } from './adapters/bluetoothHeartSensor.js';
import { createSimulatedHeartSensor } from './adapters/simulatedHeartSensor.js';

export async function createServices() {
  const database = await openDatabase();
  return {
    preferences: createPreferenceRepository(database),
    datasets: createDatasetRepository(database),
    missions: createMissionRepository(database),
    backup: createBackupRepository(database),
    accounts: createAccountRepository(database),
    capsule: createCapsuleRepository(database),
    hasher: createPasswordHasher(),
    session: createSessionStore(),
    readImage: readImageFile,
    ollama: createOllamaClient(),
    heartSensor: createBluetoothHeartSensor(),
    demoHeartSensor: createSimulatedHeartSensor(),
    loadSample: fetchSampleDataset,
    fullscreen: createFullscreen(),
    download: downloadFile,
    now: () => new Date().toISOString(),
  };
}