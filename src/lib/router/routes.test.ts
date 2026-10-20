import { describe, expect, it } from 'vitest';
import { isSitePath, LEGACY_ANCHORS, normalizePath, PAGE_SECTIONS, resolvePage } from './routes';

describe('rotas', () => {
  it.each([
    ['/', 'home'],
    ['/index.html', 'home'],
    ['/mentoria-produto', 'mentoring'],
    ['/mentoria-produto/', 'mentoring'],
    ['/diagnostico-pmo.html', 'diagnostic'],
    ['/sobre?utm=x#formacao', 'about'],
    ['/404', 'notFound'],
    ['/cases', 'notFound'],
  ])('%s → %s', (path, page) => {
    expect(resolvePage(path)).toBe(page);
  });

  it('normaliza barra final e .html', () => {
    expect(normalizePath('/sobre/')).toBe('/sobre');
    expect(normalizePath('/sobre.html')).toBe('/sobre');
    expect(normalizePath('')).toBe('/');
  });

  it('a Área do cliente é outro documento: o roteador não a intercepta', () => {
    expect(isSitePath('/entrar')).toBe(false);
    expect(isSitePath('/sobre')).toBe(true);
  });

  it('âncoras antigas levam a seções que existem na página nova', () => {
    for (const target of Object.values(LEGACY_ANCHORS)) {
      expect(PAGE_SECTIONS[target!.page]).toContain(target!.hash);
    }
  });
});
