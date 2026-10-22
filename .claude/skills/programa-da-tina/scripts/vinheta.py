"""Abertura e encerramento do Programa da Tina.

Uso: python3 -I vinheta.py episodio.mp4 saida.mp4
Opcional: STILLS=0.5,3.0 salva quadros de conferência ao lado do script.
"""
import math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1]
OUT = sys.argv[2]
W, H, FPS = 1080, 1920, 30
F = os.path.join(D, "..", "fonts")
SCRIPT = os.path.join(F, "pacifico-latin-400-normal.woff")
SERIF = os.path.join(F, "playfair-display-latin-700-normal.woff")
COND = os.path.join(F, "Archivo.ttf")
PINK = (236, 64, 150)
HOT = (255, 46, 140)

dur_src = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", SRC], capture_output=True, text=True).stdout)
OUTRO = 2.0
DUR = dur_src + OUTRO
INTRO_END = 1.83


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def eo(x):
    x = clamp(x); return 1 - (1 - x) ** 3


def back(x, s=1.7):
    x = clamp(x); return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2


def cond(size, wght=800):
    f = ImageFont.truetype(COND, size); f.set_variation_by_axes([wght, 72]); return f


def glow_text(text, font, fill, glow, glow_r=10, stroke=0):
    l, t, r, b = font.getbbox(text)
    pad = glow_r * 3
    im = Image.new("RGBA", (r - l + 2 * pad, b - t + 2 * pad), (0, 0, 0, 0))
    g = Image.new("L", im.size, 0)
    ImageDraw.Draw(g).text((pad - l, pad - t), text, font=font, fill=255, stroke_width=stroke + 3)
    g = g.filter(ImageFilter.GaussianBlur(glow_r))
    gl = Image.new("RGBA", im.size, glow + (0,)); gl.putalpha(g.point(lambda v: int(v * 0.9)))
    im.alpha_composite(gl)
    ImageDraw.Draw(im).text((pad - l, pad - t), text, font=font, fill=fill)
    return im


def gradient_text(text, font, stops, glow=(255, 80, 170), glow_r=14):
    """Texto com degradê horizontal (amarelo, creme, rosa) e brilho rosa."""
    l, t, r, b = font.getbbox(text)
    pad = glow_r * 3
    size = (r - l + 2 * pad, b - t + 2 * pad)
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).text((pad - l, pad - t), text, font=font, fill=255)
    xs = np.linspace(0, 1, size[0])
    cols = np.zeros((size[0], 3))
    for i in range(3):
        cols[:, i] = np.interp(xs, [s[0] for s in stops], [s[1][i] for s in stops])
    grad = np.tile(cols[None, :, :], (size[1], 1, 1))
    # leve brilho vertical
    vy = np.linspace(1.08, 0.92, size[1])[:, None, None]
    grad = np.clip(grad * vy, 0, 255)
    im = Image.new("RGBA", size, (0, 0, 0, 0))
    g = mask.filter(ImageFilter.GaussianBlur(glow_r))
    gl = Image.new("RGBA", size, glow + (0,)); gl.putalpha(g.point(lambda v: int(v * 0.75)))
    im.alpha_composite(gl)
    body = Image.fromarray(grad.astype(np.uint8), "RGB").convert("RGBA"); body.putalpha(mask)
    im.alpha_composite(body)
    return im


TINA_STOPS = [(0.0, (255, 214, 92)), (0.38, (255, 236, 205)), (0.62, (255, 150, 205)), (1.0, (255, 70, 160))]


def pill(text, font, fill=HOT, border=(255, 190, 225), pad=(34, 16), glow=True):
    l, t, r, b = font.getbbox(text)
    w, h = r - l + 2 * pad[0], b - t + 2 * pad[1]
    m = 24
    im = Image.new("RGBA", (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    if glow:
        g = Image.new("L", im.size, 0)
        ImageDraw.Draw(g).rounded_rectangle([m, m, m + w, m + h], radius=h // 2, fill=255)
        g = g.filter(ImageFilter.GaussianBlur(12))
        gl = Image.new("RGBA", im.size, HOT + (0,)); gl.putalpha(g.point(lambda v: int(v * 0.7))); im.alpha_composite(gl)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([m, m, m + w, m + h], radius=h // 2, fill=fill + (255,), outline=border + (255,), width=4)
    d.text((m + pad[0] - l, m + pad[1] - t), text, font=font, fill=(255, 255, 255))
    return im


def badge():
    """Selo do canto: pílula escura com borda rosa, Programa da em script, TINA em serifa."""
    s = glow_text("Programa da", ImageFont.truetype(SCRIPT, 46), (255, 255, 255), (255, 120, 190), 4)
    t = gradient_text("TINA", ImageFont.truetype(SERIF, 62), TINA_STOPS, glow_r=4)
    w = s.width + t.width - 12 + 30; h = 96
    im = Image.new("RGBA", (w + 30, h + 30), (0, 0, 0, 0))
    g = Image.new("L", im.size, 0); ImageDraw.Draw(g).rounded_rectangle([15, 15, 15 + w, 15 + h], radius=h // 2, fill=255)
    gl = Image.new("RGBA", im.size, HOT + (0,)); gl.putalpha(g.filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * 0.6))); im.alpha_composite(gl)
    ImageDraw.Draw(im).rounded_rectangle([15, 15, 15 + w, 15 + h], radius=h // 2, fill=(28, 14, 30, 225), outline=(240, 70, 160, 255), width=4)
    im.alpha_composite(s, (15 + 8, 15 + (h - s.height) // 2 + 2))
    im.alpha_composite(t, (15 + 8 + s.width - 12, 15 + (h - t.height) // 2 - 2))
    return im


PROG = glow_text("Programa da", ImageFont.truetype(SCRIPT, 92), (255, 255, 255), (255, 70, 160), 12)
TINA = gradient_text("TINA", ImageFont.truetype(SERIF, 250), TINA_STOPS)
PILL = pill("A ÚLTIMA SINCERA", cond(54))
SIGA = glow_text("SIGA PARA O PRÓXIMO EPISÓDIO", cond(44, 700), (255, 255, 255), (0, 0, 0), 6)
BADGE = badge()

rng = np.random.default_rng(12)
SPARK = [(rng.uniform(150, 930), rng.uniform(500, 1500), rng.uniform(0, 6.28), rng.uniform(8, 18)) for _ in range(16)]


def spark(d, x, y, r, a):
    if a <= 0.02:
        return
    c = (255, 255, 255, int(255 * a))
    d.polygon([(x, y - r), (x + r * 0.22, y - r * 0.22), (x + r, y), (x + r * 0.22, y + r * 0.22), (x, y + r), (x - r * 0.22, y + r * 0.22), (x - r, y), (x - r * 0.22, y - r * 0.22)], fill=c)


def sparkles(img, t, yc, spread):
    d = ImageDraw.Draw(img)
    for x, y, ph, r in SPARK:
        yy = yc + (y - 1000) * spread
        a = max(0.0, math.sin(t * 5.0 + ph)) ** 3
        spark(d, x, yy, r * (0.6 + 0.4 * a), a)


def paste_c(img, im, cx, cy, scale=1.0, alpha=1.0):
    if scale != 1.0:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)
    if alpha < 1:
        im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * alpha)))
    img.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))


def tint(img, dark, pink):
    """Escurece e banha de rosa por baixo, como no episódio anterior."""
    a = np.asarray(img.convert("RGB"), np.float32) * (1 - dark)
    yy = np.linspace(0, 1, H)[:, None, None]
    a = a * (1 - pink * 0.5 * yy) + np.array([120, 20, 90], np.float32) * pink * 0.5 * yy
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def flash(img, k):
    if k <= 0:
        return img
    a = np.asarray(img.convert("RGB"), np.float32)
    a = a + (np.array([255, 235, 245], np.float32) - a) * k
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def read_frames():
    p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", SRC, "-vf", f"scale={W}:{H}:flags=lanczos,fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    while True:
        b = p.stdout.read(W * H * 3)
        if len(b) < W * H * 3:
            break
        yield Image.frombytes("RGB", (W, H), b).convert("RGBA")


def intro(fr, t):
    img = tint(fr, 0.45 * (1 - eo((t - 1.55) / 0.28)), 0.8 * (1 - eo((t - 1.55) / 0.28)))
    # Programa da: entra em 0,25 s, sobe com o TINA depois do flash
    if t >= 0.25:
        p = eo((t - 0.25) / 0.35)
        up = eo((t - 0.8) / 0.25) * 0
        paste_c(img, PROG, W / 2, 1030 - 20 * (1 - p), 0.9 + 0.1 * p, p)
    if t >= 0.8:
        p = back((t - 0.8) / 0.3)
        paste_c(img, TINA, W / 2, 1235, 0.85 + 0.15 * p, min(1, (t - 0.8) / 0.12))
        sparkles(img, t, 1150, 0.55)
    if t >= 0.95:
        p = back((t - 0.95) / 0.3, 2.2)
        paste_c(img, PILL, W / 2, 1470, 0.6 + 0.4 * p, min(1, (t - 0.95) / 0.12))
    img = flash(img, clamp(1 - (t - 0.8) / 0.3) if t >= 0.8 else 0)
    # saída: o bloco sobe e some, o vídeo clareia
    if t >= 1.55:
        k = eo((t - 1.55) / 0.28)
        img = flash(img, 0.25 * math.sin(math.pi * k))
    return img


_END_BG = None


def outro(last, t):
    global _END_BG
    if _END_BG is None:
        b = last.filter(ImageFilter.GaussianBlur(22))
        _END_BG = tint(b, 0.72, 1.0)
    img = _END_BG.copy()
    paste_c(img, PROG, W / 2, 665, 1.0, eo(t / 0.25))
    p = back(t / 0.3)
    paste_c(img, TINA, W / 2, 875, 0.85 + 0.15 * p, clamp(t / 0.12))
    if t >= 0.12:
        p = back((t - 0.12) / 0.3, 2.2)
        paste_c(img, PILL, W / 2, 1108, 0.6 + 0.4 * p, clamp((t - 0.12) / 0.12))
    if t >= 0.45:
        paste_c(img, SIGA, W / 2, 1285, 1.0, eo((t - 0.45) / 0.3))
    sparkles(img, t, 830, 0.5)
    img = flash(img, clamp(1 - t / 0.3))
    return img


if __name__ == "__main__":
    tmpv = OUT + ".v.mp4"
    enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                            "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", tmpv], stdin=subprocess.PIPE)
    i = 0; last = None
    stills = [float(x) for x in os.environ.get("STILLS", "").split(",") if x]
    n_src = 0
    for fr in read_frames():
        t = i / FPS
        if t < INTRO_END:
            out = intro(fr, t)
        else:
            out = fr.copy()
            out.alpha_composite(BADGE, (40, 130))
            # escurece no último 0,25 s antes do flash, como no anterior
            k = clamp((t - (dur_src - 0.25)) / 0.25)
            if k > 0:
                out = tint(out, 0.4 * k, 0.4 * k)
        for s in stills:
            if abs(t - s) < 0.5 / FPS:
                out.convert("RGB").save(os.path.join(os.path.dirname(os.path.abspath(OUT)), f"st_{s}.png"))
        enc.stdin.write(out.convert("RGB").tobytes())
        last = fr; i += 1
    n_src = i
    for j in range(int(OUTRO * FPS)):
        t = j / FPS
        out = outro(last, t)
        for s in stills:
            if abs(n_src / FPS + t - s) < 0.5 / FPS:
                out.convert("RGB").save(os.path.join(os.path.dirname(os.path.abspath(OUT)), f"st_{s}.png"))
        enc.stdin.write(out.convert("RGB").tobytes())
    enc.stdin.close(); enc.wait()
    total = (n_src + int(OUTRO * FPS)) / FPS
    # áudio: o do vídeo, com cauda de 2 s e um brilho suave nos dois flashes
    sr = 48000
    a = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", SRC, "-vn", "-ac", "2", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
    aud = np.frombuffer(a, np.float32).reshape(-1, 2).copy()
    n = int(total * sr)
    aud = np.pad(aud, ((0, max(0, n - len(aud))), (0, 0)))[:n]
    fade = int(0.4 * sr); e0 = int(dur_src * sr)
    if e0 - fade > 0:
        aud[e0 - fade:e0] *= np.linspace(1, 0.0, fade)[:, None]
    aud[e0:] = 0

    def shimmer(at, k=1.0):
        d = 1.2; tt = np.arange(int(d * sr)) / sr
        s = np.zeros_like(tt)
        for f0 in (2093, 2637, 3136, 4186):
            s += np.sin(2 * math.pi * f0 * tt) * np.exp(-tt * 3.5) * np.clip(tt / 0.01, 0, 1)
        nz = np.random.default_rng(5).normal(0, 1, len(tt)) * np.exp(-tt * 9) * 0.3
        s = (s / 4 + nz) * 0.12 * k
        i0 = int(at * sr); seg = s[: n - i0]
        aud[i0:i0 + len(seg)] += np.stack([seg, np.roll(seg, 240)], 1)
    shimmer(0.8); shimmer(n_src / FPS, 1.0)
    peak = np.abs(aud).max()
    if peak > 0.95:
        aud *= 0.95 / peak
    wav = OUT + ".wav"
    import wave
    w = wave.open(wav, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(aud, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmpv, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT], check=True)
    os.remove(tmpv); os.remove(wav)
    print("ok", round(total, 2), "s")
