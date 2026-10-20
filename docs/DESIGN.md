# Sistema visual — modernismo brasileiro

O site precisa parecer **de autor**, e não gerado. A primeira versão (papel creme, laranja-terracota e serifa elegante) caiu justamente na estética padrão das ferramentas de IA de 2026, e foi descartada a partir de feedback real ("esse laranja com essa fonte é super Claude").

A identidade atual vem do modernismo brasileiro: os painéis de azulejo de Athos Bulcão, os cartazes dos anos 60 e a paleta dos jardins e da arquitetura modernista. É pessoal (Brasil, Ribeirão Preto, GiraHub) e não se confunde com template.

## Fundamentos

| Elemento | Escolha | Token / utilitário |
|---|---|---|
| Paleta de marca | **cal** (branco de parede), **palha**, **mata** (verde profundo), **ocre**, **cobalto** (azul), **anil** (noite), **breu** (tinta) | `--cal`, `--palha`, `--mata`, `--ocre`, `--azul`, `--anil`, `--breu` |
| Tons de cena | Cada capítulo assume um tom: cal, palha, mata, ocre, cobalto ou anil | `.tone-*` |
| Tipografia | **Archivo** (Omnibus-Type, foundry latino-americana), variável em peso e largura | `font-sans`, `font-display` |
| Títulos | Archivo expandida (118%) e pesada (750), como em cartaz | `display` |
| Destaque | Bloco de cor atrás da palavra, no lugar do itálico | `highlight` |
| Rótulos | Caixa alta, levemente expandida e espaçada (sem fonte mono) | `label-caps` |
| Bordas | Fios de 1px, cantos retos | `--radius: 0` |
| Arte | Azulejos generativos, fotos que se revelam (retícula → duotônico) e capas por produto | `art/Azulejo`, `art/Halftone`, `art/GenerativeCover` |

O modo escuro usa um verde-quase-preto. As cenas "mata" se invertem para cal, para manter o contraste entre capítulos.

## Movimento — o site em cenas

A página não é um scroll infinito: é uma sequência de **cenas**. Cada seção ocupa a tela, assume um *tom* de cor e, ao sair, recua e se apaga enquanto a próxima sobe.

| Cena | Tom | Coreografia |
|---|---|---|
| Início | papel | Retrato "impresso" de baixo para cima, título por linhas, campo de fluxo em tinta reagindo ao cursor |
| Mentoria | areia | Propostas chegam de lados opostos; preços contam até o valor |
| Jornada | papel | **Fixa**: a linha dos gates é traçada e cada etapa acende; depois, o que a mentoria não é vai sendo riscado; foto que se revela de retícula em duotônico |
| Depoimentos | tinta | **Fixa**: um depoimento por passo de scroll; a aspa gigante gira como um carimbo |
| Serviços | sinal (vermelhão) | **Fixa**: numeral-odômetro dentro de um selo circular que gira; um serviço por vez |
| Sobre | papel | Texto "acende" conforme a leitura; foto que se revela, com lupa no cursor |
| Produtos | tinta | **Trilho horizontal fixo** com capas generativas por produto |
| Trajetória | papel | Fichas empilhadas: cada experiência desliza sobre a anterior |
| Competências | noite | Faixas tipográficas em loop; o impulso do scroll acelera |
| Formação / FAQ | areia / papel | Entradas escalonadas |
| Contato | tinta | Título por caracteres, botão magnético, campo de fluxo |

**Tons** (`.tone-*` em `globals.css`) definem só 4 cores: fundo, tinta, sinal e texto-sobre-sinal. Todo o resto da paleta deriva delas com `color-mix`, recalculado em cada seção.

**Arte generativa** (`components/art`):
- **Azulejos:** painel com módulos geométricos em cores de marca. A composição muda a cada visita, um azulejo gira de tempos em tempos e o que está sob o cursor também gira.
- **Fotos que se revelam:**
  - a foto entra como retícula de impressão;
  - ao chegar no centro da tela, os pontos se fundem num duotônico da marca (breu sobre cal);
  - no desktop, o cursor é uma lupa que mostra a foto antes;
  - as cores são fixas, então em qualquer tema a foto é uma impressão positiva (nunca negativo);
  - no modo suave, aparece pronta.

  A retícula pura foi descartada porque as pessoas não reconheciam o que as fotos mostravam.
- **Capas por produto:** selo, gates, radar e curvas de nível.

Tudo é desenhado em canvas e pausa fora da tela.

**Transição de cor presa à rolagem:** cada cena pinta o próprio fundo, e a nova cor sobe junto com a seção, como uma folha deslizando sobre a anterior, com sombra na borda.
- Não há troca por tempo ("estalo") nem mistura intermediária ("cinza lamacento").
- Só o header e o fundo da página fazem uma dissolução curta para o tom da cena ativa.

**Celular — trilhos horizontais:** no mobile, as seções com vários itens viram trilhos guiados pelo scroll (`HorizontalTrack`):
- planos, gates da jornada, depoimentos, serviços, produtos e trajetória;
- cada painel cabe inteiro numa tela e "encaixa" ao soltar o dedo;
- nada é cortado e um painel custa cerca de meia tela de rolagem.

Também no celular:
- as cenas não se apagam enquanto você lê (só a entrada é animada);
- textos longos ficam atrás de "Ler mais";
- as certificações mostram as 5 primeiras.

**Movimento e acessibilidade — modo suave:** quando o sistema pede "Reduzir movimento", o site *não* fica estático.
- **Desliga o que pode causar enjoo:** parallax, scroll travado (pins), trilhos forçados, Lenis e SplitText.
- **Mantém o que dá identidade sem deslocar a tela:** troca de cor das cenas (que já acompanha a rolagem), fades e a arte (parada).
- **Escolha do visitante:** um aviso discreto oferece "Ver animações completas", e o rodapé permite alternar entre completo, suave e "seguir o sistema" (`lp:motion`).
- **No celular,** só as cenas que cabem na tela ficam fixas.

## Padrões de composição

- **Seções numeradas** (`§ 01 — Mentoria`): o fio superior escuro abre cada capítulo, e o rótulo fica numa coluna lateral de 3/12.
- **Listas como tabelas:** serviços, experiências e produtos usam linhas com fios, e não grades de cards.
- **Gates:** a jornada da mentoria aparece como etapas G1–G4 ligadas por uma linha, a mesma linguagem de governança ensinada na mentoria.
- **Números como ledger:** os indicadores ficam numa régua com divisórias, em serifa grande.
- **Uma citação por vez:** os depoimentos são lidos como numa revista, com navegação "Anterior / 01 de 06 / Próximo".
- **Encerramento invertido:** o contato fica em bloco de tinta, com o e-mail em tipografia grande.

## O que evitamos (anti-genérico)

- A estética padrão das IAs: papel creme com laranja-terracota e serifa "editorial", fontes mono em rótulos, gradiente roxo-azul.
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
| `motion/HorizontalTrack` | Trilho horizontal guiado pelo scroll (com encaixe), em qualquer breakpoint |
| `motion/SceneIndicator` | Marcador "§ 03 / 10" e régua de progresso (telas ≥ 1536px) |
| `art/FlowField`, `art/Halftone`, `art/GenerativeCover` | Arte generativa em canvas |
| `Reveal` | Entrada discreta (fade + 8px) |
| `TrackedLink` | Link com evento de analytics e `rel` seguro para links externos |
| `Arrow` | Seta tipográfica (→ ← ↗) no lugar de ícones |
| `ui/button` | Variantes shadcn + `signal` |
| `ui/sheet` | Menu mobile |
| `ui/accordion` | FAQ |
