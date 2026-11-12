# AGENTS.md

Guia para agentes de código (Claude Code, Codex, Cursor e outros) que trabalham neste repositório. Para pessoas, o ponto de partida é o [`README.md`](README.md).

## O projeto

Site de **Leonardo Fonseca Pontes · LP · Product & Portfolio** ([www.leopontes.com.br](https://www.leopontes.com.br)): vitrine da mentoria 1:1 em Produto & Portfólio e do Diagnóstico de Maturidade de PMO & Portfólio, com a Área do cliente (`/entrar`) que leva à plataforma LP Diagnóstico (`app.leopontes.com.br`, repositório `lp-diagnostico`).

React 19 + TypeScript `strict`, Vite, Tailwind CSS 4 + shadcn/ui, GSAP + Lenis. Cada rota é pré-renderizada num HTML próprio; entre as páginas um roteador próprio troca o conteúdo sem recarregar. Deploy na Vercel a cada merge na `main`.

## Leia antes de mexer

| Documento | Quando |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Rotas, camadas, infraestrutura, decisões e testes |
| [`docs/CONTENT.md`](docs/CONTENT.md) | Qualquer mudança de texto, preço, depoimento, FAQ ou idioma |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Qualquer mudança visual: paleta Papel & Marinho, tokens LP Noir, vidro, funil, movimento |

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm test             # Vitest, execução única
npm run build        # tsc + build do cliente + build SSR + prerender + sitemap
npm run preview      # serve dist/ em http://localhost:4173
```

Antes de dar uma tarefa por concluída: `typecheck`, `test` e `build` passando. Para mudança visível, confira também o HTML cru da rota no `dist/` (título, H1, preços) e o celular a 375 px.

**macOS:** `src/components/art/Funil.tsx` e `src/components/art/funil.ts` colidem num disco sem distinção de maiúsculas, e os três comandos acima falham localmente com "has no exported member 'Funil'". Isso não é causado pela sua mudança; na Vercel (Linux) funciona. Diga isso no relatório em vez de "consertar" importações.

## Regras do repositório

1. **Conteúdo só em `src/content/`.** Nenhuma string solta em componente. Todo texto entra nos dois idiomas (`locales/pt-BR.ts` e `locales/en.ts`); o teste de paridade falha se a estrutura divergir.
2. **Confidencialidade.** Cases de clientes aparecem generalizados ("instituição financeira de médio porte"). `content/content.test.ts` tem a lista de nomes proibidos.
3. **Rótulos em inglês, conteúdo em português.** Navegação, botões curtos, eyebrows e a marca ficam em inglês; títulos, textos, FAQ e SEO em português. Na jornada do cliente, "Etapa"; G1–G4 só para os gates da metodologia.
4. **Arquivos idênticos ao `lp-diagnostico`:** `src/styles/lp-noir.css` e `src/lib/glass-light.ts`. Mudou aqui, mude lá também (ou avise que falta).
5. **Claro sempre.** Não reintroduza alternância de tema. As faixas marinho vêm das classes `.tone-*` em `globals.css`.
6. **Movimento respeita o modo suave.** Toda animação nova fica dentro de `gsap.matchMedia()` e tem versão parada para "Reduzir movimento" (`useReducedMotion`, `lib/motion/motionPreference.ts`).
7. **Pré-renderização determinística.** O primeiro render não pode depender de `window`, `localStorage` ou aleatoriedade, senão a hidratação diverge do HTML do servidor. Arte decorativa pesada monta depois do primeiro paint (`useAfterFirstPaint`).
8. **Página nova:** `lib/router/routes.ts` (rota e `PAGE_SECTIONS`), `pages/`, `App.tsx` e `seo/head.ts`. Ela entra sozinha no prerender e no sitemap.
9. **Sem foto de banco no lugar de produto real.** Imagens de banco (`stockImages`) aparecem pelo `Halftone`, com a legenda "imagem ilustrativa".
10. **Nada de estética genérica de IA:** gradiente roxo-azul, texto em gradiente, blobs, cards idênticos com ícone em quadrado, ✨ e emojis decorativos, botão flutuante de WhatsApp (lista completa em `DESIGN.md`).

## Onde mexer

| Para mudar | Arquivo |
|---|---|
| Textos, preços, FAQ, depoimentos | `src/content/locales/pt-BR.ts` e `en.ts` |
| Contatos, links, marca, imagens | `src/content/profile.ts` |
| Rotas, seções de cada página, âncoras antigas | `src/lib/router/routes.ts` |
| Título, descrição e JSON-LD de cada página | `src/seo/head.ts` |
| Tokens compartilhados, vidro, funil | `src/styles/lp-noir.css` (+ `lp-diagnostico`) |
| Tons de cena e estilos do site | `src/styles/globals.css` |
| Área do cliente | `src/entrar/` (API em `api.ts`, `VITE_APP_URL` no `.env.local` para testar contra o app local) |
| Monitor de disponibilidade | `scripts/disponibilidade.mjs` e `.github/workflows/disponibilidade.yml` |

## Git e pull requests

- Nunca trabalhe direto na `main`. Branch com prefixo do tipo: `feat/…`, `fix/…`, `docs/…`, `perf/…`, `ops/…`.
- Mensagens de commit e títulos de PR em português, no estilo do histórico: `feat(entrar): código de 6 números, reenvio e link vencido em um toque`. O corpo explica o porquê.
- Merge na `main` publica na Vercel; todo PR ganha um preview.
- Mudou comportamento, rota, identidade ou infraestrutura? Atualize o `README.md` e o `docs/` correspondente no mesmo PR.

## Escrita

O público do site e da documentação lê português do Brasil. Escreva frases curtas e diretas, sem jargão desnecessário e sem travessões decorativos. Nos textos do site, o tom é sóbrio e seguro, sem exagero de marketing.
