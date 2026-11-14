export const detectLocale = (browserLanguage) =>
  String(browserLanguage ?? '').toLowerCase().startsWith('en') ? 'pt' : 'en';