export function createAccountRepository(database) {
  return {
    get: (id) => database.get('accounts', id),
    put: (account) => database.put('accounts', account),
    has: async (id) => Boolean(await database.get('accounts', id)),
    ids: () => database.getAllKeys('accounts'),
  };
}