# Arquitetura

Site estático (SPA de página única) em React 19 + TypeScript, com build do Vite e deploy na Vercel.

## Camadas

```
src/
├── content/              # DOMÍNIO — o quê o site diz
│   ├── types.ts          #   modelo tipado (SiteContent) — contrato entre conteúdo e UI
│   ├── profile.ts        #   identidade e canais (independente de idioma)
│   ├── sections.ts       #   ordem e numeração das seções (§ 01, § 02…)
│   └── locales/          #   pt-BR.ts, en.ts — um SiteContent por idioma
├── lib/                  # SERVIÇOS — como o site se comporta
│   ├── contact/          #   ContactLinkBuilder (WhatsApp, mailto, telefone)
│   ├── analytics/        #   AnalyticsTracker (interface) + GtagTracker / NoopTracker
│   ├── i18n/             #   registro de idiomas + LocaleProvider/useContent
│   ├── theme/            #   ThemeProvider (claro/escuro, persistido)
│   ├── services.tsx      #   container de DI (ServicesProvider/useServices)
│   └── storage.ts        #   localStorage tolerante a falhas
├── hooks/                # comportamento reutilizável (useInView, useActiveSection)
├── components/
│   ├── ui/               # primitivas shadcn/ui (button, sheet, accordion)
│   ├── common/           # peças do design system (Section, Container, Figure, Reveal…)
│   └── layout/           # Header, Footer
├── sections/             # APRESENTAÇÃO — uma seção da página por arquivo
├── App.tsx               # composição: registro seção → componente
└── main.tsx              # bootstrap: providers + render
```

O fluxo de dependências é **sections → components/common → lib → content**. O conteúdo não importa nada de UI.

## Decisões

| Decisão | Por quê |
|---|---|
| **Conteúdo tipado em TS, não JSON nem CMS** | Garante, em tempo de compilação, que os dois idiomas tenham o mesmo formato. Um teste reforça a paridade de estrutura e de campos invariantes (ids, links, status). |
| **DI via contexto (`ServicesProvider`)** | Os componentes dependem de `AnalyticsTracker`, não do `gtag`. Nos testes, um fake é injetado sem mocks globais. |
| **Classes para serviços, funções para UI** | `ContactLinkBuilder` encapsula e valida o telefone uma única vez (POO). Componentes React continuam funcionais e sem estado oculto. |
| **Registro de seções (`SECTION_ORDER` + mapa em `App.tsx`)** | A ordem da página e a numeração dos cabeçalhos vêm da mesma lista. Reordenar o funil é editar uma linha. |
| **shadcn/ui** | Os componentes ficam no repositório, então são adaptáveis ao design editorial (ex.: a variante `signal` do `Button`). O Radix fornece a acessibilidade do Sheet e do Accordion. |
| **Analytics como abstração** | Trocar o GA4 por Plausible, PostHog etc. é criar uma nova classe que implementa `AnalyticsTracker`, sem tocar em componentes. |
| **Sem roteador** | É uma página única com âncoras. Menos dependências e melhor SEO para uma landing page. |

## Testes

| Arquivo | Cobre |
|---|---|
| `lib/contact/ContactLinkBuilder.test.ts` | Codificação de URLs, formatação e validação |
| `lib/analytics/AnalyticsTracker.test.ts` | Factory, fallback e tolerância a erro |
| `lib/i18n/registry.test.ts` | Resolução do idioma inicial |
| `content/content.test.ts` | Paridade pt-BR/EN, navegação × seções, regra de confidencialidade |
| `App.test.tsx` | Integração: renderização, CTAs, analytics, troca de idioma, tema, depoimentos |

```bash
npm test               # execução única
npm run test:watch     # modo watch
npm run test:coverage  # cobertura
```
