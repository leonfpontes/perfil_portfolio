import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale, SiteContent } from '@/content/types';
import { safeStorage } from '@/lib/storage';
import { contentByLocale, resolveInitialLocale } from './registry';

const STORAGE_KEY = 'lp:locale';

interface LocaleContextValue {
  locale: Locale;
  content: SiteContent;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(
    () => initialLocale ?? resolveInitialLocale(safeStorage.get(STORAGE_KEY), globalThis.navigator?.languages ?? []),
  );

  const content = contentByLocale[locale];

  // Mantém <html lang>, <title> e meta description sincronizados com o idioma.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = content.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description);
  }, [locale, content]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    safeStorage.set(STORAGE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => setLocale(locale === 'pt-BR' ? 'en' : 'pt-BR'), [locale, setLocale]);

  const value = useMemo(() => ({ locale, content, setLocale, toggleLocale }), [locale, content, setLocale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale deve ser usado dentro de <LocaleProvider>.');
  return ctx;
}

/** Atalho para o conteúdo do idioma ativo. */
export function useContent(): SiteContent {
  return useLocale().content;
}
