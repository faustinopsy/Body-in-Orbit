import { validateDataset } from '../../domain/dataset/validateDataset.js';
import { demoCapsuleItems, withDemoHistory } from '../../domain/capsule/demoCapsule.js';
import { initialView } from '../initialView.js';
import { missionContext } from '../missionContext.js';

async function loadValidSample(services) {
  const data = await services.loadSample();
  return validateDataset(data).length === 0 ? withDemoHistory(data) : null;
}

async function storeSample(services, data) {
  const id = await services.datasets.add({ name: data.name, data });
  await Promise.all(demoCapsuleItems(id).map((item) => services.capsule.add(item)));
  await services.preferences.set('lastDatasetId', id);
  return id;
}

export const openSample = (app) => async () => {
  app.store.update({ busy: true, errorKey: null });
  try {
    const data = await loadValidSample(app.services);
    if (!data) return app.store.update({ busy: false, errorKey: 'data.error.invalid' });
    const datasetId = await storeSample(app.services, data);
    const context = await missionContext(app.services, { datasetId, dataset: data, user: app.store.getState().user });
    app.store.update({ busy: false, dataset: data, ...initialView(data), ...context });
  } catch {
    app.store.update({ busy: false, errorKey: 'data.error.load' });
  }
};