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

## Componentes

| Componente | Uso |
|---|---|
| `Section` / `SectionHeader` | Toda seção numerada |
| `Container` | Largura máxima e gutters (`max-w-7xl`) |
| `Figure` | Foto de banco com tratamento e legenda |
| `Reveal` | Entrada discreta (fade + 8px), desligada com `prefers-reduced-motion` |
| `TrackedLink` | Link com evento de analytics e `rel` seguro para links externos |
| `Arrow` | Seta tipográfica (→ ← ↗) no lugar de ícones |
| `ui/button` | Variantes shadcn + `signal` |
| `ui/sheet` | Menu mobile |
| `ui/accordion` | FAQ |
