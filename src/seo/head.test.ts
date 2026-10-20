import { describe, expect, it } from 'vitest';
import { en } from '@/content/locales/en';
import { ptBR } from '@/content/locales/pt-BR';
import { canonicalUrl, priceValue, structuredData } from './head';

type Node = Record<string, unknown> & { '@type': string };
const graph = (page: Parameters<typeof structuredData>[1]) => (structuredData(ptBR, page)!['@graph'] as Node[]);
const ofType = (nodes: Node[], type: string) => nodes.filter((n) => n['@type'] === type);

describe('SEO', () => {
  it('lê o valor dos preços nos dois formatos', () => {
    expect(priceValue('R$ 7.500')).toBe(7500);
    expect(priceValue('Depois: R$ 1.497/mês')).toBe(1497);
    expect(priceValue('Later: R$ 12,000')).toBe(12000);
    expect(priceValue('R$ 997')).toBe(997);
  });

  it('canônicas sem barra final, exceto a raiz', () => {
    expect(canonicalUrl('home')).toBe('https://www.leopontes.com.br/');
    expect(canonicalUrl('about')).toBe('https://www.leopontes.com.br/sobre');
  });

  it('Person com o posicionamento de mentor/consultor e o negócio como ProfessionalService', () => {
    const nodes = graph('home');
    expect(ofType(nodes, 'Person')[0]!.jobTitle).toMatch(/mentor/i);
    const business = ofType(nodes, 'ProfessionalService')[0]!;
    expect(business.priceRange).toBe('R$ 997 – R$ 12.000');
  });

  it('o diagnóstico anuncia as ofertas reais: R$ 7.500 (3 vagas fundador) e R$ 12.000', () => {
    const [service] = ofType(graph('diagnostic'), 'Service');
    const offers = service!.offers as Node[];
    expect(offers.map((o) => o.price)).toEqual([7500, 12000]);
    expect(offers.every((o) => o.priceCurrency === 'BRL')).toBe(true);
    expect((offers[0]!.inventoryLevel as Node).value).toBe(3);
  });

  it('a mentoria é mensal: R$ 997 (fundador) e R$ 1.497', () => {
    const [service] = ofType(graph('mentoring'), 'Service');
    const offers = service!.offers as Node[];
    expect(offers.map((o) => o.price)).toEqual([997, 1497]);
    expect((offers[0]!.priceSpecification as Node).billingDuration).toBe('P1M');
  });

  it('FAQPage só onde há perguntas visíveis, com as perguntas da página', () => {
    expect(ofType(graph('home'), 'FAQPage')).toHaveLength(0);
    expect(ofType(graph('about'), 'FAQPage')).toHaveLength(0);
    const faq = ofType(graph('diagnostic'), 'FAQPage')[0]!;
    expect((faq.mainEntity as Node[]).map((q) => q.name)).toEqual(ptBR.diagnosticPage.faq.items.map((i) => i.question));
  });

  it('a 404 não tem dados estruturados; o inglês também gera o grafo', () => {
    expect(structuredData(ptBR, 'notFound')).toBeNull();
    expect(structuredData(en, 'mentoring')).not.toBeNull();
  });
});
