# Sistema visual — Papel & Marinho (sobre a base LP Noir)

O site é **claro sempre**: fundo papel, texto e botão principal em azul-marinho, destaque em bronze, e algumas cenas em faixas marinho com marfim e champagne para marcar o ritmo entre capítulos. Não há alternância de tema (`ThemeProvider` fixa `light`).

Por baixo está o **LP Noir**, o sistema de tokens que o site divide com a plataforma (lp-diagnostico): tipografia, raios, vidro, logo e status são os mesmos nos dois, para que quem sai de um e entra no outro não sinta que mudou de lugar.

## Como chegamos aqui

| Quando | Identidade | Por que mudou |
|---|---|---|
| até out/2026 | Papel creme, laranja-terracota e serifa elegante | Caiu na estética padrão das ferramentas de IA ("esse laranja com essa fonte é super Claude") |
| até 25/10/2026 | Modernismo brasileiro: cal, palha, mata, ocre, cobalto, azulejos de Athos Bulcão, Archivo expandida, cantos retos | Não atraía o público que a mentoria quer (profissionais e empresas de renda mais alta, que procuram seriedade) |
| 26/10/2026 | **LP Noir**: preto quente, marfim, um acento champagne, vidro | Clientes acharam o "preto e branco" frio e pediram uma cor de sobriedade e segurança |
| desde 27/10/2026 | **Papel & Marinho**, escolhida pelo Leonardo entre cinco propostas | — |

## Paleta Papel & Marinho (o site hoje)

| Papel & Marinho | Valor | Token |
|---|---|---|
| Fundo (cenas `cal` · `palha` · `ocre`) | `#F6F3EC` · `#FBF9F4` · `#ECE7DC` | `--noir-paper`, `--noir-paper-raised`, `--noir-paper-deep` |
| Texto e ação no papel | Marinho `#14213D` (14:1 no papel) | `--noir-navy` / `--action` |
| Destaque no papel | Bronze `#7A5C2E` (5,5:1) | `--noir-bronze` / `--signal` |
| Faixas marinho (cenas `mata` · `cobalto` · `anil`) | `#14213D` · `#0F1A31`, texto marfim `#F1EDE4`, ação e destaque champagne `#CFB48A` | `--noir-navy`, `--noir-navy-deep` |
| Texto secundário e borda de campo | Derivados da tinta da cena (≥4,5:1 e ≥3:1) | `--muted-foreground`, `--input` |

`--signal` é o destaque (a palavra em serifa, rótulos, marcadores); `--action` é a cor do botão principal (`Button variant="signal"`). Os dois são interpolados entre cenas junto com fundo e tinta (`SceneThemeController`).

Os nomes das classes `.tone-*` (`cal`, `palha`, `ocre`, `mata`, `cobalto`, `anil`) vêm da identidade modernista e foram mantidos para não mexer nas cenas; hoje os três primeiros são papéis e os três últimos são faixas marinho (`src/styles/globals.css`).

O retrato do hero é colorido.

## Tokens compartilhados (LP Noir)

`src/styles/lp-noir.css` é **idêntico** nos dois repositórios (no app fica em `src/lp-noir.css`), assim como `src/lib/glass-light.ts`. Altere nos dois juntos.

| Elemento | Escolha | Token |
|---|---|---|
| Fundo escuro | Onyx `#0A0A0B` | `--noir-onyx` |
| Superfície / elevado | Graphite `#131315` · Smoke `#1B1B1E` | `--noir-graphite`, `--noir-smoke` |
| Fio | `#2A2A2E` | `--noir-line` |
| Texto | Ivory `#F1EDE4` · apoio Stone `#9B968C` | `--noir-ivory`, `--noir-stone` |
| Acento | Champagne `#CFB48A`, no máximo uma vez por tela | `--noir-champagne` |
| Status | ok `#8FBF9F` · atenção `#D9B26A` · crítico `#E08A7A` | `--noir-ok`, `--noir-warn`, `--noir-crit` |
| Papel (o site, o modo claro do app, e-mails, PDFs) | `#F6F3EC` · tinta `#141416` · bronze `#7A5C2E` · marinho `#14213D` | `--noir-paper`, `--noir-ink`, `--noir-bronze`, `--noir-navy` |
| Raio | 8 px campos e etiquetas · 10 px botões e cards · 12 px painéis e modais. Nada de pílula | `--noir-radius-field`, `-card`, `-panel` |
| Fonte | **Roboto** (padrão); títulos em 500 com espaçamento justo | `--noir-font-sans` |
| Destaque | A palavra-chave do título em **Instrument Serif itálica** | `--noir-font-serif`, `highlight` |

As fontes são auto-hospedadas em `public/fonts/` (veja o `README.md` de lá) e a Roboto é pré-carregada no `index.html` e no `entrar.html`.

Os tons escuros (onyx, graphite, smoke) valem no modo escuro do app e na imagem de compartilhamento (`og-image.png`, ainda na versão Noir).

## Vidro (liquid glass)

`.glass` é o vidro translúcido: fundo que desfoca e satura o que está atrás, borda com reflexo e sombra profunda. Vai só no que **flutua sobre o conteúdo**: header (`.glass-bar`), barra móvel, legenda do retrato, o quadro "o que o preço inclui" no hero das ofertas, cards em destaque, modais e controles. Texto longo nunca fica em vidro. Com "Reduzir transparência", vira sólido.

**Luz no hover.** A construção vem do GlowCard do site da ATRA: a borda acende, um reflexo branco marca o ponto mais claro, o corpo recebe um lavado de 12% e um halo quente vaza por fora. A diferença, pedida de propósito: **o centro da luz não é o cursor.** Ele fica ancorado atrás do componente, acima do meio, e só se inclina cerca de 30% na direção do mouse, com suavização (`glass-light.ts`, ligado em `main.tsx` e em `entrar/main.tsx`). Em toque, nada se move. `.glass-spot` dentro de um `[data-glass-light]` é a luz ambiente ampla que fica atrás do vidro.

## Arte: o funil de portfólio

`components/art/Funil.tsx` (geometria e taxas em `funil.ts`). Iniciativas entram espalhadas pela esquerda e atravessam os gates **G1 Intake, G2 Business case, G3 Delivery e G4 Benefits**, a mesma metodologia da mentoria e do diagnóstico. Em cada gate algumas param, e só um feixe estreito chega ao fim, pela linha de sinal. Nada é aleatório.

No site, o funil é **SVG parado** (traço nítido em qualquer tamanho, sem custo de CPU); só um pulso percorre a linha de sinal, em CSS (`.funil-pulso` em `lp-noir.css`). No modo suave, nem o pulso. No celular os rótulos somem. A versão animada (cometas, gates que acendem, taxa de aprovação ao vivo) existe só no app (`funil-motion.ts`).

Onde aparece: hero da página inicial (montado depois do primeiro paint, `useAfterFirstPaint`), contato, 404 e Área do cliente. Continuam também:

- **`Halftone`:** fotos que se revelam de retícula de impressão para a imagem (sobre e ofertas);
- **`GenerativeCover`:** capas por produto em canvas (selo, gates, radar e curvas de nível).

`Contorno.tsx` (curvas de nível em canvas) está no repositório, mas hoje nenhuma página o usa.

## Inglês nos rótulos, português no conteúdo

Navegação (Mentoring, Diagnostic, About, Contact), botões curtos (Book a call, Client area), eyebrows de seção (How it works, Deliverables, FAQ, Testimonials…) e a marca **LP · Product & Portfolio** ficam em inglês. Títulos, textos, FAQ e metadados de SEO seguem em português. A jornada do cliente usa "Etapa"; G1–G4 ficam só para os gates da metodologia.

## Movimento — o site em cenas

A página é uma sequência de **cenas**: cada seção ocupa a tela, assume um tom e, ao sair, recua e se apaga enquanto a próxima sobe (`motion/Scene`, `SceneThemeController`). A cor muda presa à rolagem: cada cena pinta o próprio fundo e a nova sobe junto com a seção; só o header e o fundo da página fazem uma dissolução curta para o tom da cena ativa.

Seções com vários itens viram trilhos guiados pelo scroll no celular (`HorizontalTrack`), com a dica "Deslize para o lado". Depoimentos, serviços e a jornada ficam fixos enquanto o conteúdo avança. As páginas trocam com View Transitions.

**Modo suave:** quando o sistema pede "Reduzir movimento", desliga parallax, pins, trilhos forçados, Lenis e SplitText, e mantém a troca de cor das cenas, fades e a arte parada. O visitante pode escolher no aviso ou no rodapé (completo, suave ou seguir o sistema; `lp:motion`).

## Padrões de composição

- **Seções numeradas** (`§ 01`): o rótulo abre cada capítulo; a numeração de cada página vem de `PAGE_SECTIONS`.
- **Gates e etapas:** a jornada aparece como etapas ligadas por uma linha, a mesma linguagem de governança ensinada na mentoria.
- **Hero das ofertas:** preço com o quadro de vidro "o que o preço inclui" (`plans[].includes`).
- **Uma citação por vez:** cada depoimento traz nome, foto (ou iniciais) e link para o LinkedIn de quem recomendou; a aspa sobe dentro da própria caixa.
- **Capturas de produto:** tela real do app num quadro de vidro (`Shot` em `sections/Brain.tsx`): raio 12 px no quadro e 8 px na imagem, com a luz ambiente (`.glass-spot`) atrás. Só dados fictícios; a legenda diz de onde vêm.
- **Redes com a própria marca:** Instagram, WhatsApp, LinkedIn e GitHub em ícones de traço único (`common/SocialIcon`), no contato, no rodapé e na barra móvel.

## O que evitamos

- Gradiente roxo-azul, texto em gradiente, blobs coloridos.
- Spotlight que segue o cursor (a luz do vidro é ambiente).
- Arte aleatória sem significado: toda linha do funil conta a história dos gates.
- Cards idênticos com ícone em quadrado colorido, badges com ✨ e emojis decorativos.
- Foto de banco como se fosse screenshot de produto.
- Botão flutuante de WhatsApp. No mobile há uma barra discreta de vidro no rodapé.

## Componentes

| Componente | Uso |
|---|---|
| `Section` / `SectionHeader` | Toda seção numerada |
| `common/PageHero` | Hero das páginas internas (preço e o quadro "o que o preço inclui") |
| `common/SocialIcon` | Marcas das redes em traço único (`currentColor`) |
| `motion/Scene` | Cena: tom, entrada e saída coreografadas |
| `motion/SplitReveal`, `CountUp`, `Magnetic`, `HorizontalTrack`, `SceneIndicator` | Movimento |
| `art/Funil` | Funil de gates (SVG parado + pulso CSS na linha de sinal) |
| `art/Halftone`, `art/GenerativeCover` | Fotos que se revelam e capas por produto |
| `ui/button` | Variantes shadcn + `signal` (cor de ação da cena) e `glass` |
| `.glass`, `.glass-bar`, `.glass-spot` | Vidro e luz (`lp-noir.css` + `glass-light.ts`) |

## Fora do site

- **Assinatura de e-mail:** `public/images/email/` (foto, logo LP e marca em PNG 2x). Os clientes de e-mail exigem imagens hospedadas e bloqueiam SVG, por isso elas são servidas pelo site.
- **Imagem de compartilhamento:** `python3 scripts/make-og-image.py` gera `public/images/og-image.png` (1200×630).
