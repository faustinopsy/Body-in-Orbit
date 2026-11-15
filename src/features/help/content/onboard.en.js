const OLLAMA_SOURCES = [
  { label: 'Ollama FAQ: allowed web origins (OLLAMA_ORIGINS)', url: 'https://docs.ollama.com/faq' },
  { label: 'Ollama: structured outputs', url: 'https://docs.ollama.com/capabilities/structured-outputs' },
];

const BLUETOOTH_SOURCES = [
  { label: 'Chrome for Developers: communicating with Bluetooth devices over JavaScript', url: 'https://developer.chrome.com/docs/capabilities/bluetooth' },
  { label: 'MDN: Web Bluetooth API and browser compatibility', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API' },
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
  {
    id: 'heartSensor',
    title: 'Bluetooth sensor',
    paragraphs: [
      'The "Resting heart rate" question can be answered with a Bluetooth chest strap. The app uses the standard Heart Rate service, which most chest straps offer. Watches usually do not share that service with other devices.',
      'The measurement is at rest only: 2 minutes still, and the median of the last minute counts, once the heart has settled. Readings without skin contact are dropped. If the rate changes by more than 15 bpm in the last minute, or there are fewer than 30 good readings, the app asks to measure again. These numbers are the app\'s own criteria and were not scientifically validated.',
      'The measured value only goes into the answer when the crew member presses "Use … bpm in the answer", and it is only kept when they save the day\'s answers. No reading is stored on its own and nothing leaves the computer.',
      'Limitation: Web Bluetooth only works in Google Chrome and Microsoft Edge (and other Chromium-based browsers) on a computer, with the app opened on localhost or HTTPS. In Firefox and Safari the button explains this and the answer is still typed with − and +. On Linux, Chrome needs an experimental flag. In the demo mission the sensor is simulated and the 2 minutes take 12 seconds.',
    ],
    items: [
      'Wet the strap electrodes, put it on your chest and turn on Bluetooth on the computer.',
      'In Today, on the heart rate question, press "Measure with the sensor" and choose the strap in the browser window.',
      'Lie down or sit, stay still and press "Start the measurement". At the end, check the result and press "Use … bpm in the answer".',
      'If you see "no skin contact", adjust the strap. If the connection drops, connect again. The app signs out after 3 minutes without use, so start the measurement right after connecting.',
    ],
    sources: BLUETOOTH_SOURCES,
  },
];