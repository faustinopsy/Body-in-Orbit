import { BACKUP_STORES } from '../domain/backup/backupFormat.js';

export function createBackupRepository(database) {
  return {
    async read() {
      const records = await Promise.all(BACKUP_STORES.map((store) => database.getAll(store)));
      return Object.fromEntries(BACKUP_STORES.map((store, index) => [store, records[index]]));
    },
    async replace(content) {
      const transaction = database.transaction(BACKUP_STORES, 'readwrite');
      BACKUP_STORES.forEach((store) => {
        const target = transaction.objectStore(store);
        target.clear();
        content[store].forEach((record) => target.put(record));
      });
      await transaction.done;
    },
  };
}