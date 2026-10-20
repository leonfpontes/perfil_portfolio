import { createRoot, hydrateRoot } from 'react-dom/client';
import { createDefaultServices } from './lib/services';
import { Root } from './Root';
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado no index.html.');

// A página vem do endereço: o mesmo caminho que gerou o HTML pré-renderizado.
const app = <Root services={createDefaultServices()} initialPath={window.location.pathname} />;

// Em produção o HTML já vem pré-renderizado: só "hidratamos". Em dev, render normal.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
