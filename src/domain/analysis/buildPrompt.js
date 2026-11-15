export const NARRATIVE_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    focus: { type: 'array', items: { type: 'integer' } },
    tips: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'focus', 'tips'],
};

const LANGUAGES = { en: 'English', pt: 'Brazilian Portuguese', es: 'Spanish' };

const RULES = [
  'You support a crew health monitor on a simulated space mission.',
  'Write for the crew member, in plain words, in {language}.',
  'Use only the facts and numbers given. Never invent a number, a value or a date.',
  'Do not diagnose, do not name diseases and do not prescribe medicines. A flight surgeon decides.',
  'Answer with JSON only: summary (at most 3 short sentences), focus (indexes of at most 3 facts that matter most), tips (at most 3 short, practical habits).',
];

export function buildPrompt(analysis, { locale, texts }) {
  const facts = analysis.findings.map((finding, index) => ({ index, level: finding.level, text: texts[index] }));
  const content = { crew: analysis.crewId, day: analysis.day, overall: analysis.level, answeredToday: analysis.answered, facts };
  return [
    { role: 'system', content: RULES.join(' ').replace('{language}', LANGUAGES[locale] ?? LANGUAGES.en) },
    { role: 'user', content: JSON.stringify(content) },
  ];
}