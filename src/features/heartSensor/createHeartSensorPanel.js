import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { REST_RULES } from '../../domain/heartRate/restMeasurement.js';
import { HEART_IDLE } from '../../app/heartSession.js';
import { DEMO_SPEED } from '../../app/adapters/simulatedHeartSensor.js';
import './heartSensor.css';

const SHOWN = {
  idle: ['intro', 'connect'],
  connecting: ['status', 'disconnect'],
  connected: ['status', 'live', 'steps', 'start', 'disconnect'],
  measuring: ['status', 'live', 'progress', 'cancel'],
  ready: ['result', 'use', 'start', 'disconnect'],
  error: ['connect'],
};
const STEPS = ['sit', 'still', 'breathe', 'wait'];

function createParts() {
  const button = (name, primary = false) => createElement('button', { type: 'button', class: `button${primary ? ' button--primary' : ''} heart-sensor__${name}` });
  return {
    intro: createElement('p', { class: 'heart-sensor__intro' }),
    status: createElement('p', { class: 'heart-sensor__status', role: 'status' }),
    live: createElement('p', { class: 'heart-sensor__live', 'aria-live': 'off' }),
    steps: createElement('ol', { class: 'heart-sensor__steps' }, ...STEPS.map((step) => createElement('li', { 'data-step': step }))),
    progress: createElement('progress', { class: 'heart-sensor__progress', max: REST_RULES.durationSeconds, value: 0 }),
    result: createElement('p', { class: 'heart-sensor__result' }),
    error: createElement('p', { class: 'heart-sensor__error', role: 'alert' }),
    used: createElement('p', { class: 'heart-sensor__used', role: 'status' }),
    connect: button('connect', true),
    start: button('start', true),
    cancel: button('cancel'),
    use: button('use', true),
    disconnect: button('disconnect'),
  };
}

function bindParts(app, parts) {
  parts.connect.addEventListener('click', () => app.commands.connectHeartSensor());
  parts.start.addEventListener('click', () => app.commands.startHeartMeasurement());
  parts.cancel.addEventListener('click', () => app.commands.cancelHeartMeasurement());
  parts.use.addEventListener('click', () => app.commands.useHeartReading());
  parts.disconnect.addEventListener('click', () => app.commands.disconnectHeartSensor());
}

function statusText(app, heart) {
  const total = REST_RULES.durationSeconds;
  if (heart.phase === 'connecting') return app.t(heart.simulated ? 'heart.status.connectingDemo' : 'heart.status.connecting');
  if (heart.phase === 'measuring') return app.t('heart.status.measuring', { seconds: heart.seconds, total });
  return app.t('heart.status.connected', { device: heart.device ?? app.t('heart.noName') });
}

function liveText(app, heart) {
  if (heart.bpm === null) return app.t('heart.waiting');
  return app.t(`heart.live.${heart.contact}`, { bpm: heart.bpm });
}

function writeTexts(app, parts, heart) {
  parts.intro.textContent = app.t('heart.intro');
  parts.status.textContent = statusText(app, heart);
  parts.live.textContent = liveText(app, heart);
  parts.live.toggleAttribute('data-warning', heart.contact === 'no');
  parts.steps.querySelectorAll('li').forEach((item) => {
    item.textContent = app.t(`heart.step.${item.dataset.step}`, { minutes: REST_RULES.durationSeconds / 60 });
  });
  parts.progress.value = heart.seconds;
  parts.result.textContent = heart.result ? app.t('heart.result', heart.result) : '';
  parts.error.textContent = heart.errorKey ? app.t(heart.errorKey) : '';
  parts.used.textContent = heart.usedBpm === null ? '' : app.t('heart.used', { bpm: heart.usedBpm });
}

function writeButtons(app, parts, heart) {
  parts.connect.replaceChildren(createIcon('heart', 16), app.t(heart.phase === 'error' ? 'heart.retry' : 'heart.connect'));
  parts.start.textContent = app.t(heart.phase === 'ready' ? 'heart.again' : 'heart.start', { minutes: REST_RULES.durationSeconds / 60 });
  parts.cancel.textContent = app.t('heart.cancel');
  parts.use.textContent = heart.result ? app.t('heart.use', { bpm: heart.result.bpm }) : '';
  parts.disconnect.textContent = app.t('heart.disconnect');
}

export function createHeartSensorPanel(app) {
  const parts = createParts();
  const { connect, start, cancel, use, disconnect, ...texts } = parts;
  const badge = createElement('p', { class: 'heart-sensor__badge' });
  const actions = createElement('div', { class: 'heart-sensor__actions' }, connect, start, cancel, use, disconnect);
  const element = createElement('div', { class: 'heart-sensor', 'data-phase': 'idle' }, badge, ...Object.values(texts), actions);
  bindParts(app, parts);

  function update(state) {
    const heart = state.heartSensor.crewId === state.crewId ? state.heartSensor : HEART_IDLE;
    const shown = SHOWN[heart.phase];
    element.dataset.phase = heart.phase;
    Object.entries(parts).forEach(([name, part]) => {
      part.hidden = !shown.includes(name);
    });
    parts.error.hidden = !heart.errorKey;
    parts.used.hidden = heart.usedBpm === null || heart.phase !== 'idle';
    badge.hidden = !heart.simulated && !state.dataset?.demo;
    badge.textContent = app.t('heart.demo', { seconds: REST_RULES.durationSeconds / DEMO_SPEED });
    writeTexts(app, parts, heart);
    writeButtons(app, parts, heart);
  }

  return { element, update };
}