"""Gera as texturas da colagem: halftone, papel, fita, caixas genéricas (sem marca, sem nome, sem dose)."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "assets")
os.makedirs(OUT, exist_ok=True)
random.seed(7); np.random.seed(7)

CREAM = (237, 228, 211)
PAPER = (246, 240, 228)      # papel claro dos recortes
KEY = (250, 246, 236)        # keyline creme
INK = (26, 26, 26)
RED = (166, 43, 36)
KRAFT = (222, 209, 186)


def halftone(dark, spacing=7.0, angle=45, color=INK):
    """dark: array HxW 0..1. Devolve RGBA com pontos de meio-tom."""
    h, w = dark.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle)
    u = xx * math.cos(a) + yy * math.sin(a)
    v = -xx * math.sin(a) + yy * math.cos(a)
    cu = (np.floor(u / spacing) + 0.5) * spacing
    cv = (np.floor(v / spacing) + 0.5) * spacing
    d = np.sqrt((u - cu) ** 2 + (v - cv) ** 2)
    r = np.sqrt(np.clip(dark, 0, 1)) * spacing * 0.68
    alpha = np.clip((r - d) + 0.5, 0, 1)
    img = np.zeros((h, w, 4), np.uint8)
    img[..., :3] = color
    img[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(img, "RGBA")


def grain(w, h, base, amount=10):
    n = np.random.normal(0, amount * 0.7, (h, w, 1))
    low = np.random.normal(0, 1, (h // 40 + 2, w // 40 + 2))
    low = np.array(Image.fromarray(((low * 30) + 128).clip(0, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32)
    low = (low - 128) / 30 * amount * 0.35
    arr = np.clip(np.array(base, np.float32)[None, None, :] + n + low[..., None], 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def with_keyline(img, k=5, shadow=False):
    """Recorte com borda creme de k px em volta da silhueta (alpha)."""
    pad = k + 2
    W, H = img.size
    canvas = Image.new("RGBA", (W + 2 * pad, H + 2 * pad), (0, 0, 0, 0))
    a = img.split()[3]
    m = Image.new("L", canvas.size, 0); m.paste(a, (pad, pad))
    dil = m.filter(ImageFilter.MaxFilter(2 * k + 1))
    dil = dil.point(lambda p: 255 if p > 90 else 0)
    key = Image.new("RGBA", canvas.size, KEY + (255,)); key.putalpha(dil)
    canvas.alpha_composite(key)
    canvas.alpha_composite(img, (pad, pad))
    return canvas


def poly_mask(size, pts, jitter=0.8):
    m = Image.new("L", size, 0)
    pts = [(x + random.uniform(-jitter, jitter), y + random.uniform(-jitter, jitter)) for x, y in pts]
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return m


def fill_region(base, mask, color, shade=None, spacing=7, ht_color=INK, grain_amt=8):
    """Pinta uma região: cor de papel com grão + meio-tom pela matriz shade (0..1)."""
    W, H = base.size
    paper = grain(W, H, color, grain_amt).convert("RGBA")
    if shade is not None:
        paper.alpha_composite(halftone(shade, spacing, color=ht_color))
    paper.putalpha(mask)
    base.alpha_composite(paper)


def lin(W, H, x0, x1, y0=0, y1=0):
    """gradiente linear 0..1 em x (e y)."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    g = np.zeros((H, W), np.float32)
    if x1 != x0: g += (xx - x0) / (x1 - x0)
    if y1 != y0: g += (yy - y0) / (y1 - y0)
    return np.clip(g, 0, 1)


# ---------- caixa genérica ----------
BANDS = ["red_band", "ink_band", "red_top", "ink_corner", "red_stripes", "ink_top", "red_half"]


def box(name, w, h, d, style, spacing=6, side_dark=0.55):
    W, H = w + d + 2, h + d + 2
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # frente
    front = poly_mask((W, H), [(0, d), (w, d), (w, d + h), (0, d + h)])
    fill_region(img, front, PAPER, shade=lin(W, H, 0, w * 4) * 0.12, spacing=spacing)
    dr = ImageDraw.Draw(img)
    # faixas genéricas (sem texto)
    if style == "red_band":
        dr.rectangle([0, d + h * 0.38, w, d + h * 0.62], fill=RED)
    elif style == "ink_band":
        dr.rectangle([0, d + h * 0.30, w, d + h * 0.46], fill=INK)
        dr.rectangle([0, d + h * 0.52, w, d + h * 0.57], fill=RED)
    elif style == "red_top":
        dr.rectangle([0, d, w, d + h * 0.34], fill=RED)
    elif style == "ink_corner":
        dr.polygon([(0, d + h), (w * 0.45, d + h), (0, d + h * 0.35)], fill=INK)
    elif style == "red_stripes":
        for i in range(3):
            y = d + h * (0.25 + 0.18 * i)
            dr.rectangle([w * 0.12, y, w * 0.88, y + max(2, h * 0.07)], fill=RED)
    elif style == "ink_top":
        dr.rectangle([0, d, w, d + h * 0.22], fill=INK)
        dr.ellipse([w * 0.08, d + h * 0.40, w * 0.08 + h * 0.3, d + h * 0.70], fill=RED)
    elif style == "red_half":
        dr.rectangle([w * 0.55, d, w, d + h], fill=RED)
    # topo
    top = poly_mask((W, H), [(0, d), (d, 0), (w + d, 0), (w, d)])
    fill_region(img, top, PAPER, shade=np.full((H, W), 0.22, np.float32), spacing=spacing)
    # lateral
    side = poly_mask((W, H), [(w, d), (w + d, 0), (w + d, h), (w, d + h)])
    fill_region(img, side, KRAFT, shade=np.full((H, W), side_dark, np.float32), spacing=spacing)
    # contornos finos de dobra
    dr.line([(w, d), (w, d + h)], fill=INK + (120,), width=1)
    dr.line([(0, d), (w, d)], fill=INK + (90,), width=1)
    out = with_keyline(img, k=4 if w > 80 else 3)
    out.save(os.path.join(OUT, name + ".png"))
    return out


# ---------- sacola de farmácia ----------
def bag():
    W, H = 500, 640
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    body = poly_mask((W, H), [(30, 110), (470, 110), (450, 630), (50, 630)])
    sh = lin(W, H, 40, 470) * 0.22 + lin(W, H, 0, 0, 110, 640) * 0.10
    sh = np.maximum(sh, (lin(W, H, 395, 470) > 0.01) * 0.38)
    fill_region(img, body, KRAFT, shade=sh, spacing=7)
    # dobra serrilhada no topo
    teeth = [(30, 110)]
    x = 30
    while x < 470:
        teeth += [(x + 10, 92), (x + 20, 110)]
        x += 20
    teeth += [(470, 150), (30, 150)]
    fill_region(img, poly_mask((W, H), teeth), PAPER, shade=np.full((H, W), 0.18, np.float32), spacing=7)
    dr = ImageDraw.Draw(img)
    # faixa vermelha genérica (sem marca)
    dr.rectangle([48, 430, 452, 470], fill=RED)
    # vinco central
    dr.line([(250, 150), (250, 630)], fill=INK + (60,), width=2)
    out = with_keyline(img, k=6)
    out.save(os.path.join(OUT, "bag.png"))
    # boca da sacola (parte de trás, para a caixa entrar "dentro")
    back = Image.new("RGBA", (W, 160), (0, 0, 0, 0))
    fill_region(back, poly_mask((W, 160), [(36, 40), (464, 40), (470, 160), (30, 160)]),
                KRAFT, shade=np.full((160, W), 0.62, np.float32), spacing=7)
    with_keyline(back, k=6).save(os.path.join(OUT, "bag_back.png"))


# ---------- silhueta ----------
def silhouette(name="silhouette", w=74, h=240):
    W, H = w, h
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    d.ellipse([w * 0.27, 4, w * 0.73, 4 + w * 0.46], fill=255)               # cabeça
    d.rectangle([w * 0.41, w * 0.44, w * 0.59, w * 0.58], fill=255)          # pescoço
    d.rounded_rectangle([3, w * 0.55, w - 3, h * 0.66], radius=int(w * 0.28), fill=255)  # tronco
    d.rectangle([w * 0.16, h * 0.55, w * 0.47, h - 2], fill=255)             # pernas
    d.rectangle([w * 0.53, h * 0.55, w * 0.84, h - 2], fill=255)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh = 0.55 + lin(W, H, 0, W) * 0.35
    fill_region(img, m, (70, 66, 60), shade=sh, spacing=5, grain_amt=6)
    out = with_keyline(img, k=4)
    out.save(os.path.join(OUT, name + ".png"))


# ---------- fita adesiva ----------
def tape(name, w, h):
    img = grain(w, h, (226, 214, 186), 6).convert("RGBA")
    a = np.full((h, w), 225, np.uint8)
    # pontas rasgadas
    for y in range(h):
        l = random.randint(0, 6); r = random.randint(0, 6)
        a[y, :l] = 0; a[y, w - r:] = 0
    img.putalpha(Image.fromarray(a))
    img.save(os.path.join(OUT, name + ".png"))


# ---------- etiqueta em branco ----------
def tag():
    W, H = 560, 330
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    m = poly_mask((W, H), [(70, 0), (W, 0), (W, H), (70, H), (0, H - 95), (0, 95)])
    fill_region(img, m, PAPER, shade=lin(W, H, W * 0.2, W * 3) * 0.10, spacing=7)
    dr = ImageDraw.Draw(img)
    dr.ellipse([42, H / 2 - 16, 74, H / 2 + 16], fill=(0, 0, 0, 0))
    dr.ellipse([40, H / 2 - 18, 76, H / 2 + 18], outline=INK + (140,), width=3)
    # furo transparente
    a = np.array(img.split()[3]); yy, xx = np.mgrid[0:H, 0:W]
    a[((xx - 58) ** 2 + (yy - H / 2) ** 2) < 14 ** 2] = 0
    img.putalpha(Image.fromarray(a))
    with_keyline(img, k=6).save(os.path.join(OUT, "tag.png"))


# ---------- carimbo (ferramenta) ----------
def stamp_tool():
    W, H = 300, 330
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    knob = Image.new("L", (W, H), 0)
    dk = ImageDraw.Draw(knob)
    dk.ellipse([95, 0, 205, 90], fill=255)
    dk.rectangle([128, 70, 172, 200], fill=255)
    fill_region(img, knob, (90, 84, 76), shade=0.45 + lin(W, H, 90, 210) * 0.45, spacing=6)
    blk = poly_mask((W, H), [(20, 195), (280, 195), (280, 290), (20, 290)])
    fill_region(img, blk, (120, 110, 98), shade=0.35 + lin(W, H, 20, 280) * 0.4, spacing=6)
    ImageDraw.Draw(img).rectangle([28, 290, 272, 326], fill=RED)
    with_keyline(img, k=5).save(os.path.join(OUT, "stamp_tool.png"))


# ---------- post-it em branco ----------
def postit():
    W, H = 74, 74
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    m = poly_mask((W, H), [(0, 0), (W, 0), (W, H - 6), (W - 10, H), (0, H)], jitter=0.3)
    fill_region(img, m, (226, 210, 178), shade=lin(W, H, 0, 0, H * 0.4, H * 2) * 0.30, spacing=4, grain_amt=5)
    ImageDraw.Draw(img).rectangle([0, 0, W, 12], fill=(208, 190, 155, 255))
    img.putalpha(Image.fromarray(np.minimum(np.array(img.split()[3]), np.array(m))))
    img.save(os.path.join(OUT, "postit.png"))


# ---------- textura de fundo e máscara de tinta ----------
def background():
    W, H = 1080, 1920
    base = grain(W, H, CREAM, 7).convert("RGBA")
    # manchas leves de impressão de revista (meio-tom muito fraco, longe das bordas)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    blob = np.exp(-(((xx - 260) / 380) ** 2 + ((yy - 1500) / 300) ** 2)) * 0.10
    blob += np.exp(-(((xx - 820) / 300) ** 2 + ((yy - 380) / 260) ** 2)) * 0.08
    ht = halftone(blob, spacing=9, color=(120, 105, 85))
    base.alpha_composite(ht)
    base.convert("RGB").save(os.path.join(OUT, "bg.jpg"), quality=92)


def ink_mask():
    W = H = 420
    n = np.random.rand(H // 3, W // 3)
    n = np.array(Image.fromarray((n * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)) / 255
    fine = np.random.rand(H, W)
    a = np.where((n * 0.7 + fine * 0.3) > 0.30, 255, 0).astype(np.uint8)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 255)); im.putalpha(Image.fromarray(a, "L")); im.save(os.path.join(OUT, "ink_mask.png"))


if __name__ == "__main__":
    background(); ink_mask(); bag(); tag(); stamp_tool(); postit()
    silhouette()
    tape("tape_l", 170, 46); tape("tape_m", 110, 34); tape("tape_s", 46, 18)
    box("box_s1", 250, 150, 50, "red_band")
    box("box_s1b", 220, 120, 40, "ink_top")
    box("box_s1c", 200, 110, 40, "red_half")
    for i, st in enumerate(BANDS):
        box(f"box_stack{i}", 270, 78, 28, st)
        box(f"box_up{i}", 92, 140, 22, st)
        box(f"box_tiny{i}", 52, 28, 9, st, spacing=4)
    print("ok")
