"""Reel Nove moedas: colagem em stop motion, 1080x1920, 30 fps.

Peças recortadas (GPT Image 2.5) sobre papel creme. Elementos entram a 12 qps
com tremor de papel; legenda pequena no terço inferior some nas duas ênfases.
Uso: python3 render.py [--still t1,t2,...]
"""
import json, math, random, subprocess, sys
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS, STEP = 1080, 1920, 30, 12
ROOT = __file__.rsplit('/', 1)[0]
CREAM = (237, 228, 211)
INK = (26, 26, 26)
RED = (166, 43, 36)
TAGPAPER = (247, 241, 229)
SAFE_X, SAFE_TOP, SAFE_BOT = 80, 170, 1720

T = json.load(open(f'{ROOT}/audio/timeline.json'))   # inícios das cenas e fim
WORDS = json.load(open(f'{ROOT}/audio/words.json'))  # [{w, s, e}]
DUR = T['end']

CRIT = ['medo de ser deixado', 'relações em extremos', 'imagem de si que muda', 'impulsividade',
        'autolesão', 'emoções que mudam rápido', 'vazio', 'raiva difícil de controlar',
        'desligamento sob estresse']
GA = {0, 1, 2, 3, 5}
GB = {4, 5, 6, 7, 8}
COMMON = 5


# ---------- fontes ----------
@lru_cache(None)
def font(kind, size):
    if kind == 'anton':
        return ImageFont.truetype(f'{ROOT}/fonts/Anton-Regular.ttf', size)
    if kind == 'serif':
        f = ImageFont.truetype(f'{ROOT}/fonts/PlayfairDisplay-Italic.ttf', size)
        f.set_variation_by_name('Bold Italic')
        return f
    f = ImageFont.truetype(f'{ROOT}/fonts/Montserrat.ttf', size)
    f.set_variation_by_name(kind)
    return f


# ---------- papel ----------
def make_paper():
    rng = np.random.default_rng(11)
    base = np.ones((H, W, 3), np.float32) * np.array(CREAM, np.float32)
    g = rng.normal(0, 1, (H, W)).astype(np.float32)
    g = np.array(Image.fromarray(np.clip(g * 30 + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), np.float32) - 128
    base += g[..., None] * 0.22
    low = rng.normal(0, 1, (H // 40, W // 40)).astype(np.float32)
    low = np.array(Image.fromarray(np.clip(low * 40 + 128, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30)), np.float32) - 128
    base += low[..., None] * 0.12
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    r = random.Random(3)
    for _ in range(260):  # fibras
        x, y = r.uniform(0, W), r.uniform(0, H)
        a = r.uniform(0, math.pi)
        L = r.uniform(8, 34)
        c = tuple(int(v - r.uniform(10, 24)) for v in CREAM)
        d.line((x, y, x + math.cos(a) * L, y + math.sin(a) * L), fill=c, width=1)
    return img.convert('RGBA')


PAPER = None


def grain(img, amount=5, seed=0):
    a = np.array(img).astype(np.float32)
    n = np.random.default_rng(seed + a.shape[0] * 7 + a.shape[1]).normal(0, amount, a.shape[:2] + (1,))
    a[..., :3] = np.clip(a[..., :3] + n, 0, 255)
    return Image.fromarray(a.astype(np.uint8), 'RGBA')


def torn_mask(w, h, seed, rough=7):
    """Máscara de papel rasgado/recortado à mão."""
    r = random.Random(seed)
    pts = []
    for side in range(4):
        n = 26
        for i in range(n):
            t = i / n
            j = r.uniform(-rough, rough)
            if side == 0:
                pts.append((t * w, rough + j))
            elif side == 1:
                pts.append((w - rough + j, t * h))
            elif side == 2:
                pts.append((w - t * w, h - rough + j))
            else:
                pts.append((rough + j, h - t * h))
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return m


def with_shadow(img, off=(8, 12), blur=10, op=0.30):
    pad = blur * 2 + max(abs(off[0]), abs(off[1]))
    out = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    a = img.getchannel('A').point(lambda v: int(v * op))
    blk = Image.new('RGBA', img.size, (20, 14, 8, 255))
    blk.putalpha(a)
    sh = Image.new('RGBA', out.size, (0, 0, 0, 0))
    sh.paste(blk, (pad + off[0], pad + off[1]))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    out.alpha_composite(sh)
    out.alpha_composite(img, (pad, pad))
    return out


# ---------- peças ----------
@lru_cache(None)
def piece(name):
    return Image.open(f'{ROOT}/pieces/{name}.png').convert('RGBA')


def fit(img, w=None, h=None):
    if w:
        return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    return img.resize((round(img.width * h / img.height), h), Image.LANCZOS)


@lru_cache(None)
def coin(side, d):
    return fit(piece('heads' if side else 'tails'), w=d)


@lru_cache(None)
def table_img():
    t = Image.open(f'{ROOT}/pieces/table.jpg').convert('RGB')
    tw, th = 920, 1180
    t = t.resize((tw, round(t.height * tw / t.width)), Image.LANCZOS).crop((0, 0, tw, th))
    t = t.convert('RGBA')
    t.putalpha(torn_mask(tw, th, 21, rough=6))
    return with_shadow(t, off=(10, 16), blur=16, op=0.28)


TABLE_XY = (W // 2, 760)


def tag_img(text, bg=TAGPAPER, fg=INK, size=26, maxw=250, hole=True, kind='SemiBold'):
    f = font(kind, size)
    words, lines, cur = text.split(), [], ''
    for wd in words:
        test = (cur + ' ' + wd).strip()
        if f.getlength(test) <= maxw - 36 or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = wd
    lines.append(cur)
    lh = int(size * 1.18)
    tw = int(max(f.getlength(l) for l in lines)) + 40
    th = lh * len(lines) + 26
    img = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    m = torn_mask(tw, th, hash(text) % 999, rough=2.5)
    fill = Image.new('RGBA', (tw, th), bg + (255,))
    img.paste(fill, (0, 0), m)
    d = ImageDraw.Draw(img)
    for i, l in enumerate(lines):
        d.text((tw / 2, 13 + lh * i + lh / 2), l, font=f, fill=fg, anchor='mm')
    return grain(img, 4, seed=len(text))


# ---------- tempo ----------
def q(t):
    return math.floor(t * STEP) / STEP


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    return 1 - (1 - x) ** 3


def ease_back(x, s=1.6):
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def boil(t, sid, amp=1.5):
    r = random.Random(int(t * STEP) * 7919 + sid)
    return r.uniform(-amp, amp), r.uniform(-amp, amp), r.uniform(-0.4, 0.4)


def place(canvas, img, cx, cy, rot=0.0, scale=1.0, alpha=1.0, shadow=True):
    if scale != 1.0:
        img = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)
    if abs(rot) > 0.05:
        img = img.rotate(rot, resample=Image.BICUBIC, expand=True)
    if shadow:
        img = with_shadow(img, off=(5, 8), blur=6, op=0.33)
    if alpha < 1:
        a = img.getchannel('A').point(lambda v: int(v * alpha))
        img.putalpha(a)
    canvas.alpha_composite(img, (int(cx - img.width / 2), int(cy - img.height / 2)))


def flip_coin(canvas, t, t0, cx, cy, d, rot, sid, start_side=0, dur=0.34, glow=None, dim=0.0):
    p = clamp((t - t0) / dur) if t >= t0 else 0.0
    side = start_side if p < 0.5 else 1 - start_side
    sx = abs(math.cos(math.pi * p))
    img = coin(side, d)
    if dim > 0:
        a = np.array(img).astype(np.float32)
        gray = a[..., :3].mean(axis=2, keepdims=True)
        a[..., :3] = a[..., :3] * (1 - dim) + (gray * 0.5 + np.array(CREAM) * 0.5) * dim
        a[..., 3] *= (1 - 0.55 * dim)
        img = Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
    if glow is not None and glow > 0:
        a = np.array(img).astype(np.float32)
        a[..., :3] = a[..., :3] * (1 - 0.55 * glow) + np.array(RED) * 0.55 * glow
        img = Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
        ring = Image.new('RGBA', (d + 40, d + 40), (0, 0, 0, 0))
        ImageDraw.Draw(ring).ellipse((4, 4, d + 35, d + 35), outline=RED + (int(255 * glow),), width=8)
        canvas.alpha_composite(ring, (int(cx - ring.width / 2), int(cy - ring.height / 2)))
    if sx < 0.06:
        return
    img = img.resize((max(1, round(d * sx)), d), Image.LANCZOS)
    bx, by, br = boil(t, sid, 1.0)
    place(canvas, img, cx + bx, cy + by, rot + br)


# ---------- grade 3x3 ----------
def grid_layout(cx, cy, scale):
    pitch_x, pitch_y = 300 * scale, 330 * scale
    return [(cx + (i % 3 - 1) * pitch_x, cy + (i // 3 - 1) * pitch_y) for i in range(9)]


def draw_grid(canvas, t, cx, cy, scale, heads, flip_times=None, tags=False, dim_others=0.0,
              glow=0.0, sid=0, rot=0.0):
    d = int(200 * scale)
    pos = grid_layout(cx, cy, scale)
    r = random.Random(sid)
    for i, (x, y) in enumerate(pos):
        crot = rot + r.uniform(-8, 8)
        if flip_times and i in flip_times:
            flip_coin(canvas, t, flip_times[i], x, y, d, crot, sid * 31 + i, start_side=0)
        else:
            dim = dim_others if i != COMMON else 0.0
            g = glow if i == COMMON else None
            flip_coin(canvas, t, 1e9, x, y, d, crot, sid * 31 + i, start_side=1 if i in heads else 0,
                      glow=g, dim=dim)
        if tags:
            tg = TAGS[i]
            bx, by, br = boil(t, sid * 97 + i, 1.0)
            place(canvas, tg, x + bx, y + d * 0.5 + tg.height / 2 + 14 + by, r.uniform(-3, 3) + br, shadow=True)


TAGS = None


def grid_sheet(heads, seed):
    """Grade pronta como folha de papel, para a cena das 256 combinações."""
    s = Image.new('RGBA', (980, 1080), (0, 0, 0, 0))
    m = torn_mask(980, 1080, seed, rough=5)
    s.paste(Image.new('RGBA', s.size, TAGPAPER + (255,)), (0, 0), m)
    s = grain(s, 4, seed)
    r = random.Random(seed)
    for i, (x, y) in enumerate(grid_layout(490, 540, 1.0)):
        c = coin(1 if i in heads else 0, 200).rotate(r.uniform(-10, 10), resample=Image.BICUBIC, expand=True)
        c = with_shadow(c, off=(4, 6), blur=5, op=0.3)
        s.alpha_composite(c, (int(x - c.width / 2), int(y - c.height / 2)))
    return s


# ---------- rosto de papel ----------
def faceless_head():
    w, h = 620, 820
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse((60, 610, w - 60, h + 300), fill=INK + (255,))          # ombros
    d.rectangle((250, 520, w - 250, 680), fill=INK + (255,))           # pescoço
    d.ellipse((130, 40, w - 130, 600), fill=INK + (255,))             # cabelo/contorno
    d.ellipse((165, 110, w - 165, 590), fill=TAGPAPER + (255,))        # rosto sem feições
    m = torn_mask(w, h, 77, rough=3)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out.paste(img, (0, 0), Image.fromarray(np.minimum(np.array(img.getchannel('A')), np.array(m))))
    return grain(out, 5, 9)


def tear_halves(img, seed=5):
    w, h = img.size
    r = random.Random(seed)
    xs, x = [], w / 2
    for y in range(0, h + 20, 20):
        x = w / 2 + r.uniform(-22, 22)
        xs.append((x, y))
    left = Image.new('L', (w, h), 0)
    ImageDraw.Draw(left).polygon([(0, 0)] + xs + [(0, h)], fill=255)
    a = np.array(img.getchannel('A'))
    la = np.minimum(a, np.array(left))
    ra = np.minimum(a, 255 - np.array(left))
    L, R = img.copy(), img.copy()
    L.putalpha(Image.fromarray(la))
    R.putalpha(Image.fromarray(ra))
    # borda branca de rasgo
    edge = Image.new('L', (w, h), 0)
    ImageDraw.Draw(edge).line(xs, fill=255, width=7)
    for P, aa in ((L, la), (R, ra)):
        e = np.minimum(np.array(edge), aa)
        lay = Image.new('RGBA', (w, h), (252, 249, 242, 0))
        lay.putalpha(Image.fromarray(e))
        P.alpha_composite(lay)
    return L, R


# ---------- texto ----------
def big_text(canvas, lines, cy, color, size, t, t0, kind='anton', lh=1.0):
    p = clamp((q(t) - t0) / 0.25)
    if t < t0:
        return
    s = 0.6 + 0.4 * ease_back(p)
    for k, line in enumerate(lines):
        f = font(kind, size)
        tw = int(f.getlength(line)) + 40
        th = int(size * 1.35)
        img = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
        ImageDraw.Draw(img).text((tw / 2, th / 2), line, font=f, fill=color + (255,), anchor='mm')
        bx, by, br = boil(t, 500 + k, 1.2)
        place(canvas, img, W / 2 + bx, cy + k * size * lh + by, br, scale=s, shadow=False)


CAP_Y = 1460
HIDE = []  # janelas sem legenda


def captions():
    """Grupos de até 4 palavras, quebrando na pontuação."""
    groups, cur = [], []
    for w in WORDS:
        cur.append(w)
        if len(cur) >= 4 or w['w'][-1] in '.,?':
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    out = []
    for i, g in enumerate(groups):
        s = g[0]['s']
        e = groups[i + 1][0]['s'] if i + 1 < len(groups) and groups[i + 1][0]['s'] - g[-1]['e'] < 0.35 else g[-1]['e'] + 0.15
        out.append((s, e, ' '.join(x['w'] for x in g)))
    return out


CAPS = None


def draw_caption(canvas, t):
    if any(a <= t < b for a, b in HIDE):
        return
    for s, e, txt in CAPS:
        if s <= t < e:
            f = font('SemiBold', 42)
            tw = int(f.getlength(txt)) + 40
            img = Image.new('RGBA', (tw, 72), (0, 0, 0, 0))
            d = ImageDraw.Draw(img)
            d.text((tw / 2, 36), txt, font=f, fill=INK + (255,), anchor='mm',
                   stroke_width=3, stroke_fill=CREAM + (255,))
            canvas.alpha_composite(img, (int(W / 2 - tw / 2), CAP_Y - 36))
            return


# ---------- cenas ----------
SCATTER = None


def scatter_positions():
    r = random.Random(42)
    pts = []
    while len(pts) < 9:
        x, y = r.uniform(250, 830), r.uniform(330, 1180)
        if all((x - a) ** 2 + (y - b) ** 2 > 190 ** 2 for a, b, *_ in pts):
            pts.append((x, y, r.uniform(-30, 30), r.random() < 0.5))
    return pts


def scene_table(cv, t, s0):
    tb = table_img()
    cv.alpha_composite(tb, (TABLE_XY[0] - tb.width // 2, TABLE_XY[1] - tb.height // 2))


def s1(cv, t):
    s0 = T['s1']
    scene_table(cv, t, s0)
    tq = q(t)
    # mão entra do topo e solta
    hand = fit(piece('hand_throw'), w=400)
    p = clamp((tq - s0) / 0.4)
    hy = -300 + (300 + SAFE_TOP + hand.height / 2) * ease_out(p)
    lift = clamp((tq - s0 - 1.1) / 0.4)
    hy -= 1400 * lift * lift
    for i, (x, y, rot, side) in enumerate(SCATTER):
        t0 = s0 + 0.45 + i * 0.09
        if tq < t0:
            continue
        pp = clamp((tq - t0) / 0.32)
        e = ease_out(pp)
        cx = W / 2 + (x - W / 2) * e
        cy = 520 + (y - 520) * e
        sc = 1.35 - 0.35 * e
        flip_coin(cv, t, 1e9, cx, cy, int(170 * sc), rot + (1 - e) * 140, 900 + i, start_side=1 if side else 0)
    if hy > -400:
        bx, by, br = boil(t, 3, 1.5)
        place(cv, hand, W / 2 + 40 + bx, hy + by, br)


def s2(cv, t):
    s0 = T['s2']
    tq = q(t)
    p = clamp((tq - s0) / 0.35)
    sc = 0.6 + 0.4 * ease_out(p)
    for k, (side, lbl, bg, fg) in enumerate(((1, 'TEM', RED, TAGPAPER), (0, 'NÃO TEM', INK, TAGPAPER))):
        cx = W / 2 + (-215 if k == 0 else 215)
        cy = 820
        flip_coin(cv, t, 1e9, cx, cy, int(370 * sc), -6 if k == 0 else 7, 30 + k, start_side=side)
        t0 = s0 + (0.55 if k == 0 else 1.75)
        if tq >= t0:
            tg = tag_img(lbl, bg=bg, fg=fg, size=54, maxw=420, kind='ExtraBold')
            pp = clamp((tq - t0) / 0.25)
            bx, by, br = boil(t, 40 + k, 1.2)
            place(cv, tg, cx + bx, 1120 + by + (1 - ease_back(pp)) * 80, (-4 if k == 0 else 3) + br,
                  scale=max(0.05, ease_back(pp, 2)))


def s3(cv, t):
    s0 = T['s3']
    tq = q(t)
    order = [0, 1, 2, 3, 5]
    span = max(0.6, (T['s4'] - s0 - 1.0) / 5)
    flips = {i: s0 + 0.55 + k * span for k, i in enumerate(order)}
    p = clamp((tq - s0) / 0.3)
    draw_grid(cv, t, W / 2, 760 + (1 - ease_out(p)) * 60, 1.0, set(), flip_times=flips, tags=True, sid=7)


SHEETS = None


def s4(cv, t):
    s0 = T['s4']
    tq = q(t)
    r = random.Random(4)
    n = len(SHEETS)
    for k, sh in enumerate(SHEETS):
        t0 = s0 + k * 0.11
        if tq < t0:
            break
        pp = clamp((tq - t0) / 0.2)
        x = r.uniform(300, 780)
        y = r.uniform(520, 1250)
        rot = r.uniform(-18, 18)
        place(cv, sh, x + (1 - ease_out(pp)) * r.choice([-900, 900]), y, rot, scale=0.42)
    t256 = T['e256']
    if tq >= t256:
        veil = Image.new('RGBA', (W, H), CREAM + (int(150 * clamp((tq - t256) / 0.2)),))
        cv.alpha_composite(veil)
        big_text(cv, ['256'], 830, RED, 470, t, t256)


def s5(cv, t):
    s0 = T['s5']
    tq = q(t)
    p = clamp((tq - s0) / 0.35)
    tdim = T['edim']
    dim = clamp((tq - tdim) / 0.3)
    glow = clamp((tq - tdim - 0.15) / 0.3)
    sc = 0.46
    for k, heads in enumerate((GA, GB)):
        cx = W / 2 + (-238 if k == 0 else 238)
        cy = 720 + (1 - ease_out(p)) * (900 if k == 0 else -900)
        lab = tag_img('PESSOA ' + 'AB'[k], bg=INK, fg=TAGPAPER, size=30, maxw=300, kind='ExtraBold')
        place(cv, lab, cx, cy - 250, 0, shadow=True)
        draw_grid(cv, t, cx, cy, sc, heads, dim_others=dim, glow=glow, sid=11 + k)
    if glow > 0:
        tg = tag_img('emoções que mudam rápido', bg=RED, fg=TAGPAPER, size=34, maxw=560, kind='Bold')
        place(cv, tg, W / 2, 1030, 0, alpha=glow)
    tc = T['ecomum']
    big_text(cv, ['UMA MOEDA', 'EM COMUM'], 1240, INK, 132, t, tc, lh=1.05)


def s6(cv, t):
    s0 = T['s6']
    tq = q(t)
    p = ease_out(clamp((tq - s0) / 1.4))
    for k, heads in enumerate((GA, GB)):
        cx = W / 2 + (-238 if k == 0 else 238) + (-120 if k == 0 else 120) * p
        cy = 720 + (-230 if k == 0 else 330) * p
        sc = 0.46 - 0.10 * p
        draw_grid(cv, t, cx, cy, sc, heads, dim_others=0, glow=0, sid=11 + k, rot=(-6 if k == 0 else 6) * p)


HEAD = None
WHOLE = None


def s7(cv, t):
    s0 = T['s7']
    tq = q(t)
    L, R = HEAD
    p = clamp((tq - s0) / 0.3)
    tr = T['erasga']
    g = ease_out(clamp((tq - tr) / 0.5))
    cy = 820 + (1 - ease_out(p)) * 1200
    bx, by, br = boil(t, 70, 1.4)
    if tq < tr:
        place(cv, WHOLE, W / 2 + bx, cy + by, br)
        return
    place(cv, L, W / 2 - 150 * g + bx, cy + 40 * g + by, 9 * g + br)
    place(cv, R, W / 2 + 150 * g + bx, cy - 30 * g + by, -8 * g + br)


def s8(cv, t):
    s0 = T['s8']
    scene_table(cv, t, s0)
    tq = q(t)
    hand = fit(piece('hand_gather'), w=560)
    sweep = clamp((tq - s0 - 0.5) / 1.6)
    hx = W + 300 - (W + 300 - 620) * ease_out(clamp((tq - s0) / 0.5)) + 900 * sweep * sweep
    for i, (x, y, rot, side) in enumerate(SCATTER):
        k = clamp((tq - s0 - 0.35 - (W - x) / W * 0.4) / 0.6)
        e = k * k
        cx = x + (hx - 120 - x) * e
        cy = y + (760 - y) * e * 0.6
        if cx < W + 150:
            flip_coin(cv, t, 1e9, cx, cy, 170, rot, 900 + i, start_side=1 if side else 0)
    bx, by, br = boil(t, 81, 1.5)
    place(cv, hand, hx + bx, 760 + by, br)
    tf = T['credit']
    if tq >= tf:
        a = clamp((tq - tf) / 0.25)
        veil = Image.new('RGBA', (W, H), CREAM + (int(255 * a),))
        cv.alpha_composite(veil)
        f1, f2 = font('ExtraBold', 50), font('Medium', 36)
        d = ImageDraw.Draw(cv)
        al = int(255 * a)
        d.text((W / 2, 860), 'Dr. Fabio Schmidt', font=f1, fill=INK + (al,), anchor='mm')
        d.text((W / 2, 935), 'médico com foco em TPB', font=f2, fill=INK + (al,), anchor='mm')
        d.text((W / 2, 990), 'CRM-SP 183549', font=f2, fill=INK + (al,), anchor='mm')
        d.text((W / 2, 1080), 'Conteúdo educativo.', font=font('serif', 40), fill=RED + (al,), anchor='mm')


SCENES = [('s1', s1), ('s2', s2), ('s3', s3), ('s4', s4), ('s5', s5), ('s6', s6), ('s7', s7), ('s8', s8)]


def frame(t):
    cv = PAPER.copy()
    name = SCENES[0][1]
    for k, (key, fn) in enumerate(SCENES):
        if t >= T[key]:
            name = fn
    name(cv, t)
    draw_caption(cv, t)
    return cv.convert('RGB')


def setup():
    global PAPER, TAGS, SCATTER, SHEETS, HEAD, CAPS, HIDE
    PAPER = make_paper()
    TAGS = [tag_img(c, size=26, maxw=270) for c in CRIT]
    SCATTER = scatter_positions()
    r = random.Random(9)
    SHEETS = [grid_sheet(set(r.sample(range(9), r.choice([5, 5, 6, 7]))), 100 + k) for k in range(14)]
    global WHOLE
    WHOLE = faceless_head()
    HEAD = tear_halves(WHOLE)
    CAPS = captions()
    HIDE = [(T['e256'], T['s5']), (T['ecomum'], T['s6'])]


def events():
    """Momentos de som: (tempo, tipo)."""
    ev = []
    for k in ('s2', 's3', 's4', 's5', 's6', 's7', 's8'):
        ev.append((T[k], 'snip'))
    for i in range(9):
        ev.append((T['s1'] + 0.45 + i * 0.09 + 0.32, 'coin'))
    ev += [(T['s2'] + 0.55, 'paper'), (T['s2'] + 1.75, 'paper')]
    span = max(0.6, (T['s4'] - T['s3'] - 1.0) / 5)
    for k in range(5):
        ev.append((T['s3'] + 0.55 + k * span + 0.17, 'flip'))
    for k in range(len(SHEETS)):
        ev.append((T['s4'] + k * 0.11, 'flick'))
    ev += [(T['e256'], 'hit'), (T['edim'] + 0.15, 'glow'), (T['ecomum'], 'hit'), (T['erasga'], 'rip')]
    for i in range(9):
        ev.append((T['s8'] + 0.6 + i * 0.12, 'coin_soft'))
    return sorted(ev)


def main():
    setup()
    if len(sys.argv) > 1 and sys.argv[1] == '--events':
        json.dump(events(), open(f'{ROOT}/audio/events.json', 'w'))
        return
    if len(sys.argv) > 2 and sys.argv[1] == '--still':
        for s in sys.argv[2].split(','):
            frame(float(s)).save(f'{ROOT}/out/still_{s}.jpg', quality=88)
        return
    n = int(round(DUR * FPS))
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                          '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
                          '-crf', '18', '-pix_fmt', 'yuv420p', f'{ROOT}/out/video_mudo.mp4'], stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frame(i / FPS).tobytes())
        if i % 60 == 0:
            print(i, '/', n, flush=True)
    p.stdin.close()
    p.wait()


if __name__ == '__main__':
    main()
