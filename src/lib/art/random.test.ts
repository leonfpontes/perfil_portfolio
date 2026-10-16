import { describe, expect, it } from 'vitest';
import { createRandom, hashSeed } from './random';

describe('createRandom', () => {
  it('é determinístico para a mesma semente', () => {
    const a = createRandom('girahub');
    const b = createRandom('girahub');
    const seqA = Array.from({ length: 20 }, () => a.next());
    const seqB = Array.from({ length: 20 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('gera sequências diferentes para sementes diferentes', () => {
    expect(createRandom('a').next()).not.toBe(createRandom('b').next());
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
  });

  it('respeita os intervalos de range, int e pick', () => {
    const r = createRandom(42);
    const items = ['x', 'y', 'z'] as const;
    for (let i = 0; i < 1000; i++) {
      const n = r.next();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
      const f = r.range(-5, 5);
      expect(f).toBeGreaterThanOrEqual(-5);
      expect(f).toBeLessThan(5);
      const k = r.int(1, 6);
      expect(Number.isInteger(k)).toBe(true);
      expect(k).toBeGreaterThanOrEqual(1);
      expect(k).toBeLessThanOrEqual(6);
      expect(items).toContain(r.pick(items));
    }
  });

  it('pick falha em lista vazia', () => {
    expect(() => createRandom(1).pick([])).toThrow();
  });
});
