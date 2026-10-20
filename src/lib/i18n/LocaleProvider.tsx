import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale, SiteContent } from '@/content/types';
import { safeStorage } from '@/lib/storage';
import { contentByLocale, DEFAULT_LOCALE, resolveInitialLocale } from './registry';

const STORAGE_KEY = 'lp:locale';

interface LocaleContextValue {
  locale: Locale;
  content: SiteContent;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  // O primeiro render é sempre o idioma padrão — igual ao HTML pré-renderizado —
  // e a preferência do visitante é aplicada logo após a hidratação.
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  useEffect(() => {
    if (initialLocale) return;
    const preferred = resolveInitialLocale(safeStorage.get(STORAGE_KEY), globalThis.navigator?.languages ?? []);
    setLocaleState(preferred);
  }, [initialLocale]);

  // <html lang>, título e descrição acompanham idioma e página: components/common/DocumentMeta.tsx.
  const content = contentByLocale[locale];

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
