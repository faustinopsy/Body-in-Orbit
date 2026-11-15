export const DEMO_SPEED = 10;
const SETTLE_READINGS = 14;
const DEFAULT_TARGET = 60;

export function demoBpm(index, target) {
  const settle = Math.max(0, SETTLE_READINGS - index);
  return Math.round(target + settle + 2 * Math.sin(index / 3));
}

export function createSimulatedHeartSensor({ speed = DEMO_SPEED, clock = () => Date.now(), every = setInterval, stop = clearInterval } = {}) {
  let timer = null;
  let origin = 0;

  function disconnect() {
    if (timer !== null) stop(timer);
    timer = null;
  }

  async function connect({ onReading, target = DEFAULT_TARGET }) {
    disconnect();
    origin = clock();
    let index = 0;
    timer = every(() => {
      onReading({ bpm: demoBpm(index, target), contact: 'yes' });
      index += 1;
    }, 1000 / speed);
    return { name: 'Demo HR sensor' };
  }

  return {
    supported: () => true,
    simulated: true,
    now: () => origin + (clock() - origin) * speed,
    connect,
    disconnect,
  };
}