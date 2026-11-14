import { ROUTES } from '../routes.js';

export const goTo = (app) => (route) => {
  if (ROUTES.includes(route)) app.store.update({ route });
};