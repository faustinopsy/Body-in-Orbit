import { ADMIN_ACCOUNT } from '../domain/access/accounts.js';
import { validUser } from '../domain/access/permissions.js';

async function accountState(accounts, datasetId) {
  const ids = await accounts.ids();
  const prefix = `crew:${datasetId}:`;
  return {
    hasAdmin: ids.includes(ADMIN_ACCOUNT),
    crewAccounts: ids.filter((id) => id.startsWith(prefix)).map((id) => id.slice(prefix.length)),
  };
}

export async function missionContext(services, { datasetId, dataset, user }) {
  const kept = validUser(user, dataset);
  return {
    datasetId,
    user: kept,
    ...(await accountState(services.accounts, datasetId)),
    capsule: datasetId === null ? [] : await services.capsule.listFor(datasetId),
    capsuleReveal: null,
    ...(kept?.role === 'crew' ? { crewId: kept.crewId } : {}),
  };
}