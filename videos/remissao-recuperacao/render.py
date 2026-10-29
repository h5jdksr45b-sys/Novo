"""Reel Remissão e recuperação: colagem em papel, 1080x1920, 30 qps, sem áudio.

Uso:
  python3 -I render.py            -> out/video.mp4 (com legenda da fala)
  python3 -I render.py --sem-legenda -> out/video-sem-legenda.mp4
  python3 -I render.py --frames   -> out/frames/cena-N.png (um quadro por cena)
Antes: python3 -I pieces.py e python3 -I prep.py.
"""
import math
import random
import subprocess
import sys
from functools import lru_cache

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = __file__.rsplit('/', 1)[0]
W, H, FPS = 1080, 1920, 30
TOTAL = 885  # 29,5 s
SAFE = dict(l=90, r=990, t=220, b=1540)
CAP_Y0, CAP_Y1 = 1420, 1530

INK = (0x2B, 0x2A, 0x28)
AMBER = (0xE8, 0xA9, 0x2A)
LABEL = (0xF1, 0xEB, 0xDD)
TAPE = (0xE6, 0xDA, 0xBC)

# início de cada cena em quadros
CUTS = [0, 120, 330, 540, 735, TOTAL]
TR = 9  # quadros da transição de rasgo


# ---------------- fontes ----------------
@lru_cache(None)
def font(kind, size):
    if kind == 'fraunces':
        f = ImageFont.truetype(f'{ROOT}/fonts/Fraunces.ttf', size)
        f.set_variation_by_axes([min(size, 144), 900, 0, 0])
        return f
    files = {'inter7': 'Inter-Bold.otf', 'inter6': 'Inter-SemiBold.otf', 'mono': 'IBMPlexMono-Medium.ttf'}
    return ImageFont.truetype(f'{ROOT}/fonts/{files[kind]}', size)


# ---------------- easing ----------------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    return 1 - (1 - clamp(x)) ** 3


def ease_in_out(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def ease_out_back(x, s=1.6):
    x = clamp(x) - 1
    return x * x * ((s + 1) * x + s) + 1


# ---------------- papel ----------------
def torn_mask(w, h, seed, amp=7, step=9, sides='tblr'):
    """Máscara de papel rasgado (L) w x h, bordas irregulares."""
    r = random.Random(seed)
    s = 2
    pts = []

    def jag(n, a):
        v, out = 0.0, []
        for _ in range(n):
            v = 0.55 * v + r.uniform(-a, a)
            out.append(v)
        return out

    m = amp + 2
    nx, ny = max(2, w // step), max(2, h // step)
    top = jag(nx + 1, amp if 't' in sides else 0.6)
    bot = jag(nx + 1, amp if 'b' in sides else 0.6)
    lef = jag(ny + 1, amp if 'l' in sides else 0.6)
    rig = jag(ny + 1, amp if 'r' in sides else 0.6)
    for i in range(nx + 1):
        pts.append((m + i * w / nx, m + top[i]))
    for i in range(ny + 1):
        pts.append((m + w + rig[i], m + i * h / ny))
    for i in range(nx, -1, -1):
        pts.append((m + i * w / nx, m + h + bot[i]))
    for i in range(ny, -1, -1):
        pts.append((m + lef[i], m + i * h / ny))
    img = Image.new('L', ((w + 2 * m) * s, (h + 2 * m) * s), 0)
    ImageDraw.Draw(img).polygon([(x * s, y * s) for x, y in pts], fill=255)
    return img.resize((w + 2 * m, h + 2 * m), Image.LANCZOS), m


def grain(arr, amount, seed):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, amount, arr.shape[:2]).astype(np.float32)
    n = cv2.GaussianBlur(n, (0, 0), 0.7)
    arr[..., :3] = np.clip(arr[..., :3].astype(np.float32) + n[..., None], 0, 255)
    return arr


def with_shadow(img, off=(5, 9), blur=9, op=0.30):
    pad = blur * 2 + max(abs(off[0]), abs(off[1]))
    out = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    a = img.getchannel('A').point(lambda v: int(v * op))
    sh = Image.new('RGBA', img.size, (30, 22, 10, 255))
    sh.putalpha(a)
    layer = Image.new('RGBA', out.size, (0, 0, 0, 0))
    layer.paste(sh, (pad + off[0], pad + off[1]))
    out.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))
    out.alpha_composite(img, (pad, pad))
    return out


def text_block(rows, gap=10, align='l'):
    """rows: lista de (texto, fonte, cor) ou (Image, None, None). Retorna RGBA justo."""
    parts = []
    for t, f, c in rows:
        if isinstance(t, Image.Image):
            parts.append(t)
            continue
        asc, desc = f.getmetrics()
        bb = f.getbbox(t)
        w = bb[2] + 2
        im = Image.new('RGBA', (w, asc + desc), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((0, 0), t, font=f, fill=c)
        # corta o espaço vazio de cima e de baixo
        a = np.array(im.getchannel('A'))
        ys = np.where(a.max(1) > 0)[0]
        im = im.crop((0, max(0, ys.min() - 2), w, ys.max() + 3))
        parts.append(im)
    bw = max(p.width for p in parts)
    bh = sum(p.height for p in parts) + gap * (len(parts) - 1)
    out = Image.new('RGBA', (bw, bh), (0, 0, 0, 0))
    y = 0
    for p in parts:
        x = 0 if align == 'l' else (bw - p.width) // 2
        out.alpha_composite(p, (x, y))
        y += p.height + gap
    return out


def label(content, seed, fill=LABEL, pad=(34, 26), rot=0.0, tape=None, rim=True):
    """Etiqueta de papel rasgado com conteúdo (RGBA) centralizado."""
    w, h = content.width + 2 * pad[0], content.height + 2 * pad[1]
    mask, m = torn_mask(w, h, seed, amp=6)
    arr = np.zeros((mask.height, mask.width, 4), np.uint8)
    arr[..., :3] = fill
    arr[..., 3] = np.array(mask)
    arr = grain(arr, 4.5, seed)
    img = Image.fromarray(arr, 'RGBA')
    if rim:  # borda branca de papel rasgado
        er = mask.filter(ImageFilter.MinFilter(5))
        rim_a = np.clip(np.array(mask, np.int16) - np.array(er, np.int16), 0, 255).astype(np.uint8)
        rim_img = Image.new('RGBA', img.size, (252, 250, 244, 0))
        rim_img.putalpha(Image.fromarray((rim_a * 0.85).astype(np.uint8)))
        img.alpha_composite(rim_img)
    img.alpha_composite(content, (m + pad[0], m + pad[1]))
    if tape:  # pedacinho de fita crepe no canto
        t = tape_strip(70, 34, seed + 5, fill=TAPE, alpha=200)
        t = t.rotate(-28 if tape == 'r' else 28, expand=True, resample=Image.BICUBIC)
        big = Image.new('RGBA', (img.width + 40, img.height + 40), (0, 0, 0, 0))
        big.alpha_composite(img, (20, 20))
        big.alpha_composite(t, (big.width - t.width - 4 if tape == 'r' else 4, 0))
        img = big
    if rot:
        img = img.rotate(rot, expand=True, resample=Image.BICUBIC)
    return with_shadow(img)


def tape_strip(w, h, seed, fill=TAPE, alpha=232):
    """Fita crepe com pontas serrilhadas."""
    r = random.Random(seed)
    s = 2
    img = Image.new('L', (w * s, h * s), 0)
    pts = []
    n = max(3, h // 7)
    for i in range(n + 1):
        pts.append((r.uniform(0, 7) * s, i * h * s / n))
    right = [(w * s - r.uniform(0, 7) * s, i * h * s / n) for i in range(n + 1)]
    ImageDraw.Draw(img).polygon(pts + right[::-1], fill=alpha)
    mask = img.resize((w, h), Image.LANCZOS)
    arr = np.zeros((h, w, 4), np.uint8)
    arr[..., :3] = fill
    # fibras longitudinais leves
    rng = np.random.default_rng(seed)
    fib = cv2.GaussianBlur(rng.normal(0, 7, (h, w)).astype(np.float32), (0, 0), sigmaX=14, sigmaY=0.8)
    arr[..., :3] = np.clip(arr[..., :3] + fib[..., None], 0, 255)
    arr[..., 3] = np.array(mask)
    return Image.fromarray(grain(arr, 3.0, seed), 'RGBA')


def tape(content, seed, fill=TAPE, pad=(30, 16), rot=0.0, alpha=238):
    t = tape_strip(content.width + 2 * pad[0], content.height + 2 * pad[1], seed, fill, alpha)
    t.alpha_composite(content, (pad[0], pad[1]))
    if rot:
        t = t.rotate(rot, expand=True, resample=Image.BICUBIC)
    return with_shadow(t, off=(3, 6), blur=6, op=0.22)


def icon(name, size):
    im = Image.open(f'{ROOT}/pieces/{name}.png').convert('RGBA')
    im.thumbnail((size, size), Image.LANCZOS)
    return im


def to_np(img):
    return np.array(img, np.float32)


# ---------------- composição ----------------
def comp(frame, rgba, cx, cy, scale=1.0, alpha=1.0, rot=0.0):
    """Cola rgba (np float32 HxWx4) centrado em (cx, cy)."""
    if scale <= 0.01 or alpha <= 0.003:
        return
    src = rgba
    if abs(scale - 1) > 1e-3 or abs(rot) > 0.05:
        h, w = src.shape[:2]
        M = cv2.getRotationMatrix2D((w / 2, h / 2), rot, scale)
        cos, sin = abs(M[0, 0]), abs(M[0, 1])
        nw, nh = int(w * cos + h * sin) + 2, int(w * sin + h * cos) + 2
        M[0, 2] += nw / 2 - w / 2
        M[1, 2] += nh / 2 - h / 2
        src = cv2.warpAffine(src, M, (nw, nh), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    h, w = src.shape[:2]
    x0, y0 = int(round(cx - w / 2)), int(round(cy - h / 2))
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
    if xa >= xb or ya >= yb:
        return
    s = src[ya - y0:yb - y0, xa - x0:xb - x0]
    a = s[..., 3:4] / 255.0 * alpha
    frame[ya:yb, xa:xb] = frame[ya:yb, xa:xb] * (1 - a) + s[..., :3] * a


_N = 0


class El:
    """Elemento na tela. pos: (x, y) do centro na tela, ou função t -> (x, y)."""

    def __init__(self, img, pos, t0, anim='pop', dur=0.35, rot=0.0, exit_at=None, maker=None, z=0, box=None):
        self.img = to_np(img) if img is not None else None
        self.pos, self.t0, self.anim, self.dur, self.rot = pos, t0, anim, dur, rot
        self.exit_at, self.maker, self.z = exit_at, maker, z
        self.box = box
        global _N
        _N += 1
        self.name = f'el{_N}'

    def size(self):
        return self.img.shape[1], self.img.shape[0]

    def draw(self, frame, t):
        if t < self.t0:
            return
        p = (t - self.t0) / self.dur
        x, y = self.pos(t) if callable(self.pos) else self.pos
        img = self.maker(t) if self.maker else self.img
        sc, al, rot = 1.0, 1.0, self.rot
        if self.anim == 'pop':
            sc = ease_out_back(p, 1.8) if p < 1 else 1.0
            al = clamp(p * 3)
        elif self.anim == 'slideL':
            e = ease_out_back(p, 0.9)
            x = x - (1 - e) * (W + 200)
            rot = rot + (1 - e) * 4
        elif self.anim == 'slideD':
            e = ease_out(p)
            y = y - (1 - e) * 60
            al = clamp(p * 2)
        elif self.anim == 'stamp':
            sc = 1.35 - 0.35 * ease_out(p) if p < 1 else 1.0
            al = clamp(p * 2.5)
            rot = rot + (1 - ease_out(p)) * -10
        comp(frame, img, x, y, sc, al, rot)
        if AUDIT is not None and p >= 1.05 and (not self.exit_at or t < self.exit_at):
            AUDIT.append((self.name, self.bbox(img, x, y, rot)))

    def bbox(self, img, x, y, rot):
        a = img[..., 3]
        if abs(rot) > 0.05:
            h, w = a.shape
            M = cv2.getRotationMatrix2D((w / 2, h / 2), rot, 1.0)
            cos, sin = abs(M[0, 0]), abs(M[0, 1])
            nw, nh = int(w * cos + h * sin) + 2, int(w * sin + h * cos) + 2
            M[0, 2] += nw / 2 - w / 2
            M[1, 2] += nh / 2 - h / 2
            a = cv2.warpAffine(a, M, (nw, nh))
        ys, xs = np.where(a > 110)
        h, w = a.shape
        x0, y0 = x - w / 2, y - h / 2
        return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max(), y0 + ys.max())


AUDIT = None


def caption(frame, t, chunks, seed):
    """Legenda da fala na faixa reservada. chunks: [(t0, t1, texto)]."""
    for a, b, txt in chunks:
        if a <= t < b:
            img = cap_img(txt, seed)
            p = clamp((t - a) / 0.12)
            comp(frame, img, W / 2, (CAP_Y0 + CAP_Y1) / 2 + (1 - p) * 8, 1.0, p)
            return


@lru_cache(None)
def cap_img(txt, seed):
    c = text_block([(txt, font('inter6', 40), INK)])
    return to_np(tape(c, seed=hash(txt) % 1000 + seed, fill=LABEL, pad=(26, 14), alpha=236))


# ---------------- fundo de foto com câmera ----------------
class Photo:
    def __init__(self, path):
        self.src = cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2RGB).astype(np.float32)
        self.h, self.w = self.src.shape[:2]
        self.base = max(W / self.w, H / self.h)

    def M(self, zoom, fx, fy, sx=None, sy=None):
        """Matriz src->tela: escala base*zoom, o ponto (fx, fy) da foto vai para (sx, sy) da tela."""
        s = self.base * zoom
        if sx is None:
            sx, sy = W / 2, H / 2
        return np.array([[s, 0, sx - fx * s], [0, s, sy - fy * s]], np.float32)

    def render(self, M):
        return cv2.warpAffine(self.src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def apply(M, x, y):
    return M[0, 0] * x + M[0, 2], M[1, 1] * y + M[1, 2]


# ---------------- cenas ----------------
def scene1():
    ph = Photo(f'{ROOT}/build/img1-sem-check.png')
    boxes = np.load(f'{ROOT}/build/img1-caixas.npy')
    chk = to_np(icon('sticker-check', 150))
    cx, cy = ph.w / 2, ph.h / 2 + 40

    def M(t):
        return ph.M(1.0 + 0.06 * ease_in_out(t / 4.0), cx, cy)

    els = []
    for i, (bx, by) in enumerate(boxes):
        els.append(El(None, (lambda bx=bx, by=by: (lambda t: apply(M(t), bx + 8, by - 6)))(), 0.45 + 0.45 * i,
                      'stamp', 0.28, rot=[-6, 4, -3][i]))
        els[-1].img = chk
    top = label(text_block([('Os sintomas', font('fraunces', 88), INK), ('foram embora.', font('fraunces', 88), INK)], gap=14),
                seed=11, rot=-1.2, tape='r')
    tw = top.width
    els.append(El(top, (SAFE['l'] + tw / 2 - 30, 360), -1.0, 'slideD', 0.4))
    emph1 = tape(text_block([('A vida não', font('fraunces', 124), INK)]), seed=12, fill=AMBER, rot=1.5)
    emph2 = tape(text_block([('voltou junto.', font('fraunces', 124), INK)]), seed=13, fill=AMBER, rot=-1.0)
    els.append(El(emph1, (W / 2 - 60, 1268), 2.0, 'pop', 0.3))
    els.append(El(emph2, (W / 2 + 20, 1430), 2.25, 'pop', 0.3))
    chunks = [(0.2, 0.95, 'Você parou'), (0.95, 1.95, 'de se machucar.')]

    def draw(t, frame_only=False):
        frame = ph.render(M(t))
        for e in els:
            e.draw(frame, t)
        return frame, chunks
    return draw


def scene2():
    ph = Photo(f'{ROOT}/src/img2.png')
    # início: perto do homem e da faixa de baixo; fim: estrada inteira
    a = dict(zoom=1.22, fx=ph.w / 2, fy=ph.h - (H / 2) / (ph.base * 1.22))
    b = dict(zoom=1.0, fx=ph.w / 2, fy=ph.h / 2)

    def M(t):
        e = ease_in_out(t / 4.2)
        z = a['zoom'] + (b['zoom'] - a['zoom']) * e
        fy = a['fy'] + (b['fy'] - a['fy']) * e
        z *= 1.0 + 0.015 * clamp((t - 4.2) / 2.8)
        return ph.M(z, ph.w / 2, fy)

    els = []
    title = label(text_block([('16 anos de', font('fraunces', 88), INK), ('acompanhamento', font('fraunces', 88), INK)], gap=14),
                  seed=21, rot=1.0, tape='l')
    els.append(El(title, (W / 2, 220 + title.height / 2 - 10), 0.2, 'slideD', 0.4))
    # faixa de baixo: Remissão
    flag = icon('icone-bandeira', 120)
    rem = label(text_block([('Remissão', font('inter7', 60), INK), ('fora do diagnóstico', font('inter6', 42), INK)], gap=12),
                seed=22, rot=-1.5)
    els.append(El(rem, (SAFE['l'] + rem.width / 2 - 20, 1240), 4.4, 'pop', 0.32))
    els.append(El(flag, (SAFE['l'] + rem.width - 40, 1130), 4.6, 'stamp', 0.3, rot=8))
    # faixa do horizonte: Recuperação
    rec = label(text_block([('Recuperação', font('inter7', 60), INK), ('+ trabalho e vínculo', font('inter6', 42), INK)], gap=12),
                seed=23, rot=1.5)
    els.append(El(rec, (SAFE['r'] - rec.width / 2 + 20, 880), 5.3, 'pop', 0.32))
    case, hands = icon('icone-maleta', 112), icon('icone-maos', 112)
    els.append(El(case, (800, 738), 5.5, 'stamp', 0.3, rot=-6))
    els.append(El(hands, (912, 732), 5.65, 'stamp', 0.3, rot=5))
    chunks = [(0.2, 1.1, 'Um estudo seguiu'), (1.1, 2.0, '290 pessoas'), (2.0, 2.8, 'com borderline'),
              (2.8, 3.9, 'por dezesseis anos.'), (4.2, 4.8, 'E mediu'), (4.8, 5.6, 'duas chegadas'), (5.6, 6.8, 'diferentes.')]

    def draw(t):
        frame = ph.render(M(t))
        for e in els:
            e.draw(frame, t)
        return frame, chunks
    return draw


def scene3():
    bg = Photo(f'{ROOT}/build/img3-fundo.png')
    Mb = bg.M(1.0, bg.w / 2, bg.h / 2)
    yel = Image.open(f'{ROOT}/build/img3-tira-amarela.png').convert('RGBA')
    gry = Image.open(f'{ROOT}/build/img3-tira-cinza.png').convert('RGBA')
    k = 880 / yel.width
    yel = with_shadow(yel.resize((880, round(yel.height * k)), Image.LANCZOS), off=(4, 8), blur=8, op=0.25)
    gw = round(880 * 60 / 99)  # comprimento proporcional: 60 contra 99
    gry = with_shadow(gry.resize((gw, round(gry.height * k)), Image.LANCZOS), off=(4, 8), blur=8, op=0.25)
    els = []
    L = SAFE['l']
    els.append(El(yel, (L - 20 + yel.width / 2, 700), 0.25, 'slideL', 0.55))
    els.append(El(gry, (L - 20 + gry.width / 2, 1270), 3.0, 'slideL', 0.55))
    t_rem = tape(text_block([('Remissão', font('inter7', 60), INK)]), seed=31, rot=-1.5)
    t_rec = tape(text_block([('Recuperação', font('inter7', 60), INK)]), seed=32, rot=1.2)
    els.append(El(t_rem, (L + t_rem.width / 2 - 10, 280), 0.7, 'pop', 0.3))
    els.append(El(t_rec, (L + t_rec.width / 2 - 10, 858), 3.4, 'pop', 0.3))

    @lru_cache(None)
    def num(v, seed):
        c = text_block([(f'{v}%', font('fraunces', 230), INK)])
        # largura fixa para o número não pular
        box = Image.new('RGBA', (font('fraunces', 230).getbbox('99%')[2] + 10, c.height), (0, 0, 0, 0))
        box.alpha_composite(c, (0, 0))
        return to_np(label(box, seed=seed, rot=-1.0 if seed == 33 else 1.0))

    def counter(target, t0, seed):
        def mk(t):
            p = ease_out(clamp((t - t0) / 1.3))
            return num(int(round(target * p)), seed)
        return mk

    n1 = El(None, None, 0.85, 'pop', 0.3, maker=counter(99, 0.95, 33))
    n2 = El(None, None, 3.55, 'pop', 0.3, maker=counter(60, 3.65, 34))
    w0 = num(99, 33).shape[1]
    n1.pos, n2.pos = (L + w0 / 2 - 20, 455), (L + w0 / 2 - 20, 1045)
    els += [n1, n2]
    foot = label(text_block([('por pelo menos', font('mono', 36), INK), ('2 anos', font('mono', 36), INK)], gap=10),
                 seed=35, pad=(22, 16), rot=2.0)
    els.append(El(foot, (SAFE['r'] - foot.width / 2 + 14, 1268), 5.0, 'pop', 0.3))
    chunks = [(0.2, 0.9, 'Quase todas'), (0.9, 1.5, 'saíram do'), (1.5, 2.6, 'diagnóstico.'), (3.0, 3.5, 'Seis em'),
              (3.5, 4.1, 'cada dez'), (4.1, 4.9, 'recuperaram'), (4.9, 6.4, 'trabalho e vínculo.')]

    def draw(t):
        frame = bg.render(Mb)
        for e in els:
            e.draw(frame, t)
        return frame, chunks
    return draw


def scene4():
    bg = Photo(f'{ROOT}/build/img4-fundo.png')
    Mb = bg.M(1.0, bg.w / 2, bg.h / 2)
    s = Mb[0, 0]
    cl = Image.open(f'{ROOT}/build/img4-nuvens.png').convert('RGBA')
    px, py = np.load(f'{ROOT}/build/img4-nuvens-pos.npy')
    cl = with_shadow(cl.resize((round(cl.width * s), round(cl.height * s)), Image.LANCZOS), off=(4, 8), blur=8, op=0.22)
    pad = 8 * 2 + 8
    cx0 = Mb[0, 2] + px * s + cl.width / 2 - pad
    cy0 = Mb[1, 2] + py * s + cl.height / 2 - pad
    T_OUT = 2.0

    def slide(t):
        e = clamp((t - T_OUT) / 0.85)
        return (e * e) * (W + 200)

    clouds = El(cl, lambda t: (cx0 + slide(t), cy0), -1, 'none', rot=0)
    rot_out = lambda t: 6 * clamp((t - T_OUT) / 0.85) ** 2
    raio = icon('icone-raio', 112)
    sai = label(text_block([('Sai primeiro', font('inter7', 60), INK), ('autolesão, impulso', font('inter6', 42), INK)], gap=12),
                seed=41, rot=-1.5)
    sai_pos = (W / 2 + 40, 540)
    lab1 = El(sai, lambda t: (sai_pos[0] + slide(t), sai_pos[1]), 0.35, 'pop', 0.32)
    ic1 = El(raio, lambda t: (sai_pos[0] - sai.width / 2 + 10 + slide(t), sai_pos[1] - sai.height / 2 - 20), 0.55, 'stamp', 0.3, rot=-8)
    amp = icon('icone-ampulheta', 112)
    dem = label(text_block([('Demora mais', font('inter7', 60), INK), ('vazio, medo de ficar só', font('inter6', 42), INK)], gap=12),
                seed=42, rot=1.2)
    dem_pos = (SAFE['l'] + dem.width / 2 - 14, 1085)
    lab1.exit_at = ic1.exit_at = T_OUT
    lab2 = El(dem, dem_pos, 2.6, 'pop', 0.32)
    ic2 = El(amp, (dem_pos[0] + dem.width / 2 - 20, dem_pos[1] - dem.height / 2 - 18), 2.8, 'stamp', 0.3, rot=7)
    chunks = [(0.2, 1.0, 'O que assusta'), (1.0, 1.9, 'sai primeiro.'), (2.4, 3.2, 'O que demora'), (3.2, 4.0, 'é o vazio'),
              (4.0, 4.7, 'e o medo'), (4.7, 6.0, 'de ficar só.')]

    def draw(t):
        frame = bg.render(Mb)
        clouds.rot = 0
        r = rot_out(t)
        comp(frame, clouds.img, *clouds.pos(t), 1.0, 1.0, -r)
        for e in (lab1, ic1):
            e.rot0 = getattr(e, 'rot0', e.rot)
            e.rot = e.rot0 - r
            e.draw(frame, t)
        for e in (lab2, ic2):
            e.draw(frame, t)
        return frame, chunks
    return draw


def scene5():
    ph = Photo(f'{ROOT}/src/img5.png')
    fx, fy = 760, 1400

    def M(t):
        z = 1.0 + 0.09 * ease_in_out(t / 5.0)
        sx, sy = apply(ph.M(1.0, ph.w / 2, ph.h / 2), fx, fy)
        return ph.M(z, fx, fy, sx, sy)

    els = []
    F = font('fraunces', 124)
    head = label(text_block([('Parar a crise', F, INK), ('é a primeira', F, INK), ('chegada.', F, INK)], gap=8),
                 seed=51, pad=(30, 22), rot=-1.0)
    els.append(El(head, (SAFE['l'] + head.width / 2 - 24, 220 + head.height / 2 - 18), 0.15, 'slideD', 0.4))
    last = tape(text_block([('Não é a última.', F, INK)]), seed=52, fill=AMBER, pad=(26, 12), rot=1.2)
    els.append(El(last, (SAFE['l'] + last.width / 2 - 14, 220 + head.height - 34 + last.height / 2), 1.6, 'pop', 0.3))
    arrow = icon('sticker-seta', 250)
    els.append(El(arrow, lambda t: apply(M(t), 1010, 1320), 2.4, 'stamp', 0.3, rot=24))
    sig = tape(text_block([('Dr. Fabio Schmidt, médico, pós-graduado em psiquiatria.', font('inter6', 30), INK),
                           ('Conteúdo educativo.', font('inter6', 30), INK),
                           ('Zanarini e col., Am J Psychiatry, 2012 e 2016.', font('mono', 26), INK)], gap=10),
               seed=53, fill=LABEL, pad=(26, 16), alpha=240)
    els.append(El(sig, (W / 2, SAFE['b'] - sig.height / 2 + 6), 2.8, 'slideD', 0.4))
    chunks = []  # ênfase grande na tela inteira: legenda escondida

    def draw(t):
        frame = ph.render(M(t))
        for e in els:
            e.draw(frame, t)
        return frame, chunks
    return draw


# ---------------- transição de rasgo ----------------
def make_rip():
    r = np.random.default_rng(9)

    def edge(n, amp):
        v = np.cumsum(r.normal(0, 1, n))
        v = v - np.convolve(v, np.ones(61) / 61, 'same')
        v = v / (np.abs(v).max() + 1e-6) * amp
        return v + r.normal(0, amp * 0.18, n)
    lead, trail = edge(H, 26), edge(H, 26)
    tilt = np.linspace(-60, 60, H)
    paper = np.ones((H, 520, 3), np.float32) * np.array([0xEF, 0xE8, 0xDA], np.float32)
    paper += cv2.GaussianBlur(r.normal(0, 6, (H, 520)).astype(np.float32), (0, 0), 0.8)[..., None]
    return lead + tilt, trail + tilt, paper


RIP = make_rip()
RIP_W = 420


def rip(old, new, p):
    """p 0->1: faixa de papel rasgado atravessa da esquerda para a direita."""
    lead, trail, paper = RIP
    X = -RIP_W - 80 + p * (W + RIP_W + 160)
    xs = np.arange(W, dtype=np.float32)[None, :]
    xl = (X + lead)[:, None]
    xt = (X - RIP_W + trail)[:, None]
    out = np.where((xs > xl)[..., None], old, new)
    # sombra à direita da borda da frente
    sh = np.clip(1 - (xs - xl) / 26, 0, 1) * (xs > xl) * 0.28
    out = out * (1 - sh[..., None])
    band = (xs <= xl) & (xs >= xt)
    px = np.clip((xs - xt).astype(int), 0, 519)
    pap = paper[np.arange(H)[:, None], px]
    # borda branca fibrosa
    rim = ((xl - xs) < 7) | ((xs - xt) < 7)
    pap = np.where(rim[..., None], np.array([252, 250, 244], np.float32), pap)
    return np.where(band[..., None], pap, out)


# ---------------- render ----------------
def main():
    sem_leg = '--sem-legenda' in sys.argv
    only_frames = '--frames' in sys.argv
    scenes = [scene1(), scene2(), scene3(), scene4(), scene5()]
    seeds = [101, 202, 303, 404, 505]

    def scene_frame(i, f):
        t = (f - CUTS[i]) / FPS
        frame, chunks = scenes[i](max(0.0, t))
        if not sem_leg:
            caption(frame, t, chunks, seeds[i])
        return frame

    if '--auditar' in sys.argv:
        global AUDIT
        bad = {}
        for i in range(5):
            for f in range(CUTS[i], CUTS[i + 1], 3):
                AUDIT = []
                scenes[i]((f - CUTS[i]) / FPS)
                for name, (x0, y0, x1, y1) in AUDIT:
                    if x0 < SAFE['l'] or x1 > SAFE['r'] or y0 < SAFE['t'] or y1 > SAFE['b']:
                        bad.setdefault((i + 1, name), (round(x0), round(y0), round(x1), round(y1)))
        for k, v in bad.items():
            print('FORA', k, v)
        print('auditoria:', len(bad), 'fora da área segura')
        return

    if only_frames:
        # quadro representativo de cada cena: tudo já na tela
        picks = [CUTS[0] + 110, CUTS[1] + 200, CUTS[2] + 200, CUTS[3] + 54, CUTS[4] + 140]
        for i, f in enumerate(picks):
            fr = scene_frame(i, f)
            Image.fromarray(np.clip(fr, 0, 255).astype(np.uint8)).save(f'{ROOT}/out/frames/cena-{i + 1}.png')
        print('quadros ok')
        return

    out = f'{ROOT}/out/video-sem-legenda.mp4' if sem_leg else f'{ROOT}/out/video.mp4'
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                           '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21',
                           '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for f in range(TOTAL):
        i = max(k for k in range(5) if CUTS[k] <= f)
        frame = scene_frame(i, f)
        # transição: centrada no corte
        for k in range(1, 5):
            c = CUTS[k]
            if c - TR // 2 <= f <= c + TR // 2:
                old = scene_frame(k - 1, f)
                new = scene_frame(k, f)
                p = (f - (c - TR // 2) + 0.5) / TR
                frame = rip(old, new, p)
        ff.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())
        if f % 60 == 0:
            print('quadro', f, flush=True)
    ff.stdin.close()
    ff.wait()
    print('ok', out)


if __name__ == '__main__':
    main()
