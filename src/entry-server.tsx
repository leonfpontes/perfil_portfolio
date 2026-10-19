import { renderToString } from 'react-dom/server';
import { createDefaultServices } from './lib/services';
import { Root } from './Root';
import { ClientAreaLogin } from './entrar/ClientAreaLogin';

/**
 * Pré-renderização (build): gera o HTML da página para que o conteúdo apareça
 * antes do JavaScript — essencial em celulares, onde o JS leva segundos.
 * Usado por scripts/prerender.mjs; no servidor o analytics é um NoopTracker.
 */
export function render(): string {
  return renderToString(<Root services={createDefaultServices()} />);
}

/** A Área do cliente (/entrar), desenhada antes do JavaScript como a página inicial. */
export function renderEntrar(): string {
  return renderToString(<ClientAreaLogin />);
}
