import { applyCheckIn, advanceDay } from '../../domain/checkIn/applyCheckIn.js';
import { validateAnswers } from '../../domain/checkIn/questions.js';
import { todayOf } from '../../domain/missionDay.js';
import { currentAnswers } from '../checkInDraft.js';
import { newlyOpened } from '../../domain/capsule/unlockRules.js';
import { isAdmin } from '../../domain/access/permissions.js';

async function persist(app, data) {
  const { datasetId } = app.store.getState();
  if (datasetId !== null) await app.services.datasets.update(datasetId, data);
}

export const updateCheckIn = (app) => (patch) => {
  const state = app.store.getState();
  if (!state.dataset) return;
  const answers = { ...currentAnswers(state), ...patch };
  app.store.update({ checkInDraft: { crewId: state.crewId, day: todayOf(state.dataset), answers }, todayErrors: [], todayMessage: null });
};

export const saveCheckIn = (app) => async () => {
  const state = app.store.getState();
  if (!state.dataset) return;
  const answers = currentAnswers(state);
  const errors = validateAnswers(answers);
  if (errors.length > 0) return app.store.update({ todayErrors: errors, todayMessage: null });
  const day = todayOf(state.dataset);
  const data = applyCheckIn(state.dataset, { crewId: state.crewId, day, answers });
  await persist(app, data);
  const opened = newlyOpened(state.capsule, state.dataset, data, state.crewId);
  app.store.update({
    dataset: data,
    checkInDraft: null,
    todayErrors: [],
    todayMessage: { key: 'today.saved', params: { crew: state.crewId, day } },
    capsuleReveal: opened?.id ?? null,
  });
};

export const closeDay = (app) => async () => {
  const { dataset, user } = app.store.getState();
  if (!isAdmin(user) || !dataset || todayOf(dataset) >= dataset.missionDays) return;
  const data = advanceDay(dataset);
  await persist(app, data);
  app.store.update({ dataset: data, day: data.today, checkInDraft: null, todayErrors: [], todayMessage: { key: 'today.closed', params: { day: data.today } } });
};