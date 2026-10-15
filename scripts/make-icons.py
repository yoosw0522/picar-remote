#!/usr/bin/env python3
"""앱 아이콘 PNG 생성 → resources/android/ 에 저장 (patch-android.js가 android 프로젝트로 복사)."""
from PIL import Image, ImageDraw
import os

BG = (11, 15, 20)        # #0b0f14
ACCENT = (52, 211, 153)  # #34d399
OUT = os.path.join(os.path.dirname(__file__), '..', 'resources', 'android')

def draw_icon(size, pad_ratio, with_bg=True):
    img = Image.new('RGBA', (size, size), BG if with_bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = size / 2
    r_outer = size * (0.5 - pad_ratio)
    w = max(2, int(size * 0.075))
    d.ellipse([c - r_outer, c - r_outer, c + r_outer, c + r_outer], outline=ACCENT, width=w)
    r_in = r_outer * 0.34
    d.ellipse([c - r_in, c - r_in, c + r_in, c + r_in], fill=ACCENT)
    return img

DENS = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
for name, mult in DENS.items():
    d = os.path.join(OUT, f'mipmap-{name}')
    os.makedirs(d, exist_ok=True)
    legacy = int(48 * mult)
    draw_icon(legacy, 0.12).save(os.path.join(d, 'ic_launcher.png'))
    rnd = draw_icon(legacy, 0.12)
    mask = Image.new('L', (legacy, legacy), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, legacy - 1, legacy - 1], fill=255)
    rnd.putalpha(mask)
    rnd.save(os.path.join(d, 'ic_launcher_round.png'))
    fg = int(108 * mult)
    draw_icon(fg, 0.30, with_bg=False).save(os.path.join(d, 'ic_launcher_foreground.png'))
print('icons written to', os.path.abspath(OUT))
