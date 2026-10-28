"""Etiqueta Errada: videoclipe de colagem (verso 1 + refrão, 46,4 s).

Uso: python3 clip.py stills  -> quadro final de cada cena (Gate 2)
     python3 clip.py video   -> MP4 com a música
Os cortes de cena caem no começo das linhas da letra (faixa de legenda do m4a do Suno).
"""
import sys, subprocess
from PIL import Image, ImageDraw
from engine import *

OUT = f'{ROOT}/out'
MUSIC = f'{ROOT}/etiqueta-errada-corte.m4a'
TOTAL = 46.4
# início das cenas no corte (linhas 1, 3, 5, 7, 9, 11, 13 e 15 da letra, -15,85 s)
CUTS = [0.0, 5.294, 10.879, 16.224, 21.73, 26.916, 32.661, 37.767, TOTAL]
BEAT = 0.68  # 88 BPM, uma linha = 4 tempos

COL = ['#B8392B', '#C9971C', '#6E1F2E', '#155E75', '#2F6B3F', '#4A2C82', '#C2571A', '#2340A0']
INKC = INK


def P(name, h=None, w=None):
    return scaled(piece(name), h=h, w=w)


def tag(txt, fill=YELLOW, fg=INK, size=46, kind='sans', padx=34, pady=22, radius=12):
    f = font(kind, size)
    tw = int(f.getlength(txt))
    w, h = tw + 2 * padx, int(size * 1.15) + 2 * pady

    def draw(d, img, x0, y0):
        d.text((x0 + w / 2, y0 + h / 2 + 2), txt, font=f, fill=fg, anchor='mm')
    return card(w, h, fill, radius=radius, draw_fn=draw)


def big(markup, y=150, size=124, hl=None, instant=False, t0=0.0):
    return TextBlock(markup, 'hook', y=y, size=size, hl=hl, instant=instant, t0=t0, center=True, maxw=940)


def small(markup, y, t0=0.3, size=50, hl=None):
    return TextBlock(markup, 'body', y=y, size=size, t0=t0, hl=hl, center=True, maxw=900)


def b(n):
    return n * BEAT


def scenes():
    S = []
    # 1. Sexta à noite, ele puxa o braço dela
    S.append(Scene(CUTS[1] - CUTS[0], [
        TextBlock('ELE CONTROLA, / AMEAÇA E ISOLA. / E CHAMAM DE *BORDERLINE.*', 'hook', y=150, size=90, instant=True, center=True, maxw=1010)], [
        Item(P('crowd', h=400), 470, 900, t0=-1, frm='B', z=0),
        Item(P('speaker', h=520), 880, 960, t0=b(0.75), frm='R', rot=4, z=1),
        Item(P('woman', h=640), 360, 1200, t0=-1, frm='L', rot=-2, z=2),
        Item(P('grip', h=560), 690, 1230, t0=b(2), frm='drop', rot=-6, z=3),
    ]))
    # 2. Mexe no celular dela, escolhe roupa e amizade
    S.append(Scene(CUTS[2] - CUTS[1], [
        big('*CUIDADO?*', y=150, size=170, hl=CREAM),
        small('escolhe a roupa, as amigas e lê o celular dela', y=390, t0=b(1))], [
        Item(P('dress', h=760), 320, 1120, t0=b(0.5), frm='L', rot=-4, z=0),
        Item(P('photo1', h=250), 620, 860, t0=b(1.5), frm='pop', rot=6, z=1, exit_at=b(5.5), exit_to='R'),
        Item(P('photo2', h=250), 820, 1020, t0=b(2), frm='pop', rot=-5, z=1, exit_at=b(6), exit_to='R'),
        Item(P('photo3', h=250), 650, 1170, t0=b(2.5), frm='pop', rot=3, z=1, exit_at=b(6.5), exit_to='R'),
        Item(P('phone_hand', h=600), 740, 1250, t0=b(3.5), frm='B', rot=-8, z=2),
        Item(P('heart_lock', h=380), 500, 1080, t0=b(5), frm='drop', rot=-6, z=4),
    ]))
    # 3. Segunda ele chora e traz flor; terça já tá ameaçando
    S.append(Scene(CUTS[3] - CUTS[2], [
        big('SEGUNDA, FLOR. / TERÇA, *AMEAÇA.*', y=150, size=120)], [
        Item(P('cal1', h=330), 250, 720, t0=b(0.5), frm='T', rot=-5, z=0),
        Item(tag('SEGUNDA', fill=CREAM, size=40), 250, 610, t0=b(1), frm='pop', rot=-5, z=5),
        Item(P('open_hand', w=560), 640, 1340, t0=b(1.5), frm='R', rot=-3, z=2),
        Item(P('bouquet', h=760), 520, 1090, t0=b(2.5), frm='drop', rot=8, z=3),
        Item(P('cal2', h=330), 830, 740, t0=b(4), frm='T', rot=4, z=1),
        Item(tag('TERÇA', fill=YELLOW, size=40), 830, 630, t0=b(4.5), frm='pop', rot=4, z=5),
    ]))
    # 4. A vizinha comenta, o primo manda um vídeo: esse aí é borderline
    S.append(Scene(CUTS[4] - CUTS[3], [
        big('A VIZINHA COMENTA. / O PRIMO *MANDA.*', y=150, size=112)], [
        Item(P('phone_a', h=470), 230, 1060, t0=b(0.5), frm='B', rot=-6, z=0),
        Item(P('phone_b', h=470), 540, 1000, t0=b(1.25), frm='B', rot=2, z=1),
        Item(P('phone_c', h=470), 850, 1060, t0=b(2), frm='B', rot=6, z=0),
        Item(P('point_r', w=420), 220, 1440, t0=b(3), frm='L', rot=-4, z=2),
        Item(P('point_l', w=420), 820, 1420, t0=b(3.5), frm='R', rot=4, z=2),
        Item(tag('ESSE AÍ É BORDERLINE', size=50), 540, 1290, t0=b(5), frm='drop', rot=-3, z=4),
    ]))
    # 5. Colaram a etiqueta errada
    S.append(Scene(CUTS[5] - CUTS[4], [
        big('ETIQUETA *ERRADA.*', y=150, size=136),
        small('o nome disso é outro', y=330, t0=b(4))], [
        Item(P('chain', h=420), 760, 1240, t0=b(0.25), frm='R', rot=8, z=0),
        Item(P('bottle', h=640), 380, 1060, t0=b(1), frm='L', rot=-3, z=1),
        Item(tag('BORDERLINE', size=50), 380, 1040, t0=b(2.5), frm='drop', rot=-4, z=2, exit_at=b(6.8), exit_to='R'),
        Item(P('pinch', h=380), 610, 820, t0=b(2), frm='T', rot=-10, z=3, exit_at=b(3.5), exit_to='T'),
        Item(P('peel', h=320), 720, 1010, t0=b(5.5), frm='R', rot=-6, z=3),
    ]))
    # 6. Quem vigia, ameaça, isola e humilha: isso tem nome na lei
    cards = [('binoculars', 'VIGIA', 270, 700), ('megaphone', 'AMEAÇA', 810, 700),
             ('door', 'ISOLA', 270, 1230), ('point_down', 'HUMILHA', 810, 1230)]
    items = []
    for k, (pn, word, x, y) in enumerate(cards):
        items.append(Item(P(pn, h=330), x, y, t0=b(0.5 + k), frm='pop', rot=(-1) ** k * 4, z=k))
        items.append(Item(tag(word, fill=CREAM, size=40), x, y + 190, t0=b(0.75 + k), frm='pop', rot=(-1) ** k * -3, z=5))
    items.append(Item(P('gavel', w=470), 545, 1000, t0=b(5.5), frm='drop', rot=-12, z=8))
    S.append(Scene(CUTS[6] - CUTS[5], [
        big('TEM NOME *NA LEI.*', y=150, size=130),
        small('violência psicológica é crime', y=320, t0=b(5.5))], items))
    # 7. Refrão: não é diagnóstico; cada vez que erra o nome, alguém real se isola
    def walk(it, t, st):
        if t > it.t0 + it.dur + b(2):
            q = clamp((t - it.t0 - it.dur - b(2)) / 1.6)
            st['x'] += (-1 if it.frm == 'B' and it.x < 540 else 1) * 260 * ease_in_out(q)
        return st
    S.append(Scene(CUTS[7] - CUTS[6], [
        big('NÃO É *DIAGNÓSTICO.*', y=150, size=124),
        small('cada nome errado isola alguém real', y=320, t0=b(4))], [
        Item(P('walk_left', h=520), 330, 1180, t0=b(0.25), frm='B', z=0, fn=walk),
        Item(P('walk_right', h=520), 760, 1180, t0=b(0.5), frm='B', z=0, fn=walk),
        Item(P('woman_back', h=700), 540, 1090, t0=b(1.5), frm='drop', z=2),
        Item(tag('BORDERLINE', size=44), 540, 900, t0=b(3), frm='drop', rot=-6, z=3),
    ]))
    # 8. Não é vilão de novela; é gente na fila do CAPS esperando a vez dela
    S.append(Scene(TOTAL - CUTS[7], [
        big('NÃO É VILÃO / DE *NOVELA.*', y=150, size=124, t0=0),
        ], [
        Item(P('tv', w=620), 540, 900, t0=b(0.25), frm='pop', rot=-3, z=3, exit_at=b(4), exit_to='T'),
        Item(P('queue', w=980), 540, 1080, t0=b(4.25), frm='B', z=1),
        Item(P('ticket_hand', h=360), 760, 1400, t0=b(5.5), frm='R', rot=-8, z=4),
    ], overlays=[]))
    return S


class Swap:
    """Troca o texto do topo da cena 8 no meio dela."""


def scene8_text(sc):
    a = sc.text[0]
    later = big('É GENTE NA FILA / DO *CAPS.*', y=150, size=130, t0=b(4.25))
    cta = small('manda pra quem ainda usa *borderline* como xingamento', y=500, t0=b(9.5), size=46)

    def draw_text(frame, lt, tq):
        pass
    sc.text = [_Until(a, b(4.25)), later, cta]


class _Until:
    def __init__(self, tb, t1):
        self.tb, self.t1 = tb, t1

    def draw(self, frame, t):
        if t < self.t1:
            self.tb.draw(frame, t)


def build():
    S = scenes()
    for sc, c in zip(S, COL):
        sc.bg = c
    scene8_text(S[7])
    return S


def stills():
    S = build()
    tiles = []
    for i, sc in enumerate(S):
        bg = paper_bg(hexrgb(sc.bg))
        t = sc.dur - 0.05
        tq = math.floor(t * STEP + 1e-6) / STEP
        fr = bg.copy()
        for it in sorted(sc.items, key=lambda i: i.z):
            st = it.state(tq)
            if not st:
                continue
            img = it.render_img(st['scale'], st['rot'], st['extra'])
            paste(fr, img, int(st['x'] - img.width / 2), int(st['y'] - img.height / 2))
        for tb in sc.text:
            tb.draw(fr, t)
        fr = fr.convert('RGB')
        fr.save(f'{OUT}/still-{i + 1}.jpg', quality=90)
        tiles.append(fr.resize((360, 640), Image.LANCZOS))
    # quadro 0 (primeiro quadro do vídeo)
    sheet = Image.new('RGB', (4 * 360 + 5 * 12, 2 * 640 + 3 * 12), (20, 20, 20))
    for i, t in enumerate(tiles):
        sheet.paste(t, (12 + (i % 4) * 372, 12 + (i // 4) * 652))
    sheet.save(f'{OUT}/still-contact-sheet.jpg', quality=88)


def video():
    S = build()
    final, total = render_video('etiqueta-errada-sfx', COL[0], S, OUT)
    # música + sons de papel baixos, -14 LUFS
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{OUT}/etiqueta-errada-sfx-noaudio.mp4',
                    '-i', MUSIC, '-i', f'{OUT}/etiqueta-errada-sfx.wav', '-filter_complex',
                    '[2:a]volume=0.8[s];[1:a][s]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
                    '-movflags', '+faststart', f'{OUT}/etiqueta-errada.mp4'], check=True)
    print(f'{OUT}/etiqueta-errada.mp4', total)


if __name__ == '__main__':
    {'stills': stills, 'video': video}[sys.argv[1]]()
