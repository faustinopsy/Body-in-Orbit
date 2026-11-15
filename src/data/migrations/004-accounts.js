export default function createAccounts(database) {
  database.createObjectStore('accounts', { keyPath: 'id' });
}