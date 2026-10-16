import { en } from '@/content/locales/en';
import { ptBR } from '@/content/locales/pt-BR';
import type { Locale, SiteContent } from '@/content/types';

/** Registro de idiomas (Open/Closed): adicionar um idioma = adicionar uma entrada. */
export const contentByLocale: Record<Locale, SiteContent> = {
  'pt-BR': ptBR,
  en,
};

export const DEFAULT_LOCALE: Locale = 'pt-BR';
export const SUPPORTED_LOCALES = Object.keys(contentByLocale) as Locale[];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in contentByLocale;
}

/** Resolve o idioma inicial: preferência salva > idioma do navegador > padrão. */
export function resolveInitialLocale(saved: string | null, browserLanguages: readonly string[]): Locale {
  if (isLocale(saved)) return saved;
  const prefersPortuguese = browserLanguages.some((l) => l.toLowerCase().startsWith('pt'));
  if (browserLanguages.length > 0 && !prefersPortuguese) {
    return browserLanguages.some((l) => l.toLowerCase().startsWith('en')) ? 'en' : DEFAULT_LOCALE;
  }
  return DEFAULT_LOCALE;
}
