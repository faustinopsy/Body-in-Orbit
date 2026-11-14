import { openDB } from 'idb';

export const DATABASE_NAME = 'orbit-crew-health';

export function collectMigrations(modules) {
  return Object.entries(modules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, migrate]) => migrate);
}

export const MIGRATIONS = collectMigrations(
  import.meta.glob('./migrations/*.js', { eager: true, import: 'default' }),
);

export function openDatabase({ name = DATABASE_NAME, migrations = MIGRATIONS } = {}) {
  return openDB(name, migrations.length, {
    upgrade(database, oldVersion, newVersion, transaction) {
      migrations.slice(oldVersion).forEach((migrate) => migrate(database, transaction));
    },
  });
}