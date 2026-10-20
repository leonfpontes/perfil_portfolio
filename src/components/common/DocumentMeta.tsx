import { useEffect, useRef } from 'react';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { useRouter } from '@/lib/router/Router';
import { useServices } from '@/lib/services';
import { canonicalUrl, pageMeta } from '@/seo/head';

/** Garante a tag no <head> (em dev o HTML não vem pré-renderizado) e define o atributo. */
function setHeadTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function meta(key: 'name' | 'property', name: string, value: string) {
  setHeadTag(
    `meta[${key}="${name}"]`,
    () => {
      const m = document.createElement('meta');
      m.setAttribute(key, name);
      return m;
    },
    'content',
    value,
  );
}

/**
 * Mantém <html lang>, título, descrição, canônica e Open Graph em dia com a página e o
 * idioma, e registra a visualização de página quando a navegação acontece sem recarregar.
 */
export function DocumentMeta() {
  const { locale, content } = useLocale();
  const { page, path } = useRouter();
  const { analytics } = useServices();
  const firstPath = useRef(path);

  useEffect(() => {
    const { title, description } = pageMeta(content, page);
    document.documentElement.lang = locale;
    document.title = title;
    meta('name', 'description', description);
    meta('property', 'og:title', title);
    meta('property', 'og:description', description);
    meta('property', 'og:locale', locale.replace('-', '_'));
    if (page !== 'notFound') {
      const url = canonicalUrl(page);
      meta('property', 'og:url', url);
      setHeadTag(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement('link');
          l.rel = 'canonical';
          return l;
        },
        'href',
        url,
      );
    }
  }, [locale, content, page]);

  // A primeira visualização o gtag já registra no carregamento.
  useEffect(() => {
    if (path === firstPath.current) return;
    firstPath.current = '';
    analytics.track('page_view', { page_path: path, page_title: document.title, page_location: window.location.href });
  }, [path, analytics]);

  return null;
}
