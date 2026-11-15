export const DISTURBANCES = ['noise', 'light', 'temperature', 'discomfort', 'worry'];

export const QUESTIONS = [
  { id: 'sleepHours', group: 'sleep', metricId: 'sleep.hours', type: 'step', min: 0, max: 12, step: 0.5, initial: 7, unit: 'h' },
  { id: 'sleepQuality', group: 'sleep', metricId: 'sleep.quality', type: 'options', options: [1, 2, 3, 4, 5] },
  { id: 'disturbances', group: 'sleep', metricId: null, type: 'multiple', options: DISTURBANCES },
  { id: 'restingHeartRate', group: 'heart', metricId: 'cardio.restingHeartRate', type: 'step', min: 40, max: 120, step: 1, initial: 60, unit: 'bpm' },
];

export const CHECK_IN_GROUPS = ['sleep', 'heart'];

export const questionById = (id) => QUESTIONS.find((question) => question.id === id) ?? null;

export function initialAnswers() {
  return { sleepHours: 7, sleepQuality: null, disturbances: [], restingHeartRate: 60 };
}

function stepValid(question, value) {
  const steps = (value - question.min) / question.step;
  return Number.isFinite(value) && value >= question.min && value <= question.max && Math.abs(steps - Math.round(steps)) < 1e-9;
}

function answerValid(question, value) {
  if (question.type === 'step') return stepValid(question, value);
  if (question.type === 'options') return question.options.includes(value);
  return Array.isArray(value) && new Set(value).size === value.length && value.every((item) => question.options.includes(item));
}

export function validateAnswers(answers) {
  return QUESTIONS.filter((question) => !answerValid(question, answers[question.id])).map((question) => question.id);
}