import { describe, expect, it } from 'vitest';
import { createNoise } from './noise';

describe('createNoise', () => {
  it('é determinístico para a mesma semente', () => {
    const a = createNoise('plantmap');
    const b = createNoise('plantmap');
    for (let i = 0; i < 50; i++) {
      const x = i * 0.37;
      const y = i * 0.11;
      expect(a(x, y, i * 0.05)).toBe(b(x, y, i * 0.05));
    }
  });

  it('muda com a semente', () => {
    const a = createNoise(1);
    const b = createNoise(2);
    const diff = Array.from({ length: 20 }, (_, i) => a(i * 0.5 + 0.1, 0.3) !== b(i * 0.5 + 0.1, 0.3));
    expect(diff.some(Boolean)).toBe(true);
  });

  it('fica em [-1, 1] e varia de forma contínua', () => {
    const n = createNoise('range');
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < 5000; i++) {
      const v = n(Math.sin(i) * 40, Math.cos(i * 1.3) * 40, i * 0.01);
      expect(Number.isFinite(v)).toBe(true);
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
    expect(min).toBeGreaterThanOrEqual(-1);
    expect(max).toBeLessThanOrEqual(1);
    expect(max - min).toBeGreaterThan(0.8);
    expect(Math.abs(n(1, 1) - n(1.001, 1))).toBeLessThan(0.05);
  });
});
