import { createElement } from './createElement.js';
import './tabs.css';

const STEP = { ArrowRight: 1, ArrowLeft: -1 };

export function createTabs({ name, ids, onSelect }) {
  const buttons = ids.map((id) => {
    const button = createElement('button', { type: 'button', class: 'tab', role: 'tab', 'data-tab': id });
    button.addEventListener('click', () => onSelect(id));
    return button;
  });
  const element = createElement('div', { class: 'tabs', role: 'tablist', 'data-tabs': name }, ...buttons);

  element.addEventListener('keydown', (event) => {
    const enabled = buttons.filter((button) => !button.disabled);
    const index = enabled.indexOf(document.activeElement);
    if (!(event.key in STEP) || index === -1) return;
    const next = enabled[(index + STEP[event.key] + enabled.length) % enabled.length];
    next.focus();
    onSelect(next.dataset.tab);
  });

  function update({ selected, label, labelOf, disabled = () => false }) {
    element.setAttribute('aria-label', label);
    buttons.forEach((button) => {
      const id = button.dataset.tab;
      button.textContent = labelOf(id);
      button.disabled = disabled(id);
      button.setAttribute('aria-selected', String(id === selected));
      button.tabIndex = id === selected ? 0 : -1;
    });
  }

  return { element, update };
}