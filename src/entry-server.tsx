import { renderToString } from 'react-dom/server';
import { profile } from './content/profile';
import { createDefaultServices } from './lib/services';
import { contentByLocale, DEFAULT_LOCALE } from './lib/i18n/registry';
import { ROUTES, type PageId } from './lib/router/routes';
import { renderHead as headFor } from './seo/head';
import { Root } from './Root';
import { ClientAreaLogin } from './entrar/ClientAreaLogin';

/**
 * Pré-renderização (build): gera o HTML de cada página para que o conteúdo apareça
 * antes do JavaScript — essencial em celulares, onde o JS leva segundos — e para que
 * buscadores leiam tudo sem executar nada. Usado por scripts/prerender.mjs; no
 * servidor o analytics é um NoopTracker.
 */
export function render(path = '/'): string {
  return renderToString(<Root services={createDefaultServices()} initialPath={path} />);
}

/** Título, descrição, canônica, Open Graph e JSON-LD da página, no idioma padrão. */
export function renderHead(page: PageId): string {
  return headFor(contentByLocale[DEFAULT_LOCALE], page);
}

/** A Área do cliente (/entrar), desenhada antes do JavaScript como as páginas do site. */
export function renderEntrar(): string {
  return renderToString(<ClientAreaLogin />);
}

export { ROUTES };
export const siteUrl = profile.siteUrl;
