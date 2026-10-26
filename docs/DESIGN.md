# Sistema visual — LP Noir

Em outubro de 2026 a identidade "modernismo brasileiro" (cal, palha, mata, ocre e cobalto, azulejos e cantos retos) saiu: não atraía o público que a mentoria quer, profissionais e empresas de renda mais alta, que procuram seriedade. O **LP Noir** é escuro, sóbrio e premium, e é **o mesmo sistema no site e na plataforma** (lp-diagnostico): quem sai de um e entra no outro não deve sentir que mudou de lugar.

A mudança foi só de identidade. Cenas, pins, trilhos horizontais, transições de rota e o modo suave continuam exatamente como antes (seção "Movimento" abaixo).

## Tokens compartilhados

`src/styles/lp-noir.css` é **idêntico** nos dois repositórios (no app fica em `src/lp-noir.css`), assim como `src/lib/glass-light.ts`. Altere nos dois juntos.

| Elemento | Escolha | Token |
|---|---|---|
| Fundo | Onyx `#0A0A0B` | `--noir-onyx` |
| Superfície / elevado | Graphite `#131315` · Smoke `#1B1B1E` | `--noir-graphite`, `--noir-smoke` |
| Fio | `#2A2A2E` | `--noir-line` |
| Texto | Ivory `#F1EDE4` · apoio Stone `#9B968C` | `--noir-ivory`, `--noir-stone` |
| Acento | Champagne `#CFB48A`, no máximo uma vez por tela | `--noir-champagne` |
| Status | ok `#8FBF9F` · atenção `#D9B26A` · crítico `#E08A7A` | `--noir-ok`, `--noir-warn`, `--noir-crit` |
| Papel (modo claro do app, e-mails, PDFs) | `#F6F3EC` · tinta `#141416` · bronze `#7A5C2E` | `--noir-paper`, `--noir-ink`, `--noir-bronze` |
| Raio | 8 px campos e etiquetas · 10 px botões e cards · 12 px painéis e modais. Nada de pílula | `--noir-radius-field`, `-card`, `-panel` |
| Fonte | **Roboto** (padrão); títulos em 500 com espaçamento justo | `--noir-font-sans` |
| Destaque | A palavra-chave do título em **Instrument Serif itálica** champagne | `--noir-font-serif`, `highlight` |

O site é escuro sempre (não há alternância de tema). As classes `.tone-*` das cenas foram mantidas, mas agora alternam entre tons de preto (onyx, graphite, smoke e um preto profundo): o contraste entre capítulos vem da luz, não da cor.

## Vidro (liquid glass)

`.glass` é o vidro translúcido: fundo que desfoca e satura o que está atrás, borda com reflexo e sombra profunda. Vai só no que **flutua sobre o conteúdo**: header (`.glass-bar`), barra móvel, legenda do retrato, cards em destaque, modais e controles. Texto longo nunca fica em vidro. Com "Reduzir transparência", vira Graphite sólido.

**Luz no hover.** A construção vem do GlowCard do site da ATRA: a borda acende em champagne, um reflexo branco marca o ponto mais claro, o corpo recebe um lavado de 12% e um halo quente vaza por fora. A diferença, pedida de propósito: **o centro da luz não é o cursor.** Ele fica ancorado atrás do componente, acima do meio, e só se inclina cerca de 30% na direção do mouse, com suavização (`glass-light.ts`). Em toque, nada se move. `.glass-spot` dentro de um `[data-glass-light]` é a luz ambiente ampla que fica atrás do vidro.

## Arte: o funil de portfólio

`components/art/Funil.tsx` (geometria e taxas em `funil.ts`; SVG parado, só um pulso champagne corre pela linha de sinal, em CSS). Iniciativas entram espalhadas pela esquerda e atravessam os gates **G1 Intake, G2 Business case, G3 Delivery e G4 Benefits**, a mesma metodologia da mentoria e do diagnóstico. Em cada gate algumas param, e só um feixe estreito chega ao fim, com a linha de sinal em champagne. Nada é aleatório: o desenho é SVG com traço nítido em qualquer tamanho.

Movimento: as linhas se desenham na entrada; depois, iniciativas fluem como cometas curtos, cada gate acende no ponto de passagem, as barradas se apagam num anel e cada rótulo mostra a taxa de aprovação ao vivo. Com o mouse perto de um gate, ele se destaca. No celular os rótulos somem; no modo suave fica só o desenho parado.

A substituiu os azulejos no hero, no painel das páginas internas, no contato, na 404 e na Área do cliente. As capas por produto (`GenerativeCover`) e as fotos que se revelam (`Halftone`) continuam.

## Inglês nos rótulos, português no conteúdo

Navegação (Mentoring, Diagnostic, About, Contact), botões curtos (Book a call, Client area), eyebrows de seção (How it works, Deliverables, FAQ, Testimonials…) e a marca **LP · Product & Portfolio** ficam em inglês. Títulos, textos, FAQ e metadados de SEO seguem em português.

## Movimento — o site em cenas (inalterado)

A página é uma sequência de **cenas**: cada seção ocupa a tela, assume um tom e, ao sair, recua e se apaga enquanto a próxima sobe (`motion/Scene`, `SceneThemeController`). Seções com vários itens viram trilhos guiados pelo scroll no celular (`HorizontalTrack`). Depoimentos, serviços e a jornada ficam fixos enquanto o conteúdo avança. As páginas trocam com View Transitions.

**Modo suave:** quando o sistema pede "Reduzir movimento", desliga parallax, pins, trilhos forçados, Lenis e SplitText, e mantém a troca de cor das cenas, fades e a arte parada. O visitante pode escolher no aviso ou no rodapé (`lp:motion`).

## O que evitamos

- Gradiente roxo-azul, texto em gradiente, blobs coloridos.
- Spotlight que segue o cursor (a luz do vidro é ambiente).
- Arte aleatória sem significado: toda linha conta a história dos gates.
- Cards idênticos com ícone em quadrado colorido, badges com ✨ e emojis decorativos.
- Botão flutuante de WhatsApp. No mobile há uma barra discreta de vidro no rodapé.

## Componentes

| Componente | Uso |
|---|---|
| `Section` / `SectionHeader` | Toda seção numerada |
| `motion/Scene` | Cena: tom, entrada e saída coreografadas |
| `motion/SplitReveal`, `CountUp`, `Magnetic`, `HorizontalTrack`, `SceneIndicator` | Movimento (inalterado) |
| `art/Funil` | Funil de gates (SVG parado + pulso CSS na linha de sinal) |
| `art/Halftone`, `art/GenerativeCover` | Fotos que se revelam e capas por produto |
| `ui/button` | Variantes shadcn + `signal` (champagne) e `glass` |
| `.glass`, `.glass-bar`, `.glass-spot` | Vidro e luz (lp-noir.css) |
