import { createElement } from '../../ui/createElement.js';
import { MISSION_TYPES, missionTypeById } from '../../domain/missions/missionTypes.js';

function field(control) {
  const label = createElement('label', { class: 'form__field' }, createElement('span', { class: 'form__label' }), control);
  return { label, text: label.firstChild, control };
}

function setValue(control, value) {
  if (document.activeElement !== control && control.value !== String(value)) control.value = String(value);
}

export function createMissionForm(app) {
  const name = field(createElement('input', { type: 'text', maxlength: 60, name: 'missionName' }));
  const options = MISSION_TYPES.map((type) => createElement('option', { value: type.id }));
  const type = field(createElement('select', { name: 'missionType' }, ...options));
  const duration = field(createElement('input', { type: 'number', step: 1, name: 'missionDays' }));
  const element = createElement('fieldset', { class: 'form mission-form' }, createElement('legend'), name.label, type.label, duration.label);
  name.control.addEventListener('input', () => app.commands.updateMissionDraft({ name: name.control.value }));
  type.control.addEventListener('change', () => app.commands.updateMissionDraft({ typeId: type.control.value }));
  duration.control.addEventListener('change', () => app.commands.updateMissionDraft({ durationDays: Number(duration.control.value) }));

  function update(state) {
    const draft = state.missionDraft;
    const selected = missionTypeById(draft.typeId);
    element.querySelector('legend').textContent = app.t('mission.legend');
    name.text.textContent = app.t('mission.name');
    type.text.textContent = app.t('mission.type');
    duration.text.textContent = app.t('mission.days', { min: selected.minDays, max: selected.maxDays });
    options.forEach((option) => {
      const item = missionTypeById(option.value);
      option.textContent = `${app.t(`missionType.${item.id}`)} (${item.minDays}-${item.maxDays} d)`;
    });
    duration.control.min = String(selected.minDays);
    duration.control.max = String(selected.maxDays);
    setValue(name.control, draft.name);
    setValue(type.control, draft.typeId);
    setValue(duration.control, draft.durationDays);
  }

  return { element, update };
}