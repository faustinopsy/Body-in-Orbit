export const startCrewSetup = (app) => () => {
  app.store.update({ welcomeOpen: false, route: 'settings', settingsTab: 'mission' });
};