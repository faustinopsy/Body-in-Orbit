export const SETTINGS_TABS = ['mission', 'crew', 'access', 'capsule', 'onboard', 'data'];

export function settingsTabLocked(state, tab) {
  if (tab === 'crew') return !state.missionConfirmed;
  return (tab === 'access' || tab === 'capsule') && !state.dataset;
}

export const setSettingsTab = (app) => (tab) => {
  const state = app.store.getState();
  if (!SETTINGS_TABS.includes(tab) || settingsTabLocked(state, tab)) return;
  app.store.update({ settingsTab: tab, missionErrors: [], errorKey: null, dataMessage: null, capsuleErrors: [], capsuleMessage: null, passwordMessage: null });
};