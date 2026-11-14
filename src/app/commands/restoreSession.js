import { initialView } from '../initialView.js';
import { validateDataset } from '../../domain/dataset/validateDataset.js';

async function loadSavedDataset({ preferences, datasets }) {
  const lastId = await preferences.get('lastDatasetId', null);
  const saved = lastId === null ? null : await datasets.get(lastId);
  return saved && validateDataset(saved.data).length === 0 ? saved.data : null;
}

export const restoreSession = (app) => async () => {
  const { preferences } = app.services;
  const locale = await preferences.get('locale', app.i18n.getLocale());
  const theme = await preferences.get('theme', 'light');
  const dataset = await loadSavedDataset(app.services);
  app.i18n.setLocale(locale);
  app.store.update({
    locale: app.i18n.getLocale(),
    theme,
    dataset,
    welcomeOpen: !dataset,
    ...(dataset ? initialView(dataset) : {}),
  });
};