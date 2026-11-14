export const syncFullscreen = (app) => (active) => {
  app.store.update({ fullscreen: active });
};