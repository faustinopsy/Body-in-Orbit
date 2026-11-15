export const HEART_IDLE = Object.freeze({ phase: 'idle', crewId: null, simulated: false, device: null, bpm: null, contact: null, seconds: 0, result: null, errorKey: null, usedBpm: null });

const sessions = new WeakMap();

export function heartSessionOf(app) {
  if (!sessions.has(app)) sessions.set(app, { sensor: null, samples: [], startedAt: 0 });
  return sessions.get(app);
}

export function patchHeart(app, patch) {
  app.store.update({ heartSensor: { ...app.store.getState().heartSensor, ...patch } });
}

export function stopHeart(app, patch = {}) {
  const session = heartSessionOf(app);
  session.sensor?.disconnect();
  session.sensor = null;
  session.samples = [];
  const { crewId } = app.store.getState().heartSensor;
  app.store.update({ heartSensor: { ...HEART_IDLE, crewId, ...patch } });
}