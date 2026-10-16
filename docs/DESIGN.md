# Sistema visual — "dossiê editorial"

O site de um consultor de governança e produto deve parecer **um relatório bem diagramado**, e não um template de startup. Toda decisão visual parte daí.

## Fundamentos

| Elemento | Escolha | Token / utilitário |
|---|---|---|
| Papel | Off-white quente | `--background` |
| Tinta | Quase-preto quente | `--foreground` |
| Sinal | Vermelhão, a **única** cor de destaque | `--signal`, `bg-signal`, `text-signal` |
| Títulos | *Instrument Serif* em tamanhos grandes, com itálico para ênfase | `display`, `font-serif` |
| Texto | *Geist* | `font-sans` |
| Metadados | *Geist Mono* em caixa alta | `label-mono` |
| Bordas | Fios de 1px; raio quase zero | `border`, `--radius: 0.125rem` |
| Fotos | P&B com contraste, mescladas ao papel, sempre com legenda "Fig. N" | `print-photo`, `<Figure>` |
| Links | Sublinhado fino que engrossa e fica vermelhão no hover | `link-rule` |

O modo escuro inverte papel e tinta e mantém o vermelhão.

## Movimento — o site em cenas

A página não é um scroll infinito: é uma sequência de **cenas**. Cada seção ocupa a tela, assume um *tom* de cor e, ao sair, recua e se apaga enquanto a próxima sobe.

| Cena | Tom | Coreografia |
|---|---|---|
| Início | papel | Retrato "impresso" de baixo para cima, título por linhas, campo de fluxo em tinta reagindo ao cursor |
| Mentoria | areia | Propostas chegam de lados opostos; preços contam até o valor |
| Jornada | papel | **Fixa**: a linha dos gates é traçada e cada etapa acende; depois, o que a mentoria não é vai sendo riscado; foto em meio-tom generativo |
| Depoimentos | tinta | **Fixa**: um depoimento por passo de scroll; a aspa gigante gira como um carimbo |
| Serviços | sinal (vermelhão) | **Fixa**: numeral-odômetro dentro de um selo circular que gira; um serviço por vez |
| Sobre | papel | Texto "acende" conforme a leitura; foto em meio-tom com lente no cursor |
| Produtos | tinta | **Trilho horizontal fixo** com capas generativas por produto |
| Trajetória | papel | Fichas empilhadas: cada experiência desliza sobre a anterior |
| Competências | noite | Faixas tipográficas em loop; o impulso do scroll acelera |
| Formação / FAQ | areia / papel | Entradas escalonadas |
| Contato | tinta | Título por caracteres, botão magnético, campo de fluxo |

**Tons** (`.tone-*` em `globals.css`) definem só 4 cores: fundo, tinta, sinal e texto-sobre-sinal. Todo o resto da paleta deriva delas com `color-mix`, então a transição entre cenas é uma interpolação de 4 variáveis feita pelo próprio navegador.

**Arte generativa** (`components/art`): campo de fluxo, meio-tom de fotos e capas por produto (selo, gates, radar e curvas de nível). Tudo é desenhado em canvas na cor da tinta da cena e pausa fora da tela.

**Acessibilidade do movimento:**
- Com `prefers-reduced-motion`, não há Lenis, pins, scrubs nem SplitText. O site vira o layout estático e os depoimentos e serviços viram carrosséis com botões.
- No celular, só as cenas que cabem na tela ficam fixas.

## Padrões de composição

- **Seções numeradas** (`§ 01 — Mentoria`): o fio superior escuro abre cada capítulo, e o rótulo fica numa coluna lateral de 3/12.
- **Listas como tabelas:** serviços, experiências e produtos usam linhas com fios, e não grades de cards.
- **Gates:** a jornada da mentoria aparece como etapas G1–G4 ligadas por uma linha, a mesma linguagem de governança ensinada na mentoria.
- **Números como ledger:** os indicadores ficam numa régua com divisórias, em serifa grande.
- **Uma citação por vez:** os depoimentos são lidos como numa revista, com navegação "Anterior / 01 de 06 / Próximo".
- **Encerramento invertido:** o contato fica em bloco de tinta, com o e-mail em tipografia grande.

## O que evitamos (anti-genérico)

- Gradientes, texto em gradiente, blobs desfocados e "glassmorphism".
- Cards idênticos com ícone num quadrado colorido.
- Badges com ✨, pontos pulsando e emojis decorativos.
- Fotos de banco coloridas "de sorriso" sem contexto. Também nunca usamos foto de banco como se fosse screenshot de produto.
- Sombras difusas para criar hierarquia: a hierarquia vem de tipografia, espaço e fios.
- Botão flutuante de WhatsApp. No mobile há uma barra discreta no rodapé.
- Movimento gratuito. Toda animação conta algo: traçar gates, riscar o que não somos, empilhar a trajetória.

## Componentes

| Componente | Uso |
|---|---|
| `Section` / `SectionHeader` | Toda seção numerada |
| `Container` | Largura máxima e gutters (`max-w-7xl`) |
| `motion/Scene` | Cena: tom de cor, entrada e saída coreografadas |
| `motion/SplitReveal` | Texto por linhas, palavras, caracteres ou "leitura" |
| `motion/CountUp`, `motion/Magnetic` | Números que contam e botões magnéticos |
| `motion/SceneIndicator` | Marcador "§ 03 / 10" e régua de progresso |
| `art/FlowField`, `art/Halftone`, `art/GenerativeCover` | Arte generativa em canvas |
| `Reveal` | Entrada discreta (fade + 8px) |
| `TrackedLink` | Link com evento de analytics e `rel` seguro para links externos |
| `Arrow` | Seta tipográfica (→ ← ↗) no lugar de ícones |
| `ui/button` | Variantes shadcn + `signal` |
| `ui/sheet` | Menu mobile |
| `ui/accordion` | FAQ |
