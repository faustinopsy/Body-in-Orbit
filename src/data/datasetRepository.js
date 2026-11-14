export function createDatasetRepository(database, clock = () => new Date().toISOString()) {
  return {
    add: ({ name, data }) => database.add('datasets', { name, data, createdAt: clock() }),
    get: (id) => database.get('datasets', id),
    list: () => database.getAll('datasets'),
  };
}