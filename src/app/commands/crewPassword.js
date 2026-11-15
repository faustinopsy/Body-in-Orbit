import { crewAccountId, passwordErrors } from '../../domain/access/accounts.js';
import { isAdmin } from '../../domain/access/permissions.js';

export const setCrewPassword = (app) => async (crewId, password) => {
  const { user, dataset, datasetId, crewAccounts } = app.store.getState();
  if (!isAdmin(user) || !dataset?.crew.some(({ id }) => id === crewId)) return;
  const errors = passwordErrors(password);
  if (errors.length > 0) return app.store.update({ passwordMessage: { key: `access.error.${errors[0]}`, error: true } });
  await app.services.accounts.put({ id: crewAccountId(datasetId, crewId), ...(await app.services.hasher.hash(password)) });
  const accounts = crewAccounts.includes(crewId) ? crewAccounts : [...crewAccounts, crewId];
  app.store.update({ crewAccounts: accounts, passwordMessage: { key: 'access.password.saved', params: { crew: crewId } } });
};