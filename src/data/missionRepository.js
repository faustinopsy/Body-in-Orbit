export function createMissionRepository(database, clock = () => new Date().toISOString()) {
  return {
    add: (mission) => database.add('missions', { ...mission, createdAt: clock() }),
    get: (id) => database.get('missions', id),
    list: () => database.getAll('missions'),
  };
}