export function createRandom(seed) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
  const gaussian = () => {
    const first = Math.max(next(), 1e-12);
    return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * next());
  };
  return { next, gaussian };
}