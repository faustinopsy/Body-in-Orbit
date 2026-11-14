import { missionTypeById } from '../../domain/missions/missionTypes.js';

export const updateMissionDraft = (app) => (patch) => {
  const { missionDraft } = app.store.getState();
  const type = patch.typeId ? missionTypeById(patch.typeId) : null;
  const duration = type ? { durationDays: type.defaultDays } : {};
  app.store.update({ missionDraft: { ...missionDraft, ...patch, ...duration }, missionErrors: [] });
};