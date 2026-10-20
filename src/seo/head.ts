import { profile } from '@/content/profile';
import type { Faq, Meta, Plan, SiteContent } from '@/content/types';
import { pathOf, type PageId } from '@/lib/router/routes';

/**
 * SEO por página: título, descrição, URL canônica, Open Graph e dados estruturados
 * (schema.org). Fonte única para o HTML pré-renderizado (scripts/prerender.mjs) e
 * para a troca de página no navegador (components/common/DocumentMeta.tsx).
 */

const OG_IMAGE = `${profile.siteUrl}/images/og-image.png`;

export function pageMeta(content: SiteContent, page: PageId): Meta {
  switch (page) {
    case 'home':
      return content.home.meta;
    case 'mentoring':
      return content.mentoringPage.meta;
    case 'diagnostic':
      return content.diagnosticPage.meta;
    case 'about':
      return content.aboutPage.meta;
    case 'notFound':
      return content.notFound.meta;
  }
}

/** URL canônica: a raiz termina em "/", as demais não (a Vercel tira a barra final). */
export function canonicalUrl(page: PageId): string {
  const path = pathOf(page);
  return path === '/' ? `${profile.siteUrl}/` : `${profile.siteUrl}${path}`;
}

/** "R$ 7.500" → 7500; "Depois: R$ 1.497/mês" → 1497. */
export function priceValue(text: string): number {
  const match = text.match(/R\$\s*([\d.,]+)/);
  if (!match) throw new Error(`Preço sem valor em "${text}"`);
  return Number(match[1]!.replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.'));
}

const ids = {
  person: `${profile.siteUrl}/#leonardo`,
  business: `${profile.siteUrl}/#lp`,
  website: `${profile.siteUrl}/#site`,
};

type Json = Record<string, unknown>;

function person(): Json {
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: profile.name,
    alternateName: profile.shortName,
    url: canonicalUrl('about'),
    image: `${profile.siteUrl}${profile.images.avatar}`,
    jobTitle: profile.jobTitle,
    worksFor: { '@id': ids.business },
    alumniOf: ['Universidade de São Paulo', 'Estácio', 'Instituto Federal de São Paulo'],
    knowsAbout: ['Gestão de produtos digitais', 'PMO', 'Governança de portfólio', 'Product Discovery', 'Dados e IA'],
    address: { '@type': 'PostalAddress', addressLocality: 'Ribeirão Preto', addressRegion: 'SP', addressCountry: 'BR' },
    sameAs: [profile.linkedin, profile.github],
  };
}

function business(content: SiteContent): Json {
  const prices = content.offer.plans.flatMap((p) => [priceValue(p.price), priceValue(p.regularPrice)]);
  return {
    '@type': 'ProfessionalService',
    '@id': ids.business,
    name: profile.brand,
    url: canonicalUrl('home'),
    image: OG_IMAGE,
    description: content.home.meta.description,
    founder: { '@id': ids.person },
    email: profile.email,
    telephone: `+${profile.whatsapp}`,
    priceRange: `R$ ${Math.min(...prices).toLocaleString('pt-BR')} – R$ ${Math.max(...prices).toLocaleString('pt-BR')}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Ribeirão Preto', addressRegion: 'SP', addressCountry: 'BR' },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    sameAs: [profile.linkedin],
  };
}

const PLAN_PAGE: Record<Plan['id'], PageId> = { mentoring: 'mentoring', diagnostic: 'diagnostic' };

/** O serviço e as duas ofertas reais: preço fundador (vagas limitadas) e preço cheio. */
function service(plan: Plan, content: SiteContent): Json {
  const url = canonicalUrl(PLAN_PAGE[plan.id]);
  const monthly = plan.id === 'mentoring';
  const offer = (name: string, price: number, extra: Json = {}): Json => ({
    '@type': 'Offer',
    name,
    price,
    priceCurrency: 'BRL',
    url,
    availability: 'https://schema.org/InStock',
    ...(monthly
      ? { priceSpecification: { '@type': 'UnitPriceSpecification', price, priceCurrency: 'BRL', unitCode: 'MON', billingDuration: 'P1M' } }
      : {}),
    ...extra,
  });
  const spots = Number(plan.priceNote.match(/(\d+)\s/)?.[1] ?? 0);
  return {
    '@type': 'Service',
    '@id': `${url}#servico`,
    name: plan.title,
    description: plan.description,
    serviceType: monthly ? 'Mentoria de produto' : 'Diagnóstico de maturidade de PMO e portfólio',
    url,
    provider: { '@id': ids.business },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    audience: { '@type': 'Audience', audienceType: plan.tag },
    offers: [
      offer(`${plan.title}: ${content.locale === 'en' ? 'founder price' : 'preço fundador'}`, priceValue(plan.price), {
        inventoryLevel: { '@type': 'QuantitativeValue', value: spots },
      }),
      offer(`${plan.title}: ${content.locale === 'en' ? 'regular price' : 'preço cheio'}`, priceValue(plan.regularPrice)),
    ],
  };
}

function faqPage(faq: Faq, page: PageId): Json {
  return {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl(page)}#faq`,
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

function breadcrumb(content: SiteContent, page: PageId, label: string): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: content.nav.home, item: canonicalUrl('home') },
      { '@type': 'ListItem', position: 2, name: label, item: canonicalUrl(page) },
    ],
  };
}

const navLabel = (content: SiteContent, id: 'mentoring' | 'diagnostic' | 'about') =>
  content.nav.items.find((i) => i.id === id)!.label;

/** Grafo schema.org da página (um único <script type="application/ld+json">). */
export function structuredData(content: SiteContent, page: PageId): Json | null {
  if (page === 'notFound') return null;
  const plan = (id: Plan['id']) => content.offer.plans.find((p) => p.id === id)!;
  const graph: Json[] = [person(), business(content)];
  switch (page) {
    case 'home':
      graph.push(
        { '@type': 'WebSite', '@id': ids.website, url: canonicalUrl('home'), name: profile.brand, inLanguage: content.locale, publisher: { '@id': ids.business } },
        ...content.offer.plans.map((p) => service(p, content)),
      );
      break;
    case 'mentoring':
      graph.push(service(plan('mentoring'), content), faqPage(content.mentoringPage.faq, page), breadcrumb(content, page, navLabel(content, 'mentoring')));
      break;
    case 'diagnostic':
      graph.push(service(plan('diagnostic'), content), faqPage(content.diagnosticPage.faq, page), breadcrumb(content, page, navLabel(content, 'diagnostic')));
      break;
    case 'about':
      graph.push(
        { '@type': 'ProfilePage', '@id': `${canonicalUrl(page)}#pagina`, url: canonicalUrl(page), name: content.aboutPage.meta.title, mainEntity: { '@id': ids.person } },
        breadcrumb(content, page, navLabel(content, 'about')),
      );
      break;
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** As tags do <head> de uma página, para o HTML pré-renderizado. */
export function renderHead(content: SiteContent, page: PageId): string {
  const meta = pageMeta(content, page);
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const url = canonicalUrl(page);
  const data = structuredData(content, page);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    page === 'notFound' ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:locale" content="${content.locale.replace('-', '_')}" />`,
    page === 'notFound' ? '' : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:site_name" content="${escapeHtml(profile.brand)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeHtml(content.home.meta.title)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    // Só a página inicial abre com o retrato (o maior elemento da primeira tela).
    page === 'home' ? `<link rel="preload" href="${profile.images.portrait}" as="image" fetchpriority="high" />` : '',
    data ? `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : '',
  ];
  return tags.filter(Boolean).join('\n    ');
}
