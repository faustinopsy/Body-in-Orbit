export async function fetchSampleDataset() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/sample-dataset.json`);
  if (!response.ok) throw new Error(`sample dataset: HTTP ${response.status}`);
  return response.json();
}