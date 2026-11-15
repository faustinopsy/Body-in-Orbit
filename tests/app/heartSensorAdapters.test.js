import { describe, expect, it, vi } from 'vitest';
import { createBluetoothHeartSensor, errorCodeOf } from '../../src/app/adapters/bluetoothHeartSensor.js';
import { createSimulatedHeartSensor, demoBpm } from '../../src/app/adapters/simulatedHeartSensor.js';

function fakeBluetooth() {
  const characteristic = new EventTarget();
  characteristic.startNotifications = vi.fn(async () => {});
  characteristic.stopNotifications = vi.fn(async () => {});
  const service = { getCharacteristic: async () => characteristic };
  const device = Object.assign(new EventTarget(), { name: 'Strap', gatt: { connected: true, connect: async () => ({ getPrimaryService: async () => service }), disconnect: vi.fn() } });
  const bluetooth = { requestDevice: vi.fn(async () => device) };
  const send = (bytes) => {
    const event = new Event('characteristicvaluechanged');
    Object.defineProperty(event, 'target', { value: { value: new DataView(new Uint8Array(bytes).buffer) } });
    characteristic.dispatchEvent(event);
  };
  return { bluetooth, device, send };
}

describe('bluetooth heart sensor', () => {
  it('asks for the heart rate service and passes readings on', async () => {
    const fake = fakeBluetooth();
    const sensor = createBluetoothHeartSensor(fake.bluetooth);
    const readings = [];
    await expect(sensor.connect({ onReading: (reading) => readings.push(reading), onLost: () => {} })).resolves.toEqual({ name: 'Strap' });
    expect(fake.bluetooth.requestDevice).toHaveBeenCalledWith({ filters: [{ services: ['heart_rate'] }] });
    fake.send([0x06, 61]);
    expect(readings).toEqual([{ bpm: 61, contact: 'yes' }]);
    sensor.disconnect();
    expect(fake.device.gatt.disconnect).toHaveBeenCalled();
  });

  it('reports a browser without Web Bluetooth', async () => {
    const sensor = createBluetoothHeartSensor(undefined);
    expect(sensor.supported()).toBe(false);
    await expect(sensor.connect({})).rejects.toMatchObject({ code: 'unsupported' });
  });

  it('turns browser errors into codes', () => {
    expect(errorCodeOf({ name: 'NotFoundError', message: 'User cancelled' })).toBe('notFound');
    expect(errorCodeOf({ name: 'NotFoundError', message: 'Bluetooth adapter not available.' })).toBe('noAdapter');
    expect(errorCodeOf({ name: 'SecurityError' })).toBe('denied');
    expect(errorCodeOf({ name: 'NetworkError' })).toBe('connection');
  });
});

describe('simulated heart sensor', () => {
  it('settles on the target and runs ten times faster', async () => {
    let time = 1000;
    let tick = null;
    const sensor = createSimulatedHeartSensor({ clock: () => time, every: (fn) => (tick = fn), stop: () => {} });
    const readings = [];
    await sensor.connect({ onReading: (reading) => readings.push(reading), target: 58 });
    for (let index = 0; index < 20; index += 1) tick();
    time += 1000;
    expect(sensor.now()).toBe(11000);
    expect(readings[0].bpm).toBeGreaterThan(70);
    expect(Math.abs(readings[19].bpm - 58)).toBeLessThanOrEqual(2);
    expect(demoBpm(40, 58)).toBeLessThanOrEqual(60);
  });
});