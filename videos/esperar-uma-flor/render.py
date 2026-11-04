"""Esperar uma Flor: monta o clipe de 42 s a partir das 11 imagens e do corte de áudio.

Uso: python render.py IMAGENS_DIR AUDIO.m4a SAIDA.mp4
Cada plano: (início s, fim s, imagem, (cx, cy, s) inicial, (cx, cy, s) final).
s é a fração da largura mostrada (1.0 = imagem inteira). Cortes caem nas palavras da letra.
"""
import subprocess, sys
from PIL import Image

W, H, FPS = 1080, 1920, 30
DUR = 42.30
FUSAO = (24.85, 25.35)          # única fusão: da vida para depois
FADE_FIM = 1.5

PLANOS = [
    (0.00, 1.92, "01", (0.50, 0.48, 1.00), (0.50, 0.47, 0.90)),   # Se isso fosse hoje
    (1.92, 3.90, "02", (0.50, 0.50, 1.00), (0.50, 0.48, 0.94)),   # ela diria sim
    (3.90, 5.82, "03", (0.45, 0.50, 0.86), (0.55, 0.50, 0.86)),   # sim
    (5.82, 7.80, "04", (0.50, 0.55, 1.00), (0.52, 0.55, 0.92)),   # Mas naquele dia
    (7.80, 9.90, "05", (0.50, 0.50, 0.95), (0.49, 0.48, 0.88)),   # ela
    (9.90, 12.26, "05", (0.47, 0.30, 0.56), (0.47, 0.30, 0.50)),  # não disse sim
    (12.26, 14.62, "06", (0.50, 0.50, 1.00), (0.50, 0.48, 0.94)), # Eu suava frio
    (14.62, 16.20, "06", (0.40, 0.35, 0.56), (0.40, 0.35, 0.50)), # com o
    (16.20, 17.98, "07", (0.45, 0.50, 1.00), (0.45, 0.50, 0.93)), # coração na
    (17.98, 19.96, "07", (0.27, 0.48, 0.52), (0.27, 0.50, 0.47)), # mão
    (19.96, 22.02, "08", (0.50, 0.50, 1.00), (0.50, 0.50, 0.95)), # E ela terminava
    (22.02, 23.52, "08", (0.21, 0.74, 0.42), (0.21, 0.74, 0.39)), # de
    (23.52, 25.10, "08", (0.47, 0.50, 0.50), (0.47, 0.50, 0.45)), # dizer não
    (25.10, 27.10, "09", (0.50, 0.50, 1.00), (0.50, 0.50, 0.95)), # o quarto
    (27.10, 29.10, "09", (0.45, 0.30, 0.56), (0.45, 0.30, 0.52)), # a cortina
    (29.10, 31.10, "10", (0.50, 0.50, 1.00), (0.50, 0.48, 0.94)), # ela no banco
    (31.10, 33.10, "10", (0.38, 0.27, 0.50), (0.38, 0.27, 0.46)), # a lágrima
    (33.10, 35.10, "10", (0.72, 0.72, 0.50), (0.72, 0.72, 0.46)), # a flor na mão
    (35.10, 37.20, "11", (0.33, 0.66, 0.45), (0.33, 0.66, 0.42)), # a luz no banco
    (37.20, DUR, "11", (0.50, 0.50, 0.86), (0.50, 0.50, 1.00)),   # ela vai embora
]

def caixa(img, cx, cy, s):
    iw, ih = img.size
    w = s * iw
    h = w * H / W
    if h > ih:
        h = ih; w = h * W / H
    x0 = min(max(cx * iw - w / 2, 0), iw - w)
    y0 = min(max(cy * ih - h / 2, 0), ih - h)
    return (x0, y0, x0 + w, y0 + h)

def quadro_do_plano(p, t, imgs):
    a, b, nome, ini, fim = p
    k = min(max((t - a) / (b - a), 0.0), 1.0)
    cx, cy, s = (ini[i] + (fim[i] - ini[i]) * k for i in range(3))
    img = imgs[nome]
    return img.resize((W, H), Image.BICUBIC, box=caixa(img, cx, cy, s))

def plano_em(t):
    for p in PLANOS:
        if p[0] <= t < p[1]:
            return p
    return PLANOS[-1]

def filtro_audio(audio):
    """Loudnorm em duas passadas (-14 LUFS, pico -1,5 dBTP) e limitador de segurança."""
    import json, re
    base = f"afade=t=out:st={DUR - 1.2:.2f}:d=1.2"
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", audio, "-af",
                          base + ",loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = json.loads(re.search(r"\{[^{}]*\}", err[err.rfind("{") - 1:], re.S).group(0))
    return (f"{base},loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
            f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
            "alimiter=limit=0.84:level=false,apad")

def main():
    pasta, audio, saida = sys.argv[1:4]
    imgs = {n: Image.open(f"{pasta}/{n}.png").convert("RGB") for n in {p[2] for p in PLANOS}}
    ff = subprocess.Popen([
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", audio,
        "-filter_complex", f"[1:a]{filtro_audio(audio)}[a]",
        "-map", "0:v", "-map", "[a]", "-t", f"{DUR:.2f}",
        "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", saida,
    ], stdin=subprocess.PIPE)
    n = int(round(DUR * FPS))
    for i in range(n):
        t = i / FPS
        quadro = quadro_do_plano(plano_em(t), t, imgs)
        if FUSAO[0] <= t < FUSAO[1]:
            antes = quadro_do_plano(PLANOS[12], t, imgs)
            depois = quadro_do_plano(PLANOS[13], t, imgs)
            quadro = Image.blend(antes, depois, (t - FUSAO[0]) / (FUSAO[1] - FUSAO[0]))
        if t > DUR - FADE_FIM:
            quadro = Image.blend(quadro, Image.new("RGB", (W, H)), min((t - (DUR - FADE_FIM)) / FADE_FIM, 1.0))
        ff.stdin.write(quadro.tobytes())
    ff.stdin.close()
    sys.exit(ff.wait())

if __name__ == "__main__":
    main()
