import { createMissionDraft, missionFieldErrors, validateMission } from '../../domain/missions/validateMission.js';
import { buildMissionDataset } from '../../domain/missions/projectMission.js';
import { initialView } from '../initialView.js';

function showErrors(app, mission, errors) {
  const step = missionFieldErrors(mission).length > 0 ? 'mission' : app.store.getState().missionStep;
  app.store.update({ missionErrors: errors, missionStep: step });
}

export const saveMission = (app) => async () => {
  const { missionDraft } = app.store.getState();
  const mission = { ...missionDraft, name: missionDraft.name.trim() };
  const errors = validateMission(mission);
  if (errors.length > 0) return showErrors(app, mission, errors);
  await app.services.missions.add(mission);
  const data = buildMissionDataset(mission);
  const id = await app.services.datasets.add({ name: data.name, data });
  await app.services.preferences.set('lastDatasetId', id);
  app.store.update({
    dataset: data,
    ...initialView(data),
    route: 'dashboard',
    missionDraft: createMissionDraft(),
    missionErrors: [],
    missionStep: 'mission',
    missionConfirmed: false,
  });
};