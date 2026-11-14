export function createPreferenceRepository(database) {
  return {
    async get(key, fallback = null) {
      const row = await database.get('preferences', key);
      return row ? row.value : fallback;
    },
    async set(key, value) {
      await database.put('preferences', { key, value });
    },
  };
}