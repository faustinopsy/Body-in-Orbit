import { nextCrewCode } from '../../domain/missions/validateMission.js';

function renumber(crew) {
  return crew.map((member, index) => ({ ...member, code: nextCrewCode(crew.slice(0, index)) }));
}

export const removeCrewMember = (app) => (code) => {
  const { missionDraft } = app.store.getState();
  const crew = renumber(missionDraft.crew.filter((member) => member.code !== code));
  app.store.update({ missionDraft: { ...missionDraft, crew }, missionErrors: [] });
};