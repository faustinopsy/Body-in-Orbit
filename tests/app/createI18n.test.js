import { describe, expect, it } from 'vitest';
import { createI18n } from '../../src/app/createI18n.js';
import { collectMessages } from '../../src/app/messages.js';

const messages = {
  pt: { hello: 'Olá, {name}', onlyPt: 'só em português' },
  en: { hello: 'Hello, {name}', onlyEn: 'english only' },
};

describe('createI18n', () => {
  it('translates and fills in parameters', () => {
    const i18n = createI18n({ messages, locale: 'pt' });
    expect(i18n.t('hello', { name: 'Ana' })).toBe('Olá, Ana');
  });

  it('switches language', () => {
    const i18n = createI18n({ messages, locale: 'pt' });
    i18n.setLocale('en');
    expect(i18n.t('hello', { name: 'Ana' })).toBe('Hello, Ana');
    expect(i18n.getLocale()).toBe('en');
  });

  it('falls back to English, then to the key itself', () => {
    const i18n = createI18n({ messages, locale: 'pt' });
    expect(i18n.t('onlyEn')).toBe('english only');
    expect(i18n.t('missing.key')).toBe('missing.key');
  });

  it('ignores a language it does not have', () => {
    const i18n = createI18n({ messages, locale: 'pt' });
    i18n.setLocale('fr');
    expect(i18n.getLocale()).toBe('pt');
  });
});

describe('collectMessages', () => {
  it('groups message files by the language in the file name', () => {
    const merged = collectMessages({
      '../features/a/locales/a.pt.js': { one: 'um' },
      '../features/a/locales/a.en.js': { one: 'one' },
      '../features/b/locales/b.pt.js': { two: 'dois' },
    });
    expect(merged).toEqual({ pt: { one: 'um', two: 'dois' }, en: { one: 'one' } });
  });
});