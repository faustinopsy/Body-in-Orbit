import overviewEn from './overview.en.js';
import methodEn from './method.en.js';
import risksEn from './risks.en.js';
import overviewPt from './overview.pt.js';
import methodPt from './method.pt.js';
import risksPt from './risks.pt.js';

export const HELP_CONTENT = {
  en: [...overviewEn, ...risksEn, ...methodEn],
  pt: [...overviewPt, ...risksPt, ...methodPt],
};

export const helpSections = (locale) => HELP_CONTENT[locale] ?? HELP_CONTENT.en;