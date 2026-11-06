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

def bg_foto(nome, a=.75, end=.55):
    im = cover(Image.open(os.path.join(F, nome)).convert('RGB'))
    return top_gradient(darken(im, .35), a, end)

def capa_baixo():
    src = CAPA if not PROVISORIO else os.path.join(F, 'slide2.png')
    im = Image.open(src).convert('RGB')
    return cover(im.crop((0, int(im.height * .4), im.width, im.height)))

def bg_blur():
    return darken(capa_baixo().filter(ImageFilter.GaussianBlur(35)), .5)

def bg_07():
    return top_gradient(capa_baixo(), .45, .55)

def parse(s):
    toks, red = [], False
    for w in s.replace('[', ' [ ').replace(']', ' ] ').split():
        if w == '[': red = True
        elif w == ']': red = False
        else: toks.append((w, red))
    # cola pontuação que ficou solta depois do colchete
    out = []
    for w, r in toks:
        if out and w in ',.:;' : out[-1] = (out[-1][0], out[-1][1], out[-1][2] + [(w, r)])
        else: out.append((w, r, []))
    return out

def wrap(par, font, maxw):
    sp = font.getlength(' ')
    lines, cur, cw = [], [], 0
    for w, r, tail in par:
        ww = font.getlength(w) + sum(font.getlength(t) for t, _ in tail)
        add = ww if not cur else cw + sp + ww
        if cur and add > maxw:
            lines.append(cur); cur, cw = [(w, r, tail)], ww
        else:
            cur.append((w, r, tail)); cw = add
    if cur: lines.append(cur)
    return lines

def layout(pars, size, gap):
    font = ImageFont.truetype(FONT, size)
    lh = round(size * 1.15)
    blocks, h = [], 0
    for i, p in enumerate(pars):
        ls = wrap(parse(p), font, W - 2 * M)
        blocks.append(ls); h += len(ls) * lh + (gap if i < len(pars) - 1 else 0)
    return font, lh, blocks, h

def render(nome, bg, pars, pos, max_h, start=96, gap=0):
    size = start
    while True:
        font, lh, blocks, h = layout(pars, size, round(gap * size))
        if h <= max_h or size <= 62: break
        size -= 2
    assert size >= 62
    im = bg.copy(); d = ImageDraw.Draw(im)
    sh = Image.new('L', (W, H), 0); ds = ImageDraw.Draw(sh)
    asc, desc = font.getmetrics()
    y = M if pos == 'top' else (H - h) // 2
    sp = font.getlength(' ')
    minx, maxx, miny, maxy = W, 0, H, 0
    for bi, ls in enumerate(blocks):
        for line in ls:
            x = M
            for i, (w, r, tail) in enumerate(line):
                if i: x += sp
                for t, rr in [(w, r)] + tail:
                    d.text((x, y), t, font=font, fill=RED if rr else OFF)
                    ds.text((x, y + 3), t, font=font, fill=255)
                    bb = d.textbbox((x, y), t, font=font)
                    minx, maxx, miny, maxy = min(minx, bb[0]), max(maxx, bb[2]), min(miny, bb[1]), max(maxy, bb[3])
                    x += font.getlength(t)
            y += lh
        y += round(gap * size)
    # sombra suave só para leitura sobre áreas claras, aplicada por baixo do texto
    txt = im; base = bg.copy()
    sh = sh.filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * .7))
    base = Image.composite(Image.new('RGB', (W, H)), base, sh)
    mask = Image.new('L', (W, H), 0); dm = ImageDraw.Draw(mask)
    im = base; d = ImageDraw.Draw(im); y = M if pos == 'top' else (H - h) // 2
    for bi, ls in enumerate(blocks):
        for line in ls:
            x = M
            for i, (w, r, tail) in enumerate(line):
                if i: x += sp
                for t, rr in [(w, r)] + tail:
                    d.text((x, y), t, font=font, fill=RED if rr else OFF)
                    x += font.getlength(t)
            y += lh
        y += round(gap * size)
    im.save(os.path.join(D, nome))
    ok = minx >= M and maxx <= W - M and miny >= M and maxy <= H - M
    log.append(f'{nome}: fonte {size}px, tinta x {minx}-{maxx}, y {miny}-{maxy}, margens {"OK" if ok else "FALHA"}')

TOP = int(H * .45) - M
render('02.png', bg_foto('slide2.png', .9, .68), ['Leva o filho na escola todo dia. Num dia ruim, chorou no carro antes de entrar. A família do ex viu e decretou: borderline [não tem condição de criar filho.]'], 'top', TOP)
render('03.png', bg_blur(), ['Ninguém olhou para os outros dias do ano. Diagnóstico não diz se alguém é boa mãe. [O cuidado diz.]'], 'mid', H - 2 * M)
render('04.png', bg_foto('slide4.png'), ['Outra mãe atrasou duas horas [de propósito] para entregar o filho, só para o pai esperar. E disseram: é o borderline.'], 'top', TOP)
render('05.png', bg_blur(), ['Não é. Borderline pode explicar uma reação impulsiva na crise. Fazer o outro sofrer de propósito [é escolha,] e se julga como a de qualquer pessoa.'], 'mid', H - 2 * M)
render('06.png', bg_blur(), ['[O que pesa de verdade:]', 'A criança está segura?', 'Existe rede de apoio?', 'A impulsividade traz risco?', 'Ela segue o tratamento e tem acesso a ele?'], 'mid', H - 2 * M, start=84, gap=.35)
render('07.png', bg_07(), ['Toda mãe erra. Quem tem borderline não merece régua mais dura. [Nem mais leve.] Manda para a mãe que tem medo de contar o diagnóstico.'], 'top', int(H * .6))
print('PROVISORIO (sem capa.png)' if PROVISORIO else 'capa.png usada')
print('\n'.join(log))
