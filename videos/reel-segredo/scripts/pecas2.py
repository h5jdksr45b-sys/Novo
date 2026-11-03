# Pote e bilhetes desenhados (traco de nanquim, meio-tom so na sombra), no lugar dos recortes de foto.
import sys, math, random
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
sys.path.insert(0, 'scripts')
OUT = sys.argv[1]
INK = (28, 25, 22); PAPER = (247, 241, 228); EDGE = (251, 247, 238)
S = 3  # supersampling

def finish(img, border=9, shadow=True):
    a = img.getchannel('A')
    pad = border + 24
    W, H = img.size[0] + 2 * pad, img.size[1] + 2 * pad
    m = Image.new('L', (W, H), 0); m.paste(a, (pad, pad))
    edge = m.filter(ImageFilter.MaxFilter(2 * (border // 2) + 1)).filter(ImageFilter.MaxFilter(2 * (border - border // 2) + 1))
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    if shadow:
        sh = edge.filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.36))
        si = Image.new('RGBA', (W, H), (40, 28, 18, 0)); si.putalpha(sh); out.alpha_composite(si, (8, 12))
    ei = Image.new('RGBA', (W, H), EDGE + (0,)); ei.putalpha(edge); out.alpha_composite(ei)
    out.alpha_composite(img, (pad, pad))
    return out

def dots(draw, region_mask, w, h, cell, dark_fn, angle=45):
    a = math.radians(angle); ca, sa = math.cos(a), math.sin(a)
    diag = int(math.hypot(w, h)) + cell
    mk = np.asarray(region_mask)
    for i in range(-diag, diag, cell):
        for j in range(-diag, diag, cell):
            x = w / 2 + i * ca - j * sa; y = h / 2 + i * sa + j * ca
            if not (0 <= x < w and 0 <= y < h) or mk[int(y), int(x)] == 0:
                continue
            d = dark_fn(x, y)
            r = cell * 0.6 * math.sqrt(max(d, 0))
            if r > 0.4:
                draw.ellipse([x - r, y - r, x + r, y + r], fill=INK)

def note(w, h, seed, fold='diag'):
    rnd = random.Random(seed)
    W, H = w * S, h * S
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    j = lambda v: v + rnd.uniform(-2, 2) * S
    quad = [(j(8 * S), j(10 * S)), (j(W - 8 * S), j(6 * S)), (j(W - 10 * S), j(H - 8 * S)), (j(6 * S), j(H - 12 * S))]
    d.polygon(quad, fill=PAPER + (255,))
    # metade sombreada da dobra
    tri = [quad[1], quad[2], quad[3]] if fold == 'diag' else [quad[0], quad[1], ((quad[1][0]+quad[2][0])/2, (quad[1][1]+quad[2][1])/2), ((quad[0][0]+quad[3][0])/2, (quad[0][1]+quad[3][1])/2)]
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon(tri, fill=255)
    dots(d, m, W, H, 7 * S, lambda x, y: 0.28 + 0.25 * (y / H))
    d.line(quad + [quad[0]], fill=INK, width=int(3.2 * S), joint='curve')
    if fold == 'diag':
        d.line([quad[1], quad[3]], fill=INK, width=int(2.4 * S))
    else:
        d.line([tri[3], tri[2]], fill=INK, width=int(2.4 * S))
    return finish(img.resize((w, h), Image.LANCZOS), border=7)

def jar():
    w, h = 520, 420; W, H = w * S, h * S
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    body = [30 * S, 70 * S, 400 * S, 360 * S]
    glass = (236, 238, 232, 255)
    d.rounded_rectangle(body, radius=80 * S, fill=glass)
    # bilhetes dentro do vidro
    rnd = random.Random(4)
    for k in range(9):
        cx = rnd.uniform(90, 330) * S; cy = rnd.uniform(220, 330) * S; s = rnd.uniform(38, 56) * S; a = rnd.uniform(0, math.pi)
        pts = [(cx + s * math.cos(a + q * math.pi / 2), cy + s * 0.8 * math.sin(a + q * math.pi / 2)) for q in range(4)]
        d.polygon(pts, fill=PAPER + (255,), outline=INK, width=int(2.2 * S))
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).rounded_rectangle(body, radius=80 * S, fill=255)
    dots(d, m, W, H, 8 * S, lambda x, y: 0.05 + 0.32 * max(0, (y / H - 0.35)) / 0.65)
    d.rounded_rectangle(body, radius=80 * S, outline=INK, width=int(6 * S))
    # brilho do vidro
    d.line([(90 * S, 110 * S), (330 * S, 104 * S)], fill=(255, 255, 255, 255), width=int(14 * S))
    d.line([(70 * S, 150 * S), (110 * S, 132 * S)], fill=(255, 255, 255, 255), width=int(9 * S))
    # gargalo com roscas e boca
    for k, x in enumerate((392, 414)):
        d.arc([(x - 40) * S, 58 * S, (x + 40) * S, 372 * S], 270, 90, fill=INK, width=int(5 * S))
    mouth = [380 * S, 48 * S, 500 * S, 382 * S]
    d.ellipse(mouth, fill=(196, 190, 178, 255))
    mm = Image.new('L', (W, H), 0); ImageDraw.Draw(mm).ellipse(mouth, fill=255)
    dots(d, mm, W, H, 8 * S, lambda x, y: 0.55)
    d.ellipse(mouth, outline=INK, width=int(6 * S))
    d.ellipse([398 * S, 70 * S, 482 * S, 360 * S], outline=INK, width=int(3 * S))
    return finish(img.resize((w, h), Image.LANCZOS), border=10)

def open_note():
    w, h = 760, 470; W, H = w * S, h * S
    rnd = random.Random(21)
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    quad = [(14 * S, 30 * S), (W - 10 * S, 8 * S), (W - 26 * S, H - 14 * S), (4 * S, H - 30 * S)]
    d.polygon(quad, fill=PAPER + (255,))
    # vincos da dobra
    vin = (205, 196, 180, 255)
    d.line([((quad[0][0]+quad[1][0])/2, (quad[0][1]+quad[1][1])/2), ((quad[3][0]+quad[2][0])/2, (quad[3][1]+quad[2][1])/2)], fill=vin, width=int(3 * S))
    d.line([((quad[0][0]+quad[3][0])/2, (quad[0][1]+quad[3][1])/2), ((quad[1][0]+quad[2][0])/2, (quad[1][1]+quad[2][1])/2)], fill=vin, width=int(3 * S))
    # letra de mao ilegivel: linhas onduladas, sem nenhuma letra
    ink = Image.new('RGBA', (W, H), (0, 0, 0, 0)); di = ImageDraw.Draw(ink)
    for row in range(4):
        y0 = (110 + row * 78) * S
        x = 80 * S; x_end = (660 - (150 if row == 3 else rnd.uniform(0, 60))) * S
        while x < x_end:
            seg = rnd.uniform(60, 130) * S
            pts = []
            for k in range(int(seg / (6 * S))):
                xx = x + k * 6 * S
                pts.append((xx, y0 + math.sin(xx / (11 * S) + rnd.uniform(-0.6, 0.6)) * 9 * S + rnd.uniform(-2, 2) * S))
            if len(pts) > 1:
                di.line(pts, fill=(36, 33, 52, 235), width=int(4.2 * S), joint='curve')
            x += seg + rnd.uniform(16, 30) * S
    ink = ink.filter(ImageFilter.GaussianBlur(1.6 * S))
    img.alpha_composite(ink)
    d.line(quad + [quad[0]], fill=INK, width=int(3.6 * S), joint='curve')
    return finish(img.resize((w, h), Image.LANCZOS), border=10)

jar().save(f'{OUT}/pote.png')
for k, (w, h, f) in enumerate([(170, 150, 'diag'), (150, 140, 'half'), (180, 130, 'diag'), (140, 150, 'half')]):
    note(w, h, 50 + k, f).save(f'{OUT}/bilhete{k + 1}.png')
open_note().save(f'{OUT}/bilhete-aberto.png')
print('ok')
