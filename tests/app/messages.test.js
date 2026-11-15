import { describe, expect, it } from 'vitest';

const files = import.meta.glob('../../src/features/*/locales/*.js', { eager: true, import: 'default' });
const LOCALES = ['en', 'pt', 'es'];

function keysByLocale() {
  const owners = {};
  for (const [path, messages] of Object.entries(files)) {
    const locale = path.match(/\.(\w+)\.js$/)[1];
    for (const key of Object.keys(messages)) {
      const id = `${locale}:${key}`;
      owners[id] = [...(owners[id] ?? []), path];
    }
  }
  return owners;
}

const keysOf = (locale) => Object.keys(keysByLocale())
  .filter((id) => id.startsWith(`${locale}:`))
  .map((id) => id.slice(locale.length + 1))
  .sort();

describe('messages', () => {
  it('never uses the same key in two features', () => {
    const repeated = Object.entries(keysByLocale()).filter(([, paths]) => paths.length > 1);
    expect(repeated).toEqual([]);
  });

  it('has the same keys in English, Portuguese and Spanish', () => {
    LOCALES.forEach((locale) => expect(keysOf(locale)).toEqual(keysOf('en')));
  });

  it('has a locale file for every feature in every language', () => {
    const features = (locale) => Object.keys(files).filter((path) => path.endsWith(`.${locale}.js`)).map((path) => path.split('/').at(-3)).sort();
    LOCALES.forEach((locale) => expect(features(locale)).toEqual(features('en')));
  });
});