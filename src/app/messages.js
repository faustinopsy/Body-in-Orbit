const LOCALE_OF_FILE = /\.(\w+)\.js$/;

export function collectMessages(modules) {
  const merged = {};
  for (const [path, messages] of Object.entries(modules)) {
    const locale = path.match(LOCALE_OF_FILE)[1];
    merged[locale] = { ...merged[locale], ...messages };
  }
  return merged;
}

export const MESSAGES = collectMessages(
  import.meta.glob('../features/*/locales/*.js', { eager: true, import: 'default' }),
);