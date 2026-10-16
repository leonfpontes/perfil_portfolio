import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LocaleProvider } from './lib/i18n/LocaleProvider';
import { createDefaultServices, ServicesProvider } from './lib/services';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado no index.html.');

createRoot(container).render(
  <StrictMode>
    <ServicesProvider value={createDefaultServices()}>
      <ThemeProvider>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </ThemeProvider>
    </ServicesProvider>
  </StrictMode>,
);
