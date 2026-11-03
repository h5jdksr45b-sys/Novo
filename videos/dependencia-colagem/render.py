"""Reel Dependência emocional e borderline: colagem em stop motion, 1080x1920, 30 fps.

Peças recortadas (GPT Image 2.5, meio-tom) sobre papel creme, cartão de cor chapada por cena,
peças em tremor a 12 qps, legenda pequena (até 3 palavras) num lugar só, ênfase num molde só:
palavra grande Anton + complemento em serifa itálica vermelha.
Uso: python3 render.py [--still t1,t2,...] [--events]
"""
import json, math, random, subprocess, sys
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS, STEP = 1080, 1920, 30, 12
ROOT = __file__.rsplit('/', 1)[0]
CREAM = (237, 228, 211)
PAPER2 = (247, 241, 229)
INK = (26, 24, 22)
RED = (204, 0, 0)
CARDS = {
    'mostarda': (227, 169, 43), 'azul': (47, 93, 168), 'verde': (62, 138, 99),
    'rosa': (229, 139, 160), 'vermelho': (204, 0, 0), 'petroleo': (21, 94, 117),
}

WORDS = json.load(open(f'{ROOT}/audio/words.json'))
BL = {b['k']: b for b in json.load(open(f'{ROOT}/audio/blocos.json'))}
END_VOICE = BL[10]['e']
T_CTA = END_VOICE + 0.25
DUR = T_CTA + 3.6


def w_at(word, nth=0, after=0.0):
    hits = [w for w in WORDS if w['w'].strip('.,?').lower() == word.strip('.,?').lower() and w['s'] >= after]
    return hits[nth]['s']


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
    low = rng.normal(0, 1, (H // 40, W // 40)).astype(np.float32)
    low = np.array(Image.fromarray(np.clip(low * 40 + 128, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
                   .filter(ImageFilter.GaussianBlur(30)), np.float32) - 128
    base += low[..., None] * 0.10
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    r = random.Random(3)
    for _ in range(160):
        x, y = r.uniform(0, W), r.uniform(0, H)
        a = r.uniform(0, math.pi)
        L = r.uniform(8, 30)
        c = tuple(int(v - r.uniform(8, 18)) for v in CREAM)
        d.line((x, y, x + math.cos(a) * L, y + math.sin(a) * L), fill=c, width=1)
    return img.convert('RGBA')


def torn_mask(w, h, seed, rough=7):
    r = random.Random(seed)
    pts = []
    for side in range(4):
        n = 24
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


def with_shadow(img, off=(6, 9), blur=7, op=0.30):
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


@lru_cache(None)
def card(color, w, h, seed):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    img.paste(Image.new('RGBA', (w, h), CARDS[color] + (255,)), (0, 0), torn_mask(w, h, seed, rough=6))
    return img


def tag_img(text, bg=PAPER2, fg=INK, size=30, kind='ExtraBold', pad=22):
    f = font(kind, size)
    tw = int(f.getlength(text)) + pad * 2
    th = int(size * 1.25) + 24
    img = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    img.paste(Image.new('RGBA', (tw, th), bg + (255,)), (0, 0), torn_mask(tw, th, sum(map(ord, text)) % 997, rough=2.5))
    ImageDraw.Draw(img).text((tw / 2, th / 2), text, font=f, fill=fg + (255,), anchor='mm')
    return img


TAGS = {}


def tag(text, **kw):
    key = (text, tuple(sorted(kw.items())))
    if key not in TAGS:
        TAGS[key] = tag_img(text, **kw)
    return TAGS[key]


def bubble_img(kind='dots', w=300, h=150):
    """Balão de mensagem de papel: dots = digitando; check = chegou."""
    img = Image.new('RGBA', (w + 20, h + 50), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    fill = PAPER2 if kind == 'dots' else RED
    d.rounded_rectangle((8, 8, w, h), radius=48, fill=fill + (255,), outline=INK + (255,), width=6)
    d.polygon([(54, h - 8), (40, h + 40), (110, h - 6)], fill=fill + (255,))
    d.line([(54, h - 4), (40, h + 40), (110, h - 3)], fill=INK + (255,), width=6)
    cx, cy = (w + 8) / 2, (h + 8) / 2
    if kind == 'dots':
        for k in (-1, 0, 1):
            d.ellipse((cx + k * 62 - 17, cy - 17, cx + k * 62 + 17, cy + 17), fill=INK + (255,))
    else:
        for dx in (-26, 18):
            d.line([(cx + dx - 34, cy + 2), (cx + dx - 10, cy + 26), (cx + dx + 34, cy - 24)], fill=PAPER2 + (255,), width=13, joint='curve')
    return img


BUB = {}


# ---------- tempo ----------
def q(t):
    return math.floor(t * STEP) / STEP


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    return 1 - (1 - x) ** 3


def ease_back(x, s=1.7):
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def boil(t, sid, amp=1.4):
    r = random.Random(int(t * STEP) * 7919 + sid)
    return r.uniform(-amp, amp), r.uniform(-amp, amp), r.uniform(-0.5, 0.5)


@lru_cache(maxsize=4096)
def prepared(key, img_id, w, rot, shadow):
    img = SRC[img_id]
    h = max(1, round(img.height * w / img.width))
    im = img.resize((max(1, w), h), Image.LANCZOS)
    if abs(rot) > 0.05:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if shadow:
        im = with_shadow(im)
    return im


SRC = {}


def reg(img):
    k = id(img)
    SRC[k] = img
    return k


def place(cv, img, cx, cy, w=None, rot=0.0, alpha=1.0, shadow=True):
    k = reg(img)
    w = int(round((w or img.width) / 4) * 4)
    rot = round(rot * 2) / 2
    im = prepared(k, k, w, rot, shadow)
    if alpha < 1:
        im = im.copy()
        im.putalpha(im.getchannel('A').point(lambda v: int(v * alpha)))
    cv.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))


def pop(t, t0, dur=0.28):
    """Fator de escala de entrada (0 antes de t0)."""
    if q(t) < t0:
        return 0.0
    return max(0.02, ease_back(clamp((q(t) - t0) / dur)))


def put(cv, t, img, cx, cy, w, t0, sid, rot=0.0, enter='pop', alpha=1.0, shadow=True, amp=1.4):
    tq = q(t)
    if tq < t0:
        return
    p = clamp((tq - t0) / 0.3)
    bx, by, br = boil(t, sid, amp)
    if enter == 'pop':
        s = ease_back(p)
        place(cv, img, cx + bx, cy + by, max(8, w * s), rot + br, alpha, shadow)
        return
    e = ease_out(p)
    dx, dy = {'left': (-1, 0), 'right': (1, 0), 'up': (0, -1), 'down': (0, 1), 'none': (0, 0)}[enter]
    place(cv, img, cx + bx + dx * (1 - e) * 1100, cy + by + dy * (1 - e) * 1500, w, rot + br, alpha, shadow)


def burst(cv, t, t0, cx, cy, r0=60, r1=190, n=12, color=RED, dur=0.45, sid=0):
    tq = q(t)
    if not (t0 <= tq < t0 + dur):
        return
    p = (tq - t0) / dur
    d = ImageDraw.Draw(cv)
    rr = random.Random(sid)
    for k in range(n):
        a = 2 * math.pi * k / n + rr.uniform(-0.15, 0.15)
        L = r1 * (0.7 + 0.3 * rr.random())
        a0 = r0 + (L - r0) * ease_out(p) * 0.5
        a1 = r0 + (L - r0) * ease_out(p)
        d.line((cx + math.cos(a) * a0, cy + math.sin(a) * a0, cx + math.cos(a) * a1, cy + math.sin(a) * a1),
               fill=color + (int(255 * (1 - p * 0.7)),), width=9)


def red_circle(cv, t, t0, cx, cy, rx, ry, dur=0.35, width=10, sid=0):
    tq = q(t)
    if tq < t0:
        return
    p = clamp((tq - t0) / dur)
    r = random.Random(sid)
    pts = []
    n = int(60 * p) + 2
    for k in range(n):
        a = -1.9 + 2 * math.pi * 1.08 * k / 60
        j = 1 + 0.03 * math.sin(k * 0.7 + sid)
        pts.append((cx + math.cos(a) * rx * j, cy + math.sin(a) * ry * j))
    bx, by, _ = boil(t, 300 + sid, 1.5)
    pts = [(x + bx, y + by) for x, y in pts]
    ImageDraw.Draw(cv).line(pts, fill=RED + (255,), width=width, joint='curve')


def thread(cv, a, b, color=INK, width=4, alpha=255, sag=40):
    (x0, y0), (x1, y1) = a, b
    pts = []
    for k in range(21):
        u = k / 20
        x = x0 + (x1 - x0) * u
        y = y0 + (y1 - y0) * u + sag * math.sin(math.pi * u)
        pts.append((x, y))
    ImageDraw.Draw(cv).line(pts, fill=color + (alpha,), width=width, joint='curve')


# ---------- texto ----------
@lru_cache(None)
def text_img(txt, kind, size, color, stroke=0, stroke_color=None):
    f = font(kind, size)
    bb = f.getbbox(txt, stroke_width=stroke)
    w, h = bb[2] - bb[0] + 30, bb[3] - bb[1] + 30
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((15 - bb[0], 15 - bb[1]), txt, font=f, fill=color + (255,),
                             stroke_width=stroke, stroke_fill=(stroke_color or color) + (255,))
    return img


def emph(cv, t, t0, t1, big, small=None, cy=330, size=150, color=INK, small_color=RED, maxw=960):
    """Molde único de ênfase: linhas grandes em Anton + complemento em serifa vermelha."""
    tq = q(t)
    if not (t0 <= tq < t1):
        return
    s = 0.7 + 0.3 * ease_back(clamp((tq - t0) / 0.22))
    y = cy
    for k, line in enumerate(big):
        img = text_img(line, 'anton', size, color)
        sc = min(1.0, maxw / img.width)
        bx, by, br = boil(t, 700 + k, 1.0)
        place(cv, img, W / 2 + bx, y + by, img.width * sc * s, br, shadow=False)
        y += size * sc * 1.08
    if small:
        img = text_img(small, 'serif', int(size * 0.42), small_color)
        p = clamp((tq - t0 - 0.12) / 0.22)
        if p > 0:
            bx, by, br = boil(t, 720, 1.0)
            place(cv, img, W / 2 + bx, y + size * 0.05 + by, img.width * ease_back(p), br, shadow=False)


CAP_Y = 1500
HIDE = set()


def captions():
    """Grupos de até 3 palavras, quebrando na pontuação."""
    groups, cur = [], []
    for w in WORDS:
        cur.append(w)
        if len(cur) >= 3 or w['w'][-1] in '.,?':
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    out = []
    for i, g in enumerate(groups):
        s = g[0]['s'] - 0.05
        nxt = groups[i + 1][0]['s'] - 0.05 if i + 1 < len(groups) else 1e9
        e = nxt if nxt - g[-1]['e'] < 0.45 else g[-1]['e'] + 0.2
        out.append((s, e, ' '.join(x['w'] for x in g)))
    return out


CAPS = []


def draw_caption(cv, t):
    if any(a <= t < b for a, b in HIDE):
        return
    for s, e, txt in CAPS:
        if s <= t < e:
            img = text_img(txt, 'Bold', 46, INK, 4, CREAM)
            p = clamp((t - s) / 0.12)
            cv.alpha_composite(img, (int(W / 2 - img.width / 2), int(CAP_Y - img.height / 2 + (1 - ease_out(p)) * 14)))
            return


# ---------- cenas ----------
def bg_card(cv, t, color, w=900, h=1180, cy=860, rot=-2, seed=1, t0=None):
    c = card(color, w, h, seed)
    tq = q(t)
    s = 1.0 if t0 is None else ease_out(clamp((tq - t0) / 0.25))
    if s <= 0:
        return
    bx, by, br = boil(t, 900 + seed, 0.8)
    place(cv, c, W / 2 + bx, cy + by, w * s, rot + br, shadow=True)


def sc1(cv, t):
    """Gancho. 0 s: mulher esperando + balão digitando + texto de abertura já visível."""
    tq = q(t)
    t_cut = w_at('alguém')
    t_b = w_at('borderline')
    if tq < t_cut:
        bg_card(cv, t, 'mostarda', 920, 1080, 900, -2, 1)
        put(cv, t, piece('woman'), 540, 1030, 780, -1, 1)
        put(cv, t, BUB['dots'], 800, 620, 300, -1, 2, rot=4)
        red_circle(cv, t, 0.6, 800, 610, 210, 140, sid=1)
        emph(cv, t, -1, 99, ['UMA RESPOSTA'], 'segura o dia inteiro', cy=300, size=140)
    elif tq < t_b:
        # corte: aproximação no rosto e no balão
        bg_card(cv, t, 'mostarda', 1100, 1500, 900, 1, 2)
        put(cv, t, piece('woman'), 470, 1180, 1500, -1, 3)
        put(cv, t, BUB['dots'], 790, 470, 420, -1, 4, rot=-3)
        put(cv, t, tag('ESPERANDO', bg=INK, fg=PAPER2, size=40), 360, 360, 330, t_cut + 0.1, 5, rot=-4)
    else:
        bg_card(cv, t, 'vermelho', 940, 1150, 880, -1, 3)
        put(cv, t, piece('woman'), 540, 1060, 700, -1, 6)
        emph(cv, t, t_b - 0.05, 99, ['BORDERLINE?'], 'ou outra coisa', cy=360, size=170, color=INK, small_color=PAPER2)
        HIDE.add((t_b - 0.05, BL[1]['e'] + 0.1))


def sc2(cv, t):
    tq = q(t)
    s0 = BL[2]['s']
    t_alm = w_at('almoço')
    t_dep = w_at('Depois,')
    t_bom = w_at('bom.')
    bg_card(cv, t, 'azul', 900, 1100, 880, 2, 4)
    if tq < t_dep:
        put(cv, t, piece('woman'), 540, 1060, 640, s0, 10, enter='up')
        put(cv, t, piece('plate'), 560, 700, 560, t_alm - 0.25, 11)
        put(cv, t, BUB['dots'], 830, 520, 240, w_at('resposta') - 0.1, 12, rot=5)
        put(cv, t, tag('ALMOÇO?', size=36), 330, 520, 230, t_alm, 13, rot=-5)
    else:
        put(cv, t, piece('woman'), 540, 1100, 600, -1, 10)
        # relógio com ponteiro girando até a resposta chegar
        clock = piece('clock')
        put(cv, t, clock, 540, 690, 520, t_dep - 0.05, 14)
        if tq >= t_dep:
            d = ImageDraw.Draw(cv)
            ang = (tq - t_dep) * 4.0
            if tq >= t_bom:
                ang = (t_bom - t_dep) * 4.0
            cx, cy = 540, 690
            d.line((cx, cy, cx + math.cos(ang - 1.57) * 150, cy + math.sin(ang - 1.57) * 150), fill=RED + (255,), width=12)
            d.ellipse((cx - 16, cy - 16, cx + 16, cy + 16), fill=RED + (255,))
        put(cv, t, BUB['check'], 840, 520, 230, t_bom - 0.2, 15, rot=-4)
        emph(cv, t, t_bom - 0.05, BL[2]['e'] + 0.35, ['O DIA BOM'], 'depende da resposta', cy=250, size=110)
        HIDE.add((t_bom - 0.05, BL[2]['e'] + 0.35))


def sc3(cv, t):
    """Ciclo: resposta chega, alívio, procura de novo. Cada volta mais rápida."""
    tq = q(t)
    s0 = BL[3]['s']
    bg_card(cv, t, 'verde', 920, 1120, 880, -1, 5)
    hits = [w_at('responde,'), w_at('alívio,'), w_at('alívio', 0, w_at('alívio,') + 0.1), w_at('procurar'), w_at('novo.')]
    put(cv, t, piece('woman'), 540, 1060, 680, s0, 20)
    # balão viaja de cima até a mulher em cada volta
    for k, h in enumerate(hits):
        dur = max(0.25, 0.55 - k * 0.07)
        if h - dur <= tq < h + 0.35:
            p = clamp((tq - (h - dur)) / dur)
            x = 900 - 260 * ease_out(p)
            y = 260 + 300 * ease_out(p)
            place(cv, BUB['check'], x, y, 230, -5 + 6 * p)
        burst(cv, t, h, 640, 600, sid=k)
    t_al = w_at('alívio,')
    emph(cv, t, t_al - 0.05, w_at('E', 0, t_al) - 0.05, ['ALÍVIO'], 'a cada resposta', cy=290, size=170, small_color=PAPER2)
    t_ens = w_at('ensina')
    emph(cv, t, t_ens - 0.05, BL[3]['e'] + 0.35, ['DE NOVO'], 'e de novo', cy=290, size=170, small_color=PAPER2)
    HIDE.add((t_al - 0.05, w_at('E', 0, t_al) - 0.05))
    HIDE.add((t_ens - 0.05, BL[3]['e'] + 0.35))


NET = [('friend1', 230, 470, 'AMIGOS', 'amigos,'), ('friend2', 540, 380, 'AMIGOS', 'amigos,'),
       ('friend3', 850, 470, 'OPINIÃO PRÓPRIA', 'opinião'), ('guitar', 250, 830, 'O QUE VOCÊ GOSTAVA', 'gostava'),
       ('book', 830, 840, 'O QUE VOCÊ GOSTAVA', 'gostava')]


def sc4(cv, t):
    """Rede encolhendo até sobrar uma pessoa."""
    tq = q(t)
    s0 = BL[4]['s']
    t_off = w_at('ficam')
    t_sob = w_at('Sobra')
    t_seg = w_at('segurando')
    root = (540, 1080)
    put(cv, t, piece('back'), 540, 1240, 330, s0, 30, enter='up')
    for k, (nm, x, y, lab, word) in enumerate(NET):
        t0 = w_at(word) - 0.1 + (0.12 if k in (1, 4) else 0)
        if tq < t0:
            continue
        fall = clamp((tq - t_off - k * 0.15) / 0.6)
        alpha = 1 - fall
        if alpha <= 0.02:
            continue
        yy = y + 900 * fall * fall
        thread(cv, root, (x, yy + 80), INK, 4, int(200 * alpha), sag=30)
        w0 = 260 if nm.startswith('friend') else 240
        put(cv, t, piece(nm), x, yy, w0, t0, 31 + k, rot=(-6 + 3 * k) + 40 * fall, alpha=alpha)
    # etiquetas
    labs = [('AMIGOS', 540, 640, 'amigos,'), ('OPINIÃO PRÓPRIA', 760, 640, 'opinião'), ('O QUE GOSTAVA', 540, 1010, 'gostava')]
    for k, (lab, x, y, word) in enumerate(labs):
        t0 = w_at(word)
        if t0 <= tq < t_off + 0.3:
            put(cv, t, tag(lab, bg=INK, fg=PAPER2, size=32), x if k != 1 else 820, y if k != 1 else 640, None or tag(lab, bg=INK, fg=PAPER2, size=32).width, t0, 40 + k, rot=(-3 + 3 * k))
    if tq >= t_sob - 0.1:
        p = ease_out(clamp((tq - t_sob + 0.1) / 0.4))
        thread(cv, root, (540, 560), RED, 9, 255, sag=0)
        put(cv, t, BUB['check'], 540, 470, 300, t_sob - 0.1, 45)
        put(cv, t, tag('UMA PESSOA', bg=RED, fg=PAPER2, size=38), 540, 650, tag('UMA PESSOA', bg=RED, fg=PAPER2, size=38).width, t_sob + 0.1, 46, rot=-2)
    emph(cv, t, t_seg - 0.05, BL[4]['e'] + 0.35, ['SEGURANDO TUDO'], None, cy=270, size=130)
    HIDE.add((t_seg - 0.05, BL[4]['e'] + 0.35))


def sc5(cv, t):
    tq = q(t)
    s0 = BL[5]['s']
    t_dep = w_at('dependência')
    t_com = w_at('com', 0, s0 + 2)
    bg_card(cv, t, 'rosa', 920, 1100, 900, 2, 6)
    put(cv, t, piece('woman'), 540, 1110, 620, s0, 50, enter='up')
    put(cv, t, BUB['dots'], 820, 760, 220, s0 + 0.2, 51, rot=4)
    if tq >= t_dep - 0.05 and tq < t_com - 0.05:
        emph(cv, t, t_dep - 0.05, t_com, ['DEPENDÊNCIA', 'EMOCIONAL'], 'nome do dia a dia', cy=300, size=140)
    if tq >= t_com - 0.05:
        put(cv, t, tag('COM BORDERLINE', bg=INK, fg=PAPER2, size=44), 540, 330, tag('COM BORDERLINE', bg=INK, fg=PAPER2, size=44).width, t_com - 0.05, 52, rot=-3)
        put(cv, t, tag('SEM BORDERLINE', bg=RED, fg=PAPER2, size=44), 540, 450, tag('SEM BORDERLINE', bg=RED, fg=PAPER2, size=44).width, w_at('sem', 0, t_com) - 0.05, 53, rot=2)


def sc6(cv, t):
    tq = q(t)
    s0 = BL[6]['s']
    t_am = w_at('ameaça')
    bg_card(cv, t, 'petroleo', 920, 1100, 880, -2, 7)
    put(cv, t, piece('door'), 790, 900, 400, s0, 60, enter='right')
    p = clamp((tq - t_am + 0.1) / 1.6)
    put(cv, t, piece('leaving'), 380 + 360 * ease_out(p), 960 - 30 * p, 430 - 120 * p, s0 + 0.1, 61, alpha=1 - 0.5 * p * p)
    emph(cv, t, s0 - 0.02, t_am - 0.1, ['A DIFERENÇA'], 'aparece aqui', cy=300, size=150, color=INK, small_color=PAPER2)
    HIDE.add((s0 - 0.02, t_am - 0.1))


def sc7(cv, t):
    tq = q(t)
    s0 = BL[7]['s']
    t_ced = w_at('cedendo')
    t_con = w_at('Concorda,')
    t_des = w_at('desculpa')
    t_pro = w_at('procura')
    bg_card(cv, t, 'azul', 920, 1120, 880, 2, 8)
    x_b = 540 if tq < t_pro - 0.1 else 540 - 170 * ease_out(clamp((tq - t_pro + 0.1) / 0.4))
    put(cv, t, piece('bowed'), x_b, 960, 330, s0, 70, enter='up')
    put(cv, t, tag('CEDE EM TUDO', bg=INK, fg=PAPER2, size=40), 540, 380, tag('CEDE EM TUDO', bg=INK, fg=PAPER2, size=40).width, t_ced, 71, rot=-3)
    put(cv, t, tag('CONCORDA', size=36), 250, 600, tag('CONCORDA', size=36).width, t_con, 72, rot=-6)
    put(cv, t, tag('PEDE DESCULPA', size=36), 820, 640, tag('PEDE DESCULPA', size=36).width, t_des, 73, rot=5)
    if tq >= t_pro - 0.1:
        put(cv, t, piece('friend1'), 760, 900, 300, t_pro - 0.1, 74, enter='right', rot=3)
        put(cv, t, tag('OUTRO APOIO', bg=RED, fg=PAPER2, size=38), 760, 1130, tag('OUTRO APOIO', bg=RED, fg=PAPER2, size=38).width, w_at('apoio.') - 0.05, 75, rot=-2)


def halo(cv, t, cx, cy, r, alpha):
    d = ImageDraw.Draw(cv)
    rr = random.Random(int(t * STEP))
    for k in range(28):
        a = 2 * math.pi * k / 28
        L = r * (1.25 + 0.25 * rr.random())
        d.line((cx + math.cos(a) * r, cy + math.sin(a) * r, cx + math.cos(a) * L, cy + math.sin(a) * L),
               fill=PAPER2 + (int(255 * alpha),), width=10)


@lru_cache(None)
def flames_red():
    a = np.array(piece('flames')).astype(np.float32)
    lum = a[..., :3].mean(2, keepdims=True) / 255
    a[..., :3] = np.array(RED) * (1 - lum) + np.array(PAPER2) * lum
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')


def sc8(cv, t):
    """Ondas: implora, acusa, se arrepende. A mesma pessoa vira tudo e vira ameaça."""
    tq = q(t)
    s0 = BL[8]['s']
    t_on = w_at('ondas.')
    t_imp = w_at('Implora')
    t_acu = w_at('acusa,')
    t_arr = w_at('arrepende.')
    t_quem = w_at('Quem', 0, s0)
    t_vira = w_at('vira', 0, s0)
    if tq < t_imp - 0.05:
        bg_card(cv, t, 'petroleo', 940, 1120, 880, -1, 9)
        wx = 540 + 80 * math.sin((tq - s0) * 3)
        put(cv, t, piece('wave'), wx, 900, 940, s0, 80, enter='left')
        emph(cv, t, t_on - 0.05, t_imp, ['EM ONDAS'], None, cy=330, size=170, color=INK)
        HIDE.add((t_on - 0.05, t_imp))
        return
    bg_card(cv, t, 'mostarda', 940, 1150, 880, 1, 10)
    on_fire = (t_acu - 0.05 <= tq < t_arr) or (tq >= t_vira - 0.05)
    good = not on_fire
    if on_fire:
        f0 = t_acu - 0.05 if tq < t_arr else t_vira - 0.05
        p = ease_out(clamp((tq - f0) / 0.3))
        bx, by, br = boil(t, 81, 3)
        place(cv, flames_red(), 540 + bx, 1010 - 160 * p + by, 560 * (0.6 + 0.4 * p), br)
    else:
        halo(cv, t, 560, 600, 150, 1.0)
    put(cv, t, piece('seated'), 540, 980, 440, t_imp - 0.05, 82)
    lab = 'VIRA TUDO' if good else 'VIRA AMEAÇA'
    if tq < t_quem - 0.05:
        words = [('IMPLORA', t_imp), ('ACUSA', t_acu), ('SE ARREPENDE', t_arr)]
        cur = [w for w, s in words if tq >= s - 0.05]
        if cur:
            emph(cv, t, -1, 99, [cur[-1]], None, cy=300, size=150)
            HIDE.add((t_imp - 0.05, t_quem - 0.05))
    else:
        emph(cv, t, t_vira - 0.05, BL[8]['e'] + 0.35, ['VIRA AMEAÇA'], 'em poucas horas', cy=300, size=140)
        if tq < t_vira - 0.05:
            put(cv, t, tag('ERA TUDO', bg=INK, fg=PAPER2, size=44), 540, 330, tag('ERA TUDO', bg=INK, fg=PAPER2, size=44).width, t_quem - 0.05, 83)
        HIDE.add((t_vira - 0.05, BL[8]['e'] + 0.35))


HALVES = None


def tear_halves(img, seed=5):
    w, h = img.size
    r = random.Random(seed)
    xs = [(w / 2 + r.uniform(-24, 24), y) for y in range(0, h + 20, 20)]
    left = Image.new('L', (w, h), 0)
    ImageDraw.Draw(left).polygon([(0, 0)] + xs + [(0, h)], fill=255)
    a = np.array(img.getchannel('A'))
    la = np.minimum(a, np.array(left))
    ra = np.minimum(a, 255 - np.array(left))
    L, R = img.copy(), img.copy()
    L.putalpha(Image.fromarray(la))
    R.putalpha(Image.fromarray(ra))
    edge = Image.new('L', (w, h), 0)
    ImageDraw.Draw(edge).line(xs, fill=255, width=8)
    for P, aa in ((L, la), (R, ra)):
        e = np.minimum(np.array(edge), aa)
        lay = Image.new('RGBA', (w, h), PAPER2 + (0,))
        lay.putalpha(Image.fromarray(e))
        P.alpha_composite(lay)
    return L, R


def sc9(cv, t):
    """Fora da relação: vazio, impulso, dúvida sobre quem é, mesmo sem ninguém sair."""
    tq = q(t)
    s0 = BL[9]['s']
    t_rel = w_at('relação.')
    t_vaz = w_at('vazio,')
    t_imp = w_at('impulso')
    t_duv = w_at('dúvida')
    t_mes = w_at('mesmo')
    bg_card(cv, t, 'verde', 940, 1150, 880, -1, 11)
    if tq < t_vaz - 0.1:
        # a moldura da relação abre: a mulher sai do quadro do casal
        put(cv, t, piece('cups'), 540, 900, 640, s0, 90)
        put(cv, t, tag('NÃO FICA SÓ AQUI', bg=INK, fg=PAPER2, size=40), 540, 640, tag('NÃO FICA SÓ AQUI', bg=INK, fg=PAPER2, size=40).width, t_rel - 0.4, 91, rot=-3)
        return
    put(cv, t, piece('frame'), 300, 690, 380, t_vaz - 0.1, 92, rot=-4)
    put(cv, t, tag('VAZIO', bg=RED, fg=PAPER2, size=40), 300, 950, tag('VAZIO', bg=RED, fg=PAPER2, size=40).width, t_vaz, 93, rot=3)
    put(cv, t, piece('match'), 790, 700, 330, t_imp - 0.1, 94, rot=-8)
    put(cv, t, tag('IMPULSO QUE MACHUCA', size=32), 760, 950, tag('IMPULSO QUE MACHUCA', size=32).width, t_imp, 95, rot=-2)
    if tq >= t_duv - 0.1:
        L, R = HALVES
        g = ease_out(clamp((tq - t_duv - 0.25) / 0.5))
        bx, by, br = boil(t, 96, 1.4)
        place(cv, L, 540 - 70 * g + bx, 1220 + by, 230 * pop(t, t_duv - 0.1) if g == 0 else 230, 5 * g + br)
        place(cv, R, 540 + 70 * g + bx, 1210 + by, 230 * pop(t, t_duv - 0.1) if g == 0 else 230, -5 * g + br)
        put(cv, t, tag('QUEM SOU EU?', bg=INK, fg=PAPER2, size=34), 540, 1400, tag('QUEM SOU EU?', bg=INK, fg=PAPER2, size=34).width, t_duv + 0.3, 97)
    emph(cv, t, t_mes - 0.05, BL[9]['e'] + 0.35, ['NINGUÉM SAIU'], 'e mesmo assim dói', cy=300, size=140, small_color=PAPER2)
    HIDE.add((t_mes - 0.05, BL[9]['e'] + 0.35))


def venn(cv, t, t0, cx, cy, r, gap):
    tq = q(t)
    if tq < t0:
        return
    p = ease_out(clamp((tq - t0) / 0.5))
    d = ImageDraw.Draw(cv)
    off = gap * (1 - p) + r * 0.55 * p
    for k, col in ((-1, INK), (1, RED)):
        x = cx + k * off
        d.ellipse((x - r, cy - r, x + r, cy + r), outline=col + (255,), width=10)


def sc10(cv, t):
    tq = q(t)
    s0 = BL[10]['s']
    t_jun = w_at('juntas.')
    t_sep = w_at('separa')
    t_ava = w_at('avaliação')
    bg_card(cv, t, 'rosa', 940, 1150, 880, 1, 12)
    if tq < t_sep - 0.1:
        venn(cv, t, s0 + 0.3, 540, 960, 260, 330)
        put(cv, t, tag('DEPENDÊNCIA', size=34), 340, 640, tag('DEPENDÊNCIA', size=34).width, s0 + 0.5, 100, rot=-4)
        put(cv, t, tag('BORDERLINE', bg=RED, fg=PAPER2, size=34), 740, 640, tag('BORDERLINE', bg=RED, fg=PAPER2, size=34).width, s0 + 0.7, 101, rot=4)
        emph(cv, t, t_jun - 0.05, t_sep - 0.1, ['JUNTAS'], 'as duas podem existir', cy=300, size=150)
        HIDE.add((t_jun - 0.05, t_sep - 0.1))
    else:
        put(cv, t, piece('clipboard'), 540, 880, 520, t_sep - 0.1, 102, rot=-3)
        emph(cv, t, t_ava - 0.05, 999, ['AVALIAÇÃO'], 'com calma', cy=300, size=150)
        HIDE.add((t_ava - 0.05, 999))


def cta(cv, t):
    tq = q(t)
    bg_card(cv, t, 'mostarda', 960, 1250, 900, -1, 13)
    put(cv, t, piece('woman'), 540, 1120, 560, T_CTA, 110, enter='none')
    put(cv, t, BUB['check'], 800, 800, 240, T_CTA + 0.2, 111, rot=4)
    emph(cv, t, T_CTA, 999, ['MANDA PRA QUEM'], 'organiza o dia em volta', cy=300, size=130)
    img = text_img('da resposta de alguém', 'serif', 55, RED)
    p = clamp((tq - T_CTA - 0.3) / 0.25)
    if p > 0:
        place(cv, img, W / 2, 545, img.width * ease_back(p), shadow=False)
    f1, f2 = font('ExtraBold', 34), font('Medium', 28)
    d = ImageDraw.Draw(cv)
    a = int(255 * clamp((tq - T_CTA - 0.8) / 0.3))
    if a > 0:
        d.text((W / 2, 1462), 'Dr. Fabio Schmidt', font=f1, fill=INK + (a,), anchor='mm')
        d.text((W / 2, 1504), 'médico com foco em TPB  ·  CRM-SP 183549', font=f2, fill=INK + (a,), anchor='mm')


SCENES = [(-1, sc1), (BL[2]['s'] - 0.12, sc2), (BL[3]['s'] - 0.12, sc3), (BL[4]['s'] - 0.12, sc4),
          (BL[5]['s'] - 0.12, sc5), (BL[6]['s'] - 0.12, sc6), (BL[7]['s'] - 0.12, sc7), (BL[8]['s'] - 0.12, sc8),
          (BL[9]['s'] - 0.12, sc9), (BL[10]['s'] - 0.12, sc10), (T_CTA, cta)]

PAPER = None


def frame(t):
    cv = PAPER.copy()
    fn = SCENES[0][1]
    for s, f in SCENES:
        if t >= s:
            fn = f
    fn(cv, t)
    if t < T_CTA:
        draw_caption(cv, t)
    if t > DUR - 0.12:
        a = int(255 * clamp((t - (DUR - 0.12)) / 0.12))
        cv.alpha_composite(Image.new('RGBA', (W, H), (0, 0, 0, a)))
    return cv.convert('RGB')


def setup():
    global PAPER, CAPS, HALVES
    PAPER = make_paper()
    BUB['dots'] = bubble_img('dots')
    BUB['check'] = bubble_img('check')
    CAPS = captions()
    HALVES = tear_halves(piece('face'))
    # pré-registra as janelas sem legenda rodando um quadro de cada cena
    for s, f in SCENES:
        f(PAPER.copy(), max(0, s) + 0.01)
        f(PAPER.copy(), 999 if f is cta else max(0, s) + 30)


def events():
    ev = []
    for s, f in SCENES[1:]:
        ev.append((s, 'snip'))
    for k in ('responde,', 'alívio,', 'procurar', 'novo.'):
        ev.append((w_at(k), 'pop'))
    ev.append((w_at('alívio', 0, w_at('alívio,') + 0.1), 'pop'))
    for k in ('amigos,', 'opinião', 'gostava', 'Concorda,', 'desculpa', 'vazio,', 'impulso', 'cedendo'):
        ev.append((w_at(k), 'paper'))
    ev += [(w_at('ficam'), 'fall'), (w_at('Sobra'), 'pop'), (w_at('dúvida') + 0.25, 'rip'),
           (w_at('acusa,'), 'whoosh'), (w_at('vira', 0, BL[8]['s']), 'whoosh'), (w_at('almoço'), 'paper'),
           (w_at('bom.') - 0.2, 'pop'), (w_at('separa'), 'paper'), (T_CTA + 0.2, 'pop')]
    return sorted(ev)


def main():
    setup()
    if len(sys.argv) > 1 and sys.argv[1] == '--events':
        json.dump(events(), open(f'{ROOT}/audio/events.json', 'w'))
        json.dump({'end': DUR}, open(f'{ROOT}/audio/timeline.json', 'w'))
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
        if i % 150 == 0:
            print(i, '/', n, flush=True)
    p.stdin.close()
    p.wait()


if __name__ == '__main__':
    main()
