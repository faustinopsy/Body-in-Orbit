const OLLAMA_SOURCES = [
  { label: 'Ollama FAQ: allowed web origins (OLLAMA_ORIGINS)', url: 'https://docs.ollama.com/faq' },
  { label: 'Ollama: structured outputs', url: 'https://docs.ollama.com/capabilities/structured-outputs' },
];

export default [
  {
    id: 'superAi',
    title: 'Onboard superintelligence',
    paragraphs: [
      'The onboard superintelligence turns the analysis of the day into a short summary for the crew member, with up to three practical habits. It runs on a language model installed on this computer through Ollama, so no health data leaves the computer.',
      'It never works alone. The app first builds the analysis with its own rules, then sends only those facts to the model. The answer must come back in a fixed JSON format, and every number in it is compared with the measurements. An answer with a different number, or in another format, is discarded, and the screen keeps the analysis by rules.',
      'The screen always says where the text came from: app rules, prepared demo analysis or the local model, with its name. In the demo mission no model is called; the summaries are prepared by the app from the same facts.',
      'This is not a medical evaluation. In a real mission, the flight surgeon decides.',
    ],
    items: [
      'Install Ollama on this computer and download a model, for example: ollama pull llama3.2.',
      'In Settings, tab "Onboard superintelligence", turn the option on, write the model name and use "Test connection".',
      'Ollama accepts browser calls from localhost and 127.0.0.1. If the app is opened from another address, add that address to OLLAMA_ORIGINS before starting Ollama.',
    ],
    sources: OLLAMA_SOURCES,
  },
];