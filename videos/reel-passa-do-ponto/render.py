import json, subprocess, sys, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
A_END = 23.0667            # fim do trecho A (antes do apresentador)
B_IN, B_OUT = 24.2667, 32.70
OFF = B_IN - A_END          # deslocamento do trecho B
DUR = A_END + (B_OUT - B_IN)
N = int(round(DUR * FPS))
ONLY = [int(x) for x in sys.argv[2:]] if len(sys.argv) > 2 else None
OUT = sys.argv[1]

RED = (204, 0, 0)
CREAM = (242, 234, 219)
F = lambda n, s: ImageFont.truetype(os.path.join(D, "fonts", n), s)
INTER = "Inter-Black.otf"; ANTON = "Anton.ttf"; FR9 = "Fraunces900.ttf"; FR6 = "Fraunces600.ttf"

def ease(x):
    x = max(0, min(1, x)); return 1 - (1 - x) ** 3
def back(x):
    x = max(0, min(1, x)); c = 1.7; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

# ---------- sprites de texto ----------
_cache = {}
def sprite(text, font, size, fill, stroke=0, stroke_fill=(0, 0, 0), shadow=0.55, blur=10):
    key = (text, font, size, fill, stroke, shadow, blur)
    if key in _cache: return _cache[key]
    f = F(font, size)
    l, t, r, b = f.getbbox(text, stroke_width=stroke)
    pad = blur * 3 + 10
    w, h = r - l + pad * 2, b - t + pad * 2
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.text((pad - l, pad - t), text, font=f, fill=fill + (255,), stroke_width=stroke, stroke_fill=stroke_fill + (255,))
    if shadow:
        a = im.split()[3].filter(ImageFilter.GaussianBlur(blur))
        sh = Image.new("RGBA", (w, h), (0, 0, 0, 0)); sh.putalpha(a.point(lambda v: int(v * shadow)))
        base = Image.new("RGBA", (w, h), (0, 0, 0, 0)); base.alpha_composite(sh, (0, 6)); base.alpha_composite(im)
        im = base
    _cache[key] = (im, pad, -l, f.getlength(text))
    return _cache[key]

def put(canvas, spr, cx, cy, alpha=1.0, scale=1.0, anchor="c"):
    im, pad, _, _ = spr
    if scale != 1.0:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)
    if alpha < 1.0:
        a = im.split()[3].point(lambda v: int(v * max(0, alpha))); im = im.copy(); im.putalpha(a)
    x = int(cx - im.width / 2) if anchor == "c" else int(cx - pad * scale)
    canvas.alpha_composite(im, (max(-im.width + 1, min(W - 1, x)), int(cy - im.height / 2)))

def letters(canvas, text, font, size, fill, cx, cy, t, mode, stroke=0, stagger=0.025, dur=0.28):
    """Texto letra a letra (movimento do pacote de titulos: deslocamento + opacidade por letra)."""
    f = F(font, size)
    total = f.getlength(text)
    x = cx - total / 2
    for i, ch in enumerate(text):
        adv = f.getlength(text[:i + 1]) - f.getlength(text[:i])
        if ch != " ":
            p = ease((t - i * stagger) / dur)
            if p > 0:
                dx = dy = 0
                if mode == "up": dy = (1 - p) * 60
                elif mode == "down": dy = -(1 - p) * 60
                elif mode == "right": dx = -(1 - p) * 70
                elif mode == "left": dx = (1 - p) * 70
                s = sprite(ch, font, size, fill, stroke)
                sc = back((t - i * stagger) / dur) if mode == "pop" else 1.0
                put(canvas, s, x + adv / 2 + dx, cy + dy, alpha=min(1, p * 1.6), scale=max(0.01, sc))
        x += adv

def strip(canvas, cx, cy, w, h, color, t, rot=-2.0, dur=0.22):
    """Tira de papel creme que entra deslizando (ligacao com a colagem)."""
    p = ease(t / dur)
    if p <= 0: return
    ww = max(2, int(w * p))
    im = Image.new("RGBA", (ww + 40, h + 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((20, 26, 20 + ww, 26 + h), fill=(0, 0, 0, 70))
    im = im.filter(ImageFilter.GaussianBlur(6))
    d = ImageDraw.Draw(im)
    d.rectangle((20, 20, 20 + ww, 20 + h), fill=color + (255,))
    im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    canvas.alpha_composite(im, (int(cx - w / 2 - 20), int(cy - im.height / 2)))

def bar(canvas, x0, y, w, h, color, t, dur=0.25):
    p = ease(t / dur)
    if p > 0:
        ImageDraw.Draw(canvas).rectangle((x0, y, x0 + w * p, y + h), fill=color + (255,))

# ---------- legenda pequena (fala) ----------
words = json.load(open(os.path.join(D, "words.json")))
def src2out(s):
    if s < A_END: return s
    if s >= B_IN: return s - OFF
    return None
fix = {"Passo": "Passou", "Borderline,": "borderline,", "Borderline": "borderline"}
W2 = []
for w in words:
    o = src2out(w["start"])
    if o is None or w["start"] >= B_OUT - 0.05: continue
    txt = fix.get(w["text"], w["text"])
    W2.append({"t": txt, "s": o, "e": src2out(w["end"]) or o + 0.2})
# cortar palavra truncada do fim do trecho A ("problema" vira ambiguo) -> fica so ate "proteger"
W2 = [w for w in W2 if not (A_END - 1.0 < w["s"] < A_END and w["t"].strip(".,").lower() in ("o", "problema"))]
chunks, cur = [], []
for i, w in enumerate(W2):
    cur.append(w)
    end_punct = w["t"][-1] in ".,?!"
    gap = (W2[i + 1]["s"] - w["e"]) if i + 1 < len(W2) else 9
    if len(cur) == 3 or end_punct or gap > 0.3:
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
for i, c in enumerate(chunks):
    c_end = chunks[i + 1][0]["s"] if i + 1 < len(chunks) else DUR
    for w in c: w["cend"] = min(c_end, c[-1]["e"] + 0.6)
MODES = ["up", "right", "pop", "left", "down"]

# ---------- momentos de enfase (tempo de saida) ----------
BR0, BR1 = 12.05, 14.70
def o(src): return src - OFF
EMPH = [  # (inicio, fim)
    (0.0, 2.45), (3.32, 5.05), (8.46, 10.75), (BR0, BR1), (18.16, 19.95), (21.56, A_END),
    (o(26.42), o(27.30)), (o(28.70), o(29.85)), (o(31.45), DUR)]
def in_emph(t): return any(a <= t < b for a, b in EMPH[1:])

ZOOM = [(3.32, 5.05, 1.10), (8.46, 10.75, 1.14), (18.16, 19.95, 1.09), (21.56, A_END, 1.15),
        (o(26.42), o(27.30), 1.10), (o(28.70), o(29.85), 1.12), (o(31.45), DUR, 1.08)]
def zoom_at(t):
    for a, b, z in ZOOM:
        if a <= t < b: return z
    return 1.0 + 0.035 * (t / DUR)

def draw_small(cv, t):
    if in_emph(t) or BR0 - 0.05 <= t < BR1: return
    for ci, c in enumerate(chunks):
        if c[0]["s"] - 0.04 <= t < c[-1]["cend"]:
            mode = MODES[ci % len(MODES)]
            f = F(INTER, 64)
            txts = [w["t"].strip(",.") for w in c]
            line = " ".join(txts).upper()
            total = f.getlength(line); x = W / 2 - total / 2; y = 1300
            for w, tx in zip(c, txts):
                tx = tx.upper(); wl = f.getlength(tx)
                lt = t - (w["s"] - 0.04)
                if lt >= 0:
                    active = w["s"] <= t < w["e"] + 0.05
                    col = (255, 214, 0) if active and len(c) > 1 else (255, 255, 255)
                    letters(cv, tx, INTER, 64, col, x + wl / 2, y, lt, mode, stroke=2, stagger=0.012, dur=0.16)
                x += wl + f.getlength(" ")
            return

def draw_emph(cv, t):
    # 0  gancho em texto (nao repete a fala)
    a, b = EMPH[0]
    if t < b:
        lt = t
        letters(cv, "REAGIU DEMAIS", ANTON, 128, (255, 255, 255), W / 2, 250, lt, "up", stagger=0.03, dur=0.3)
        strip(cv, W / 2, 372, 650, 92, CREAM, lt - 0.45)
        if lt > 0.5:
            letters(cv, "e se arrependeu depois", FR9, 58, RED, W / 2, 368, lt - 0.55, "right", stagger=0.015, dur=0.25)
    # 1  AMEACA
    a, b = EMPH[1]
    if a <= t < b:
        lt = t - a
        letters(cv, "AMEAÇA", ANTON, 190, (255, 255, 255), W / 2, 270, lt, "down", stagger=0.04, dur=0.25)
        bar(cv, W / 2 - 250, 375, 500, 16, RED, lt - 0.35)
        if lt > 0.56:
            letters(cv, "capta bem a", INTER, 50, (255, 255, 255), W / 2, 160, lt - 0.56, "pop", stroke=2, stagger=0.012, dur=0.2)
    # 2  INDIGNACAO legitima
    a, b = EMPH[2]
    if a <= t < b:
        lt = t - a
        strip(cv, W / 2, 262, 820, 150, CREAM, lt, rot=2.0)
        letters(cv, "indignação", FR9, 128, RED, W / 2, 255, lt - 0.12, "up", stagger=0.025, dur=0.28)
        if t >= 9.18:
            letters(cv, "LEGÍTIMA", INTER, 70, (255, 255, 255), W / 2, 400, t - 9.18, "pop", stroke=2, stagger=0.02, dur=0.22)
    # 3  B-roll: PUTZ. / PASSEI do ponto
    a, b = EMPH[3]
    if a <= t < b:
        if t < 13.80:
            letters(cv, "PUTZ", ANTON, 160, (20, 20, 20), W / 2, 255, t - 12.12, "pop", stagger=0.04, dur=0.25)
        else:
            lt = t - 13.84
            letters(cv, "PASSEI", ANTON, 130, (20, 20, 20), 325, 250, lt, "up", stagger=0.03, dur=0.22)
            letters(cv, "do ponto", FR9, 100, RED, 720, 240, lt - 0.15, "up", stagger=0.02, dur=0.22)
    # 4  EM PERIGO (pilula vermelha)
    a, b = EMPH[4]
    if a <= t < b:
        lt = t - a
        p = back(lt / 0.25)
        if p > 0:
            pw, ph = 720 * p, 170
            ImageDraw.Draw(cv).rounded_rectangle((W / 2 - pw / 2, 265 - ph / 2, W / 2 + pw / 2, 265 + ph / 2), radius=30, fill=RED + (255,))
        letters(cv, "EM PERIGO", ANTON, 150, (255, 255, 255), W / 2, 262, lt - 0.12, "up", stagger=0.03, dur=0.22)
        letters(cv, "alguém que você ama", FR6, 54, (255, 255, 255), W / 2, 400, lt - 0.3, "left", stroke=0, stagger=0.012, dur=0.2)
    # 5  PARA PROTEGER
    a, b = EMPH[5]
    if a <= t < b:
        lt = t - a
        letters(cv, "PARA", INTER, 70, (255, 255, 255), W / 2, 175, lt, "right", stroke=2, stagger=0.02, dur=0.2)
        letters(cv, "proteger", FR9, 150, (255, 255, 255), W / 2, 300, lt - 0.12, "up", stagger=0.03, dur=0.26)
        bar(cv, W / 2 - 290, 395, 580, 14, RED, lt - 0.4)
    # 6  NAO ERA bem aquilo
    a, b = EMPH[6]
    if a <= t < b:
        lt = t - a
        letters(cv, "NÃO ERA", ANTON, 170, (255, 255, 255), W / 2, 235, lt, "left", stagger=0.035, dur=0.24)
        if lt > 0.3:
            strip(cv, W / 2, 372, 520, 96, CREAM, lt - 0.3, rot=-1.5)
            letters(cv, "bem aquilo", FR9, 70, RED, W / 2, 366, lt - 0.38, "up", stagger=0.02, dur=0.22)
    # 7  BORDERLINE
    a, b = EMPH[7]
    if a <= t < b:
        lt = t - a
        letters(cv, "NA MENTE DO", INTER, 58, (255, 255, 255), W / 2, 175, lt, "down", stroke=2, stagger=0.015, dur=0.2)
        strip(cv, W / 2, 300, 860, 160, CREAM, lt - 0.1, rot=-2.0)
        letters(cv, "borderline", FR9, 140, RED, W / 2, 292, lt - 0.18, "pop", stagger=0.025, dur=0.25)
    # 8  final
    a, b = EMPH[8]
    if a <= t < b:
        lt = t - a
        letters(cv, "PRA FALAR", ANTON, 170, (255, 255, 255), W / 2, 235, lt, "up", stagger=0.035, dur=0.24)
        letters(cv, "alguma coisa", FR9, 84, RED, W / 2, 370, lt - 0.3, "right", stagger=0.02, dur=0.24)

# ---------- b-roll ----------
BR = sorted(os.listdir(os.path.join(D, "broll")))
def broll_frame(t):
    lt = t - BR0
    seq = list(range(2, 8)) + list(range(11, 32)) + list(range(32, 44))
    idx = seq[min(len(seq) - 1, int(lt * FPS / 2))]
    im = Image.open(os.path.join(D, "broll", BR[idx])).convert("RGB").resize((W, H), Image.LANCZOS)
    # assentar: zoom lento
    z = 1.0 + 0.03 * lt
    if z > 1.0:
        cw, ch = W / z, H / z
        im = im.crop((int((W - cw) / 2), int((H - ch) / 2), int((W + cw) / 2), int((H + ch) / 2))).resize((W, H), Image.LANCZOS)
    return im

# ---------- leitura da base ----------
def reader():
    fc = (f"[0:v]trim=0:{A_END},setpts=PTS-STARTPTS,fps=30,scale={W}:{H}:flags=lanczos[a];"
          f"[0:v]trim={B_IN + 0.0667}:{B_OUT},setpts=PTS-STARTPTS,fps=30,scale={W}:{H}:flags=lanczos,tpad=start=2:start_mode=clone[b];"
          f"[a][b]concat=n=2:v=1:a=0,trim=end_frame={N}[v]")
    return subprocess.Popen(["ffmpeg", "-v", "error", "-i", os.path.join(D, "raw.mp4"), "-filter_complex", fc, "-map", "[v]",
                             "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)

def frame(i, base):
    t = i / FPS
    if BR0 <= t < BR1:
        img = broll_frame(t)
    else:
        z = zoom_at(t)
        cw, ch = W / z, H / z
        cy = H * 0.40
        top = max(0, min(H - ch, cy - ch * 0.40))
        img = base.crop((int((W - cw) / 2), int(top), int((W + cw) / 2), int(top + ch))).resize((W, H), Image.LANCZOS)
    cv = img.convert("RGBA")
    draw_small(cv, t)
    draw_emph(cv, t)
    # flash branco curto na entrada e saida do b-roll
    for ft in (BR0, BR1):
        d = t - ft
        if 0 <= d < 0.1:
            fl = Image.new("RGBA", (W, H), (255, 255, 255, int(255 * (1 - d / 0.1) * 0.85)))
            cv.alpha_composite(fl)
    # fade para preto no ultimo 0,1 s
    if t > DUR - 0.1:
        cv.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, int(255 * (t - (DUR - 0.1)) / 0.1))))
    return cv.convert("RGB")

if __name__ == "__main__":
    print("N", N, "DUR", DUR, file=sys.stderr)
    r = reader()
    if ONLY:
        os.makedirs(OUT, exist_ok=True)
        for i in range(N):
            buf = r.stdout.read(W * H * 3)
            if not buf: break
            if i in ONLY:
                frame(i, Image.frombytes("RGB", (W, H), buf)).save(os.path.join(OUT, f"f{i:04d}.jpg"), quality=88)
            if i >= max(ONLY): break
        r.kill(); sys.exit()
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30",
                            "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", OUT], stdin=subprocess.PIPE)
    last = None
    for i in range(N):
        buf = r.stdout.read(W * H * 3)
        if len(buf) < W * H * 3: buf = last
        last = buf
        enc.stdin.write(frame(i, Image.frombytes("RGB", (W, H), buf)).tobytes())
        if i % 60 == 0: print(i, file=sys.stderr)
    enc.stdin.close(); enc.wait()
