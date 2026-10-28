"""Motor de colagem em stop motion para os vídeos Atalho.

Peças recortadas entram a partir do fundo vazio a 12 qps (com tremor de papel),
o texto desliza suave a 24 qps. Saída: MP4 1080x1920, 24 fps, com sons de papel.
"""
import math, random, subprocess, wave
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

W, H, FPS, STEP = 1080, 1920, 24, 12
ROOT = __file__.rsplit('/', 1)[0]
CREAM = (242, 234, 219)
YELLOW = (244, 197, 66)
INK = (28, 24, 22)


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


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
    f.set_variation_by_name(kind if kind != 'sans' else 'ExtraBold')
    return f


# ---------- papel ----------
_rng = np.random.default_rng(7)
GRAIN = (_rng.normal(0, 1, (H, W)) * 5).astype(np.float32)
GRAIN = np.array(Image.fromarray(np.clip(GRAIN + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) - 128


def paper_bg(color):
    base = np.ones((H, W, 3), np.float32) * np.array(color, np.float32)
    base += GRAIN[..., None] * 1.6
    # fibras longas, bem leves
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert('RGBA')


def add_grain(img, amount=6):
    a = np.array(img).astype(np.float32)
    h, w = a.shape[:2]
    n = np.random.default_rng(h * 31 + w).normal(0, amount, (h, w, 1))
    a[..., :3] = np.clip(a[..., :3] + n, 0, 255)
    return Image.fromarray(a.astype(np.uint8), 'RGBA')


def card(w, h, fill, radius=22, keyline=10, draw_fn=None):
    """Cartão de papel com contorno creme. draw_fn(draw, img, x0, y0) desenha o conteúdo."""
    k = keyline
    img = Image.new('RGBA', (w + 2 * k, h + 2 * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, w + 2 * k - 1, h + 2 * k - 1), radius + k, fill=CREAM + (255,))
    d.rounded_rectangle((k, k, w + k - 1, h + k - 1), radius, fill=tuple(fill) + (255,))
    if draw_fn:
        draw_fn(d, img, k, k)
    return add_grain(img, 5)


def text_center(d, cx, cy, txt, f, fill):
    d.text((cx, cy), txt, font=f, fill=fill, anchor='mm')


@lru_cache(None)
def piece(name):
    return Image.open(f'{ROOT}/pieces/{name}.png').convert('RGBA')


def scaled(img, h=None, w=None):
    if h is not None:
        w2 = round(img.width * h / img.height)
        return img.resize((w2, h), Image.LANCZOS)
    h2 = round(img.height * w / img.width)
    return img.resize((w, h2), Image.LANCZOS)


def with_shadow(img, off=(10, 16), blur=14, op=0.32):
    pad = blur * 2 + max(abs(off[0]), abs(off[1]))
    out = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    sh = Image.new('RGBA', out.size, (0, 0, 0, 0))
    a = img.getchannel('A').point(lambda v: int(v * op))
    blk = Image.new('RGBA', img.size, (10, 6, 20, 255))
    blk.putalpha(a)
    sh.paste(blk, (pad + off[0], pad + off[1]))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    out.alpha_composite(sh)
    out.alpha_composite(img, (pad, pad))
    return out


# ---------- easing ----------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out_back(x, s=1.5):
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def ease_out(x):
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    return 3 * x * x - 2 * x * x * x


# ---------- itens ----------
class Item:
    """Peça na cena. t0 relativo ao início da cena."""

    def __init__(self, img, x, y, t0=0.0, frm='B', rot=0.0, dur=0.42, z=0, shadow=True,
                 fn=None, exit_at=None, exit_to='R', boil=True, sfx=True, maker=None):
        self.base, self.maker = img, maker
        self.x, self.y, self.t0, self.frm, self.rot, self.dur = x, y, t0, frm, rot, dur
        self.z, self.fn, self.exit_at, self.exit_to, self.boil, self.sfx = z, fn, exit_at, exit_to, boil, sfx
        self.shadow = shadow
        self.cache = {}
        self.sid = random.random()

    def render_img(self, scale, rot, extra):
        key = (round(scale, 3), round(rot, 1), extra)
        if key not in self.cache:
            img = self.maker(extra) if self.maker else self.base
            if scale != 1:
                img = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)
            if abs(rot) > 0.05:
                img = img.rotate(rot, resample=Image.BICUBIC, expand=True)
            if self.shadow:
                img = with_shadow(img)
            if len(self.cache) > 60:
                self.cache.clear()
            self.cache[key] = img
        return self.cache[key]

    def state(self, t):
        """t já quantizado em passos de stop motion."""
        if t < self.t0:
            return None
        p = clamp((t - self.t0) / self.dur)
        x, y, rot, scale = self.x, self.y, self.rot, 1.0
        dist = 1500
        if self.frm == 'pop':
            scale = max(0.02, ease_out_back(p, 2.2)) if p < 1 else 1.0
        elif self.frm == 'drop':
            e = ease_out_back(p, 1.2)
            y = self.y - (1 - e) * 260
            scale = 1.25 - 0.25 * ease_out(p)
            rot = self.rot + (1 - e) * 10
            if p == 0:
                return None
        else:
            e = ease_out_back(p, 1.3)
            dx, dy = {'L': (-dist, 0), 'R': (dist, 0), 'T': (0, -dist), 'B': (0, dist)}[self.frm]
            x = self.x + dx * (1 - e)
            y = self.y + dy * (1 - e)
            rot = self.rot + (1 - e) * (8 if self.frm in 'LT' else -8)
        if self.exit_at is not None and t >= self.exit_at:
            q = clamp((t - self.exit_at) / 0.4)
            e = q * q
            dx, dy = {'L': (-dist, 0), 'R': (dist, 0), 'T': (0, -dist), 'B': (0, dist)}[self.exit_to]
            x += dx * e
            y += dy * e
            rot += e * 10
        st = dict(x=x, y=y, rot=rot, scale=scale, alpha=1.0, extra=None)
        if self.fn:
            st = self.fn(self, t, st) or st
        if self.boil and p >= 1:
            r = random.Random(int(t * STEP) * 1000 + int(self.sid * 1e6))
            st['x'] += r.uniform(-1.6, 1.6)
            st['y'] += r.uniform(-1.6, 1.6)
            st['rot'] += r.uniform(-0.35, 0.35)
        return st


# ---------- texto ----------
def parse(markup):
    """*palavra* = destaque. Retorna lista de (palavra, destaque)."""
    out, hl = [], False
    for w in markup.split():
        start = w.startswith('*')
        end = w.endswith('*') and len(w) > 1
        w2 = w.strip('*')
        if start:
            hl = True
        out.append((w2, hl))
        if end:
            hl = False
    return out


def _wrap(markup, style, maxw, size):
    words = parse(markup)
    if style == 'hook':
        size = size or 118
        fb, fh = font('anton', size), font('anton', size)
        words = [(w.upper(), h) for w, h in words]
        lead = int(size * 1.2)
    else:
        size = size or 74
        fb, fh = font('sans', size), font('serif', int(size * 1.14))
        lead = int(size * 1.28)
    space = int(size * 0.26)
    SHORT = {'o', 'a', 'e', 'de', 'em', 'um', 'no', 'na', 'do', 'da', 'ou', 'que', 'se', 'é', 'os', 'as', 'O', 'A', 'E'}
    lines, cur, curw = [], [], 0
    for w, h in words:
        if w == '/':
            lines.append(cur)
            cur, curw = [], 0
            continue
        f = fh if h else fb
        ww = f.getlength(w)
        if cur and curw + space + ww > maxw:
            carry = []
            # palavra curta não fica sozinha no fim da linha
            while len(cur) > 1 and (cur[-1][0].lower() in SHORT or len(cur[-1][0].strip('.,?')) <= 2):
                carry.insert(0, cur.pop())
            lines.append(cur)
            cur = carry
            curw = sum(x[2] for x in cur) + space * max(0, len(cur) - 1)
        cur.append((w, h, ww))
        curw += (space if len(cur) > 1 else 0) + ww
    if cur:
        lines.append(cur)
    # evita palavra curta sozinha na última linha
    if len(lines) > 1 and len(lines[-1]) == 1 and len(lines[-1][0][0]) <= 4:
        lines[-1].insert(0, lines[-2].pop())
    return lines, fb, fh, lead, space


def layout_text(markup, style='body', maxw=900, size=None):
    best = None
    for mw in range(maxw, int(maxw * 0.72), -20):
        lines, fb, fh, lead, space = _wrap(markup, style, mw, size)
        if best and len(lines) > len(best[0]):
            break
        widths = [sum(w for _, _, w in ln) for ln in lines]
        cost = sum((max(widths) - w) ** 2 for w in widths[:-1]) + 0.5 * (max(widths) - widths[-1]) ** 2
        cost += sum(4e5 for ln in lines[:-1] if len(ln) == 1)
        if best is None or cost < best[-1]:
            best = (lines, fb, fh, lead, space, cost)
    lines, fb, fh, lead, space, _ = best
    imgs = []
    for ln in lines:
        lw = sum(w for _, _, w in ln) + space * (len(ln) - 1)
        im = Image.new('RGBA', (int(lw) + 90, lead + 70), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        x = 6
        base = int(lead * 0.82) + 36
        for w, h, ww in ln:
            f = fh if h else fb
            col = YELLOW if h else CREAM
            # sombra leve
            d.text((x + 3, base + 4), w, font=f, fill=(0, 0, 0, 70), anchor='ls')
            d.text((x, base), w, font=f, fill=col + (255,), anchor='ls')
            x += ww + space
        imgs.append(im)
    return imgs, lead


class TextBlock:
    def __init__(self, markup, style='body', t0=0.0, y=170, x=84, size=None, instant=False, maxw=900):
        self.lines, self.lead = layout_text(markup, style, maxw=maxw, size=size)
        self.t0, self.y, self.x, self.instant = t0, y, x, instant
        self.bottom = y + self.lead * len(self.lines)

    def draw(self, frame, t):
        for i, im in enumerate(self.lines):
            ti = t - self.t0 - i * 0.07
            if self.instant:
                p = 1.0
            else:
                if ti < 0:
                    continue
                p = ease_out(clamp(ti / 0.38))
            dy = (1 - p) * 46
            if p < 1:
                im2 = im.copy()
                im2.putalpha(im.getchannel('A').point(lambda v, p=p: int(v * p)))
            else:
                im2 = im
            paste(frame, im2, self.x - 6, int(self.y + i * self.lead + dy) - 36)


# ---------- cena e vídeo ----------
class Scene:
    def __init__(self, dur, text=None, items=(), overlays=(), whoosh=True, bg=None):
        self.bg = bg
        self.dur, self.text, self.items, self.overlays, self.whoosh = dur, text, list(items), list(overlays), whoosh


def render_video(name, color, scenes, out_dir):
    bg = paper_bg(hexrgb(color))
    for s_ in scenes:
        s_.bg_img = paper_bg(hexrgb(s_.bg)) if s_.bg else None
    total = sum(s.dur for s in scenes)
    nframes = int(round(total * FPS))
    path = f'{out_dir}/{name}-noaudio.mp4'
    proc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                             '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
                             '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path],
                            stdin=subprocess.PIPE)
    events = []  # (tempo, tipo)
    starts = []
    acc = 0
    for s in scenes:
        starts.append(acc)
        if s.whoosh and acc > 0:
            events.append((acc, 'whoosh'))
        for it in s.items:
            if it.sfx:
                events.append((acc + it.t0 + it.dur * 0.75, 'paper'))
        acc += s.dur
    for f in range(nframes):
        t = f / FPS
        si = max(i for i, st in enumerate(starts) if st <= t + 1e-9)
        s, lt = scenes[si], t - starts[si]
        tq = math.floor(lt * STEP + 1e-6) / STEP
        frame = (s.bg_img if getattr(s, 'bg_img', None) else bg).copy()
        for it in sorted(s.items, key=lambda i: i.z):
            st = it.state(tq)
            if not st or st['alpha'] <= 0:
                continue
            img = it.render_img(st['scale'], st['rot'], st['extra'])
            if st['alpha'] < 1:
                img = img.copy()
                img.putalpha(img.getchannel('A').point(lambda v, a=st['alpha']: int(v * a)))
            px, py = int(st['x'] - img.width / 2), int(st['y'] - img.height / 2)
            paste(frame, img, px, py)
        for ov in s.overlays:
            ov(frame, lt, tq)
        if s.text:
            for tb in (s.text if isinstance(s.text, (list, tuple)) else [s.text]):
                tb.draw(frame, lt)
        # fade curto para preto no último ~0,1 s
        if t > total - 0.1:
            k = clamp((total - t) / 0.1)
            frame = Image.blend(Image.new('RGBA', frame.size, (0, 0, 0, 255)), frame, k)
        proc.stdin.write(frame.convert('RGB').tobytes())
    proc.stdin.close()
    proc.wait()
    wav = f'{out_dir}/{name}.wav'
    make_sfx(events, total, wav)
    final = f'{out_dir}/{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-i', wav, '-c:v', 'copy', '-c:a', 'aac',
                    '-b:a', '160k', '-shortest', '-movflags', '+faststart', final], check=True)
    return final, total


def paste(frame, img, px, py):
    x0, y0 = max(0, px), max(0, py)
    x1, y1 = min(W, px + img.width), min(H, py + img.height)
    if x1 <= x0 or y1 <= y0:
        return
    crop = img.crop((x0 - px, y0 - py, x1 - px, y1 - py))
    frame.alpha_composite(crop, (x0, y0))


# ---------- som ----------
SR = 48000


def make_sfx(events, total, path):
    n = int(total * SR) + SR
    buf = np.zeros(n, np.float32)
    rng = np.random.default_rng(3)
    for t, kind in events:
        i = int(t * SR)
        if kind == 'paper':
            L = int(0.09 * SR)
            noise = rng.normal(0, 1, L)
            # passa-faixa grosseiro: diferença de médias móveis
            hp = noise - np.convolve(noise, np.ones(9) / 9, 'same')
            env = np.exp(-np.linspace(0, 9, L)) * (1 - np.exp(-np.linspace(0, 60, L)))
            s = hp * env
            s *= 10 ** (-27 / 20) / (np.abs(s).max() + 1e-9)
            s *= rng.uniform(0.75, 1.0)
        else:
            L = int(0.24 * SR)
            noise = rng.normal(0, 1, L)
            lp = np.convolve(noise, np.ones(24) / 24, 'same')
            env = np.sin(np.linspace(0, np.pi, L)) ** 2
            s = lp * env
            s *= 10 ** (-29 / 20) / (np.abs(s).max() + 1e-9)
        j = min(n, i + len(s))
        buf[i:j] += s[:j - i]
    buf = buf[:int(total * SR)]
    st = np.stack([buf, buf], 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())


def read_time(markup, base=1.3, per=0.3):
    return base + per * len(markup.split())
