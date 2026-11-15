import { describe, expect, it, vi } from 'vitest';
import { createTabs } from '../../src/ui/createTabs.js';

function setup() {
  const onSelect = vi.fn();
  const tabs = createTabs({ name: 'demo', ids: ['one', 'two', 'three'], onSelect });
  document.body.replaceChildren(tabs.element);
  tabs.update({ selected: 'one', label: 'Demo', labelOf: (id) => id.toUpperCase(), disabled: (id) => id === 'three' });
  return { tabs, onSelect, buttons: [...tabs.element.querySelectorAll('[role="tab"]')] };
}

describe('createTabs', () => {
  it('marks the selected tab and disables the locked ones', () => {
    const { buttons } = setup();
    expect(buttons.map((button) => button.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect(buttons[2].disabled).toBe(true);
    expect(buttons[0].textContent).toBe('ONE');
  });

  it('moves with the arrow keys and skips disabled tabs', () => {
    const { tabs, onSelect, buttons } = setup();
    buttons[0].focus();
    tabs.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(onSelect).toHaveBeenLastCalledWith('two');
    buttons[1].focus();
    tabs.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(onSelect).toHaveBeenLastCalledWith('one');
  });
});