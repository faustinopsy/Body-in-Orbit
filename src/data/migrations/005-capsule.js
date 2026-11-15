export default function createCapsule(database) {
  database.createObjectStore('capsule', { keyPath: 'id', autoIncrement: true });
}