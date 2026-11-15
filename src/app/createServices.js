import { openDatabase } from '../data/openDatabase.js';
import { createPreferenceRepository } from '../data/preferenceRepository.js';
import { createDatasetRepository } from '../data/datasetRepository.js';
import { createMissionRepository } from '../data/missionRepository.js';
import { createBackupRepository } from '../data/backupRepository.js';
import { createFullscreen } from './adapters/createFullscreen.js';
import { fetchSampleDataset } from './adapters/fetchSampleDataset.js';
import { downloadFile } from './adapters/downloadFile.js';

export async function createServices() {
  const database = await openDatabase();
  return {
    preferences: createPreferenceRepository(database),
    datasets: createDatasetRepository(database),
    missions: createMissionRepository(database),
    backup: createBackupRepository(database),
    loadSample: fetchSampleDataset,
    fullscreen: createFullscreen(),
    download: downloadFile,
    now: () => new Date().toISOString(),
  };
}