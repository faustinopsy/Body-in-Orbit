export const closeWelcome = (app) => () => {
  app.store.update({ welcomeOpen: false });
};