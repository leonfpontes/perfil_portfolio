"""
Gera a foto de perfil (LinkedIn e afins) a partir do retrato recortado do site:
fundo de estúdio marinho (#0F1A31) com luz champagne apagada atrás da cabeça, borda
do recorte limpa, cor levemente aquecida e nitidez fina. Não altera o rosto.

Uso: python3 scripts/make-profile-photo.py public/images/leonardo-portrait.webp docs/linkedin/foto-perfil
     (gera <saida>.png e <saida>.jpg, 1000x1000)
"""
import sys
from PIL import Image, ImageFilter, ImageEnhance, ImageChops, ImageDraw
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
# Corte de cabeça e ombros (quadrado), com folga acima da cabeça.
box = (-6, -10, 414, 410)
im = im.crop(box)
N = 1000
im = im.resize((N, N), Image.LANCZOS)
r, g, b, a = im.split()
# Borda: encolhe 1-2 px e suaviza, para não sobrar halo branco do recorte.
a = a.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.6))
rgb = Image.merge('RGB', (r, g, b))
# Descontamina a franja: perto da borda, puxa a cor para o interior (sem branco).
inner = rgb.filter(ImageFilter.GaussianBlur(6))
edge = a.point(lambda v: 255 if 0 < v < 250 else 0).filter(ImageFilter.MaxFilter(7))
rgb = Image.composite(ImageChops.darker(rgb, inner), rgb, edge)
# Cor: um pouco mais de contraste, calor leve, nitidez fina depois do aumento.
rgb = ImageEnhance.Contrast(rgb).enhance(1.06)
rgb = ImageEnhance.Color(rgb).enhance(0.96)
warm = Image.new('RGB', rgb.size, (255, 236, 214))
rgb = Image.blend(rgb, ImageChops.multiply(rgb, warm), 0.35)
rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=2))

# Fundo de estúdio: marinho profundo, luz quente difusa atrás da cabeça, vinheta nas bordas.
import numpy as np
yy, xx = np.mgrid[0:N, 0:N].astype(np.float32) / N
def falloff(cx, cy, rx, ry):
    d = np.sqrt(((xx-cx)/rx)**2 + ((yy-cy)/ry)**2)
    return np.clip(1 - d, 0, 1) ** 1.6
base = np.array([15, 26, 49], np.float32)       # #0F1A31 navy-deep
mid = np.array([32, 48, 82], np.float32)        # marinho um pouco aberto
warm = np.array([92, 80, 64], np.float32)       # luz champagne apagada
t = falloff(0.5, 0.34, 0.95, 0.85)[..., None]
g = falloff(0.5, 0.26, 0.42, 0.36)[..., None]
arr = base + (mid - base) * t + warm * g * 0.55
bg = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
# Sombra suave atrás da pessoa, para assentar no fundo.
sh = a.filter(ImageFilter.GaussianBlur(28)).point(lambda v: int(v*0.45))
shifted = Image.new('L', (N, N), 0); shifted.paste(sh, (10, 18))
bg = Image.composite(Image.new('RGB', (N, N), (6, 10, 20)), bg, shifted)
# Grão fino, como foto de estúdio.
noise = Image.effect_noise((N, N), 6).convert('RGB')
bg = Image.blend(bg, ImageChops.add(bg, noise, scale=1.0, offset=-128), 0.35)
final = Image.composite(rgb, bg, a)
final.save(out + '.png')
final.save(out + '.jpg', quality=92, optimize=True, progressive=True)
