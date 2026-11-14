export const startDemo = (app) => async () => {
  await app.commands.openSample();
  if (app.store.getState().dataset) app.store.update({ welcomeOpen: false, route: 'dashboard' });
};