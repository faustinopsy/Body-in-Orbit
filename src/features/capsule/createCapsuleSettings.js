import { createElement } from '../../ui/createElement.js';
import { createEveryForm } from './createEveryForm.js';
import { createItemForm } from './createItemForm.js';
import { createItemList } from './createItemList.js';
import './capsule.css';

export function createCapsuleSettings(app) {
  const text = createElement('p', { class: 'screen__text' });
  const message = createElement('p', { class: 'capsule-settings__message', role: 'status' });
  const errors = createElement('ul', { class: 'screen__error capsule-settings__errors', role: 'alert' });
  const parts = [createEveryForm(app), createItemForm(app), createItemList(app)];
  const element = createElement('div', { class: 'capsule-settings' }, text, parts[0].element, parts[1].element, message, errors, parts[2].element);

  function update(state) {
    if (!state.dataset) return;
    text.textContent = app.t('capsule.settings.text');
    message.hidden = !state.capsuleMessage;
    message.textContent = state.capsuleMessage ? app.t(state.capsuleMessage.key, state.capsuleMessage.params) : '';
    errors.hidden = state.capsuleErrors.length === 0;
    errors.replaceChildren(...state.capsuleErrors.map((code) => createElement('li', {}, app.t(`capsule.error.${code}`))));
    parts.forEach((part) => part.update(state));
  }

  return { element, update };
}