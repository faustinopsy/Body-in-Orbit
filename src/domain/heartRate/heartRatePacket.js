export const MIN_BPM = 30;
export const MAX_BPM = 220;

const CONTACT_BY_BITS = { 2: 'no', 3: 'yes' };

export function parseHeartRatePacket(bytes) {
  if (!bytes || bytes.length < 2) return null;
  const flags = bytes[0];
  const wide = (flags & 0x01) !== 0;
  if (wide && bytes.length < 3) return null;
  const bpm = wide ? bytes[1] | (bytes[2] << 8) : bytes[1];
  const contact = CONTACT_BY_BITS[(flags >> 1) & 0x03] ?? 'unknown';
  return { bpm, contact };
}

export function validReading({ bpm, contact }) {
  return Number.isFinite(bpm) && bpm >= MIN_BPM && bpm <= MAX_BPM && contact !== 'no';
}