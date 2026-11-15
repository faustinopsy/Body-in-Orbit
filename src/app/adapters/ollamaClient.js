export const OLLAMA_URL = 'http://127.0.0.1:11434';
const TIMEOUT_MS = 120000;

async function request(fetchJson, path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchJson(`${OLLAMA_URL}${path}`, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`http-${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export function createOllamaClient(fetchJson = (...args) => fetch(...args)) {
  return {
    async listModels() {
      const data = await request(fetchJson, '/api/tags');
      return (data.models ?? []).map((model) => model.name);
    },
    async chat({ model, messages, format }) {
      const body = JSON.stringify({ model, messages, format, stream: false, options: { temperature: 0.2 } });
      const data = await request(fetchJson, '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      return data.message?.content ?? '';
    },
  };
}