import { createElement } from './createElement.js';
import { createIcon } from './icons.js';

function createChoice(choice, onChoose) {
  const label = createElement('span', { class: 'choice__label' });
  const detail = createElement('span', { class: 'choice__detail' });
  const text = createElement('span', { class: 'choice__text' }, label, detail);
  const button = createElement('button', { type: 'button', class: 'choice', 'data-choice': choice.value }, createIcon(choice.icon), text);
  button.addEventListener('click', () => onChoose(choice.value));
  return { value: choice.value, button, label, detail };
}

export function createChoiceGroup({ name, choices, onChoose }) {
  const items = choices.map((choice) => createChoice(choice, onChoose));
  const element = createElement('div', { class: 'choices', role: 'group', 'data-group': name }, ...items.map((item) => item.button));

  function update({ selected, label, labelOf, detailOf = () => '' }) {
    element.setAttribute('aria-label', label);
    items.forEach((item) => {
      item.label.textContent = labelOf(item.value);
      item.detail.textContent = detailOf(item.value);
      item.detail.hidden = item.detail.textContent === '';
      item.button.setAttribute('aria-pressed', String(item.value === selected));
    });
  }

  return { element, update };
}