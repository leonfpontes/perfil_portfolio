Fontes auto-hospedadas (LP Noir, ver docs/DESIGN.md). Os mesmos arquivos existem no lp-diagnostico.

- `roboto.woff2` — Roboto (Google), SIL Open Font License 1.1. Fonte padrão.
  Variável em peso (100–900), subconjunto latino do pacote @fontsource-variable/roboto 5.x
  (`roboto-latin-wght-normal.woff2`).
- `instrument-serif-italic.woff2` — Instrument Serif itálica, SIL Open Font License 1.1.
  Só nas palavras de destaque dos títulos. Subconjunto latino do pacote
  @fontsource/instrument-serif 5.3.0 (`instrument-serif-latin-400-italic.woff2`).

A Roboto é pré-carregada no index.html e no entrar.html para não haver "salto" de layout.
