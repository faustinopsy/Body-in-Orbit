export const setLocale = (app) => async (locale) => {
  app.i18n.setLocale(locale);
  app.store.update({ locale: app.i18n.getLocale() });
  await app.services.preferences.set('locale', app.i18n.getLocale());
};