import { isAdmin } from '../../domain/access/permissions.js';
import { itemErrors, itemsOf, validEvery } from '../../domain/capsule/unlockRules.js';
import { TODAY_TABS } from '../todayTabs.js';


async function reload(app, extra) {
  const { datasetId } = app.store.getState();
  app.store.update({ capsule: await app.services.capsule.listFor(datasetId), ...extra });
}

async function readImage(app, kind, file) {
  if (kind !== 'image' || !file) return null;
  try {
    return await app.services.readImage(file);
  } catch {
    return undefined;
  }
}

export const addCapsuleItem = (app) => async ({ crewId, kind, title = '', from = '', text = '', file = null }) => {
  const { user, datasetId, capsule } = app.store.getState();
  if (!isAdmin(user) || datasetId === null) return;
  const image = await readImage(app, kind, file);
  if (image === undefined) return app.store.update({ capsuleErrors: ['imageRead'], capsuleMessage: null });
  const order = itemsOf(capsule, crewId).length;
  const item = { datasetId, crewId, kind, title: title.trim(), from: from.trim(), text: text.trim(), image, order };
  const errors = itemErrors(item);
  if (errors.length > 0) return app.store.update({ capsuleErrors: errors, capsuleMessage: null });
  await app.services.capsule.add(item);
  await reload(app, { capsuleErrors: [], capsuleMessage: { key: 'capsule.added', params: { crew: crewId } } });
};

export const removeCapsuleItem = (app) => async (id) => {
  if (!isAdmin(app.store.getState().user)) return;
  await app.services.capsule.remove(id);
  await reload(app, { capsuleErrors: [], capsuleMessage: null });
};

export const setUnlockEvery = (app) => async (value) => {
  const { user, dataset, datasetId } = app.store.getState();
  if (!isAdmin(user) || !dataset) return;
  if (!validEvery(value)) return app.store.update({ capsuleErrors: ['every'], capsuleMessage: null });
  const data = { ...dataset, capsuleEvery: value };
  if (datasetId !== null) await app.services.datasets.update(datasetId, data);
  app.store.update({ dataset: data, capsuleErrors: [], capsuleMessage: { key: 'capsule.everySaved', params: { every: value } } });
};

export const setTodayTab = (app) => (tab) => {
  if (TODAY_TABS.includes(tab)) app.store.update({ todayTab: tab });
};

export const dismissReveal = (app) => () => {
  app.store.update({ capsuleReveal: null });
};