/**
 * Pré-renderiza o site em dist/: uma página HTML por rota (index.html, mentoria-produto.html,
 * diagnostico-pmo.html, sobre.html e 404.html), cada uma com o próprio <head> (título, descrição,
 * canônica, Open Graph e JSON-LD), mais a Área do cliente (entrar.html) e o sitemap.xml.
 * Roda depois de `vite build` (cliente) e `vite build --ssr` (servidor).
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ssrEntry = `${root}dist-ssr/entry-server.js`;
const rootMarker = '<div id="root"></div>';
const headMarker = '<!--app-head-->';

const { render, renderHead, renderEntrar, ROUTES, siteUrl } = await import(ssrEntry);

function inject(template, page, html) {
  if (!template.includes(rootMarker)) throw new Error(`Marcador ${rootMarker} não encontrado (${page})`);
  return template.replace(rootMarker, `<div id="root">${html}</div>`);
}

// O index.html do Vite é o molde de todas as páginas do site: lido uma vez, antes de ser sobrescrito.
const template = await readFile(`${root}dist/index.html`, 'utf8');
if (!template.includes(headMarker)) throw new Error(`Marcador ${headMarker} não encontrado em dist/index.html`);

for (const route of ROUTES) {
  const html = render(route.path);
  const page = inject(template, route.file, html).replace(headMarker, renderHead(route.id));
  await writeFile(`${root}dist/${route.file}`, page);
  console.log(`prerender: ${(html.length / 1024).toFixed(1)} KiB de HTML em dist/${route.file} (${route.path})`);
}

const entrarPath = `${root}dist/entrar.html`;
await writeFile(entrarPath, inject(await readFile(entrarPath, 'utf8'), 'entrar.html', renderEntrar()));
console.log('prerender: dist/entrar.html');

// Sitemap gerado das rotas: uma página nova entra sozinha.
const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => r.indexable)
  .map((r) => {
    const loc = r.path === '/' ? `${siteUrl}/` : `${siteUrl}${r.path}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
  })
  .join('\n');
await writeFile(
  `${root}dist/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log('prerender: dist/sitemap.xml');

await rm(`${root}dist-ssr`, { recursive: true, force: true });
