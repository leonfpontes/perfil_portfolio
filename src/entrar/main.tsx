import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { startGlassLight } from '../lib/glass-light';
import { ClientAreaLogin } from './ClientAreaLogin';
import '../styles/globals.css';
import './entrar.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado em entrar.html.');

const app = (
  <StrictMode>
    <ClientAreaLogin />
  </StrictMode>
);

// Em produção o HTML já vem pré-renderizado (scripts/prerender.mjs): só hidratamos.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);

// Luz difusa que segue o mouse por trás e na borda dos elementos de vidro.
startGlassLight();
