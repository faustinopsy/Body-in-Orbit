export function createDatasetRepository(database, clock = () => new Date().toISOString()) {
  return {
    add: ({ name, data }) => database.add('datasets', { name, data, createdAt: clock() }),
    get: (id) => database.get('datasets', id),
    list: () => database.getAll('datasets'),
    async update(id, data) {
      const record = await database.get('datasets', id);
      await database.put('datasets', { ...record, data });
    },
  };
}