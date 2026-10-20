import { describe, expect, it } from 'vitest';
import { contentByLocale } from '@/lib/i18n/registry';
import { en } from './locales/en';
import { ptBR } from './locales/pt-BR';
import { PAGE_SECTIONS } from '@/lib/router/routes';
import { sectionCount, sectionNumber } from './sections';

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

  it('toda página com conteúdo termina no contato (o item "Contato" do menu é uma âncora)', () => {
    for (const page of ['home', 'mentoring', 'diagnostic', 'about'] as const) {
      expect(PAGE_SECTIONS[page].at(-1)).toBe('contato');
    }
  });

  it('numera seções com dois dígitos, por página', () => {
    expect(sectionNumber('home', 'ofertas')).toBe('01');
    expect(sectionNumber('about', 'sobre')).toBe('01');
    expect(sectionNumber('home', 'contato')).toBe(String(sectionCount('home')).padStart(2, '0'));
    expect(sectionNumber('home', 'inicio')).toBe('');
  });

  it('o diagnóstico custa R$ 7.500 (fundador) e R$ 12.000 (cheio) nos dois idiomas, sem os preços antigos', () => {
    const plan = (c: typeof ptBR) => c.offer.plans.find((p) => p.id === 'diagnostic')!;
    expect([plan(ptBR).price, plan(ptBR).regularPrice]).toEqual(['R$ 7.500', 'Depois: R$ 12.000']);
    expect([plan(en).price, plan(en).regularPrice]).toEqual(['R$ 7,500', 'Later: R$ 12,000']);
    for (const content of Object.values(contentByLocale)) {
      expect(JSON.stringify(content)).not.toMatch(/R\$ ?(2|3)[.,]500/);
    }
  });

  // Regra de comunicação da mentoria: cases de clientes aparecem generalizados.
  it.each(['Sofisa', 'Porto Seguro', 'Porto '])('não cita o cliente confidencial "%s"', (term) => {
    for (const content of Object.values(contentByLocale)) {
      expect(JSON.stringify(content)).not.toContain(term);
    }
  });
});
