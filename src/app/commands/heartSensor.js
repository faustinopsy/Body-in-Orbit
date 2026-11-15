import { REST_RULES, summarizeRest } from '../../domain/heartRate/restMeasurement.js';
import { errorCodeOf } from '../adapters/bluetoothHeartSensor.js';
import { currentAnswers } from '../checkInDraft.js';
import { heartSessionOf, patchHeart, stopHeart } from '../heartSession.js';

const ERROR_KEYS = ['unsupported', 'noAdapter', 'notFound', 'denied', 'connection', 'unknown'];
const errorKeyOf = (error) => {
  const code = errorCodeOf(error);
  return `heart.error.${ERROR_KEYS.includes(code) ? code : 'unknown'}`;
};
const CONNECTED = ['connected', 'ready'];

function finish(app, samples) {
  const result = summarizeRest(samples);
  if (result.ok) return patchHeart(app, { phase: 'ready', result, seconds: REST_RULES.durationSeconds });
  patchHeart(app, { phase: 'connected', seconds: 0, errorKey: `heart.error.${result.reason}` });
}

function receive(app, reading) {
  const state = app.store.getState();
  if (!state.user || state.heartSensor.crewId !== state.crewId) return stopHeart(app);
  const session = heartSessionOf(app);
  if (state.heartSensor.phase !== 'measuring') return patchHeart(app, reading);
  const t = (session.sensor.now() - session.startedAt) / 1000;
  session.samples.push({ t, ...reading });
  if (t >= REST_RULES.durationSeconds) return finish(app, session.samples);
  patchHeart(app, { ...reading, seconds: Math.floor(t) });
}

function lost(app) {
  if (app.store.getState().heartSensor.phase === 'idle') return;
  stopHeart(app, { phase: 'error', errorKey: 'heart.error.lost' });
}

export const connectHeartSensor = (app) => async () => {
  const state = app.store.getState();
  if (!state.dataset || !['idle', 'error'].includes(state.heartSensor.phase)) return;
  const sensor = state.dataset.demo ? app.services.demoHeartSensor : app.services.heartSensor;
  stopHeart(app);
  heartSessionOf(app).sensor = sensor;
  const target = currentAnswers(state).restingHeartRate;
  const pending = sensor.connect({ onReading: (reading) => receive(app, reading), onLost: () => lost(app), target });
  patchHeart(app, { phase: 'connecting', crewId: state.crewId, simulated: Boolean(sensor.simulated) });
  try {
    const info = await pending;
    patchHeart(app, { phase: 'connected', device: info.name });
  } catch (error) {
    stopHeart(app, { phase: 'error', errorKey: errorKeyOf(error) });
  }
};

export const startHeartMeasurement = (app) => () => {
  if (!CONNECTED.includes(app.store.getState().heartSensor.phase)) return;
  const session = heartSessionOf(app);
  session.samples = [];
  session.startedAt = session.sensor.now();
  patchHeart(app, { phase: 'measuring', seconds: 0, result: null, errorKey: null });
};

export const cancelHeartMeasurement = (app) => () => {
  if (app.store.getState().heartSensor.phase !== 'measuring') return;
  heartSessionOf(app).samples = [];
  patchHeart(app, { phase: 'connected', seconds: 0 });
};

export const useHeartReading = (app) => () => {
  const { heartSensor, crewId } = app.store.getState();
  if (heartSensor.phase !== 'ready' || heartSensor.crewId !== crewId) return;
  const { bpm } = heartSensor.result;
  stopHeart(app, { crewId, usedBpm: bpm });
  app.commands.updateCheckIn({ restingHeartRate: bpm });
};

export const disconnectHeartSensor = (app) => () => stopHeart(app);