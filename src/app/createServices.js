import { openDatabase } from '../data/openDatabase.js';
import { createPreferenceRepository } from '../data/preferenceRepository.js';
import { createDatasetRepository } from '../data/datasetRepository.js';
import { fetchSampleDataset } from './adapters/fetchSampleDataset.js';

export async function createServices() {
  const database = await openDatabase();
  return {
    browserLanguage: navigator.language,
    preferences: createPreferenceRepository(database),
    datasets: createDatasetRepository(database),
    loadSample: fetchSampleDataset,
  };
}