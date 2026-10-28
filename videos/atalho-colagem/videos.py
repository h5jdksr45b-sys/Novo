"""Os 4 vídeos de colagem dos apps Atalho. Uso: python3 videos.py [plantao|hora|encaixe|post]"""
import sys, math
from PIL import Image, ImageDraw
from engine import *

OUT = f'{ROOT}/out'
PAL = {'plantao': '#4A2C82', 'hora': '#1E7A55', 'encaixe': '#155E75', 'post': '#7B2D5E'}
PAPER = (250, 246, 238)
GREEN_OK = (107, 191, 138)
CORAL = (226, 96, 80)


def P(name, h):
    return scaled(piece(name), h=h)


def tag(txt, fill=YELLOW, fg=INK, size=46, kind='sans', padx=34, pady=22, radius=16):
    f = font(kind, size)
    tw = int(f.getlength(txt))
    w, h = tw + 2 * padx, size + 2 * pady

    def draw(d, img, x0, y0):
        d.text((x0 + w / 2, y0 + h / 2 + 2), txt, font=f, fill=fg, anchor='mm')
    return card(w, h, fill, radius=radius, draw_fn=draw)


def hook(markup):
    return TextBlock(markup, 'hook', instant=True, y=150, size=132)


def body(markup):
    return TextBlock(markup, 'body', t0=0.0, y=170)


def lockup(app, color, t_icon=None):
    """Tela final com o nome do app."""
    def ov(frame, lt, tq):
        pass
    a = font('anton', 190)
    s = font('serif', 150)
    w1 = int(a.getlength('ATALHO'))
    w2 = int(s.getlength(app))
    name1 = Image.new('RGBA', (w1 + 30, 240), (0, 0, 0, 0))
    ImageDraw.Draw(name1).text((10, 200), 'ATALHO', font=a, fill=CREAM + (255,), anchor='ls')
    name2 = Image.new('RGBA', (w2 + 40, 220), (0, 0, 0, 0))
    ImageDraw.Draw(name2).text((14, 160), app, font=s, fill=YELLOW + (255,), anchor='ls')
    items = [Item(name1, 540, 800, t0=0.05, frm='L', shadow=False),
             Item(name2, 560, 975, t0=0.3, frm='R', shadow=False),
             Item(tag('em breve', fill=CREAM, size=44), 540, 1180, t0=0.6, frm='pop')]
    return Scene(2.2, None, items)


# ======================= 1. PLANTÃO =======================
def plantao():
    sc = []
    t1 = 'Você fez / o plantão. / O dinheiro / *caiu?*'
    sc.append(Scene(3.6, hook(t1), [
        Item(P('env_open', 560), 520, 1230, t0=0.35, frm='B', rot=-4),
        Item(P('stethoscope', 600), 620, 1060, t0=0.9, frm='drop', rot=-10, z=2),
    ]))
    t2 = 'Três hospitais, três datas de pagamento e um depósito que veio *pela metade.*'
    sc.append(Scene(read_time(t2), body(t2), [
        Item(P('hosp2', 470), 225, 1060, t0=0.3, frm='B'),
        Item(P('hosp1', 360), 560, 1120, t0=0.5, frm='B', z=1),
        Item(P('hosp3', 210), 850, 1195, t0=0.7, frm='B', z=2),
        Item(tag('dia 5'), 220, 760, t0=1.1, frm='pop', rot=-5, z=3),
        Item(tag('dia 20'), 560, 880, t0=1.35, frm='pop', rot=4, z=3),
        Item(tag('dia 30'), 860, 1010, t0=1.6, frm='pop', rot=-3, z=3),
        Item(P('note_l', 250), 430, 1490, t0=2.3, frm='drop', rot=8, z=4),
        Item(P('note_r', 250), 690, 1510, t0=2.45, frm='drop', rot=-12, z=4),
    ]))
    t3 = 'A conta fica *na cabeça,* no print da escala ou numa nota do celular.'
    sc.append(Scene(read_time(t3), body(t3), [
        Item(P('head', 720), 330, 1180, t0=0.2, frm='L'),
        Item(P('crumple', 230), 790, 860, t0=0.9, frm='pop', z=2),
        Item(P('sticky', 270), 800, 1180, t0=1.25, frm='R', rot=7, z=2),
        Item(tag('escala?', fill=CREAM, size=42), 770, 1420, t0=1.6, frm='pop', rot=-4, z=3),
    ]))
    t4 = 'Quando atrasa, você nem sabe direito *quanto cobrar.*'
    rec = P('receipt', 760)

    def rec_maker(k):
        k = 1.0 if k is None else k
        h = max(20, int(rec.height * k))
        im = rec.crop((0, 0, rec.width, h)).copy()
        if k >= 1:
            d = ImageDraw.Draw(im)
            d.text((im.width / 2 - 10, im.height * 0.42), '?', font=font('anton', 260), fill=INK + (255,), anchor='mm')
        return im
    top = 820

    def rec_fn(it, t, st):
        k = clamp((t - it.t0 - 0.2) / 1.0)
        k = round(k * 8) / 8
        st['extra'] = k
        st['y'] = top + rec.height * k / 2
        return st
    sc.append(Scene(read_time(t4) + 0.4, body(t4), [
        Item(P('clock_plain', 480), 320, 1090, t0=0.2, frm='L', rot=-6),
        Item(rec, 760, 1200, t0=0.6, frm='pop', maker=rec_maker, fn=rec_fn, z=2),
    ]))
    t5 = 'O *Atalho Plantão* mostra em uma tela o que entrou, o que falta e o que venceu.'
    rows = [('Entrou', GREEN_OK, 0.78), ('Falta', YELLOW, 0.46), ('Venceu', CORAL, 0.22)]

    def panel_maker(k):
        k = 1.0 if k is None else k

        def draw(d, img, x0, y0):
            d.text((x0 + 48, y0 + 70), 'Atalho Plantão', font=font('serif', 54), fill=INK, anchor='ls')
            for i, (lab, col, v) in enumerate(rows):
                yy = y0 + 150 + i * 130
                d.text((x0 + 48, yy), lab, font=font('Bold', 40), fill=INK, anchor='lm')
                bx, bw = x0 + 260, 400
                d.rounded_rectangle((bx, yy - 22, bx + bw, yy + 22), 22, fill=(225, 218, 205))
                kk = clamp(k * 3 - i)
                if kk > 0:
                    d.rounded_rectangle((bx, yy - 22, bx + max(44, int(bw * v * kk)), yy + 22), 22, fill=col)
        return card(720, 520, PAPER, radius=30, draw_fn=draw)

    def panel_fn(it, t, st):
        st['extra'] = round(clamp((t - it.t0 - 0.45) / 1.2) * 12) / 12
        return st
    sc.append(Scene(read_time(t5), body(t5), [
        Item(P('hosp2', 190), 180, 880, t0=0.15, frm='T', rot=-3, z=1),
        Item(P('hosp1', 160), 430, 890, t0=0.25, frm='T', rot=2, z=1),
        Item(P('hosp3', 110), 750, 910, t0=0.35, frm='T', rot=-2, z=1),
        Item(None, 540, 1300, t0=0.3, frm='B', maker=panel_maker, fn=panel_fn, z=2),
    ]))
    t6 = 'Em breve. Entre na lista de acesso antecipado pelo *link da bio.*'
    sc.append(Scene(read_time(t6), body(t6), [
        Item(P('env_sealed', 470), 540, 1130, t0=0.25, frm='R', rot=-4),
        Item(tag('lista de acesso antecipado', fill=YELLOW, size=40), 540, 1440, t0=0.9, frm='pop', rot=-2, z=2),
    ]))
    sc.append(lockup('Plantão', PAL['plantao']))
    return sc


# ======================= 2. HORA =======================
def hora():
    sc = []
    clock = P('clock_big', 640)
    t1 = 'Seu plantão / de 12 horas / paga quanto / *por hora?*'
    sc.append(Scene(3.8, hook(t1), [
        Item(clock, 540, 1290, t0=0.3, frm='pop'),
        Item(P('coin', 210), 540, 1290, t0=1.0, frm='drop', z=2),
    ]))
    t2 = 'A conta mais comum é *dividir o valor por 12.*'

    def cut_maker(k):
        k = 12 if k is None else k
        im = clock.copy()
        d = ImageDraw.Draw(im)
        cx, cy, r = im.width / 2, im.height / 2, im.width * 0.43
        for i in range(k):
            a = math.radians(i * 30 - 90)
            d.line((cx, cy, cx + r * math.cos(a), cy + r * math.sin(a)), fill=CREAM + (255,), width=9)
        d.ellipse((cx - 16, cy - 16, cx + 16, cy + 16), fill=YELLOW + (255,))
        return im

    def cut_fn(it, t, st):
        st['extra'] = int(clamp((t - 0.6) / 1.6) * 12)
        return st
    sc.append(Scene(read_time(t2) + 0.6, body(t2), [
        Item(clock, 520, 1200, t0=0.15, frm='pop', maker=cut_maker, fn=cut_fn),
        Item(P('scissors_a', 430), 900, 1560, t0=0.4, frm='R', rot=-35, z=2),
        Item(tag('÷ 12', fill=YELLOW, size=64, kind='anton'), 200, 880, t0=1.9, frm='pop', rot=-6, z=3),
    ]))

    def wedge_img(r=420, frac=1.0):
        pad = 20
        im = Image.new('RGBA', (2 * r + 2 * pad, 2 * r + 2 * pad), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        box = (pad, pad, pad + 2 * r, pad + 2 * r)
        d.pieslice(box, -90, -90 + 360 / 12 * 2, fill=CREAM + (255,))
        rr = r * frac
        box2 = (pad + r - rr + 10, pad + r - rr + 10, pad + r + rr - 10, pad + r + rr - 10)
        d.pieslice(box2, -90, -90 + 360 / 12 * 2, fill=YELLOW + (255,))
        return add_grain(im, 5)
    t3 = 'Ficam de fora o deslocamento, a espera, o imposto e *o atraso no pagamento.*'
    sc.append(Scene(read_time(t3), body(t3), [
        Item(wedge_img(), 400, 1330, t0=0.15, frm='pop', z=1),
        Item(P('car', 200), 300, 870, t0=0.6, frm='L', z=2),
        Item(P('chair_plastic', 330), 860, 1000, t0=0.9, frm='R', z=2),
        Item(P('form', 380), 240, 1450, t0=1.2, frm='L', rot=-7, z=2),
        Item(P('hourglass_h', 380), 830, 1460, t0=1.5, frm='R', rot=5, z=2),
    ]))
    t4 = 'Com isso tudo na conta, a hora real costuma ser *menor do que parece.*'

    def shrink_maker(k):
        k = 1.0 if k is None else k
        return wedge_img(frac=k)

    def shrink_fn(it, t, st):
        st['extra'] = round(1 - 0.45 * clamp((t - 0.8) / 1.4) * 1, 2)
        st['extra'] = round(st['extra'] * 12) / 12
        return st
    sc.append(Scene(read_time(t4) + 0.4, body(t4), [
        Item(None, 380, 1380, t0=0.1, frm='pop', maker=shrink_maker, fn=shrink_fn, z=1),
        Item(P('scissors_a', 400), 880, 1000, t0=0.5, frm='R', rot=-120, z=2),
        Item(tag('parecia', fill=CREAM, size=46), 820, 1300, t0=1.0, frm='pop', rot=4, z=3),
        Item(tag('hora real', fill=YELLOW, size=46), 300, 1520, t0=2.2, frm='pop', rot=-4, z=3),
    ]))
    t5 = 'O *Atalho Hora* faz essa conta em 1 minuto, de graça.'
    sc.append(Scene(read_time(t5), body(t5), [
        Item(P('stopwatch', 600), 400, 1220, t0=0.2, frm='L', rot=-5),
        Item(tag('1 min', fill=CREAM, size=110, kind='anton', padx=44, pady=26), 800, 1000, t0=0.8, frm='pop', rot=6, z=2),
        Item(tag('grátis', fill=YELLOW, size=56), 820, 1390, t0=1.2, frm='pop', rot=-4, z=2),
    ]))
    t6 = 'Comente *HORA* e receba o link quando abrir.'
    bub = P('bubble_cream', 560)

    def bub_maker(_):
        im = bub.copy()
        ImageDraw.Draw(im).text((im.width / 2, im.height * 0.42), 'HORA', font=font('anton', 190), fill=INK + (255,), anchor='mm')
        return im
    sc.append(Scene(read_time(t6) + 0.3, body(t6), [
        Item(None, 540, 1150, t0=0.2, frm='pop', maker=bub_maker),
    ]))
    sc.append(lockup('Hora', PAL['hora']))
    return sc


# ======================= 3. ENCAIXE =======================
def encaixe():
    sc = []
    t1 = 'A paciente / desmarcou às 8h. / O horário das 14h / *ficou vazio.*'

    def struck(_):
        im = tag('8h', fill=CREAM, size=62, kind='anton')
        d = ImageDraw.Draw(im)
        d.line((18, im.height * 0.62, im.width - 18, im.height * 0.38), fill=CORAL + (255,), width=10)
        return im

    def slot(_):
        def draw(d, img, x0, y0):
            d.text((x0 + 36, y0 + 60), '14h', font=font('anton', 62), fill=INK, anchor='lm')
            for x in range(x0 + 150, x0 + 330, 28):
                d.line((x, y0 + 86, x + 14, y0 + 86), fill=(120, 110, 100), width=5)
        return card(360, 120, YELLOW, radius=16, draw_fn=draw)
    sc.append(Scene(4.4, TextBlock(t1, 'hook', instant=True, y=150, size=104), [
        Item(P('armchair', 460), 380, 1170, t0=0.3, frm='B'),
        Item(P('lamp', 600), 830, 1120, t0=0.55, frm='R', z=1),
        Item(None, 250, 1470, t0=1.1, frm='pop', rot=-6, maker=struck, z=2),
        Item(None, 640, 1480, t0=1.5, frm='pop', rot=3, maker=slot, z=2),
    ]))
    t2 = 'Tinha gente querendo *antecipar a consulta.*'
    sc.append(Scene(read_time(t2) + 0.5, body(t2), [
        Item(P('woman', 800), 250, 1230, t0=0.2, frm='L'),
        Item(P('man', 820), 540, 1215, t0=0.5, frm='L', z=1),
        Item(P('older', 800), 820, 1230, t0=0.8, frm='L', z=2),
    ]))
    t3 = 'Só que o nome estava / *perdido* no meio / das conversas / do WhatsApp.'

    def namecard(_):
        im = P('namecard', 190).copy()
        ImageDraw.Draw(im).text((im.width / 2, im.height / 2), 'quero antecipar', font=font('Bold', 44), fill=INK + (255,), anchor='mm')
        return im
    sc.append(Scene(read_time(t3), body(t3), [
        Item(None, 540, 1150, t0=0.2, frm='pop', maker=namecard),
        Item(P('bubble_green', 210), 430, 1040, t0=1.0, frm='L', rot=-6, z=2),
        Item(P('bubble_cream2', 210), 650, 1170, t0=1.25, frm='R', rot=5, z=3),
        Item(P('bubble_grey', 210), 470, 1290, t0=1.5, frm='L', rot=3, z=4),
        Item(P('bubble_green', 200), 640, 1410, t0=1.75, frm='R', rot=-4, z=5),
        Item(P('bubble_cream2', 200), 520, 1110, t0=2.0, frm='T', rot=-8, z=6),
    ]))
    t4 = 'Uma vaga vazia é uma consulta *que não volta.*'
    sc.append(Scene(read_time(t4) + 0.5, body(t4), [
        Item(P('armchair', 520), 390, 1230, t0=0.2, frm='L'),
        Item(P('hourglass_e', 560), 830, 1180, t0=0.6, frm='drop', rot=4, z=1),
    ]))
    t5 = 'O *Atalho Encaixe* guarda a fila de espera e mostra quem chamar primeiro.'

    def num(n):
        return tag(str(n), fill=YELLOW, size=58, kind='anton', padx=26, pady=12, radius=30)

    def walk(it, t, st):
        k = ease_in_out(clamp((t - 2.4) / 0.9))
        st['x'] = it.x + (700 - it.x) * k
        st['y'] = it.y + (it.y - 0) * 0
        return st
    sc.append(Scene(read_time(t5) + 1.2, body(t5), [
        Item(P('armchair', 420), 900, 1340, t0=0.15, frm='R'),
        Item(P('older', 520), 150, 1300, t0=0.4, frm='L', z=1),
        Item(P('man', 540), 340, 1290, t0=0.55, frm='L', z=2),
        Item(P('woman', 520), 540, 1300, t0=0.7, frm='L', z=3, fn=walk),
        Item(num(3), 150, 960, t0=1.2, frm='pop', z=4),
        Item(num(2), 340, 940, t0=1.4, frm='pop', z=4),
        Item(num(1), 540, 960, t0=1.6, frm='pop', z=4, fn=walk),
    ]))
    t6 = 'Em breve. Mande este post para *quem cuida da sua agenda.*'
    sc.append(Scene(read_time(t6), body(t6), [
        Item(P('planner', 620), 520, 1210, t0=0.2, frm='L', rot=-6, exit_at=read_time(t6) - 0.6, exit_to='R'),
    ]))
    sc.append(lockup('Encaixe', PAL['encaixe']))
    return sc


# ======================= 4. POST =======================
def caption_strip(bars=(0.92, 0.8, 0.66, 0.85), hl=None, gap=None, w=820):
    rows = len(bars)
    h = 80 + rows * 64

    def draw(d, img, x0, y0):
        for i, b in enumerate(bars):
            yy = y0 + 54 + i * 64
            x1 = x0 + 50 + (w - 100) * b
            if hl and hl[0] == i:
                a, bb, k = hl[1], hl[2], hl[3]
                hx0 = x0 + 50 + (w - 100) * a
                hx1 = hx0 + ((w - 100) * (bb - a)) * k
                d.rounded_rectangle((hx0 - 8, yy - 24, hx1 + 8, yy + 24), 8, fill=YELLOW)
            if gap and gap[0] == i:
                ga, gb = x0 + 50 + (w - 100) * gap[1], x0 + 50 + (w - 100) * gap[2]
                d.rounded_rectangle((x0 + 50, yy - 9, ga - 10, yy + 9), 9, fill=(150, 142, 132))
                d.rounded_rectangle((gb + 10, yy - 9, x1, yy + 9), 9, fill=(150, 142, 132))
                continue
            d.rounded_rectangle((x0 + 50, yy - 9, x1, yy + 9), 9, fill=(150, 142, 132))
    return card(w, h, PAPER, radius=24, draw_fn=draw)


def post():
    sc = []
    t1 = 'Você tirou a promessa / da legenda. / A imagem continua / *prometendo.*'

    def strip_fn(it, t, st):
        st['extra'] = 1 if t >= 1.4 else 0
        return st

    def strip_maker(k):
        im = caption_strip(bars=(0.9, 0.7), w=640)
        if k:
            d = ImageDraw.Draw(im)
            d.line((30, im.height * 0.62, im.width - 30, im.height * 0.38), fill=CORAL + (255,), width=12)
        return im
    sc.append(Scene(4.4, TextBlock(t1, 'hook', instant=True, y=150, size=104), [
        Item(P('photo_serum', 600), 430, 1230, t0=0.3, frm='B', rot=-3),
        Item(None, 600, 1460, t0=0.7, frm='R', rot=2, maker=strip_maker, fn=strip_fn, exit_at=2.0, exit_to='L', z=2),
        Item(P('star', 230), 640, 1020, t0=2.5, frm='pop', rot=12, z=3),
    ]))
    t2 = 'Antes e depois, depoimento e repost também entram *na sua publicidade.*'
    sc.append(Scene(read_time(t2), body(t2), [
        Item(P('split_photo', 470), 320, 960, t0=0.2, frm='L', rot=-4),
        Item(P('quote_bubble', 360), 770, 1200, t0=0.6, frm='R', rot=4, z=1),
        Item(P('repost', 330), 330, 1440, t0=1.0, frm='B', rot=-6, z=2),
    ]))
    t3 = 'A regra existe, mas ler o manual inteiro antes de cada post *não acontece.*'
    sc.append(Scene(read_time(t3), body(t3), [
        Item(P('book', 420), 540, 1420, t0=0.2, frm='B'),
        Item(P('paper_stack', 560), 520, 1000, t0=0.7, frm='T', rot=-2, z=1),
        Item(P('glasses', 190), 760, 1560, t0=1.3, frm='R', rot=-8, z=2),
    ]))
    t4 = 'O *Atalho Post* lê a legenda e marca o trecho que pode dar problema.'

    def hl_maker(k):
        k = 0 if k is None else k
        return caption_strip(hl=(2, 0.18, 0.6, k) if k > 0 else None)

    def hl_fn(it, t, st):
        st['extra'] = round(clamp((t - 1.3) / 0.8) * 8) / 8
        return st
    sc.append(Scene(read_time(t4) + 0.4, body(t4), [
        Item(None, 540, 1150, t0=0.2, frm='B', maker=hl_maker, fn=hl_fn),
        Item(P('magnifier', 560), 820, 1420, t0=0.6, frm='R', rot=-20, z=2),
    ]))
    t5 = 'O app explica o motivo e *sugere outra forma de escrever.*'
    W_ = 820
    seg_w = int((W_ - 100) * 0.42)

    def seg(fill):
        return card(seg_w, 36, fill, radius=12, keyline=6)

    def fall(it, t, st):
        if t >= 1.6:
            k = clamp((t - 1.6) / 0.6)
            st['y'] += 900 * k * k
            st['rot'] += 40 * k
        return st
    sx = 540 - (W_ + 20) / 2 + 10 + 50 + (W_ - 100) * 0.18 + seg_w / 2
    sy = 1150 - (80 + 4 * 64 + 20) / 2 + 10 + 54 + 2 * 64
    sc.append(Scene(read_time(t5) + 0.6, body(t5), [
        Item(caption_strip(gap=(2, 0.18, 0.6)), 540, 1150, t0=0.0, frm='pop', boil=True, sfx=False),
        Item(seg(YELLOW), sx, sy, t0=0.0, frm='pop', fn=fall, z=1, sfx=False),
        Item(P('scissors_b', 420), 900, 1450, t0=0.5, frm='R', rot=-30, z=3),
        Item(seg(GREEN_OK), sx, sy, t0=2.4, frm='T', z=2),
        Item(tag('outra forma', fill=CREAM, size=44), 420, 1460, t0=2.9, frm='pop', rot=-3, z=4),
    ]))
    t6 = 'Em breve. *Salve este post* para lembrar antes de publicar.'
    sc.append(Scene(read_time(t6), body(t6), [
        Item(P('photo_serum', 560), 450, 1200, t0=0.2, frm='L', rot=-4),
        Item(P('bookmark', 600), 720, 1050, t0=0.7, frm='T', z=2),
    ]))
    sc.append(lockup('Post', PAL['post']))
    return sc


BUILD = {'plantao': plantao, 'hora': hora, 'encaixe': encaixe, 'post': post}

if __name__ == '__main__':
    import os
    os.makedirs(OUT, exist_ok=True)
    for name in sys.argv[1:] or BUILD:
        f, tot = render_video(f'atalho-{name}', PAL[name], BUILD[name](), OUT)
        print(f, round(tot, 2))
