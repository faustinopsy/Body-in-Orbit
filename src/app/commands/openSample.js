import { validateDataset } from '../../domain/dataset/validateDataset.js';
import { initialView } from '../initialView.js';

async function loadValidSample(services) {
  const data = await services.loadSample();
  return validateDataset(data).length === 0 ? data : null;
}

export const openSample = (app) => async () => {
  app.store.update({ busy: true, errorKey: null });
  try {
    const data = await loadValidSample(app.services);
    if (!data) return app.store.update({ busy: false, errorKey: 'data.error.invalid' });
    const id = await app.services.datasets.add({ name: data.name, data });
    await app.services.preferences.set('lastDatasetId', id);
    app.store.update({ busy: false, dataset: data, ...initialView(data) });
  } catch {
    app.store.update({ busy: false, errorKey: 'data.error.load' });
  }
};