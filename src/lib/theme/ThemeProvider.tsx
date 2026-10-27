import { createContext, useContext, useEffect, type ReactNode } from 'react';

/**
 * O site é claro sempre (identidade Papel & Marinho, ver docs/DESIGN.md): não há
 * alternância claro/escuro; as faixas marinho vêm dos tons de cena, não do tema.
 * O provider continua existindo para que quem lê o tema (SceneDirector) tenha um valor estável.
 */
export type Theme = 'light';

interface ThemeContextValue {
  theme: Theme;
}

const VALUE: ThemeContextValue = { theme: 'light' };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }, []);

  return <ThemeContext.Provider value={VALUE}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>.');
  return ctx;
}
