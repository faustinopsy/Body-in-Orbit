import { createElement } from '../../ui/createElement.js';
import { createChoiceGroup } from '../../ui/createChoiceGroup.js';
import { MISSION_TYPES, missionTypeById } from '../../domain/missions/missionTypes.js';
import { MISSION_ICONS } from './missionIcons.js';

function field(control) {
  const label = createElement('label', { class: 'form__field' }, createElement('span', { class: 'form__label' }), control);
  return { label, text: label.firstChild, control };
}

function setValue(control, value) {
  if (document.activeElement !== control && control.value !== String(value)) control.value = String(value);
}

export function createMissionForm(app) {
  const name = field(createElement('input', { type: 'text', maxlength: 60, name: 'missionName' }));
  const types = createChoiceGroup({
    name: 'missionType',
    choices: MISSION_TYPES.map((type) => ({ value: type.id, icon: MISSION_ICONS[type.id] })),
    onChoose: (typeId) => app.commands.updateMissionDraft({ typeId }),
  });
  const typeText = createElement('span', { class: 'form__label' });
  const duration = field(createElement('input', { type: 'number', step: 1, name: 'missionDays' }));
  const legend = createElement('legend');
  const element = createElement('fieldset', { class: 'form mission-form' }, legend, name.label, createElement('div', { class: 'form__field' }, typeText, types.element), duration.label);
  name.control.addEventListener('input', () => app.commands.updateMissionDraft({ name: name.control.value }));
  duration.control.addEventListener('change', () => app.commands.updateMissionDraft({ durationDays: Number(duration.control.value) }));

  function update(state) {
    const draft = state.missionDraft;
    const selected = missionTypeById(draft.typeId);
    legend.textContent = app.t('mission.legend');
    name.text.textContent = app.t('mission.name');
    typeText.textContent = app.t('mission.type');
    duration.text.textContent = app.t('mission.days', { min: selected.minDays, max: selected.maxDays });
    types.update({
      selected: draft.typeId,
      label: app.t('mission.type'),
      labelOf: (typeId) => app.t(`missionType.${typeId}`),
      detailOf: (typeId) => `${missionTypeById(typeId).minDays}-${missionTypeById(typeId).maxDays} d`,
    });
    duration.control.min = String(selected.minDays);
    duration.control.max = String(selected.maxDays);
    setValue(name.control, draft.name);
    setValue(duration.control, draft.durationDays);
  }

  return { element, update };
}