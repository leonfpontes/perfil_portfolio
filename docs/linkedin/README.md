# LinkedIn: capa e foto de perfil

Na identidade Papel & Marinho do site (veja [`../DESIGN.md`](../DESIGN.md)).

| Arquivo | Uso |
|---|---|
| `banner-linkedin.png` (1584×396) e `banner-linkedin@2x.png` (3168×792) | Capa do perfil. Suba a versão @2x: o LinkedIn reduz e fica mais nítida |
| `foto-perfil.jpg` (1000×1000) | Foto de perfil |
| `preview-com-foto.png` | Simulação de como a capa fica com a foto por cima |
| `banner.html` | Fonte da capa (Roboto e Instrument Serif desta pasta) |

**A capa.** Foi desenhada em volta da foto de perfil, medida no LinkedIn real: no desktop a capa
aparece a 74% do tamanho, no celular a 45%, e a foto cobre o canto inferior esquerdo (até x≈490 e
de y≈200 para baixo no celular). Por isso o título ocupa a faixa de cima, o endereço fica embaixo,
à direita da foto, e nenhum texto importante tem menos de 26 px.

A arte nasce da foto: os gates da metodologia (G1 Intake, G2 Business case, G3 Delivery,
G4 Benefits) são anéis que irradiam dela. Muitas iniciativas param no G1, cada vez menos nos anéis
seguintes, e a linha bronze sai da foto, cruza os quatro gates e chega ao endereço do site.
`preview-com-foto.png` mostra a capa com a foto nas duas medidas (desktop à esquerda, celular à
direita).

**A foto.** É o retrato do site, sem alteração no rosto, sobre um fundo de estúdio marinho com luz
suave atrás da cabeça.

## Gerar de novo

Capa: abra `banner.html` num navegador com janela de 1584×396 e tire a captura (fator 1 e 2). Por
exemplo, com o Playwright:

```js
const page = await browser.newPage({ viewport: { width: 1584, height: 396 }, deviceScaleFactor: 2 });
await page.goto('file://' + caminhoDoBanner);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'banner-linkedin@2x.png' });
```

Foto:

```bash
python3 scripts/make-profile-photo.py public/images/leonardo-portrait.webp docs/linkedin/foto-perfil && rm docs/linkedin/foto-perfil.png
```
