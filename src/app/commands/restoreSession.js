import { initialView } from '../initialView.js';
import { missionContext } from '../missionContext.js';
import { validateDataset } from '../../domain/dataset/validateDataset.js';

async function loadSavedDataset({ preferences, datasets }) {
  const lastId = await preferences.get('lastDatasetId', null);
  const saved = lastId === null ? null : await datasets.get(lastId);
  return saved && validateDataset(saved.data).length === 0 ? saved : null;
}

export const restoreSession = (app) => async () => {
  const { preferences, session } = app.services;
  const locale = await preferences.get('locale', app.i18n.getLocale());
  const theme = await preferences.get('theme', 'light');
  const zoom = await preferences.get('zoom', 1);
  const saved = await loadSavedDataset(app.services);
  const dataset = saved?.data ?? null;
  const context = await missionContext(app.services, { datasetId: saved?.id ?? null, dataset, user: session.load() });
  app.i18n.setLocale(locale);
  app.store.update({
    locale: app.i18n.getLocale(),
    theme,
    zoom,
    dataset,
    welcomeOpen: !dataset,
    ...(dataset ? initialView(dataset) : {}),
    ...context,
  });
};