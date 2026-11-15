import { parseHeartRatePacket } from '../../domain/heartRate/heartRatePacket.js';

const CONNECT_TIMEOUT_MS = 15000;

export function sensorError(code) {
  return Object.assign(new Error(code), { code });
}

const CODE_BY_NAME = { NotFoundError: 'notFound', SecurityError: 'denied', NotAllowedError: 'denied', NetworkError: 'connection' };

export function errorCodeOf(error) {
  if (error?.code) return error.code;
  if (/adapter/i.test(String(error?.message ?? ''))) return 'noAdapter';
  return CODE_BY_NAME[error?.name] ?? 'unknown';
}

function withTimeout(promise, ms) {
  let timer;
  const limit = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(sensorError('connection')), ms);
  });
  return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
}

function readingOf(event) {
  const view = event.target.value;
  return parseHeartRatePacket(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
}

export function createBluetoothHeartSensor(bluetooth = globalThis.navigator?.bluetooth, timeoutMs = CONNECT_TIMEOUT_MS) {
  let device = null;
  let characteristic = null;
  let handlers = null;

  const onValue = (event) => {
    const reading = readingOf(event);
    if (reading) handlers?.onReading(reading);
  };
  const onDisconnected = () => handlers?.onLost();

  async function subscribe() {
    const server = await withTimeout(device.gatt.connect(), timeoutMs);
    const service = await server.getPrimaryService('heart_rate');
    characteristic = await service.getCharacteristic('heart_rate_measurement');
    characteristic.addEventListener('characteristicvaluechanged', onValue);
    await characteristic.startNotifications();
    return { name: device.name || null };
  }

  function disconnect() {
    handlers = null;
    characteristic?.removeEventListener('characteristicvaluechanged', onValue);
    characteristic?.stopNotifications?.().catch(() => {});
    if (device?.gatt?.connected) device.gatt.disconnect();
    characteristic = null;
    device = null;
  }

  async function connect(nextHandlers) {
    if (!bluetooth) throw sensorError('unsupported');
    try {
      const chosen = bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });
      handlers = nextHandlers;
      device = await chosen;
      device.addEventListener('gattserverdisconnected', onDisconnected);
      return await subscribe();
    } catch (error) {
      disconnect();
      throw sensorError(errorCodeOf(error));
    }
  }

  return { supported: () => Boolean(bluetooth), now: () => Date.now(), connect, disconnect };
}