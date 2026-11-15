import { missionFieldErrors } from '../../domain/missions/validateMission.js';

export const confirmMission = (app) => () => {
  const { missionDraft } = app.store.getState();
  const errors = missionFieldErrors({ ...missionDraft, name: missionDraft.name.trim() });
  if (errors.length > 0) return app.store.update({ missionErrors: errors });
  app.store.update({ missionConfirmed: true, missionStep: 'crew', missionErrors: [] });
};