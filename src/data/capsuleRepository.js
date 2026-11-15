export function createCapsuleRepository(database) {
  return {
    add: (item) => database.add('capsule', item),
    remove: (id) => database.delete('capsule', id),
    async listFor(datasetId) {
      const items = await database.getAll('capsule');
      return items.filter((item) => item.datasetId === datasetId);
    },
  };
}