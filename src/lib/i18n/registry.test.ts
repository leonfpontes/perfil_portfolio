import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, isLocale, resolveInitialLocale } from './registry';

describe('resolveInitialLocale', () => {
  it('prioriza a preferência salva', () => {
    expect(resolveInitialLocale('en', ['pt-BR'])).toBe('en');
  });

  it('ignora preferência salva inválida', () => {
    expect(resolveInitialLocale('fr', ['pt-BR'])).toBe('pt-BR');
  });

  it('usa inglês para navegadores em inglês', () => {
    expect(resolveInitialLocale(null, ['en-US', 'en'])).toBe('en');
  });

  it('usa o padrão para idiomas não suportados ou lista vazia', () => {
    expect(resolveInitialLocale(null, ['de-DE'])).toBe(DEFAULT_LOCALE);
    expect(resolveInitialLocale(null, [])).toBe(DEFAULT_LOCALE);
  });

  it('valida códigos de idioma', () => {
    expect(isLocale('pt-BR')).toBe(true);
    expect(isLocale('es')).toBe(false);
  });
});
