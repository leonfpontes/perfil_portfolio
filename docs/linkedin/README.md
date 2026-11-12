# LinkedIn: capa e foto de perfil

Na identidade Papel & Marinho do site (veja [`../DESIGN.md`](../DESIGN.md)).

| Arquivo | Uso |
|---|---|
| `banner-linkedin.png` (1584×396) e `banner-linkedin@2x.png` (3168×792) | Capa do perfil. Suba a versão @2x: o LinkedIn reduz e fica mais nítida |
| `foto-perfil.jpg` (1000×1000) | Foto de perfil |
| `preview-com-foto.png` | Simulação de como a capa fica com a foto por cima |
| `banner.html` | Fonte da capa (Roboto e Instrument Serif desta pasta) |

**A capa.** O título é o do hero do site, com "saem do papel" em serifa bronze. Ao fundo, o funil
de gates G1–G4 (a mesma geometria de `src/components/art/funil.ts`): as iniciativas entram atrás
da foto, várias param nos gates e só a linha de sinal chega à faixa marinho, onde está o endereço
do site. O canto inferior esquerdo fica livre para a foto, e o endereço fica longe da borda direita,
que o LinkedIn corta no celular.

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
