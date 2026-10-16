import { describe, expect, it } from 'vitest';
import { contentByLocale } from '@/lib/i18n/registry';
import { en } from './locales/en';
import { ptBR } from './locales/pt-BR';
import { SECTION_ORDER, sectionNumber } from './sections';

/** Descreve a "forma" de um valor: chaves de objetos e tamanho de arrays, sem o texto. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, shape((value as Record<string, unknown>)[k])]),
    );
  }
  return typeof value;
}

/** Campos que não são texto traduzível e devem ser idênticos entre idiomas. */
const invariantKeys = new Set(['id', 'status', 'highlighted', 'href', 'inProgress']);
function invariants(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => invariants(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      invariantKeys.has(k) && typeof v !== 'object' ? [`${path}.${k}=${String(v)}`] : invariants(v, `${path}.${k}`),
    );
  }
  return [];
}

describe('conteúdo do site', () => {
  it('pt-BR e en têm exatamente a mesma estrutura', () => {
    const { locale: _a, ...pt } = ptBR;
    const { locale: _b, ...english } = en;
    expect(shape(english)).toEqual(shape(pt));
  });

  it('ids, status, links e flags são iguais entre idiomas', () => {
    expect(invariants(en)).toEqual(invariants(ptBR));
  });

  it('todo item de navegação aponta para uma seção numerada', () => {
    for (const content of Object.values(contentByLocale)) {
      for (const item of content.nav.items) {
        expect(SECTION_ORDER).toContain(item.id);
      }
    }
  });

  it('numera seções com dois dígitos', () => {
    expect(sectionNumber('mentoria')).toBe('01');
    expect(sectionNumber('contato')).toBe(String(SECTION_ORDER.length).padStart(2, '0'));
    expect(sectionNumber('inicio')).toBe('');
  });

  // Regra de comunicação da mentoria: cases de clientes aparecem generalizados.
  it.each(['Sofisa', 'Porto Seguro', 'Porto '])('não cita o cliente confidencial "%s"', (term) => {
    for (const content of Object.values(contentByLocale)) {
      expect(JSON.stringify(content)).not.toContain(term);
    }
  });
});
