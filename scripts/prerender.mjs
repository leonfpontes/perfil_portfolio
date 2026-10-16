/**
 * Injeta o HTML pré-renderizado em dist/index.html.
 * Roda depois de `vite build` (cliente) e `vite build --ssr` (servidor).
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const indexPath = `${root}dist/index.html`;
const ssrEntry = `${root}dist-ssr/entry-server.js`;

const { render } = await import(ssrEntry);
const html = render();
const template = await readFile(indexPath, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`Marcador ${marker} não encontrado em dist/index.html`);

await writeFile(indexPath, template.replace(marker, `<div id="root">${html}</div>`));
await rm(`${root}dist-ssr`, { recursive: true, force: true });
console.log(`prerender: ${(html.length / 1024).toFixed(1)} KiB de HTML injetados em dist/index.html`);
