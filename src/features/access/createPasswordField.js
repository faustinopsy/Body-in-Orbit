import { createElement } from '../../ui/createElement.js';

export function createPasswordField(name, autocomplete) {
  const text = createElement('span', { class: 'access__label' });
  const control = createElement('input', { type: 'password', name, autocomplete, class: 'access__input' });
  const element = createElement('label', { class: 'access__field' }, text, control);
  return { element, text, control };
}