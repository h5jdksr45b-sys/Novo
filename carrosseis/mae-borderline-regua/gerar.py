import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(D, 'fontes')
W, H, M = 1080, 1350, 70
OFF, RED = (245, 239, 230), (192, 57, 43)
FONT = os.path.join(F, 'DMSerifDisplay-Regular.ttf')
CAPA = os.path.join(F, 'capa.png')
PROVISORIO = not os.path.exists(CAPA)
log = []

def cover(im):
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((l, t, l + W, t + H))

def darken(im, k):
    return Image.eval(im, lambda v: int(v * (1 - k)))

def top_gradient(im, a_top, end):
    ov = Image.new('L', (W, H), 0)
    px = ov.load()
    for y in range(int(H * end)):
        a = int(255 * a_top * (1 - y / (H * end)) ** 1.4)
        for x in range(W): px[x, y] = a
    return Image.composite(Image.new('RGB', (W, H)), im, ov)

def bg_foto(nome, a=.75, end=.55, desce=0):
    im = cover(Image.open(os.path.join(F, nome)).convert('RGB'))
    if desce:
        # desce a foto para a cabeça da pessoa não ficar sob o texto; o topo vira extensão espelhada e desfocada, coberta pelo gradiente
        topo = im.crop((0, 0, W, desce)).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(25))
        novo = Image.new('RGB', (W, H)); novo.paste(im, (0, desce)); novo.paste(topo, (0, 0)); im = novo
    return top_gradient(darken(im, .35), a, end)

def capa_baixo():
    src = CAPA if not PROVISORIO else os.path.join(F, 'slide2.png')
    im = Image.open(src).convert('RGB')
    return cover(im.crop((0, int(im.height * .4), im.width, im.height)))

def bg_blur():
    return darken(capa_baixo().filter(ImageFilter.GaussianBlur(25)), .3)

def bg_07():
    # fundo: o mesmo recorte da capa (de 40% para baixo), desfocado e escurecido no topo para o texto.
    # sobre ele, o recorte nítido em largura total, posto no terço de baixo com a borda de cima esfumada,
    # para mãe, filho e banco ficarem inteiros e longe das bordas.
    src = Image.open(CAPA).convert('RGB')
    crop = src.crop((0, int(src.height * .4), src.width, src.height))
    sc = W / crop.width
    nit = crop.resize((W, round(crop.height * sc)), Image.LANCZOS)
    y = 720                                       # onde começa o recorte nítido
    fundo = darken(capa_baixo().filter(ImageFilter.GaussianBlur(25)), .3)
    mask = Image.new('L', nit.size, 255); pm = mask.load()
    fade = 60
    for yy in range(fade):
        for xx in range(W): pm[xx, yy] = int(255 * yy / fade)
    fundo.paste(nit, (0, y), mask)
    return top_gradient(fundo, .6, .58)


def spans(line):
    out, red, buf = [], False, ''
    for ch in line:
        if ch in '[]':
            if buf: out.append((buf, red)); buf = ''
            red = ch == '['
        else: buf += ch
    if buf: out.append((buf, red))
    return out

def group_metrics(g):
    size = g['size']
    while True:
        font = ImageFont.truetype(FONT, size)
        wmax = max(sum(font.getlength(t) for t, _ in spans(l)) for l in g['lines'])
        if wmax <= W - 2 * M or size <= 62: break
        size -= 2
    assert size >= 62, g
    return font, size, round(size * 1.15)

def render(nome, bg, groups, pos, reforco_vermelho=0):
    ms = [group_metrics(g) for g in groups]
    h = sum(len(g['lines']) * lh + g.get('gap', 0) for g, (_, _, lh) in zip(groups, ms)) - groups[-1].get('gap', 0)
    im = bg.copy()
    sh = Image.new('L', (W, H), 0); ds = ImageDraw.Draw(sh)
    y0 = M if pos == 'top' else (H - h) // 2
    ops, y = [], y0
    for g, (font, size, lh) in zip(groups, ms):
        # compensa o respiro do topo da fonte para alinhar a tinta à margem
        for l in g['lines']:
            x = M
            for t, r in spans(l):
                ops.append((x, y, t, font, RED if r else OFF)); x += font.getlength(t)
            y += lh
        y += g.get('gap', 0)
    for x, y, t, font, c in ops: ds.text((x, y + 3), t, font=font, fill=255)
    sh = sh.filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * .7))
    im = Image.composite(Image.new('RGB', (W, H)), im, sh)
    if reforco_vermelho:
        # halo escuro mais largo só atrás das palavras em vermelho, para o vermelho saltar sobre a luz da foto
        hv = Image.new('L', (W, H), 0); dh = ImageDraw.Draw(hv)
        for x, y, t, font, c in ops:
            if c == RED: dh.text((x, y), t, font=font, fill=255, stroke_width=10, stroke_fill=255)
        hv = hv.filter(ImageFilter.GaussianBlur(40)).point(lambda v: int(min(255, v * 2.2) * reforco_vermelho))
        im = Image.composite(Image.new('RGB', (W, H)), im, hv)
    d = ImageDraw.Draw(im)
    minx = miny = 9999; maxx = maxy = 0
    for x, y, t, font, c in ops:
        d.text((x, y), t, font=font, fill=c)
        bb = d.textbbox((x, y), t, font=font)
        minx, miny, maxx, maxy = min(minx, bb[0]), min(miny, bb[1]), max(maxx, bb[2]), max(maxy, bb[3])
    im.save(os.path.join(D, nome))
    ok = minx >= M and maxx <= W - M and miny >= M and maxy <= H - M
    log.append(f'{nome}: tamanhos {[s for _, s, _ in ms]}px, tinta x {minx:.0f}-{maxx:.0f}, y {miny}-{maxy}, margens {"OK" if ok else "FALHA"}')

G = lambda size, gap, *lines: {'size': size, 'gap': gap, 'lines': list(lines)}

render('02.png', bg_foto('slide2.png', .95, .78, desce=230), [
    G(66, 34, 'Leva o filho na escola todo dia.', 'Num dia ruim, chorou no carro', 'antes de entrar.'),
    G(66, 22, 'A família do ex viu e decretou:'),
    G(92, 0, 'borderline [não tem', '[condição de criar filho.]'),
], 'top', reforco_vermelho=.85)

render('03.png', bg_blur(), [
    G(76, 40, 'Ninguém olhou para os', 'outros dias do ano.'),
    G(76, 56, 'Diagnóstico não diz se', 'alguém é boa mãe.'),
    G(140, 0, '[O cuidado diz.]'),
], 'mid')

render('04.png', bg_foto('slide4.png', .85, .62, desce=60), [
    G(74, 34, 'Outra mãe atrasou duas', 'horas [de propósito] para', 'entregar o filho, só para', 'o pai esperar.'),
    G(74, 0, 'E disseram:'),
    G(108, 0, 'é o borderline.'),
], 'top')

render('05.png', bg_blur(), [
    G(150, 44, 'Não é.'),
    G(68, 44, 'Borderline pode explicar uma', 'reação impulsiva na crise.'),
    G(68, 6, 'Fazer o outro sofrer de propósito'),
    G(118, 6, '[é escolha,]'),
    G(68, 0, 'e se julga como a de', 'qualquer pessoa.'),
], 'mid')

render('06.png', bg_blur(), [
    G(108, 56, '[O que pesa]', '[de verdade:]'),
    G(70, 30, 'A criança está segura?'),
    G(70, 30, 'Existe rede de apoio?'),
    G(70, 30, 'A impulsividade traz risco?'),
    G(70, 0, 'Ela segue o tratamento', 'e tem acesso a ele?'),
], 'mid')

render('07.png', bg_07(), [
    G(110, 30, 'Toda mãe erra.'),
    G(72, 0, 'Quem tem borderline não', 'merece régua mais dura.'),
    G(110, 44, '[Nem mais leve.]'),
    G(64, 0, 'Manda para a mãe que tem medo', 'de contar o diagnóstico.'),
], 'top')
print('PROVISORIO (sem capa.png)' if PROVISORIO else 'capa.png usada')
print('\n'.join(log))
