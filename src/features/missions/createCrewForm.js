import { createElement } from '../../ui/createElement.js';
import { CREW_ROLES, MEMBER_LIMITS } from '../../domain/missions/validateMission.js';

const NUMBER_FIELDS = ['age', 'weightKg', 'heightCm'];

function numberField(fieldId) {
  const [min, max] = MEMBER_LIMITS[fieldId];
  const control = createElement('input', { type: 'number', min, max, step: 1, name: fieldId });
  const text = createElement('span', { class: 'form__label' });
  return { fieldId, control, text, label: createElement('label', { class: 'form__field' }, text, control) };
}

export function createCrewForm(app) {
  const options = CREW_ROLES.map((role) => createElement('option', { value: role }));
  const role = createElement('select', { name: 'role' }, ...options);
  const roleText = createElement('span', { class: 'form__label' });
  const numbers = NUMBER_FIELDS.map(numberField);
  const add = createElement('button', { type: 'button', class: 'button crew-form__add' });
  const legend = createElement('legend');
  const element = createElement(
    'fieldset',
    { class: 'form crew-form' },
    legend,
    createElement('label', { class: 'form__field' }, roleText, role),
    ...numbers.map((item) => item.label),
    add,
  );
  add.addEventListener('click', () => {
    const values = Object.fromEntries(numbers.map((item) => [item.fieldId, Number(item.control.value)]));
    app.commands.addCrewMember({ role: role.value, ...values });
  });

  function update(state) {
    legend.textContent = app.t('crew.legend', { count: state.missionDraft.crew.length });
    roleText.textContent = app.t('crew.role');
    options.forEach((option) => { option.textContent = app.t(`role.${option.value}`); });
    numbers.forEach((item) => {
      const [min, max] = MEMBER_LIMITS[item.fieldId];
      item.text.textContent = app.t(`crew.${item.fieldId}`, { min, max });
    });
    add.textContent = app.t('crew.add');
  }

  return { element, update };
}