export const startCrewSetup = (app) => () => {
  app.store.update({ welcomeOpen: false, route: 'mission' });
};