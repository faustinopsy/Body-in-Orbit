import { ZOOM_STEPS } from '../zoomSteps.js';

export const changeZoom = (app) => async (step) => {
  const current = ZOOM_STEPS.indexOf(app.store.getState().zoom);
  const index = Math.min(Math.max((current === -1 ? 2 : current) + Math.sign(step), 0), ZOOM_STEPS.length - 1);
  const zoom = ZOOM_STEPS[index];
  app.store.update({ zoom });
  await app.services.preferences.set('zoom', zoom);
};