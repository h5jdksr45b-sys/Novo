# POV BORDER EM TRATAMENTO: parte 2 do POV BORDER.
# Mesmo modelo e mesmos tempos do original (música reaproveitada), textos novos.
# Uso: python3 render.py  -> renders/pov-border-em-tratamento.mp4
import os, subprocess, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
DUR = 25.8
SERIF = os.path.join(HERE, 'fonts/DMSerifDisplay-Regular.ttf')
SANS = os.path.join(HERE, 'fonts/Montserrat.ttf')
HANDLE = '@DRFABIOSCHMIDT'

# (início, fim, tipo, palavra, complemento, início do complemento)
# Tempos copiados do original, que estão no compasso da música.
SCENES = [
    (0.0, 4.2, 'title', 'POV BORDER', 'EM TRATAMENTO:', 0.0),
    (4.2, 5.3, 'word', 'EMOÇÃO', 'ainda intensa,\npassa mais rápido', 4.8),
    (5.3, 6.4, 'word', 'APEGO', 'mais devagar', 5.9),
    (6.4, 7.1, 'blank', '', '', 0),
    (7.1, 8.2, 'word', 'MEDO?', 'ainda vem, também vai', 7.7),
    (8.2, 9.3, 'word', 'IDENTIDADE', 'começando a saber', 8.55),
    (9.3, 10.05, 'flash', 'pede ajuda', '', 0),
    (10.05, 10.2, 'blank', '', '', 0),
    (10.2, 11.3, 'word', 'HUMOR', '8 ou 80, às vezes 50', 10.75),
    (11.3, 11.5, 'blank', '', '', 0),
    (11.5, 12.4, 'word', 'CONFIANÇA', 'aos poucos', 11.9),
    (12.4, 12.8, 'blank', '', '', 0),
    (12.8, 14.0, 'word', 'AMOR', 'sem se perder', 13.5),
    (14.0, 15.2, 'word', 'RAIVA', 'percebe antes', 14.9),
    (15.2, 16.1, 'flash', 'respira', '', 0),
    (16.1, 17.2, 'word', 'DOR', 'tem nome agora', 16.7),
    (17.2, 18.4, 'word', 'VAZIO', 'menos dias', 17.85),
    (18.4, 19.0, 'blank', '', '', 0),
    (19.0, 20.7, 'cta', 'siga', '@drfabioschmidt', 19.9),
    (20.7, 21.85, 'redblank', '', '', 0),
    (21.85, DUR, 'end', '', '', 0),
]
RED_FROM = {'IDENTIDADE': 8.8, 'RAIVA': 14.7}  # no original, essas viram vermelho no fim

rng = np.random.default_rng(7)

def smooth_noise(h, w, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((h // scale + 2, w // scale + 2)).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img).astype(np.float32) / 255

def canvas_texture(seed, palette):
    """Aquarela sobre tela: manchas grandes + trama de tecido + grão."""
    h, w = H // 2, W // 2
    n = (0.55 * smooth_noise(h, w, 90, seed) + 0.3 * smooth_noise(h, w, 35, seed + 1)
         + 0.15 * smooth_noise(h, w, 12, seed + 2))
    n = (n - n.min()) / (n.max() - n.min())
    c0, c1, c2 = [np.array(c, np.float32) for c in palette]
    t = n[..., None]
    col = np.where(t < 0.5, c0 + (c1 - c0) * (t / 0.5), c1 + (c2 - c1) * ((t - 0.5) / 0.5))
    img = Image.fromarray(col.clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    a = np.asarray(img).astype(np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.random.default_rng(seed + 3)
    weave = (np.sin(xx * 1.05 + r.random() * 6) * np.sin(yy * 1.05) * 0.6
             + smooth_noise(H, W, 3, seed + 9) - 0.5)
    grain = r.normal(0, 1, (H, W)).astype(np.float32)
    a += weave[..., None] * 16 + grain[..., None] * 7
    # vinheta
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    a *= (1 - 0.28 * np.clip(d - 0.55, 0, 1))[..., None]
    return a.clip(0, 255).astype(np.uint8)

BLUE = [(20, 95, 215), (25, 160, 225), (95, 210, 235)]
RED = [(110, 28, 20), (150, 52, 38), (185, 95, 75)]
print('texturas...')
BLUE_T = [Image.fromarray(canvas_texture(s, BLUE)) for s in (10, 20, 30, 40)]
RED_T = [Image.fromarray(canvas_texture(s, RED)) for s in (50, 60, 70)]

def font(path, size, wght=None):
    f = ImageFont.truetype(path, size)
    if wght:
        try:
            f.set_variation_by_axes([wght])
        except Exception:
            pass
    return f

F_WORD = font(SERIF, 150)
F_TITLE = font(SERIF, 104)
F_SUB = font(SERIF, 72)
F_FLASH = font(SERIF, 110)
F_HANDLE = font(SANS, 30, 700)
F_END = font(SANS, 44, 700)

def text_shadowed(img, xy, text, f, alpha=1.0, anchor='mm', spacing=8):
    if alpha <= 0:
        return
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = xy
    d.multiline_text((x + 6, y + 7), text, font=f, fill=(15, 20, 40, int(190 * alpha)),
                     anchor=anchor, align='center', spacing=spacing)
    sh = layer.filter(ImageFilter.GaussianBlur(3))
    d2 = ImageDraw.Draw(sh)
    d2.multiline_text((x, y), text, font=f, fill=(255, 255, 255, int(255 * alpha)),
                      anchor=anchor, align='center', spacing=spacing)
    img.alpha_composite(sh)

def ig_logo(size, mono=False):
    s = size * 4
    grad = np.zeros((s, s, 3), np.float32)
    yy, xx = np.mgrid[0:s, 0:s] / s
    t = ((xx + (1 - yy)) / 2)[..., None]
    c0, c1, c2 = np.array([254, 218, 117]), np.array([214, 41, 118]), np.array([150, 47, 191])
    grad = np.where(t < 0.5, c0 + (c1 - c0) * t * 2, c1 + (c2 - c1) * (t - 0.5) * 2)
    if mono:
        grad[:] = 255
    mask = Image.new('L', (s, s), 0)
    m = ImageDraw.Draw(mask)
    lw = int(s * 0.09)
    m.rounded_rectangle([lw, lw, s - lw, s - lw], radius=int(s * 0.28), outline=255, width=lw)
    m.ellipse([s * 0.29, s * 0.29, s * 0.71, s * 0.71], outline=255, width=lw)
    m.ellipse([s * 0.70, s * 0.20, s * 0.80, s * 0.30], fill=255)
    logo = Image.fromarray(grad.clip(0, 255).astype(np.uint8)).convert('RGBA')
    logo.putalpha(mask)
    return logo.resize((size, size), Image.LANCZOS)

LOGO_S = ig_logo(56)
LOGO_S_MONO = ig_logo(56, mono=True)
LOGO_L = ig_logo(150)

def watermark(img, top=True, t=0):
    # marca pequena, como no original: em cima à direita, depois embaixo à esquerda
    logo = LOGO_S if int(t * 2) % 3 == 0 else LOGO_S_MONO
    if top:
        x, y = W - 210, 420
        img.alpha_composite(logo, (x - 28 + 0, y))
        ImageDraw.Draw(img).text((x, y + 80), HANDLE, font=F_HANDLE, fill=(255, 255, 255, 235), anchor='mm')
    else:
        x, y = 70, 1150
        img.alpha_composite(logo, (x, y))
        ImageDraw.Draw(img).text((x, y + 80), HANDLE, font=F_HANDLE, fill=(255, 255, 255, 235), anchor='lm')

def glitch(img, t, strength=1.0):
    """Faixas horizontais claras e deslocamento, como no original."""
    a = np.asarray(img).copy()
    r = np.random.default_rng(int(t * FPS) * 13 + 1)
    for _ in range(int(r.integers(1, 4) * strength)):
        y = int(r.integers(0, H - 60)); hh = int(r.integers(8, 45))
        shift = int(r.integers(-60, 60))
        a[y:y + hh] = np.roll(a[y:y + hh], shift, axis=1)
        x0 = int(r.integers(0, W // 2)); x1 = int(r.integers(x0 + 80, W))
        a[y:y + hh // 2, x0:x1, :3] = np.clip(a[y:y + hh // 2, x0:x1, :3].astype(int) + 120, 0, 255)
    return Image.fromarray(a)

def ease(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3

def load_photo(name):
    p = os.path.join(HERE, 'assets', name)
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert('RGB')
    im = im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)
    if im.height < H:
        im = im.resize((int(im.width * H / im.height), H), Image.LANCZOS)
    left = (im.width - W) // 2; top = (im.height - H) // 2
    im = im.crop((left, top, left + W, top + H))
    # tratamento do original: monocromático vermelho, granulado
    g = np.asarray(im.convert('L')).astype(np.float32) / 255
    tint = np.stack([60 + g * 195, 25 + g * 105, 20 + g * 80], -1)
    return tint

PHOTOS = {'pede ajuda': load_photo('flash-porta.jpg'), 'respira': load_photo('flash-respira.jpg')}

def frame(t):
    sc = next(s for s in SCENES if s[0] <= t < s[1]) if t < DUR else SCENES[-1]
    start, end, kind, word, sub, sub_t = sc
    tex_i = int(t * 3)  # textura troca 3 vezes por segundo, como stop motion
    if kind == 'end':
        base = Image.new('RGBA', (W, H), (42, 21, 17, 255))
        a = np.asarray(base).astype(np.float32)
        a[..., :3] += rng.normal(0, 4, (H, W, 1))
        img = Image.fromarray(a.clip(0, 255).astype(np.uint8))
        lt = t - start
        if lt > 0.2:
            al = ease((lt - 0.2) / 0.4)
            logo = LOGO_L.copy(); logo.putalpha(logo.getchannel('A').point(lambda v: int(v * al)))
            img.alpha_composite(logo, (W // 2 - 75, 820))
            ImageDraw.Draw(img).text((W // 2, 1040), HANDLE, font=F_END, fill=(255, 255, 255, int(255 * al)), anchor='mm')
        if lt < 0.6 or int(t * 10) % 17 == 0:
            img = glitch(img.convert('RGB'), t, 1.5).convert('RGBA')
        if t > DUR - 0.12:
            img = Image.blend(img, Image.new('RGBA', (W, H), (0, 0, 0, 255)), (t - (DUR - 0.12)) / 0.12)
        return img.convert('RGB')

    red = kind in ('title', 'flash', 'redblank') or (word in RED_FROM and t >= RED_FROM[word])
    tex = (RED_T if red else BLUE_T)[tex_i % (3 if red else 4)]
    img = tex.convert('RGBA')
    if kind == 'flash':
        ph = PHOTOS.get(word)
        if ph is not None:
            lt = t - start
            z = 1.0 + 0.04 * lt
            base = np.asarray(tex).astype(np.float32)
            p = Image.fromarray(ph.astype(np.uint8)).resize((int(W * z), int(H * z)), Image.LANCZOS)
            ox, oy = (p.width - W) // 2, (p.height - H) // 2
            p = np.asarray(p.crop((ox, oy, ox + W, oy + H))).astype(np.float32)
            mix = 0.78 * (1 - 0.15 * math.sin(t * 9) ** 2)
            img = Image.fromarray((base * (1 - mix) + p * mix).clip(0, 255).astype(np.uint8)).convert('RGBA')
    lt = t - start
    top_mark = t < 9.3 or kind == 'cta'
    watermark(img, top=top_mark, t=t)
    cy = 830
    if kind == 'title':
        text_shadowed(img, (W // 2, 900), word, F_TITLE)
        text_shadowed(img, (W // 2, 1025), sub, F_TITLE)
    elif kind == 'word':
        al = ease(lt / 0.12)
        dy = int(18 * (1 - ease(lt / 0.25)))
        text_shadowed(img, (W // 2, cy + dy), word, F_WORD, al)
        if t >= sub_t:
            sal = ease((t - sub_t) / 0.15)
            nl = sub.count('\n')
            text_shadowed(img, (W // 2, cy + 120 + nl * 40), sub, F_SUB, sal)
    elif kind == 'flash':
        al = ease(lt / 0.1)
        text_shadowed(img, (W // 2, 960), word, F_FLASH, al)
    elif kind == 'cta':
        text_shadowed(img, (W // 2, 930), word, F_SUB)
        if t >= sub_t:
            text_shadowed(img, (W // 2, 1015), sub, F_SUB, ease((t - sub_t) / 0.15))
    out = img.convert('RGB')
    # glitch nas trocas e no título, como no original
    if kind == 'title' and (int(t * 10) % 7 in (0, 1)):
        out = glitch(out, t, 1.5)
    elif lt < 0.1 and kind in ('flash', 'word') and word in {'pede ajuda', 'respira'}:
        out = glitch(out, t, 1.0)
    elif (word in RED_FROM and abs(t - RED_FROM.get(word, -9)) < 0.1) or (red and kind != 'title' and int(t * 10) % 5 == 0):
        out = glitch(out, t, 0.7)
    return out

def main():
    os.makedirs(os.path.join(HERE, 'renders'), exist_ok=True)
    silent = os.path.join(HERE, 'renders', '_video.mp4')
    final = os.path.join(HERE, 'renders', 'pov-border-em-tratamento.mp4')
    n = int(DUR * FPS)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                          '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264',
                          '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', silent],
                         stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frame(i / FPS).tobytes())
        if i % 150 == 0:
            print(f'{i}/{n}')
    p.stdin.close(); p.wait()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', silent,
                    '-i', os.path.join(HERE, 'assets', 'musica-original.m4a'),
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                    '-shortest', '-movflags', '+faststart', final], check=True)
    os.remove(silent)
    print(final)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:  # python3 render.py 4.5 9.6 ... -> quadros de prova
        for s in sys.argv[1:]:
            frame(float(s)).save(os.path.join(HERE, 'renders', f'prova_{s}.png'))
    else:
        main()
