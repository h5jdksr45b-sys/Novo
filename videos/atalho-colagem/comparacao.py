"""Reel curto de comparação (Atalho Hora): o plantão que paga mais pode pagar menos por hora.

Números = os dois exemplos da calculadora (atalho-hora.higgsfield.app), marcados como simulação.
"""
import subprocess
from videos import *

VERDE = PAL['hora']
XA, XB = 290, 790


def txt(s, kind, size, col, strike=None):
    f = font(kind, size)
    w = int(f.getlength(s)) + 40
    im = Image.new('RGBA', (w, int(size * 1.45)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    base = int(size * 1.12)
    d.text((22, base + 4), s, font=f, fill=(0, 0, 0, 80), anchor='ls')
    d.text((20, base), s, font=f, fill=col + (255,), anchor='ls')
    if strike:
        y = int(base - size * 0.36)
        d.line((14, y, w - 14, y), fill=strike + (255,), width=max(4, size // 12))
    return im


def cabeca(nome, valor):
    def draw(d, img, x0, y0):
        d.text((x0 + 210, y0 + 46), nome, font=font('Bold', 34), fill=(110, 100, 90), anchor='mm')
        d.text((x0 + 210, y0 + 118), valor, font=font('anton', 92), fill=INK, anchor='mm')
        d.text((x0 + 210, y0 + 186), '12 horas', font=font('Bold', 34), fill=(110, 100, 90), anchor='mm')
    return card(420, 222, PAPER, radius=24, draw_fn=draw)


def comparacao():
    k = 14
    dur = k * BEAT
    pre = -1.0  # já assentado no primeiro quadro
    items = [
        Item(cabeca('PLANTÃO A', 'R$ 1.500'), XA, 790, t0=pre, frm='pop', rot=-2),
        Item(cabeca('PLANTÃO B', 'R$ 1.800'), XB, 790, t0=pre, frm='pop', rot=2),
    ]
    linhas = [('ida e volta 1h20', 'ida e volta 3h'), ('R$ 60 de carro', 'R$ 150 de carro'), ('recebe em 60 dias', 'recebe em 120 dias')]
    t = 0.75
    for i, (a, b) in enumerate(linhas):
        y = 960 + i * 80
        items.append(Item(tag(a, fill=CREAM, size=34, padx=24, pady=16), XA, y, t0=t, frm='pop', rot=(-2, 1, -1)[i]))
        items.append(Item(tag(b, fill=YELLOW, size=34, padx=24, pady=16), XB, y, t0=t + 0.17, frm='pop', rot=(2, -1, 1)[i]))
        t += 0.5
    t_parece, t_real = 2.75, 3.6
    items += [
        Item(txt('parece', 'Bold', 32, CREAM), XA, 1200, t0=t_parece, frm='pop', shadow=False, sfx=False),
        Item(txt('parece', 'Bold', 32, CREAM), XB, 1200, t0=t_parece, frm='pop', shadow=False, sfx=False),
        Item(txt('R$ 125/h', 'Bold', 50, CREAM, strike=CORAL), XA, 1248, t0=t_parece + 0.05, frm='pop', shadow=False),
        Item(txt('R$ 150/h', 'Bold', 50, CREAM, strike=CORAL), XB, 1248, t0=t_parece + 0.2, frm='pop', shadow=False),
        Item(txt('hora real', 'Bold', 32, CREAM), XA, 1312, t0=t_real, frm='pop', shadow=False, sfx=False),
        Item(txt('hora real', 'Bold', 32, CREAM), XB, 1312, t0=t_real, frm='pop', shadow=False, sfx=False),
        Item(txt('R$ 85', 'anton', 112, YELLOW), XA, 1390, t0=t_real + 0.1, frm='pop', shadow=False),
        Item(txt('R$ 82', 'anton', 112, CORAL), XB, 1390, t0=t_real + 0.45, frm='pop', shadow=False),
        Item(tag('Simulação. Faça a sua conta: link na bio', fill=YELLOW, size=36, padx=30, pady=18), 540, 1500, t0=5.3,
             frm='B', rot=-1),
    ]
    hook_tb = TextBlock('O plantão que *paga mais* / pode pagar *menos por hora.*', 'hook', instant=True, y=140, size=104)
    body = Scene(dur, hook_tb, items)
    end = lockup()
    end.dur = SONG_END - (BEAT0 + OUTRO_BEAT * BEAT) + 0.3
    return [body, end], k


if __name__ == '__main__':
    import os
    os.makedirs(OUT, exist_ok=True)
    scenes, k = comparacao()
    name = 'atalho-hora-comparacao'
    f, tot = render_video(name, VERDE, scenes, OUT)
    mus = f'{OUT}/{name}-musica.wav'
    music_track(k, tot, mus)
    final = f'{OUT}/{name}-com-musica.mp4'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{OUT}/{name}-noaudio.mp4', '-i', mus, '-i', f'{OUT}/{name}.wav',
                    '-filter_complex', '[2:a]volume=12dB[s];[1:a][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
                    '-shortest', '-movflags', '+faststart', final], check=True)
    print(final, round(tot, 2))
