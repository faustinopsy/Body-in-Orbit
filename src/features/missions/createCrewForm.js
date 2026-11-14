import { createElement } from '../../ui/createElement.js';
import { createChoiceGroup } from '../../ui/createChoiceGroup.js';
import { CREW_ROLES, MEMBER_LIMITS } from '../../domain/missions/validateMission.js';
import { ROLE_ICONS } from './missionIcons.js';

const NUMBER_FIELDS = ['age', 'weightKg', 'heightCm'];

function numberField(fieldId) {
  const [min, max] = MEMBER_LIMITS[fieldId];
  const control = createElement('input', { type: 'number', min, max, step: 1, name: fieldId });
  const text = createElement('span', { class: 'form__label' });
  return { fieldId, control, text, label: createElement('label', { class: 'form__field' }, text, control) };
}

export function createCrewForm(app) {
  let role = CREW_ROLES[0];
  const roles = createChoiceGroup({
    name: 'role',
    choices: CREW_ROLES.map((value) => ({ value, icon: ROLE_ICONS[value] })),
    onChoose: (value) => {
      role = value;
      renderRoles();
    },
  });
  const roleText = createElement('span', { class: 'form__label' });
  const numbers = NUMBER_FIELDS.map(numberField);
  const add = createElement('button', { type: 'button', class: 'button crew-form__add' });
  const legend = createElement('legend');
  const element = createElement(
    'fieldset',
    { class: 'form crew-form' },
    legend,
    createElement('div', { class: 'form__field crew-form__roles' }, roleText, roles.element),
    ...numbers.map((item) => item.label),
    add,
  );
  add.addEventListener('click', () => {
    const values = Object.fromEntries(numbers.map((item) => [item.fieldId, Number(item.control.value)]));
    app.commands.addCrewMember({ role, ...values });
  });

  function renderRoles() {
    roles.update({ selected: role, label: app.t('crew.role'), labelOf: (value) => app.t(`role.${value}`) });
  }

  function update(state) {
    legend.textContent = app.t('crew.legend', { count: state.missionDraft.crew.length });
    roleText.textContent = app.t('crew.role');
    renderRoles();
    numbers.forEach((item) => {
      const [min, max] = MEMBER_LIMITS[item.fieldId];
      item.text.textContent = app.t(`crew.${item.fieldId}`, { min, max });
    });
    add.textContent = app.t('crew.add');
  }

  return { element, update };
}