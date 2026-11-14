export default [
  {
    id: 'timeline',
    title: 'How the timeline is projected',
    paragraphs: [
      'When you create a mission, the app builds one series per day for each crew member and each metric. It starts from a normal baseline, applies the expected monthly change below, multiplies it by the mission weight factor and the personal factor, and adds a small daily variation. The dashboard then uses the mean of the last 7 days.',
      'The warning and critical limits of each metric are provisional values chosen for the demo. They are not NASA medical standards.',
    ],
    items: [
      'Spine and hip bone density: -1.25% per month. NASA reports an average loss of 1% to 1.5% per month in 4 to 6 month missions.',
      'Tibia bone density: -0.75% per month. Team assumption, smaller than spine and hip.',
      'Muscle strength (core, thigh, calf): -1.5%, -2% and -2.5% per month. On space station missions, strength and aerobic fitness drop 10% to 12% on average.',
      'Resting heart rate +1 bpm and heart rate recovery -0.8 bpm per month. Team assumption to show deconditioning.',
      'Sleep: falls about 1.5 hours over the first two weeks. NASA reports that crews sleep about 6 hours a night in flight.',
      'SANS signs: +0.2 per month. About 70% of crew on 4 to 6 month missions show early signs of optic disc swelling, so the average reaches about one sign around month 5.',
      'Radiation dose per day: low orbit 0.5, lunar orbit and surface 1.4, deep space 1.8 and the whole Mars mission 1.5 millisieverts. These are order-of-magnitude values that are not in the reports used here and still need to be checked by the team.',
    ],
  },
  {
    id: 'demoAnalysis',
    title: 'The demo analysis (rule-based, no real AI)',
    paragraphs: [
      'The demo analysis reads exactly what the dashboard shows for the selected crew member and day: the status of each metric, the 60-day trend, the day when the next limit should be crossed and the mission weights.',
      'It puts findings in order: critical first, then warning, then the risks with the highest mission weight, then the closest projected crossing. The sentences come from fixed text files in English and Portuguese, and the numbers are inserted by the code, so they always match the dashboard.',
      'It never gives a diagnosis. When it mentions what can help, it only repeats the types of countermeasures NASA describes publicly, such as exercise, lighting schedules or compression garments. The screen always says that the text comes from the demo analysis.',
    ],
  },
  {
    id: 'localAi',
    title: 'Local AI (optional)',
    paragraphs: [
      'You can turn on a language model that runs on your own computer with Ollama. It is off by default. When on, the app talks only to http://127.0.0.1:11434 on this computer; nothing is sent to the internet.',
      'The app sends only crew codes, the mission type, the day, and the values, status, trend and weights of each metric. It never sends names, age, body weight or height.',
      'The model must answer in a fixed JSON format. Before showing the answer, the app checks that every number it quotes exists on the dashboard. If the check fails, the app shows the demo analysis instead. The screen always says where the analysis came from.',
    ],
    items: [
      'System prompt rules: you are a mission health monitoring assistant for an educational demo.',
      'Use only the numbers in the data you receive. Never invent values.',
      'Do not diagnose and do not recommend treatments or medicines.',
      'Explain which body system is changing, how fast, and how the mission type raises or lowers that risk.',
      'Answer in the language requested and in the JSON format requested.',
    ],
  },
];