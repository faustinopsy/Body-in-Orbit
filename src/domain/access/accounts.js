export const ADMIN_ACCOUNT = 'admin';
export const MIN_PASSWORD = 6;
export const IDLE_MINUTES = 3;

export const crewAccountId = (datasetId, crewId) => `crew:${datasetId}:${crewId}`;

export function passwordErrors(password, confirm = password) {
  const errors = [];
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) errors.push('short');
  if (password !== confirm) errors.push('mismatch');
  return errors;
}

export const userOf = (profile) => (profile === ADMIN_ACCOUNT ? { role: 'admin' } : { role: 'crew', crewId: profile });