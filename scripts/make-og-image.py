"""
Gera public/images/og-image.png (1200x630) — o card exibido quando o link do
site é compartilhado (LinkedIn, WhatsApp, Slack…). Mesma identidade do site:
papel, tinta, vermelhão, Instrument Serif e Geist Mono.

Uso: python3 scripts/make-og-image.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "public" / "fonts"
OUT = ROOT / "public" / "images" / "og-image.png"

W, H = 1200, 630
PAPER = (243, 239, 230)
INK = (27, 26, 23)
MUTED = (110, 105, 96)
SIGNAL = (204, 72, 34)

serif = lambda size: ImageFont.truetype(str(FONTS / "instrument-serif-latin-400-normal.woff2"), size)
serif_i = lambda size: ImageFont.truetype(str(FONTS / "instrument-serif-latin-400-italic.woff2"), size)
mono = lambda size: ImageFont.truetype(str(FONTS / "geist-mono-latin-wght-normal.woff2"), size)

img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)
M = 64  # margem

# Bloco vermelhão + retrato em P&B (mesma composição do hero).
block = (820, 92, 1136, H)
d.rectangle(block, fill=SIGNAL)
portrait = Image.open(ROOT / "scripts" / "assets" / "portrait-cutout.png").convert("RGBA")
gray = ImageOps.grayscale(portrait.convert("RGB"))
gray = ImageOps.autocontrast(gray, cutoff=1)
portrait_bw = Image.merge("RGBA", (gray, gray, gray, portrait.getchannel("A")))
target_h = H - 112
scale = target_h / portrait_bw.height
portrait_bw = portrait_bw.resize((round(portrait_bw.width * scale), target_h), Image.LANCZOS)
px = block[0] + (block[2] - block[0] - portrait_bw.width) // 2
img.paste(portrait_bw, (px, H - target_h), portrait_bw)

# Linha de metadados, como o cabeçalho de um relatório.
d.text((M, 56), "LP | PRODUTO & PORTFÓLIO", font=mono(20), fill=MUTED)
d.rectangle((M, 96, 760, 97), fill=INK)

# Título: "Produto, portfólio e IA que / saem do papel."
y = 128
for line in ("Produto, portfólio", "e IA que"):
    d.text((M - 4, y), line, font=serif(96), fill=INK)
    y += 92
d.text((M - 4, y), "saem do papel.", font=serif_i(96), fill=SIGNAL)

# Rodapé: oferta + quem.
d.rectangle((M, 486, M + 14, 500), fill=SIGNAL)
d.text((M + 28, 480), "MENTORIA 1:1 · CONSULTORIA · VAGAS FUNDADOR", font=mono(19), fill=INK)
d.text((M, 528), "Leonardo Pontes", font=serif(44), fill=INK)
d.text((M, 582), "leopontes.com.br", font=mono(19), fill=MUTED)

img.save(OUT, optimize=True)
print(f"{OUT.relative_to(ROOT)} — {OUT.stat().st_size // 1024} KiB")
