"""
Gera public/images/og-image.png (1200x630) — o card exibido quando o link do
site é compartilhado (LinkedIn, WhatsApp, Slack…). Mesma identidade do site:
LP Noir — preto quente, marfim e champagne, Roboto com o destaque em serifa
itálica, o funil de gates ao fundo e o retrato em preto e branco.

Uso: python3 scripts/make-og-image.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SANS = ROOT / "public" / "fonts" / "roboto.woff2"
SERIF = ROOT / "public" / "fonts" / "instrument-serif-italic.woff2"
PORTRAIT = ROOT / "scripts" / "assets" / "portrait-cutout.png"
OUT = ROOT / "public" / "images" / "og-image.png"

W, H = 1200, 630
ONYX = (10, 10, 11)
GRAPHITE = (19, 19, 21)
LINE = (42, 42, 46)
IVORY = (241, 237, 228)
STONE = (155, 150, 140)
CHAMPAGNE = (207, 180, 138)


def sans(size: int, weight: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(SANS), size)
    f.set_variation_by_axes([weight])
    return f


def serif(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(SERIF), size)


def bezier(p0, p1, p2, p3, steps=40):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        a = (1 - t) ** 3
        b = 3 * (1 - t) ** 2 * t
        c = 3 * (1 - t) * t**2
        d = t**3
        pts.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return pts


def funil(w: int, h: int, scale: int = 3) -> Image.Image:
    """O funil de gates (mesma geometria de src/components/art/funil.ts, encaixada no card)."""
    S = scale
    layer = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    gates = [0.36, 0.53, 0.70, 0.87]
    aperto = [1, 0.62, 0.38, 0.2, 0.08]
    focus = 0.5
    linhas = [(0.09, 0), (0.16, 1), (0.24, 4), (0.31, 0), (0.37, 2), (0.44, 4), (0.5, 1), (0.56, 4), (0.62, 3), (0.69, 0), (0.76, 4), (0.83, 2), (0.9, 1)]
    sobreviventes = [y for y, a in linhas if a == 4]
    sinal = min(sobreviventes, key=lambda y: abs(y - focus))
    for g in gates:
        x = g * w * S
        for y in range(0, h * S, 8 * S):
            d.line([(x, y), (x, y + 2 * S)], fill=(*IVORY, 26), width=S)
    for y0, ate in linhas:
        pts = [(-0.03, y0)]
        for g in range(min(ate, 3) + 1):
            pts.append((gates[g], focus + (y0 - focus) * aperto[g + 1]))
        if ate == 4:
            pts.append((1.03, focus + (y0 - focus) * aperto[4]))
        path = []
        for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
            k = (xb - xa) * 0.5
            path += bezier((xa * w * S, ya * h * S), ((xa + k) * w * S, ya * h * S), ((xb - k) * w * S, yb * h * S), (xb * w * S, yb * h * S))
        is_sinal = ate == 4 and y0 == sinal
        d.line(path, fill=(*CHAMPAGNE, 200) if is_sinal else (*IVORY, 46), width=int(1.6 * S) if is_sinal else S, joint="curve")
        if ate < 4:
            x, y = path[-1]
            r = 3 * S
            d.ellipse((x - r, y - r, x + r, y + r), fill=(*ONYX, 255), outline=(*IVORY, 90), width=S)
    return layer.resize((w, h), Image.LANCZOS)


img = Image.new("RGB", (W, H), ONYX)
# Luz ambiente champagne atrás do retrato.
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse((700, 40, 1260, 600), fill=(*CHAMPAGNE, 46))
img.paste(glow.filter(ImageFilter.GaussianBlur(120)), (0, 0), glow.filter(ImageFilter.GaussianBlur(120)))
img.paste(funil(W, H), (0, 0), funil(W, H))
d = ImageDraw.Draw(img)
M = 64

# Painel do retrato: cantos de 12 px, borda grafite, retrato em P&B.
panel = (820, 56, W - 56, H - 56)
mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(mask).rounded_rectangle(panel, radius=12, fill=255)
card = Image.new("RGB", (W, H), GRAPHITE)
portrait = Image.open(PORTRAIT).convert("RGBA")
gray = ImageOps.autocontrast(ImageOps.grayscale(portrait.convert("RGB")), cutoff=1)
bw = Image.merge("RGBA", (gray, gray, gray, portrait.getchannel("A")))
target_h = panel[3] - panel[1] - 24
bw = bw.resize((round(bw.width * target_h / bw.height), target_h), Image.LANCZOS)
card.paste(bw, (panel[0] + (panel[2] - panel[0] - bw.width) // 2, panel[3] - target_h), bw)
img.paste(card, (0, 0), mask)
d.rounded_rectangle(panel, radius=12, outline=LINE, width=2)

d.text((M, 64), "LP · PRODUCT & PORTFOLIO", font=sans(18, 600), fill=STONE)
d.line((M, 100, 760, 100), fill=LINE, width=2)

title = sans(66, 500)
d.text((M - 2, 128), "Produto, portfólio", font=title, fill=IVORY)
d.text((M - 2, 204), "e IA que", font=title, fill=IVORY)
x = M - 2 + d.textlength("e IA que ", font=title)
d.text((x, 196), "saem do papel.", font=serif(76), fill=CHAMPAGNE)

d.ellipse((M, 456, M + 10, 466), fill=CHAMPAGNE)
d.text((M + 24, 450), "PRIVATE MENTORING · PORTFOLIO DIAGNOSTIC", font=sans(17, 600), fill=IVORY)
d.text((M, 506), "Leonardo Pontes", font=sans(40, 500), fill=IVORY)
d.text((M, 562), "leopontes.com.br", font=sans(19, 400), fill=STONE)

img.save(OUT, optimize=True)
print(f"{OUT.relative_to(ROOT)} — {OUT.stat().st_size // 1024} KiB")
