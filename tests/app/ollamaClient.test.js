import { describe, expect, it } from 'vitest';
import { createOllamaClient } from '../../src/app/adapters/ollamaClient.js';

function fakeFetch(body, ok = true) {
  const calls = [];
  const fetchJson = async (url, options) => {
    calls.push({ url, options });
    return { ok, status: ok ? 200 : 500, json: async () => body };
  };
  return { calls, fetchJson };
}

describe('ollama client', () => {
  it('lists the models of this computer', async () => {
    const fake = fakeFetch({ models: [{ name: 'llama3.2' }, { name: 'qwen2.5' }] });
    expect(await createOllamaClient(fake.fetchJson).listModels()).toEqual(['llama3.2', 'qwen2.5']);
    expect(fake.calls[0].url).toBe('http://127.0.0.1:11434/api/tags');
  });

  it('sends one chat without streaming and returns the content', async () => {
    const fake = fakeFetch({ message: { content: '{"summary":"ok"}' } });
    const content = await createOllamaClient(fake.fetchJson).chat({ model: 'llama3.2', messages: [], format: { type: 'object' } });
    const body = JSON.parse(fake.calls[0].options.body);
    expect(content).toBe('{"summary":"ok"}');
    expect(fake.calls[0].url).toBe('http://127.0.0.1:11434/api/chat');
    expect(body).toMatchObject({ model: 'llama3.2', stream: false, format: { type: 'object' } });
  });

  it('fails when Ollama answers with an error', async () => {
    const fake = fakeFetch({}, false);
    await expect(createOllamaClient(fake.fetchJson).listModels()).rejects.toThrow('http-500');
  });
});