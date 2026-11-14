import { openDatabase } from '../data/openDatabase.js';
import { createPreferenceRepository } from '../data/preferenceRepository.js';
import { createDatasetRepository } from '../data/datasetRepository.js';
import { fetchSampleDataset } from './adapters/fetchSampleDataset.js';
import { createFullscreen } from './adapters/createFullscreen.js';
import { createMissionRepository } from '../data/missionRepository.js';
export async function createServices() {
    
  const database = await openDatabase();
  return {
    fullscreen: createFullscreen(),
    preferences: createPreferenceRepository(database),
    datasets: createDatasetRepository(database),
    loadSample: fetchSampleDataset,
    missions: createMissionRepository(database),
  };
}