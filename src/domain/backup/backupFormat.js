import { validateDataset } from '../dataset/validateDataset.js';

export const BACKUP_FORMAT = 'orbit-crew-health-backup';
export const BACKUP_VERSION = 1;
export const BACKUP_STORES = ['preferences', 'datasets', 'missions', 'accounts', 'capsule'];
export const REQUIRED_STORES = ['preferences', 'datasets', 'missions'];

export function buildBackup(content, createdAt) {
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, createdAt, ...content };
}

const isRecord = (value) => typeof value === 'object' && value !== null;

const validStore = (records) => Array.isArray(records) && records.every(isRecord);

function storeErrors(backup) {
  const missing = REQUIRED_STORES.filter((store) => !validStore(backup[store]));
  const broken = BACKUP_STORES.filter((store) => store in backup && !validStore(backup[store]));
  return [...new Set([...missing, ...broken])];
}

function datasetErrors(backup) {
  return backup.datasets.some((entry) => validateDataset(entry.data).length > 0) ? ['datasets'] : [];
}

export function validateBackup(backup) {
  if (!isRecord(backup) || backup.format !== BACKUP_FORMAT || backup.version !== BACKUP_VERSION) return ['format'];
  const stores = storeErrors(backup);
  return stores.length > 0 ? stores : datasetErrors(backup);
}

export const backupFileName = (createdAt) => `body-in-orbit-backup-${createdAt.slice(0, 10)}.json`;