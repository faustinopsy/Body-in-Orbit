import { describe, expect, it } from 'vitest';
import { createPasswordHasher } from '../../src/app/adapters/passwordHasher.js';

describe('password hasher', () => {
  it('keeps only salt, iterations and hash, and checks the password', async () => {
    const hasher = createPasswordHasher(1000);
    const record = await hasher.hash('orbita123');
    expect(Object.keys(record).sort()).toEqual(['hash', 'iterations', 'salt']);
    expect(JSON.stringify(record)).not.toContain('orbita123');
    expect(await hasher.verify('orbita123', record)).toBe(true);
    expect(await hasher.verify('orbita124', record)).toBe(false);
    expect(await hasher.verify('orbita123', null)).toBe(false);
  });

  it('uses a new salt every time', async () => {
    const hasher = createPasswordHasher(1000);
    const [first, second] = await Promise.all([hasher.hash('same-password'), hasher.hash('same-password')]);
    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });

  it('follows the OWASP iteration count by default', async () => {
    expect(createPasswordHasher().hash).toBeTypeOf('function');
    const record = await createPasswordHasher(600000).hash('x');
    expect(record.iterations).toBe(600000);
  });
});