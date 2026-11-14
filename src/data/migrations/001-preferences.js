export default function createPreferences(database) {
  database.createObjectStore('preferences', { keyPath: 'key' });
}