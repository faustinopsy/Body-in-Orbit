const PARAMETER = /\{(\w+)\}/g;

export function createI18n({ messages, locale, fallback = 'en' }) {
  let current = locale;

  const lookup = (key) => messages[current]?.[key] ?? messages[fallback]?.[key] ?? key;

  return {
    t: (key, params = {}) =>
      lookup(key).replace(PARAMETER, (match, name) => (name in params ? String(params[name]) : match)),
    getLocale: () => current,
    locales: () => Object.keys(messages),
    setLocale(next) {
      if (messages[next]) current = next;
    },
  };
}