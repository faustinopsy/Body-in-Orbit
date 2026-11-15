import { createElement } from '../../ui/createElement.js';
import { ITEM_KINDS } from '../../domain/capsule/unlockRules.js';

function field(control, className = '') {
  const text = createElement('span', { class: 'capsule-form__label' });
  return { control, text, element: createElement('label', { class: `capsule-form__field ${className}` }, text, control) };
}

export function createItemForm(app) {
  const crew = field(createElement('select', { name: 'capsuleCrew', class: 'capsule-form__input' }));
  const kind = field(createElement('select', { name: 'capsuleKind', class: 'capsule-form__input' }, ...ITEM_KINDS.map((value) => createElement('option', { value }))));
  const title = field(createElement('input', { type: 'text', name: 'capsuleTitle', maxlength: 80, class: 'capsule-form__input' }));
  const from = field(createElement('input', { type: 'text', name: 'capsuleFrom', maxlength: 60, class: 'capsule-form__input' }));
  const text = field(createElement('textarea', { name: 'capsuleText', rows: 3, maxlength: 600, class: 'capsule-form__input' }), 'capsule-form__wide');
  const file = field(createElement('input', { type: 'file', name: 'capsuleFile', accept: 'image/*', class: 'capsule-form__input' }), 'capsule-form__wide');
  const add = createElement('button', { type: 'button', class: 'button button--primary capsule-form__add' });
  const fields = { crew, kind, title, from, text, file };
  const element = createElement('div', { class: 'capsule-form' }, ...Object.values(fields).map((item) => item.element), add);
  kind.control.addEventListener('change', () => {
    file.element.hidden = kind.control.value !== 'image';
  });
  add.addEventListener('click', async () => {
    const values = { crewId: crew.control.value, kind: kind.control.value, title: title.control.value, from: from.control.value, text: text.control.value, file: file.control.files?.[0] ?? null };
    await app.commands.addCapsuleItem(values);
    if (app.store.getState().capsuleErrors.length === 0) [title, text, file].forEach((item) => (item.control.value = ''));
  });

  function update(state) {
    const chosen = crew.control.value;
    crew.control.replaceChildren(...state.dataset.crew.map(({ id }) => createElement('option', { value: id }, id)));
    if (chosen) crew.control.value = chosen;
    [...kind.control.options].forEach((option) => (option.textContent = app.t(`capsule.kind.${option.value}`)));
    Object.entries(fields).forEach(([name, item]) => (item.text.textContent = app.t(`capsule.field.${name}`)));
    text.text.textContent = app.t(kind.control.value === 'image' ? 'capsule.field.caption' : 'capsule.field.text');
    file.element.hidden = kind.control.value !== 'image';
    add.textContent = app.t('capsule.add');
  }

  return { element, update };
}