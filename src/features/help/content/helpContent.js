import overviewEn from './overview.en.js';
import methodEn from './method.en.js';
import risksEn from './risks.en.js';
import overviewPt from './overview.pt.js';
import methodPt from './method.pt.js';
import risksPt from './risks.pt.js';
import overviewEs from './overview.es.js';
import methodEs from './method.es.js';
import risksEs from './risks.es.js';

export const HELP_CONTENT = {
  en: { about: overviewEn, risks: risksEn, method: methodEn },
  pt: { about: overviewPt, risks: risksPt, method: methodPt },
  es: { about: overviewEs, risks: risksEs, method: methodEs },
};

export const helpSections = (locale, tab) => (HELP_CONTENT[locale] ?? HELP_CONTENT.en)[tab];