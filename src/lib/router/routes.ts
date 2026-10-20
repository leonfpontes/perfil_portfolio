import type { SectionId } from '@/content/types';

/**
 * As páginas do site. Cada uma tem a própria URL, o próprio HTML pré-renderizado
 * (scripts/prerender.mjs) e os próprios metadados de SEO (src/seo/head.ts).
 */
export type PageId = 'home' | 'mentoring' | 'diagnostic' | 'about' | 'notFound';

export interface PageRoute {
  id: PageId;
  path: string;
  /** Arquivo gerado em dist/ (com `cleanUrls` da Vercel, /sobre serve sobre.html). */
  file: string;
  /** Entra no sitemap e pode ser indexada. */
  indexable: boolean;
}

export const ROUTES: readonly PageRoute[] = [
  { id: 'home', path: '/', file: 'index.html', indexable: true },
  { id: 'mentoring', path: '/mentoria-produto', file: 'mentoria-produto.html', indexable: true },
  { id: 'diagnostic', path: '/diagnostico-pmo', file: 'diagnostico-pmo.html', indexable: true },
  { id: 'about', path: '/sobre', file: 'sobre.html', indexable: true },
  // A Vercel serve 404.html, com status 404, para qualquer caminho desconhecido.
  { id: 'notFound', path: '/404', file: '404.html', indexable: false },
];

const byId = Object.fromEntries(ROUTES.map((r) => [r.id, r])) as Record<PageId, PageRoute>;

export function routeOf(id: PageId): PageRoute {
  return byId[id];
}

export function pathOf(id: PageId): string {
  return byId[id].path;
}

/** "/sobre/", "/sobre.html" e "/sobre" são a mesma página. */
export function normalizePath(pathname: string): string {
  let p = pathname.split(/[?#]/)[0] || '/';
  p = p.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

/** Página de um caminho; caminhos desconhecidos caem na 404. */
export function resolvePage(pathname: string): PageId {
  const path = normalizePath(pathname);
  return ROUTES.find((r) => r.path === path && r.id !== 'notFound')?.id ?? 'notFound';
}

/** Caminhos que o roteador do site atende (o resto, como /entrar, é outro documento). */
export function isSitePath(pathname: string): boolean {
  return resolvePage(pathname) !== 'notFound';
}

/**
 * Seções numeradas (§ 01, § 02…) de cada página, na ordem em que aparecem.
 * O hero ("inicio") abre todas as páginas e não é numerado.
 */
export const PAGE_SECTIONS: Record<PageId, readonly SectionId[]> = {
  home: ['ofertas', 'depoimentos', 'perfil', 'contato'],
  mentoring: ['mentoria', 'jornada', 'faq', 'contato'],
  diagnostic: ['processo', 'diagnostico', 'faq', 'contato'],
  about: ['sobre', 'produtos', 'experiencia', 'competencias', 'formacao', 'servicos', 'contato'],
  notFound: [],
};

/**
 * Âncoras da antiga página única (ex.: links antigos para /#produtos): cada uma
 * leva à página onde a seção mora agora.
 */
export const LEGACY_ANCHORS: Partial<Record<string, { page: PageId; hash: string }>> = {
  mentoria: { page: 'home', hash: 'ofertas' },
  jornada: { page: 'mentoring', hash: 'jornada' },
  faq: { page: 'mentoring', hash: 'faq' },
  servicos: { page: 'about', hash: 'servicos' },
  sobre: { page: 'about', hash: 'sobre' },
  produtos: { page: 'about', hash: 'produtos' },
  experiencia: { page: 'about', hash: 'experiencia' },
  competencias: { page: 'about', hash: 'competencias' },
  formacao: { page: 'about', hash: 'formacao' },
};

/** Destino de um item do menu: a página, ou a âncora de contato (que encerra todas as páginas). */
export function navHref(id: 'mentoring' | 'diagnostic' | 'about' | 'contact'): string {
  return id === 'contact' ? '#contato' : pathOf(id);
}
