import { describe, expect, it, vi } from 'vitest';
import { createChoiceGroup } from '../../src/ui/createChoiceGroup.js';
import { createIcon, swapIcon } from '../../src/ui/icons.js';

const choices = [{ value: 'a', icon: 'sun' }, { value: 'b', icon: 'moon' }];

describe('createChoiceGroup', () => {
  it('draws one button with an icon and a label per choice', () => {
    const group = createChoiceGroup({ name: 'test', choices, onChoose: () => {} });
    group.update({ selected: 'b', label: 'Pick one', labelOf: (value) => value.toUpperCase() });
    const buttons = [...group.element.querySelectorAll('button')];
    expect(buttons.map((button) => button.textContent)).toEqual(['A', 'B']);
    expect(buttons[0].querySelector('svg.icon')).not.toBeNull();
    expect(buttons.map((button) => button.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
    expect(group.element.getAttribute('aria-label')).toBe('Pick one');
  });

  it('tells which choice was clicked', () => {
    const onChoose = vi.fn();
    const group = createChoiceGroup({ name: 'test', choices, onChoose });
    group.element.querySelector('[data-choice="a"]').dispatchEvent(new Event('click'));
    expect(onChoose).toHaveBeenCalledWith('a');
  });
});

describe('icons', () => {
  it('hides icons from screen readers and swaps them by name', () => {
    const icon = createIcon('sun');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    document.body.replaceChildren(icon);
    const next = swapIcon(icon, 'moon');
    expect(next.dataset.icon).toBe('moon');
    expect(document.body.firstChild).toBe(next);
    expect(swapIcon(next, 'moon')).toBe(next);
  });
});