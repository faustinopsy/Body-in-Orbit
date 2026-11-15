import { createElement } from '../../ui/createElement.js';
import { createStepInput } from './createStepInput.js';
import { createOptionsInput } from './createOptionsInput.js';
import { createHeartSensorPanel } from '../heartSensor/createHeartSensorPanel.js';

export function createQuestion(app, question) {
  const legend = createElement('legend', { class: 'question__text' });
  const hint = createElement('p', { class: 'question__hint' });
  const input = question.type === 'step' ? createStepInput(app, question) : createOptionsInput(app, question);
  const sensor = question.sensor === 'heartRate' ? createHeartSensorPanel(app) : null;
  const element = createElement('fieldset', { class: 'question', 'data-question': question.id }, legend, input.element, hint);
  if (sensor) element.append(sensor.element);

  function update(state, answers) {
    legend.textContent = app.t(`today.q.${question.id}`);
    hint.textContent = app.t(`today.h.${question.id}`);
    element.toggleAttribute('data-invalid', state.todayErrors.includes(question.id));
    input.update(state, answers[question.id]);
    sensor?.update(state);
  }

  return { element, update };
}