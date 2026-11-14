export default function createDatasets(database) {
  database.createObjectStore('datasets', { keyPath: 'id', autoIncrement: true });
}