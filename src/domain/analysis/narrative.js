const FIXED_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 30];
const MAX_SUMMARY = 800;
const MAX_TIP = 240;
const MAX_ITEMS = 3;
const NUMBER = /(?<![\p{L}\d.,])\d+(?:[.,]\d+)?(?![\p{L}\d])/gu;

export const numbersIn = (text) => (text.match(NUMBER) ?? []).map((value) => Number(value.replace(',', '.')));

export function allowedNumbers(analysis) {
  const fromFindings = analysis.findings.flatMap((finding) => Object.values(finding.params).filter(Number.isFinite));
  const alerts = analysis.findings.filter((finding) => finding.level !== 'ok').length;
  return [...FIXED_NUMBERS, ...fromFindings, analysis.day, alerts, analysis.findings.length];
}

const known = (allowed, value) => allowed.some((number) => Math.abs(number - value) < 0.051);
const isText = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

const shortList = (list, check) => Array.isArray(list) && list.length <= MAX_ITEMS && list.every(check);
const validIndex = (count) => (index) => Number.isInteger(index) && index >= 0 && index < count;

function shapeErrors(narrative, analysis) {
  const errors = [];
  if (!isText(narrative?.summary, MAX_SUMMARY)) errors.push('summary');
  if (!shortList(narrative?.tips, (tip) => isText(tip, MAX_TIP))) errors.push('tips');
  if (!shortList(narrative?.focus, validIndex(analysis.findings.length))) errors.push('focus');
  return errors;
}

export function narrativeErrors(narrative, analysis) {
  const errors = shapeErrors(narrative, analysis);
  if (errors.length > 0) return errors;
  const allowed = allowedNumbers(analysis);
  const numbers = [narrative.summary, ...narrative.tips].flatMap(numbersIn);
  return numbers.every((value) => known(allowed, value)) ? [] : ['numbers'];
}

export function parseNarrative(content) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}