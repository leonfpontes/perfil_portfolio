# Arquitetura

Site estático em React 19 + TypeScript, com build do Vite e deploy na Vercel. São várias páginas, cada uma com URL e HTML pré-renderizado próprios; entre elas a navegação acontece sem recarregar. A Área do cliente (`/entrar`) é um segundo documento, que conversa com a plataforma LP Diagnóstico (`app.leopontes.com.br`).

## Páginas

| Rota | Arquivo em `dist/` | Componente | Seções (`PAGE_SECTIONS`) |
|---|---|---|---|
| `/` | `index.html` | `pages/HomePage` | Hero (as duas ofertas, com preço) · `ofertas` · `depoimentos` · `perfil` · `contato` |
| `/mentoria-produto` | `mentoria-produto.html` | `pages/MentoringPage` | Hero com "o que o preço inclui" · `mentoria` · `jornada` · `faq` · `contato` |
| `/diagnostico-pmo` | `diagnostico-pmo.html` | `pages/DiagnosticPage` | Hero com "o que o preço inclui" · `processo` · `diagnostico` · `faq` · `contato` |
| `/sobre` | `sobre.html` | `pages/AboutPage` | `sobre` · `produtos` · `experiencia` · `competencias` · `formacao` · `servicos` · `contato` |
| qualquer outra | `404.html` | `pages/NotFoundPage` | 404 (a Vercel responde com status 404), `noindex` |
| `/entrar` | `entrar.html` | `entrar/` | Área do cliente: outro documento, `noindex` |

As rotas, a numeração das seções de cada página (§ 01, § 02…) e o mapa das âncoras antigas (`/#produtos` → `/sobre#produtos`) ficam em `lib/router/routes.ts`.

## Camadas

```
src/
├── content/              # DOMÍNIO — o quê o site diz
│   ├── types.ts          #   modelo tipado (SiteContent) — contrato entre conteúdo e UI
│   ├── profile.ts        #   identidade, canais (e-mail, WhatsApp, LinkedIn, Instagram…) e imagens
│   ├── sections.ts       #   numeração das seções na página (§ 01, § 02…)
│   └── locales/          #   pt-BR.ts, en.ts — um SiteContent por idioma
├── pages/                # PÁGINAS — uma por rota, compostas de seções (Lazy: fronteira de hidratação)
├── sections/             # APRESENTAÇÃO — uma seção da página por arquivo
├── seo/head.ts           # título, descrição, canônica, Open Graph e JSON-LD por página
├── lib/                  # SERVIÇOS — como o site se comporta
│   ├── router/           #   rotas + RouterProvider (navegação sem recarregar, View Transitions, âncoras)
│   ├── contact/          #   ContactLinkBuilder (WhatsApp, mailto, telefone)
│   ├── analytics/        #   AnalyticsTracker (interface) + GtagTracker / NoopTracker
│   ├── i18n/             #   registro de idiomas + LocaleProvider/useContent
│   ├── theme/            #   ThemeProvider (claro sempre: Papel & Marinho)
│   ├── motion/           #   GSAP (registro), SceneThemeController, SceneDirector, SmoothScroll (Lenis), motionPreference
│   ├── art/              #   PRNG e noise determinísticos para a arte generativa
│   ├── glass-light.ts    #   luz do vidro (idêntico no lp-diagnostico)
│   ├── services.tsx      #   container de DI (ServicesProvider/useServices)
│   └── storage.ts        #   localStorage tolerante a falhas
├── hooks/                # useInView, useSteppedScene, useCanvas, useReducedMotion, useAfterFirstPaint
├── components/
│   ├── ui/               # primitivas shadcn/ui (button, sheet, accordion)
│   ├── common/           # peças do design system (Section, PageHero, Reveal, TrackedLink, SocialIcon, Arrow…)
│   ├── motion/           # Scene, SplitReveal, CountUp, Magnetic, HorizontalTrack, SceneIndicator
│   ├── art/              # Funil (+ funil.ts: geometria), Halftone, GenerativeCover (+ covers.ts: estratégias)
│   └── layout/           # Header, Footer, MobileMenu, MotionControls
├── entrar/               # ÁREA DO CLIENTE — documento próprio (entrar.html)
│   ├── ClientAreaLogin.tsx  # código de 6 números, link por e-mail, senha + 2FA para quem tem senha
│   ├── api.ts            #   chamadas à API de entrada do app (cookie, CORS)
│   ├── lembrar.ts        #   último e-mail e pedido em andamento, neste aparelho
│   └── passagem.ts       #   a cortina entre o site e a Área do cliente
├── styles/
│   ├── lp-noir.css       # tokens LP Noir, vidro e funil (idêntico no lp-diagnostico)
│   └── globals.css       # tons de cena (.tone-*), tipografia e utilitários do site
├── Root.tsx              # árvore de providers, a mesma no cliente e na pré-renderização
├── App.tsx               # cabeçalho, rodapé e a página da rota atual
├── main.tsx              # bootstrap do cliente: hidratação + luz do vidro
└── entry-server.tsx      # render de cada rota para a pré-renderização
```

O fluxo de dependências é **sections → components/common → lib → content**. O conteúdo não importa nada de UI.

## Infraestrutura

| Peça | Onde | O que faz |
|---|---|---|
| Hospedagem | Vercel ([`vercel.json`](../vercel.json)) | Serve `dist/` com URLs limpas, cache imutável em `/assets` e `/fonts`, cabeçalhos de segurança; merge na `main` publica sozinho |
| Monitor de disponibilidade | GitHub Actions ([`.github/workflows/disponibilidade.yml`](../.github/workflows/disponibilidade.yml) + [`scripts/disponibilidade.mjs`](../scripts/disponibilidade.mjs)) | A cada 10 minutos confere o site, o `/entrar` e o `/healthz` da plataforma, com segunda tentativa depois de 20 s. E-mail pelo Resend só quando algo cai e quando volta; o estado da rodada anterior fica no cache do Actions |
| Área do cliente | `src/entrar/` → `app.leopontes.com.br` | `fetch` com cookie (`credentials: 'include'`) para `/api/auth/*`; `www` e `app` são o mesmo site, então o cookie `SameSite=Lax` funciona. O app só aceita esta origem nas rotas de entrada |
| Assinatura de e-mail | `public/images/email/` | Imagens PNG 2x servidas pelo site (clientes de e-mail bloqueiam SVG) |

O monitor fica fora da Vercel de propósito: se a Vercel cair, ele continua de pé. Ele precisa dos segredos `RESEND_API_KEY` e `ALERTA_EMAIL`; sem eles, só registra no log. O GitHub desliga workflows agendados depois de 60 dias sem commits no repositório; nesse caso, reative em **Actions → Disponibilidade**.

## Decisões

| Decisão | Por quê |
|---|---|
| **Conteúdo tipado em TS, não JSON nem CMS** | Garante, em tempo de compilação, que os dois idiomas tenham o mesmo formato. Um teste reforça a paridade de estrutura e de campos invariantes (ids, links, status). |
| **DI via contexto (`ServicesProvider`)** | Os componentes dependem de `AnalyticsTracker`, não do `gtag`. Nos testes, um fake é injetado sem mocks globais. |
| **Classes para serviços, funções para UI** | `ContactLinkBuilder` encapsula e valida o telefone uma única vez (POO). Componentes React continuam funcionais e sem estado oculto. |
| **Seções por página (`PAGE_SECTIONS` em `lib/router/routes.ts`)** | A numeração dos cabeçalhos de cada página vem de uma lista; reordenar é editar a lista e a página em `pages/`. |
| **Tokens compartilhados com a plataforma** (`styles/lp-noir.css`, `lib/glass-light.ts`) | Site e app são a mesma identidade. Os dois arquivos são idênticos nos dois repositórios: mude nos dois juntos. O que é só do site (tons de cena, Papel & Marinho) fica em `globals.css`. |
| **Claro sempre** (`ThemeProvider`) | A identidade Papel & Marinho não tem modo escuro; as faixas marinho vêm dos tons de cena. O provider continua existindo para dar a quem lê o tema um valor estável. |
| **shadcn/ui** | Os componentes ficam no repositório, então são adaptáveis à identidade (ex.: as variantes `signal` e `glass` do `Button`). O Radix fornece a acessibilidade do Sheet e do Accordion. |
| **Analytics como abstração** | Trocar o GA4 por Plausible, PostHog etc. é criar uma nova classe que implementa `AnalyticsTracker`, sem tocar em componentes. |
| **Cenas com GSAP + ScrollTrigger + Lenis** | GSAP é o padrão da indústria para animação orientada a scroll (pins, scrub, SplitText). O Lenis suaviza o scroll e roda no mesmo relógio do GSAP, o que evita tremidas nos pins. Toda animação fica dentro de `gsap.matchMedia()`, então é revertida sozinha com reduced motion ou ao mudar de breakpoint. |
| **Tons por seção + `SceneThemeController`** | Cada `<section>` usa sua classe `.tone-*`, então a cor muda presa à rolagem. A classe `SceneThemeController` só leva o tom da cena ativa (fundo, tinta, `--signal` e `--action`) ao header e ao `<html>`. Ela recebe `root` e `ToneReader` por injeção (testável sem DOM real) e interpola com `color-mix` do navegador. |
| **Funil em SVG parado** | O desenho dos gates é determinístico e nítido em qualquer tamanho, sem custo de CPU; só um pulso CSS corre pela linha de sinal. No hero ele monta depois do primeiro paint (`useAfterFirstPaint`) para não disputar o LCP com o texto. |
| **Capas generativas por estratégia** | `coverPainters: Record<variant, painter>`. Um produto novo ganha arte nova adicionando uma entrada, sem tocar no componente (OCP). |
| **Canvas medido pelo tamanho de layout** (`useCanvas`) | `clientWidth/clientHeight`, não `getBoundingClientRect`: medido durante uma animação de entrada achatada (`scaleY 0`), o canvas ficava com altura quase zero e a arte esticava em faixas. |
| **Encaixe (snap) só no celular** | No desktop o Lenis já suaviza o scroll, e o encaixe do ScrollTrigger brigava com ele, puxando a página de volta no fim dos trilhos. |
| **Pins resolvem o `<section>` via `closest()`** | No React a ref do pai só é ligada depois dos efeitos de layout dos filhos, então o filho localiza a própria cena no DOM (`sceneSectionOf`). |
| **Pré-renderização no build** (`entry-server.tsx` + `scripts/prerender.mjs`) | Cada rota vira um HTML completo, com `<head>` próprio (marcador `<!--app-head-->` no `index.html`), e o `sitemap.xml` é gerado das rotas. O conteúdo aparece antes do JS (decisivo no celular) e buscadores leem tudo sem executar nada. O primeiro render é determinístico (idioma padrão, `Reveal` visível) para não divergir do HTML do servidor; `Root.tsx` é a mesma árvore nos dois lados. |
| **Roteador próprio, sem dependência** (`lib/router/Router.tsx`) | Links comuns (`<a href="/sobre">`) são interceptados e a página troca sem recarregar: cabeçalho, Lenis e tema continuam vivos. A troca usa `document.startViewTransition`; sem a API, o `<main>` esmaece; no modo suave, é direta. Voltar/avançar restauram a rolagem. A visualização de página vai ao GA4 (`page_view`). |
| **Âncora direta para na seção certa** (`Router.tsx`) | Ao abrir `/#contato` numa aba nova (o botão da assinatura de e-mail), o navegador pulava para a âncora antes de as cenas fixadas esticarem a página. O pulo é refeito a cada refresh do ScrollTrigger até a página assentar, ou até a pessoa rolar. |
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
| `lib/motion/motionPreference.test.ts` | Preferência de movimento (completo, suave, sistema) |
| `components/motion/motion.test.tsx` | Contador (parse/format) e localização da cena |
| `lib/art/*.test.ts`, `components/art/art.test.tsx` | PRNG/noise determinísticos, funil, capas e tamanho do canvas |
| `entrar/ClientAreaLogin.test.tsx` | Código, link por e-mail, link vencido, senha + 2FA, `?next=` seguro |
| `App.test.tsx` | Integração: páginas, navegação sem recarregar, CTAs, analytics, troca de idioma, tema claro, depoimentos, Instagram e WhatsApp |

```bash
npm test               # execução única
npm run test:watch     # modo watch
npm run test:coverage  # cobertura
```

> **macOS:** `components/art/Funil.tsx` e `components/art/funil.ts` têm o mesmo nome com caixa diferente. Num disco que não distingue maiúsculas (o padrão do macOS), `./Funil` resolve para `funil.ts`, e `tsc`, os testes e o build quebram com "has no exported member 'Funil'". Na Vercel (Linux) funciona. Até um dos arquivos ser renomeado, rode a verificação num disco com distinção de maiúsculas ou confie no build da Vercel.
