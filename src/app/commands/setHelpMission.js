import { missionTypeById } from '../../domain/missions/missionTypes.js';

export const setHelpMission = (app) => (typeId) => {
  if (missionTypeById(typeId)) app.store.update({ helpMissionTypeId: typeId });
};