import { ADMIN_ACCOUNT, crewAccountId, passwordErrors, userOf } from '../../domain/access/accounts.js';
import { homeRoute, validUser } from '../../domain/access/permissions.js';

const SIGNED_OUT = { user: null, checkInDraft: null, todayErrors: [], todayMessage: null, capsuleReveal: null, playing: false };

function enter(app, user, extra = {}) {
  app.services.session.save(user);
  const crewId = user.role === 'crew' ? user.crewId : app.store.getState().crewId;
  app.store.update({ ...SIGNED_OUT, user, crewId, route: homeRoute(user), accessError: null, accessMessage: null, ...extra });
}

const accountIdOf = (datasetId, profile) => (profile === ADMIN_ACCOUNT ? ADMIN_ACCOUNT : crewAccountId(datasetId, profile));

export const createAdmin = (app) => async (password, confirm) => {
  const errors = passwordErrors(password, confirm);
  if (errors.length > 0) return app.store.update({ accessError: `access.error.${errors[0]}` });
  if (await app.services.accounts.has(ADMIN_ACCOUNT)) return app.store.update({ accessError: 'access.error.exists' });
  await app.services.accounts.put({ id: ADMIN_ACCOUNT, ...(await app.services.hasher.hash(password)) });
  enter(app, { role: 'admin' }, { hasAdmin: true, route: 'settings' });
};

export const signIn = (app) => async (profile, password) => {
  const { dataset, datasetId } = app.store.getState();
  const user = validUser(userOf(profile), dataset);
  const record = user ? await app.services.accounts.get(accountIdOf(datasetId, profile)) : null;
  if (!(await app.services.hasher.verify(password, record))) return app.store.update({ accessError: 'access.error.wrong' });
  enter(app, user);
};

export const signInDemo = (app) => (profile) => {
  const { dataset } = app.store.getState();
  const user = validUser({ ...userOf(profile), demo: true }, dataset);
  if (user) enter(app, user);
};

export const signOut = (app) => (reason = null) => {
  if (!app.store.getState().user) return;
  app.services.session.clear();
  app.store.update({ ...SIGNED_OUT, accessError: null, accessMessage: reason === 'idle' ? 'access.idle' : null });
};