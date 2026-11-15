export const SETTINGS_TABS = ['mission', 'crew', 'data'];

export const setSettingsTab = (app) => (tab) => {
  const { missionConfirmed } = app.store.getState();
  if (!SETTINGS_TABS.includes(tab) || (tab === 'crew' && !missionConfirmed)) return;
  app.store.update({ settingsTab: tab, missionErrors: [], errorKey: null, dataMessage: null });
};