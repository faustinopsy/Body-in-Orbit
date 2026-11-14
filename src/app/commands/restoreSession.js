import { initialView } from '../initialView.js';

export const restoreSession = (app) => async () => {
  const { preferences, datasets } = app.services;
  const locale = await preferences.get('locale', app.i18n.getLocale());
  const theme = await preferences.get('theme', 'light');
  const lastId = await preferences.get('lastDatasetId', null);
  const saved = lastId === null ? null : await datasets.get(lastId);
  app.i18n.setLocale(locale);
  const view = saved ? initialView(saved.data) : {};
  app.store.update({ locale: app.i18n.getLocale(), theme, dataset: saved ? saved.data : null, ...view });
};