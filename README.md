<div align="center">

# Leonardo Pontes · LP · Product & Portfolio

**Mentoria de produto e diagnóstico de PMO que saem do papel.**

Mentoria 1:1 para PMs, POs e líderes de produto, e diagnóstico de maturidade de PMO e portfólio
para empresas, por quem lidera produtos e PMOs há mais de 8 anos.

[**leopontes.com.br**](https://www.leopontes.com.br) ·
[Área do cliente](https://www.leopontes.com.br/entrar) ·
[LinkedIn](https://www.linkedin.com/in/leonardo-fonseca-pontes-465740103/) ·
[Instagram](https://www.instagram.com/pontes_brain/) ·
[WhatsApp](https://wa.me/5516991091234)

![Página inicial: as duas ofertas com preço logo na primeira tela](docs/assets/readme/home.jpg)

</div>

---

## Sumário

- [O que eu ofereço](#o-que-eu-ofereço)
- [Vitrine](#vitrine)
- [Sobre este repositório](#sobre-este-repositório)
- [Mapa da infraestrutura](#mapa-da-infraestrutura)
- [Stack](#stack)
- [Passo a passo para desenvolvedores](#passo-a-passo-para-desenvolvedores)
- [Documentação](#documentação)

## O que eu ofereço

| | Mentoria 1:1 em Produto & Portfólio | Diagnóstico de Maturidade de PMO & Portfólio |
|---|---|---|
| **Para quem** | PMs, POs, Product Designers, gerentes de projeto e líderes de PMO | Empresas com projetos demais, prioridades em disputa e pouca visibilidade do valor |
| **Como** | 2 sessões de 60 min por mês, online, e WhatsApp entre as sessões | 2 a 3 semanas: entrevistas, maturidade por etapa da metodologia, roadmap priorizado e apresentação executiva |
| **Investimento** | **R$ 997/mês** (5 vagas fundador), depois R$ 1.497/mês; sem fidelidade | **R$ 7.500** (3 vagas fundador), depois R$ 12.000; implementação sob proposta |
| **Página** | [/mentoria-produto](https://www.leopontes.com.br/mentoria-produto) | [/diagnostico-pmo](https://www.leopontes.com.br/diagnostico-pmo) |

Quem já é cliente acompanha tudo pela plataforma
[LP Diagnóstico](https://app.leopontes.com.br), com entrada pela
[Área do cliente](https://www.leopontes.com.br/entrar) do site.

**→ [Agendar uma conversa gratuita de 30 minutos](https://wa.me/5516991091234)**

## Vitrine

| Mentoria de produto | Diagnóstico de PMO |
|---|---|
| ![Página da mentoria: título e o quadro com o que o preço inclui](docs/assets/readme/mentoria.jpg) | ![Página do diagnóstico: título, o que o preço inclui e os números da oferta](docs/assets/readme/diagnostico.jpg) |

| Início, no celular | Diagnóstico, no celular | Área do cliente |
|---|---|---|
| <img src="docs/assets/readme/home-celular.jpg" alt="Início no celular, com as duas ofertas" width="240"> | <img src="docs/assets/readme/diagnostico-celular.jpg" alt="Página do diagnóstico no celular" width="240"> | <img src="docs/assets/readme/entrar-celular.jpg" alt="Entrada da Área do cliente: código e link por e-mail" width="240"> |

## Sobre este repositório

O site é a vitrine da prática e também uma amostra de como eu trabalho: produto bem definido,
código limpo, testes e documentação.

**Páginas com endereço próprio, navegação sem recarregar.** Cada rota sai do build como um HTML
completo, com título, descrição, Open Graph e dados estruturados próprios, para os buscadores e
para quem compartilha o link. Entre as páginas, um roteador próprio troca o conteúdo sem
recarregar, com View Transitions: o cabeçalho fica parado e a página nova sobe.

| Rota | Conteúdo |
|---|---|
| `/` | As duas ofertas com preço, depoimentos, quem conduz, contato |
| `/mentoria-produto` | Para quem é, o que trabalhamos, preço, como funciona, perguntas frequentes |
| `/diagnostico-pmo` | Etapas (Conversa inicial → Diagnóstico → Plano de ação → Execução acompanhada), entregáveis, preço, perguntas frequentes |
| `/sobre` | História, produtos autorais, trajetória, competências, formação |
| `/brain` | Página de produto do Brain Copilot (o vault do Obsidian como um cérebro 3D, com o Barão e a equipe de agentes): capturas reais do app, recursos, celular, como usa a Conta do Google, o login em `brain.leopontes.com.br` e, no fim, o convite para conversar. É também a página inicial que o Google confere na verificação do app |
| `/entrar` | Área do cliente: entrada na plataforma por código ou link por e-mail (`noindex`) |
| qualquer outra | 404 de verdade (`noindex`) |

**Identidade: Papel & Marinho, sobre a base LP Noir.** Fundo papel, texto e botão principal em
azul-marinho, destaque em bronze, e faixas marinho com marfim e champagne para marcar o ritmo entre
capítulos. Roboto, com a palavra de destaque em Instrument Serif itálica; cantos de 8 a 12 px;
vidro translúcido com luz de borda no que flutua; rótulos e botões em inglês, conteúdo em
português. A arte é um funil de portfólio que atravessa os gates G1–G4. A plataforma
(lp-diagnostico) usa os mesmos tokens (`src/styles/lp-noir.css`). Cada capítulo da página é uma
**cena** que muda o fundo enquanto você rola. Quem pede menos movimento vê uma versão suave, sem
parallax. A história das identidades e os tokens estão em [`docs/DESIGN.md`](docs/DESIGN.md).

**Prova social.** Os depoimentos são recomendações do LinkedIn, com nome, foto e link para o perfil
de quem recomendou.

**SEO.** Título e H1 por página mirando as buscas da oferta. O JSON-LD traz `Person`,
`ProfessionalService`, `Service` + `Offer` com os preços reais (lidos do conteúdo), `FAQPage` onde
há perguntas visíveis e `BreadcrumbList`. O `sitemap.xml` é gerado das rotas no build.

## Mapa da infraestrutura

```mermaid
flowchart LR
  V[Visitante] --> W
  C[Cliente] --> W

  subgraph W["www.leopontes.com.br · Vercel"]
    H["HTML pré-renderizado por rota<br/>/, /mentoria-produto, /diagnostico-pmo, /sobre, /brain, 404"]
    E["/entrar<br/>Área do cliente"]
  end

  W -- "WhatsApp e e-mail<br/>(links com mensagem pronta)" --> L[Leonardo]
  W -- "page_view e cliques<br/>(carrega com a página ociosa)" --> GA[Google Analytics 4]
  E -- "fetch com cookie (CORS)<br/>/api/auth/*" --> APP["app.leopontes.com.br<br/>LP Diagnóstico"]
  E -- "login certo: cortina e navegação" --> APP
  GH["GitHub · main"] -- "deploy automático" --> W
  MON["GitHub Actions<br/>monitor a cada 10 min"] -- "/, /entrar, /healthz" --> W
  MON --> APP
  MON -- "caiu / voltou<br/>(Resend)" --> L
```

- **Hospedagem**: Vercel, servindo `dist/` com URLs limpas (`/sobre` → `sobre.html`), cache
  imutável em `/assets` e `/fonts`, e cabeçalhos de segurança em [`vercel.json`](vercel.json).
- **DNS**: `leopontes.com.br` no Registro.br; o domínio sem `www` redireciona para o `www`.
- **Área do cliente**: o `/entrar` fala com a API da plataforma (`VITE_APP_URL`, padrão
  `https://app.leopontes.com.br`). O cookie de sessão funciona entre `www` e `app` porque os dois
  são o mesmo site, `leopontes.com.br`. O desenho completo está no repositório da plataforma, em
  `docs/publicacao.md`.
- **Monitor de disponibilidade**: um workflow do GitHub Actions
  ([`disponibilidade.yml`](.github/workflows/disponibilidade.yml)) confere o site, o `/entrar` e o
  `/healthz` da plataforma a cada 10 minutos, fora da Vercel. Só manda e-mail (Resend) quando algo
  cai e quando volta. Segredos: `RESEND_API_KEY` e `ALERTA_EMAIL`.
- **Assinatura de e-mail**: as imagens (foto, logo e marca LP) são servidas pelo site, em
  `public/images/email/`.

## Stack

| Camada | Escolha |
|---|---|
| Interface | React 19 + TypeScript `strict` |
| Estilo | Tailwind CSS 4 + componentes [shadcn/ui](https://ui.shadcn.com) (Radix); tokens LP Noir divididos com a plataforma |
| Tipografia | Roboto e Instrument Serif itálica, auto-hospedadas em `public/fonts/` |
| Movimento | GSAP (ScrollTrigger, SplitText) + Lenis; funil de gates em SVG, fotos que se revelam e capas generativas em canvas, com PRNG determinístico |
| Navegação | Roteador próprio com View Transitions, sem dependência nova; voltar e avançar restauram a rolagem |
| Build | Vite com pré-renderização: `vite build`, `vite build --ssr` e `scripts/prerender.mjs`, que gera um HTML por rota e o sitemap |
| Conteúdo | Modelo tipado, em pt-BR e EN, separado da apresentação |
| Testes | Vitest + Testing Library (103 testes): rotas, HTML de cada página, SEO e JSON-LD, navegação, conteúdo nos dois idiomas |
| Qualidade | Lighthouse 100 em acessibilidade, boas práticas e SEO |
| Deploy | Vercel, ligado ao GitHub |
| Analytics | Google Analytics 4 atrás de uma interface própria (`AnalyticsTracker`) |

**Princípios.** Serviços com uma responsabilidade (`ContactLinkBuilder`, `AnalyticsTracker`),
injetados por contexto; idiomas e seções entram por registro, sem mexer em quem consome; nenhuma
string solta nos componentes; peças-base reaproveitadas (`Scene`, `SplitReveal`,
`useSteppedScene`, `SectionHeader`, `TrackedLink`). Os testes garantem que pt-BR e EN têm a mesma
estrutura e que nenhum cliente confidencial é citado.

## Passo a passo para desenvolvedores

### 1. Preparar

Requisitos: Node 20 ou mais novo (o projeto é desenvolvido no **Node 24**) e npm.

> **No macOS**, `src/components/art/Funil.tsx` e `funil.ts` colidem num disco sem distinção de
> maiúsculas, e `typecheck`, `test` e `build` quebram localmente (na Vercel, que roda em Linux,
> funciona). Detalhes em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#testes).

```bash
git clone git@github.com:leonfpontes/perfil_portfolio.git
cd perfil_portfolio
npm install
```

### 2. Rodar

```bash
npm run dev
```

O site abre em http://localhost:3000. Para testar a Área do cliente contra a plataforma rodando
na sua máquina, crie um `.env.local` com `VITE_APP_URL` apontando para ela (por exemplo
`http://localhost:3300`). No servidor da plataforma, a origem do site precisa estar em
`SITE_ORIGINS`.

### 3. Conferir antes de abrir um PR

```bash
npm run typecheck
```

```bash
npm test
```

```bash
npm run build
```

Depois do build, `npm run preview` serve o `dist/` em http://localhost:4173. Confira o HTML cru de
cada rota (título, H1, preços) e o celular a 375 px.

### 4. Publicar

Merge na `main` → a Vercel publica sozinha. Pull requests ganham um preview.

### Scripts

| Script | Para quê |
|---|---|
| `npm run dev` | Servidor de desenvolvimento em :3000 |
| `npm run build` | Tipos, build do cliente e do servidor, pré-renderização e sitemap em `dist/` |
| `npm run preview` | Serve o `dist/` em :4173 |
| `npm test` / `test:watch` / `test:coverage` | Testes |
| `scripts/lh-median.sh <url> [rodadas]` | Mediana de várias rodadas do Lighthouse mobile (uma rodada só oscila muito) |
| `python3 scripts/make-og-image.py` | Gera a imagem de compartilhamento (`public/images/og-image.png`, 1200×630) |
| `node scripts/disponibilidade.mjs` | Roda o monitor de disponibilidade uma vez (sem `RESEND_API_KEY`, só registra) |

### Onde mexer

| Para mudar | Arquivo |
|---|---|
| Textos, preços, FAQ, depoimentos | `src/content/locales/pt-BR.ts` e `en.ts` (veja [`docs/CONTENT.md`](docs/CONTENT.md)) |
| Fotos de quem recomendou | `public/testimonials/` |
| Contatos, links e identidade | `src/content/profile.ts` |
| Rotas, seções de cada página e âncoras antigas | `src/lib/router/routes.ts` |
| Título, descrição e JSON-LD de cada página | `src/seo/head.ts` |
| Tokens compartilhados (cores LP Noir, raios, vidro, funil) | `src/styles/lp-noir.css` e `src/lib/glass-light.ts`: idênticos no lp-diagnostico, mude os dois juntos |
| Tons de cena e estilos só do site | `src/styles/globals.css` |

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): páginas, camadas, fluxo de dados e decisões.
- [`docs/CONTENT.md`](docs/CONTENT.md): como editar textos, preços, produtos e idiomas.
- [`docs/DESIGN.md`](docs/DESIGN.md): o sistema visual Papel & Marinho, a base LP Noir e a história das identidades.
- [`AGENTS.md`](AGENTS.md) e [`CLAUDE.md`](CLAUDE.md): guia para agentes de código (Claude Code, Codex e outros) trabalharem no repositório.

---

<div align="center">

**Precisa estruturar o portfólio da sua empresa ou acelerar a sua carreira em produto?**

[Fale comigo no WhatsApp](https://wa.me/5516991091234) · [Conecte-se no LinkedIn](https://www.linkedin.com/in/leonardo-fonseca-pontes-465740103/)

<sub>© Leonardo Fonseca Pontes · LP · Product & Portfolio</sub>

</div>
