import { describe, expect, it } from 'vitest';
import { buildMediaQueries, isGentleMode } from './motionPreference';

describe('preferência de movimento', () => {
  it('modo suave: só quando o sistema pede e o visitante não pediu "completo"', () => {
    expect(isGentleMode('system', true)).toBe(true);
    expect(isGentleMode('system', false)).toBe(false);
    expect(isGentleMode('full', true)).toBe(false);
    expect(isGentleMode('reduced', false)).toBe(true);
  });

  it('"completo" remove a cláusula de prefers-reduced-motion das consultas', () => {
    const q = buildMediaQueries('full');
    expect(q.motion).toBe('all');
    expect(q.desktop).toBe('(min-width: 1024px)');
    expect(q.mobile).not.toContain('prefers-reduced-motion');
  });

  it('"reduzido" faz as consultas de movimento nunca casarem, mas mantém as suaves', () => {
    const q = buildMediaQueries('reduced');
    expect(q.motion).toBe('not all');
    expect(q.desktop).toBe('not all');
    expect(q.wide).toBe('(min-width: 1024px)');
  });

  it('"sistema" depende do prefers-reduced-motion', () => {
    expect(buildMediaQueries('system').desktop).toContain('prefers-reduced-motion: no-preference');
  });
});
