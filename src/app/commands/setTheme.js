const THEMES = ['light', 'dark'];

export const setTheme = (app) => async (theme) => {
  if (!THEMES.includes(theme)) return;
  app.store.update({ theme });
  await app.services.preferences.set('theme', theme);
};