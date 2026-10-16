import { StrictMode } from 'react';
import { App } from './App';
import { LocaleProvider } from './lib/i18n/LocaleProvider';
import { SceneDirector } from './lib/motion/SceneDirector';
import { SmoothScrollProvider } from './lib/motion/SmoothScroll';
import { ServicesProvider, type AppServices } from './lib/services';
import { ThemeProvider } from './lib/theme/ThemeProvider';

/**
 * Árvore de providers da aplicação. Compartilhada entre o cliente (main.tsx)
 * e a pré-renderização (entry-server.tsx) — a mesma árvore nos dois lados é o
 * que garante uma hidratação sem divergências.
 */
export function Root({ services }: { services: AppServices }) {
  return (
    <StrictMode>
      <ServicesProvider value={services}>
        <ThemeProvider>
          <LocaleProvider>
            <SmoothScrollProvider>
              <SceneDirector>
                <App />
              </SceneDirector>
            </SmoothScrollProvider>
          </LocaleProvider>
        </ThemeProvider>
      </ServicesProvider>
    </StrictMode>
  );
}
