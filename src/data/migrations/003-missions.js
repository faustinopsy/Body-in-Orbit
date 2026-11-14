export default function createMissions(database) {
  database.createObjectStore('missions', { keyPath: 'id', autoIncrement: true });
}