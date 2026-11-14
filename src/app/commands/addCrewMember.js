import { MAX_CREW, nextCrewCode, validateMember } from '../../domain/missions/validateMission.js';

export const addCrewMember = (app) => (fields) => {
  const { missionDraft } = app.store.getState();
  const member = { code: nextCrewCode(missionDraft.crew), ...fields };
  const errors = validateMember(member);
  if (missionDraft.crew.length >= MAX_CREW) errors.push('crewSize');
  if (errors.length > 0) return app.store.update({ missionErrors: errors });
  app.store.update({ missionDraft: { ...missionDraft, crew: [...missionDraft.crew, member] }, missionErrors: [] });
};