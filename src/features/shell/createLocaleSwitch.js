import { createElement } from '../../ui/createElement.js';

export function createLocaleSwitch(app) {
  const element = createElement('div', { class: 'switch', role: 'group' });
  const buttons = app.i18n.locales().map((locale) => {
    const button = createElement('button', { type: 'button', class: 'switch__button', 'data-locale': locale });
    button.addEventListener('click', () => app.commands.setLocale(locale));
    return button;
  });
  element.append(...buttons);

  function update(state) {
    element.setAttribute('aria-label', app.t('locale.label'));
    buttons.forEach((button) => {
      const locale = button.dataset.locale;
      button.textContent = app.t(`locale.${locale}`);
      button.setAttribute('aria-pressed', String(locale === state.locale));
    });
  }

  return { element, update };
}