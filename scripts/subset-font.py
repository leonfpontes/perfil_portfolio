"""
Gera public/fonts/archivo.woff2 a partir da fonte variável original
(scripts/assets/archivo-latin-wdth-normal.source.woff2), mantendo só o que o
site usa — a fonte é o maior arquivo da primeira tela no celular.

- Eixos limitados: peso 400–800 e largura 100–120% (os valores usados no CSS).
- Caracteres: latim básico + acentos do português + símbolos usados no site.

Requer fonttools com suporte a woff2:
  python3 -m venv .venv-font && .venv-font/bin/pip install "fonttools[woff]==4.60.1"
  .venv-font/bin/python scripts/subset-font.py
"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "assets" / "archivo-latin-wdth-normal.source.woff2"
OUT = ROOT / "public" / "fonts" / "archivo.woff2"

TEXT = (
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    "áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑºª"
    " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ ×·•…–—‘’“”«»€£°±²³"
    "→←↗↑↓✳"
)

font = TTFont(SRC)
font = instancer.instantiateVariableFont(font, {"wght": (400, 800), "wdth": (100, 120)})

options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["kern", "liga", "calt", "tnum", "lnum"]
options.name_IDs = ["*"]
options.notdef_outline = True
sub = subset.Subsetter(options)
sub.populate(text=TEXT)
sub.subset(font)
font.flavor = "woff2"
font.save(OUT)

before = SRC.stat().st_size // 1024
after = OUT.stat().st_size // 1024
print(f"{OUT.relative_to(ROOT)} — {after} KiB (antes: {before} KiB)")
