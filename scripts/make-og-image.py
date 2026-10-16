"""
Gera public/images/og-image.png (1200x630) — o card exibido quando o link do
site é compartilhado (LinkedIn, WhatsApp, Slack…). Mesma identidade do site:
modernismo brasileiro — cal, mata, ocre e cobalto, Archivo expandida e um
painel de azulejos atrás do retrato.

Uso: python3 scripts/make-og-image.py
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "public" / "fonts" / "archivo-latin-wdth-normal.woff2"
PORTRAIT = ROOT / "scripts" / "assets" / "portrait-cutout.png"
OUT = ROOT / "public" / "images" / "og-image.png"

W, H = 1200, 630
CAL = (247, 247, 242)
BREU = (19, 38, 31)
MATA = (20, 81, 63)
OCRE = (240, 180, 41)
AZUL = (45, 79, 179)
MUTED = (96, 110, 104)


def font(size: int, weight: int, width: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONT), size)
    f.set_variation_by_axes([weight, width])
    return f


def azulejo_wall(w: int, h: int, size: int, seed: int) -> Image.Image:
    """Painel de azulejos (mesmos módulos do componente Azulejo.tsx)."""
    rnd = random.Random(seed)
    pairs = [(AZUL, CAL), (CAL, AZUL), (OCRE, BREU), (MATA, OCRE), (CAL, MATA), (AZUL, OCRE), (OCRE, AZUL), (CAL, OCRE)]
    scale = 4  # desenha grande e reduz (bordas suaves)
    s = size * scale
    wall = Image.new("RGB", (math.ceil(w / size) * s, math.ceil(h / size) * s))
    for row in range(math.ceil(h / size)):
        for col in range(math.ceil(w / size)):
            bg, fg = rnd.choice(pairs)
            tile = Image.new("RGB", (s, s), bg)
            d = ImageDraw.Draw(tile)
            motif = rnd.randint(0, 5)
            if motif == 0:
                d.pieslice((-s, -s, s, s), 0, 90, fill=fg)
            elif motif == 1:
                d.pieslice((0, s // 2, s, s + s // 2), 180, 360, fill=fg)
            elif motif == 2:
                d.polygon([(0, 0), (s, 0), (0, s)], fill=fg)
            elif motif == 3:
                d.pieslice((-s // 2, -s // 2, s // 2, s // 2), 0, 90, fill=fg)
                d.pieslice((s // 2, s // 2, s + s // 2, s + s // 2), 180, 270, fill=fg)
            elif motif == 4:
                r = int(s * 0.3)
                d.ellipse((s // 2 - r, s // 2 - r, s // 2 + r, s // 2 + r), fill=fg)
            else:
                d.rectangle((0, 0, s, s // 2), fill=fg)
            wall.paste(tile.rotate(90 * rnd.randint(0, 3)), (col * s, row * s))
    wall = wall.resize((wall.width // scale, wall.height // scale), Image.LANCZOS)
    return wall.crop((0, 0, w, h))


img = Image.new("RGB", (W, H), CAL)
d = ImageDraw.Draw(img)
M = 64

# Painel de azulejos + retrato em P&B por cima (mesma composição do hero).
panel = (812, 0, W, H)
img.paste(azulejo_wall(panel[2] - panel[0], H, 56, seed=7), (panel[0], 0))
portrait = Image.open(PORTRAIT).convert("RGBA")
gray = ImageOps.autocontrast(ImageOps.grayscale(portrait.convert("RGB")), cutoff=1)
bw = Image.merge("RGBA", (gray, gray, gray, portrait.getchannel("A")))
target_h = H - 70
bw = bw.resize((round(bw.width * target_h / bw.height), target_h), Image.LANCZOS)
img.paste(bw, (panel[0] + (panel[2] - panel[0] - bw.width) // 2, H - target_h), bw)

# Rótulo e fio, como no cabeçalho do site.
d.text((M, 54), "LP  |  PRODUTO & PORTFÓLIO", font=font(19, 650, 112), fill=MUTED)
d.rectangle((M, 92, 760, 94), fill=BREU)

# Título de cartaz: Archivo expandida e pesada, destaque em bloco cobalto.
title = font(70, 800, 116)
d.text((M - 3, 116), "Produto,", font=title, fill=BREU)
d.text((M - 3, 190), "portfólio e IA que", font=title, fill=BREU)
hl = "saem do papel."
x0, y0 = M - 3, 270
bbox = d.textbbox((x0, y0), hl, font=title)
d.rectangle((bbox[0] - 10, bbox[1] - 10, bbox[2] + 10, bbox[3] + 14), fill=AZUL)
d.text((x0, y0), hl, font=title, fill=CAL)

# Oferta + quem.
d.rectangle((M, 452, M + 14, 466), fill=OCRE)
d.text((M + 28, 448), "MENTORIA 1:1 · CONSULTORIA · VAGAS FUNDADOR", font=font(17, 650, 112), fill=BREU)
d.text((M, 510), "Leonardo Pontes", font=font(40, 750, 115), fill=BREU)
d.text((M, 566), "leopontes.com.br", font=font(19, 500, 100), fill=MUTED)

img.save(OUT, optimize=True)
print(f"{OUT.relative_to(ROOT)} — {OUT.stat().st_size // 1024} KiB")
