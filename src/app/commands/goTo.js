import { ROUTES } from '../routes.js';
import { canOpen } from '../../domain/access/permissions.js';

export const goTo = (app) => (route) => {
  if (ROUTES.includes(route) && canOpen(app.store.getState().user, route)) app.store.update({ route });
};