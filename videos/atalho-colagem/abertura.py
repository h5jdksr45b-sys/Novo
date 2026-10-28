"""Abertura genérica da marca Atalho: as quatro cores dos apps e a assinatura."""
import subprocess
from videos import *

COLS = [PAL['plantao'], PAL['hora'], PAL['encaixe'], PAL['post']]
APPS = ['Plantão', 'Hora', 'Encaixe', 'Post']
OBJ = [('stethoscope', 720), ('clock_big', 640), ('armchair', 620), ('magnifier', 760)]


def word(txt, kind, size, col):
    f = font(kind, size)
    im = Image.new('RGBA', (int(f.getlength(txt)) + 60, int(size * 1.5)), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((20, int(size * 1.15)), txt, font=f, fill=col + (255,), anchor='ls')
    return im


def abertura():
    sc = []
    b2 = 2 * BEAT
    for i, (col, app, (obj, h)) in enumerate(zip(COLS, APPS, OBJ)):
        sc.append(Scene(b2, None, [
            Item(P(obj, h), 540, 900, t0=0.0, frm='pop', rot=(-6, 5, -4, -14)[i]),
            Item(word(app, 'serif', 170, YELLOW), 540, 1400, t0=0.08, frm=('L', 'R', 'L', 'R')[i], shadow=False, sfx=False),
        ], bg=col))
    # as quatro peças juntas, uma em cada canto
    pos = [(300, 640), (790, 700), (300, 1180), (790, 1150)]
    sc.append(Scene(b2, None, [Item(P(o, int(h * 0.62)), x, y, t0=0.06 * i, frm='pop', rot=(-6, 5, -4, -14)[i])
                               for i, ((o, h), (x, y)) in enumerate(zip(OBJ, pos))], bg='#1C1830'))
    sc.append(lockup())
    return sc


if __name__ == '__main__':
    scenes = abertura()
    k = len(scenes[:-1]) * 2  # 8 tempos
    if k % 4 == 0:
        scenes[-2].dur += 2 * BEAT
        k += 2
    scenes[-1].dur = SONG_END - (BEAT0 + OUTRO_BEAT * BEAT) + 0.3
    f, tot = render_video('atalho-abertura', '#1C1830', scenes, OUT)
    mus = f'{OUT}/atalho-abertura-musica.wav'
    music_track(k, tot, mus)
    final = f'{OUT}/atalho-abertura-com-musica.mp4'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{OUT}/atalho-abertura-noaudio.mp4', '-i', mus,
                    '-i', f'{OUT}/atalho-abertura.wav', '-filter_complex',
                    '[2:a]volume=12dB[s];[1:a][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                    '-shortest', '-movflags', '+faststart', final], check=True)
    print(final, round(tot, 2))
