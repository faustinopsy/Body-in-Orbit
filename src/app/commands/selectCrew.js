import { canSeeCrew } from '../../domain/access/permissions.js';

export const selectCrew = (app) => (crewId) => {
  const { dataset, user } = app.store.getState();
  if (!dataset?.crew.some((member) => member.id === crewId) || !canSeeCrew(user, crewId)) return;
  app.store.update({ crewId, todayErrors: [], capsuleReveal: null });
};