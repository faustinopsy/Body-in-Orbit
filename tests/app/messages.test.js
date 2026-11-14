import { describe, expect, it } from 'vitest';

const files = import.meta.glob('../../src/features/*/locales/*.js', { eager: true, import: 'default' });

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

describe('messages', () => {
  it('never uses the same key in two features', () => {
    const repeated = Object.entries(keysByLocale()).filter(([, paths]) => paths.length > 1);
    expect(repeated).toEqual([]);
  });

  it('has the same keys in English and Portuguese', () => {
    const keys = Object.keys(keysByLocale());
    const english = keys.filter((id) => id.startsWith('en:')).map((id) => id.slice(3)).sort();
    const portuguese = keys.filter((id) => id.startsWith('pt:')).map((id) => id.slice(3)).sort();
    expect(portuguese).toEqual(english);
  });
});