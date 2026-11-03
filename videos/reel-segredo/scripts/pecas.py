# Recortes em meio-tom a partir do quadro 2k do gancho, papel de fundo, balao e textura de tinta.
import sys, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np

SRC = sys.argv[1]
OUT = sys.argv[2]
CREAM = (242, 234, 219)
EDGE = (251, 247, 238)
INK = (24, 22, 20)
RED = (204, 0, 0)

src = Image.open(SRC).convert('RGB')

def halftone(img, cell=7, angle=45, gamma=1.0, contrast=1.25, stretch=True):
    """Meio-tom em pontos pretos sobre creme, com supersampling 3x."""
    g = np.asarray(img.convert('L'), dtype=np.float32) / 255.0
    if stretch:
        lo, hi = np.percentile(g, 2), np.percentile(g, 98)
        g = np.clip((g - lo) / max(hi - lo, 1e-3), 0, 1)
    g = np.clip(0.5 + (g - 0.5) * contrast, 0, 1) ** gamma
    h, w = g.shape
    S = 3
    canvas = Image.new('RGB', (w * S, h * S), CREAM)
    d = ImageDraw.Draw(canvas)
    a = math.radians(angle)
    ca, sa = math.cos(a), math.sin(a)
    diag = int(math.hypot(w, h)) + cell
    for i in range(-diag, diag, cell):
        for j in range(-diag, diag, cell):
            x = w / 2 + i * ca - j * sa
            y = h / 2 + i * sa + j * ca
            if x < -cell or y < -cell or x > w + cell or y > h + cell:
                continue
            xi, yi = int(min(max(x, 0), w - 1)), int(min(max(y, 0), h - 1))
            dark = 1.0 - g[yi, xi]
            r = cell * 0.62 * math.sqrt(dark)
            if r < 0.35:
                continue
            d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=INK)
    return canvas.resize((w, h), Image.LANCZOS)

def jitter_poly(pts, amp, seed):
    """Borda de papel cortado a mao: subdivide e desloca um pouco cada ponto."""
    rnd = random.Random(seed)
    out = []
    for k in range(len(pts)):
        x0, y0 = pts[k]
        x1, y1 = pts[(k + 1) % len(pts)]
        n = max(2, int(math.hypot(x1 - x0, y1 - y0) / 18))
        for s in range(n):
            t = s / n
            out.append((x0 + (x1 - x0) * t + rnd.uniform(-amp, amp),
                        y0 + (y1 - y0) * t + rnd.uniform(-amp, amp)))
    return out

def finish(face, mask, border=9, shadow=True):
    """Aplica mascara, contorno creme de papel e sombra curta. Devolve RGBA com margem."""
    pad = border + 24
    w, h = face.size
    W, H = w + 2 * pad, h + 2 * pad
    m = Image.new('L', (W, H), 0); m.paste(mask, (pad, pad))
    edge = m.filter(ImageFilter.MaxFilter(2 * (border // 2) + 1))
    edge = edge.filter(ImageFilter.MaxFilter(2 * (border - border // 2) + 1))
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    if shadow:
        sh = edge.filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.38))
        sh_img = Image.new('RGBA', (W, H), (40, 28, 18, 0)); sh_img.putalpha(sh)
        out.alpha_composite(sh_img, (8, 12))
    e_img = Image.new('RGBA', (W, H), EDGE + (0,)); e_img.putalpha(edge)
    out.alpha_composite(e_img)
    f = Image.new('RGBA', (W, H), (0, 0, 0, 0)); f.paste(face.convert('RGBA'), (pad, pad))
    f.putalpha(m)
    out.alpha_composite(f)
    return out

def piece(box, poly, scale, name, cell=7, seed=1, border=9, inset=0):
    x0, y0, x1, y1 = box
    crop = src.crop(box)
    w, h = int((x1 - x0) * scale), int((y1 - y0) * scale)
    crop = crop.resize((w, h), Image.LANCZOS)
    face = halftone(crop, cell=cell, stretch=False, gamma=0.8, contrast=1.15)
    mask = Image.new('L', (w, h), 0)
    md = ImageDraw.Draw(mask)
    cxp = sum(p[0] for p in poly) / len(poly); cyp = sum(p[1] for p in poly) / len(poly)
    poly = [(cxp + (px - cxp) * (1 - inset), cyp + (py - cyp) * (1 - inset)) for px, py in poly]
    pts = [((px - x0) * scale, (py - y0) * scale) for px, py in poly]
    md.polygon(jitter_poly(pts, 2.2, seed), fill=255)
    return face, mask

# Pote: corpo + boca (elipse), recortado do 2k e reduzido para ~470 px de largura.
sc = 0.74
box = (0, 1300, 640, 1900)
crop = src.crop(box).resize((int(640 * sc), int(600 * sc)), Image.LANCZOS)
face = halftone(crop, cell=7, gamma=0.62, contrast=1.05)
mask = Image.new('L', crop.size, 0)
md = ImageDraw.Draw(mask)
body = [(0, 100), (150, 62), (380, 55), (380, 545), (150, 528), (0, 492)]
md.polygon(jitter_poly([(x * sc, y * sc) for x, y in body], 2.0, 3), fill=255)
md.ellipse([300 * sc, 55 * sc, 590 * sc, 545 * sc], fill=255)
finish(face, mask).save(f'{OUT}/pote.png')

notes = {
    'bilhete1': [(737, 1837), (951, 1840), (947, 2000), (740, 1997)],
    'bilhete2': [(951, 1860), (1071, 1860), (1147, 1957), (1020, 1997), (951, 1947)],
    'bilhete3': [(1143, 1909), (1251, 1880), (1360, 1911), (1247, 1957), (1143, 1940)],
    'bilhete4': [(297, 1933), (573, 1917), (591, 2053), (300, 2060)],
}
for k, (name, poly) in enumerate(notes.items()):
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    b = (min(xs) - 4, min(ys) - 4, max(xs) + 4, max(ys) + 4)
    f, m = piece(b, poly, 0.78, name, cell=6, seed=10 + k, inset=0.04)
    finish(f, m, border=7).save(f'{OUT}/{name}.png')

# Bilhete aberto (o que mais doi): letra borrada e ilegivel, ja e assim no quadro.
poly = [(580, 1993), (1107, 2037), (980, 2400), (367, 2293)]
xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
b = (min(xs) - 4, min(ys) - 4, max(xs) + 4, max(ys) + 4)
f, m = piece(b, poly, 1.0, 'aberto', cell=6, seed=31, inset=0.06)
finish(f, m, border=10).save(f'{OUT}/bilhete-aberto.png')

# Balao vermelho de papel, com rabicho apontando para baixo e para a esquerda (para o pote).
W, H = 820, 700
rnd = random.Random(7)
pts = []
cx, cy, rx, ry = 410, 300, 380, 270
for k in range(120):
    a = 2 * math.pi * k / 120
    r = 1 + rnd.uniform(-0.012, 0.012)
    pts.append((cx + rx * r * math.cos(a), cy + ry * r * math.sin(a)))
S = 2
big = Image.new('L', (W * S, H * S), 0)
bd = ImageDraw.Draw(big)
bd.polygon([(x * S, y * S) for x, y in pts], fill=255)
tail = [(190, 470), (300, 520), (120, 680)]
bd.polygon([(x * S, y * S) for x, y in jitter_poly(tail, 2.5, 8)], fill=255)
mask = big.resize((W, H), Image.LANCZOS)
grain = (np.random.default_rng(5).normal(0, 7, (H, W, 1))).clip(-18, 18)
red = np.ones((H, W, 3), np.float32) * np.array(RED, np.float32) + grain
face = Image.fromarray(red.clip(0, 255).astype(np.uint8))
finish(face, mask, border=10).save(f'{OUT}/balao.png')

# Fita adesiva translucida.
W, H = 300, 86
tape = Image.new('RGBA', (W, H), (0, 0, 0, 0))
td = ImageDraw.Draw(tape)
tp = jitter_poly([(6, 8), (294, 0), (300, 78), (0, 86)], 3, 12)
td.polygon(tp, fill=(236, 226, 196, 200))
tape.save(f'{OUT}/fita.png')

# Papel de fundo creme com fibra e vinheta suave.
W, H = 1080, 1920
rng = np.random.default_rng(1)
base = np.ones((H, W, 3), np.float32) * np.array((239, 230, 213), np.float32)
noise = rng.normal(0, 4.5, (H, W, 1))
fib = Image.fromarray((rng.random((H // 4, W // 4)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2))
fib = (np.asarray(fib, np.float32)[..., None] - 128) / 128 * 5
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.10 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
img = (base + noise + fib) * vig[..., None]
Image.fromarray(img.clip(0, 255).astype(np.uint8)).save(f'{OUT}/papel.png')

# Textura de tinta para o carimbo (mascara: branco = tinta).
W, H = 900, 260
n = rng.random((H // 3, W // 3))
t = Image.fromarray((n * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
t = t.point(lambda v: 255 if v > 40 else 120)
t.save(f'{OUT}/tinta.png')
print('ok')
