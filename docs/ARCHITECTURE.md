# Arquitetura

Site estático em React 19 + TypeScript, com build do Vite e deploy na Vercel. São várias páginas, cada uma com URL e HTML pré-renderizado próprios; entre elas a navegação acontece sem recarregar.

## Páginas

| Rota | Arquivo em `dist/` | Componente | Conteúdo |
|---|---|---|---|
| `/` | `index.html` | `pages/HomePage` | Hero (as duas ofertas, com preço), ofertas, depoimentos, "quem conduz", contato |
| `/mentoria-produto` | `mentoria-produto.html` | `pages/MentoringPage` | Mentoria 1:1: escopo e preço, como funciona (gates), FAQ, contato |
| `/diagnostico-pmo` | `diagnostico-pmo.html` | `pages/DiagnosticPage` | Diagnóstico: etapas (gates), entregáveis e preço, FAQ, contato |
| `/sobre` | `sobre.html` | `pages/AboutPage` | História, produtos autorais (GiraHub…), trajetória, competências, formação, serviços, contato |
| qualquer outra | `404.html` | `pages/NotFoundPage` | 404 (a Vercel responde com status 404), `noindex` |
| `/entrar` | `entrar.html` | `entrar/` | Área do cliente: outro documento, `noindex` |

As rotas, a numeração das seções de cada página (§ 01, § 02…) e o mapa das âncoras antigas (`/#produtos` → `/sobre#produtos`) ficam em `lib/router/routes.ts`.

## Camadas

```
src/
├── content/              # DOMÍNIO — o quê o site diz
│   ├── types.ts          #   modelo tipado (SiteContent) — contrato entre conteúdo e UI
│   ├── profile.ts        #   identidade e canais (independente de idioma)
│   ├── sections.ts       #   numeração das seções na página (§ 01, § 02…)
│   └── locales/          #   pt-BR.ts, en.ts — um SiteContent por idioma
├── pages/                # PÁGINAS — uma por rota, compostas de seções
├── seo/head.ts           # título, descrição, canônica, Open Graph e JSON-LD por página
├── lib/                  # SERVIÇOS — como o site se comporta
│   ├── router/           #   rotas + RouterProvider (navegação sem recarregar, View Transitions)
│   ├── contact/          #   ContactLinkBuilder (WhatsApp, mailto, telefone)
│   ├── analytics/        #   AnalyticsTracker (interface) + GtagTracker / NoopTracker
│   ├── i18n/             #   registro de idiomas + LocaleProvider/useContent
│   ├── theme/            #   ThemeProvider (claro/escuro, persistido)
│   ├── services.tsx      #   container de DI (ServicesProvider/useServices)
│   └── storage.ts        #   localStorage tolerante a falhas
│   ├── motion/           #   GSAP (registro), SceneThemeController, SceneDirector, SmoothScroll (Lenis)
│   └── art/              #   PRNG e noise determinísticos para a arte generativa
├── hooks/                # useInView, useSteppedScene, useCanvas, useReducedMotion
├── components/
│   ├── ui/               # primitivas shadcn/ui (button, sheet, accordion)
│   ├── common/           # peças do design system (Container, SectionHeader, Reveal…)
│   ├── motion/           # Scene, SplitReveal, CountUp, Magnetic, SceneIndicator
│   ├── art/              # FlowField, Halftone, GenerativeCover (+ covers.ts: estratégias)
│   └── layout/           # Header, Footer
├── sections/             # APRESENTAÇÃO — uma seção da página por arquivo
├── App.tsx               # cabeçalho, rodapé e a página da rota atual
└── main.tsx              # bootstrap: providers + render
```

O fluxo de dependências é **sections → components/common → lib → content**. O conteúdo não importa nada de UI.

## Decisões

| Decisão | Por quê |
|---|---|
| **Conteúdo tipado em TS, não JSON nem CMS** | Garante, em tempo de compilação, que os dois idiomas tenham o mesmo formato. Um teste reforça a paridade de estrutura e de campos invariantes (ids, links, status). |
| **DI via contexto (`ServicesProvider`)** | Os componentes dependem de `AnalyticsTracker`, não do `gtag`. Nos testes, um fake é injetado sem mocks globais. |
| **Classes para serviços, funções para UI** | `ContactLinkBuilder` encapsula e valida o telefone uma única vez (POO). Componentes React continuam funcionais e sem estado oculto. |
| **Seções por página (`PAGE_SECTIONS` em `lib/router/routes.ts`)** | A numeração dos cabeçalhos de cada página vem de uma lista; reordenar é editar a lista e a página em `pages/`. |
| **shadcn/ui** | Os componentes ficam no repositório, então são adaptáveis ao design editorial (ex.: a variante `signal` do `Button`). O Radix fornece a acessibilidade do Sheet e do Accordion. |
| **Analytics como abstração** | Trocar o GA4 por Plausible, PostHog etc. é criar uma nova classe que implementa `AnalyticsTracker`, sem tocar em componentes. |
| **Cenas com GSAP + ScrollTrigger + Lenis** | GSAP é o padrão da indústria para animação orientada a scroll (pins, scrub, SplitText). O Lenis suaviza o scroll e roda no mesmo relógio do GSAP, o que evita tremidas nos pins. Toda animação fica dentro de `gsap.matchMedia()`, então é revertida sozinha com reduced motion ou ao mudar de breakpoint. |
| **Tons por seção + `SceneThemeController`** | Cada `<section>` usa sua classe `.tone-*`, então a cor muda presa à rolagem. A classe `SceneThemeController` só leva o tom da cena ativa ao header e ao `<html>`. Ela recebe `root` e `ToneReader` por injeção (testável sem DOM real) e interpola com `color-mix` do navegador, sem converter oklch em JS. |
| **Capas generativas por estratégia** | `coverPainters: Record<variant, painter>`. Um produto novo ganha arte nova adicionando uma entrada, sem tocar no componente (OCP). |
| **Encaixe (snap) só no celular** | No desktop o Lenis já suaviza o scroll, e o encaixe do ScrollTrigger brigava com ele, puxando a página de volta no fim dos trilhos. |
| **Pins resolvem o `<section>` via `closest()`** | No React a ref do pai só é ligada depois dos efeitos de layout dos filhos, então o filho localiza a própria cena no DOM (`sceneSectionOf`). |
| **Pré-renderização no build** (`entry-server.tsx` + `scripts/prerender.mjs`) | Cada rota vira um HTML completo, com `<head>` próprio (marcador `<!--app-head-->` no `index.html`), e o `sitemap.xml` é gerado das rotas. O conteúdo aparece antes do JS (decisivo no celular) e buscadores leem tudo sem executar nada. O primeiro render é determinístico (idioma padrão, ícones de tema via CSS, `Reveal` visível) para não divergir do HTML do servidor. |
| **Roteador próprio, sem dependência** (`lib/router/Router.tsx`) | Links comuns (`<a href="/sobre">`) são interceptados e a página troca sem recarregar: cabeçalho, Lenis e tema continuam vivos. A troca usa `document.startViewTransition` (o cabeçalho fica parado, a página antiga se apaga e a nova sobe: `globals.css`); sem a API, o `<main>` esmaece; no modo suave, é direta. Voltar/avançar restauram a rolagem. A visualização de página vai ao GA4 (`page_view`). |
| **Gatilhos de scroll se autocorrigem** (`SmoothScroll.tsx`) | Um `ResizeObserver` na página recalcula o ScrollTrigger quando a altura muda depois do cálculo inicial: fontes sem cache, troca de idioma, "Ler mais". Sem isso, cores e cenas disparam no lugar errado após um recarregamento forçado. |

## Testes

| Arquivo | Cobre |
|---|---|
| `lib/contact/ContactLinkBuilder.test.ts` | Codificação de URLs, formatação e validação |
| `lib/analytics/AnalyticsTracker.test.ts` | Factory, fallback e tolerância a erro |
| `lib/i18n/registry.test.ts` | Resolução do idioma inicial |
| `content/content.test.ts` | Paridade pt-BR/EN, numeração por página, preços do diagnóstico, regra de confidencialidade |
| `lib/router/routes.test.ts` | Resolução de caminhos, 404, âncoras antigas |
| `seo/head.test.ts` | Canônicas, preços nos dados estruturados, FAQPage só onde há FAQ |
| `entry-server.test.tsx` | HTML de cada rota, um H1 por página, títulos únicos, 404 `noindex` |
| `lib/motion/SceneThemeController.test.ts` | Tons, interpolação e descarte |
| `components/motion/motion.test.tsx` | Contador (parse/format) e localização da cena |
| `lib/art/*.test.ts`, `components/art/art.test.tsx` | PRNG/noise determinísticos e renderização da arte |
| `App.test.tsx` | Integração: páginas, navegação sem recarregar, CTAs, analytics, troca de idioma, tema, depoimentos |

```bash
npm test               # execução única
npm run test:watch     # modo watch
npm run test:coverage  # cobertura
```
