import { backupFileName, buildBackup, validateBackup } from '../../domain/backup/backupFormat.js';

export const saveBackup = (app) => async () => {
  const createdAt = app.services.now();
  const content = await app.services.backup.read();
  const name = backupFileName(createdAt);
  app.services.download(name, JSON.stringify(buildBackup(content, createdAt)));
  app.store.update({ errorKey: null, dataMessage: { key: 'data.backup.saved', params: { file: name } } });
};

function parse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const restoreBackup = (app) => async (text) => {
  const backup = parse(text);
  if (backup === null) return app.store.update({ errorKey: 'data.backup.error.read', dataMessage: null });
  if (validateBackup(backup).length > 0) return app.store.update({ errorKey: 'data.backup.error.invalid', dataMessage: null });
  await app.services.backup.replace(backup);
  await app.commands.restoreSession();
  const params = { missions: backup.missions.length, datasets: backup.datasets.length };
  app.store.update({ errorKey: null, welcomeOpen: false, dataMessage: { key: 'data.backup.restored', params } });
};