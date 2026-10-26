import { createContext, useContext, useEffect, type ReactNode } from 'react';

/**
 * O site é escuro sempre (identidade LP Noir, ver docs/DESIGN.md): não há mais
 * alternância claro/escuro. O provider continua existindo para que quem lê o tema
 * (SceneDirector, componentes shadcn com `dark:`) tenha um valor estável.
 */
export type Theme = 'dark';

interface ThemeContextValue {
  theme: Theme;
}

const VALUE: ThemeContextValue = { theme: 'dark' };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  }, []);

  return <ThemeContext.Provider value={VALUE}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>.');
  return ctx;
}
