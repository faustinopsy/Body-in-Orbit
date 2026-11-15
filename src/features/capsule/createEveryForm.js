import { createElement } from '../../ui/createElement.js';
import { unlockEvery } from '../../domain/capsule/unlockRules.js';

export function createEveryForm(app) {
  const text = createElement('span', { class: 'capsule-form__label' });
  const control = createElement('input', { type: 'number', min: 1, max: 30, step: 1, name: 'capsuleEvery', class: 'capsule-form__input' });
  const save = createElement('button', { type: 'button', class: 'button capsule-every__save' });
  const element = createElement('div', { class: 'capsule-every' }, createElement('label', { class: 'capsule-form__field' }, text, control), save);
  save.addEventListener('click', () => app.commands.setUnlockEvery(Number(control.value)));

  function update(state) {
    text.textContent = app.t('capsule.every');
    save.textContent = app.t('capsule.everySave');
    if (document.activeElement !== control) control.value = String(unlockEvery(state.dataset));
  }

  return { element, update };
}