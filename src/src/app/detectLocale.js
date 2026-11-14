export const detectLocale = (browserLanguage) =>
  String(browserLanguage ?? '').toLowerCase().startsWith('pt') ? 'pt' : 'en';