const OWASP_ITERATIONS = 600000;
const encoder = new TextEncoder();

const toHex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const fromHex = (hex) => new Uint8Array(hex.match(/../g).map((pair) => Number.parseInt(pair, 16)));

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return toHex(bits);
}

function sameText(first, second) {
  let difference = first.length ^ second.length;
  for (let index = 0; index < Math.min(first.length, second.length); index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return difference === 0;
}

export function createPasswordHasher(iterations = OWASP_ITERATIONS) {
  return {
    async hash(password) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      return { salt: toHex(salt), iterations, hash: await derive(password, salt, iterations) };
    },
    async verify(password, record) {
      if (!record) return false;
      return sameText(await derive(password, fromHex(record.salt), record.iterations), record.hash);
    },
  };
}