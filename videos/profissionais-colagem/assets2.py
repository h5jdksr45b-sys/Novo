"""Peças da colagem 2: porta, batente, plaquinha, crachá em branco, ficha, mesa. Sem rosto, sem nome, sem logotipo."""
import os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
spec = importlib.util.spec_from_file_location("a1", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "remedios-colagem", "assets.py"))
a1 = importlib.util.module_from_spec(spec); spec.loader.exec_module(a1)
a1.OUT = OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
from types import SimpleNamespace
P, KRAFT, INK, RED = a1.PAPER, a1.KRAFT, a1.INK, a1.RED
fill, pm, lin, kl = a1.fill_region, a1.poly_mask, a1.lin, a1.with_keyline

def door(name, w, h, sp=7):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fill(img, pm((w, h), [(0, 0), (w, 0), (w, h), (0, h)]), P, shade=0.06 + lin(w, h, 0, w) * 0.16, spacing=sp)
    # almofadas da porta (meio-tom mais escuro)
    for (y0, y1) in [(0.07, 0.45), (0.53, 0.93)]:
        m = pm((w, h), [(w*.15, h*y0), (w*.85, h*y0), (w*.85, h*y1), (w*.15, h*y1)])
        fill(img, m, P, shade=np.full((h, w), 0.20, np.float32), spacing=sp)
    d = ImageDraw.Draw(img)
    r = w * 0.055
    d.ellipse([w*.82-r, h*.5-r, w*.82+r, h*.5+r], fill=RED)
    d.rectangle([0, 0, w-1, h-1], outline=INK + (110,), width=2)
    img.save(os.path.join(OUT, name + ".png"))   # sem keyline: a keyline fica no batente

def frame(name, w, h, b, sp=7):
    W, H = w + 2*b, h + b
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fill(img, pm((W, H), [(0, 0), (W, 0), (W, H), (0, H)]), KRAFT, shade=np.full((H, W), 0.30, np.float32), spacing=sp)
    fill(img, pm((W, H), [(b, b), (b+w, b), (b+w, H), (b, H)], jitter=0), (60, 56, 50), shade=0.75 + lin(W, H, b, b+w) * 0.2, spacing=sp)
    kl(img, k=5).save(os.path.join(OUT, name + ".png"))

def plaque():
    w, h = 190, 96
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fill(img, pm((w, h), [(0, 0), (w, 0), (w, h), (0, h)]), P, shade=lin(w, h, 0, w*3)*0.15, spacing=5)
    ImageDraw.Draw(img).rectangle([8, 8, w-9, h-9], outline=RED + (255,), width=5)
    kl(img, k=4).save(os.path.join(OUT, "plaque.png"))

def badge():
    w, h = 210, 300
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    m = Image.new("L", (w, h), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, w-1, h-1], radius=18, fill=255)
    fill(img, m, P, shade=lin(w, h, 0, w*3)*0.12, spacing=5)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([w/2-30, 16, w/2+30, 30], radius=7, fill=(0, 0, 0, 0), outline=INK + (180,), width=3)
    # quadro de foto vazio (sem rosto)
    fill(img, pm((w, h), [(55, 52), (155, 52), (155, 162), (55, 162)], jitter=0), (215, 205, 186), shade=np.full((h, w), 0.18, np.float32), spacing=5)
    d.rectangle([55, 52, 155, 162], outline=INK + (120,), width=2)
    for y, ww in [(186, 140), (210, 100)]:
        fill(img, pm((w, h), [(w/2-ww/2, y), (w/2+ww/2, y), (w/2+ww/2, y+10), (w/2-ww/2, y+10)], jitter=0), P, shade=np.full((h, w), 0.5, np.float32), spacing=4)
    d.rectangle([0, 250, w, 274], fill=RED)
    a = np.array(img.split()[3]); a[np.array(m) == 0] = 0
    yy, xx = np.mgrid[0:h, 0:w]; a[((xx-w/2)**2/30**2 + (yy-23)**2/7**2) < 1] = 0
    img.putalpha(Image.fromarray(a))
    kl(img, k=4).save(os.path.join(OUT, "badge.png"))

def card(name, w, h):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fill(img, pm((w, h), [(0, 0), (w, 0), (w, h), (0, h)]), P, shade=lin(w, h, 0, w*4)*0.12, spacing=4 if w < 150 else 5)
    d = ImageDraw.Draw(img)
    lw = max(2, h // 40)
    d.rectangle([0, h*0.20, w, h*0.20 + lw + 1], fill=RED)
    for i in range(1, 5):
        y = h*0.20 + i*h*0.16
        if y < h - 6: d.line([(w*0.06, y), (w*0.94, y)], fill=INK + (90,), width=max(1, lw - 1))
    kl(img, k=4 if w > 100 else 3).save(os.path.join(OUT, name + ".png"))

def table():
    w, h = 900, 230
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fill(img, pm((w, h), [(30, 0), (w-30, 0), (w, h), (0, h)]), KRAFT, shade=0.25 + lin(w, h, 0, 0, 0, h)*0.3, spacing=8)
    kl(img, k=6).save(os.path.join(OUT, "table.png"))

if __name__ == "__main__":
    door("door_big", 340, 680); frame("frame_big", 340, 680, 26)
    door("door", 130, 260, sp=5); frame("frame", 130, 260, 12, sp=5)
    plaque(); badge(); card("card", 220, 136); card("card_s", 84, 54); table()
    print("ok")
