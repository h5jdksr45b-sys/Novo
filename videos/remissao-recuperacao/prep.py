"""Prepara as camadas das fotos: tira os checks desenhados da img1, separa as tiras
da img3 e as nuvens da img4 do resto. Saída em build/."""
import cv2
import numpy as np
from scipy import ndimage as ndi

ROOT = __file__.rsplit('/', 1)[0]
B = f'{ROOT}/build'


def silhouette(im, t=12):
    b = cv2.GaussianBlur(im.astype(np.float32), (0, 0), 3)
    paper = np.median(np.concatenate([b[:150].reshape(-1, 3), b[-150:].reshape(-1, 3)]), 0)
    near = np.abs(b - paper).max(2) < t
    lab, _ = ndi.label(near)
    ids = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(ids))
    return ndi.binary_fill_holes(~bg), paper


def paper_fill(im, hole, paper_src):
    """Preenche hole com textura de papel tirada de paper_src (mesmo tamanho, só papel)."""
    out = im.copy()
    soft = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 4)[..., None]
    soft = np.clip(soft * 1.6, 0, 1)
    return (out * (1 - soft) + paper_src * soft).astype(np.uint8)


def paper_texture(im, region):
    """Ladrilha um retângulo só de papel (y0,y1,x0,x1) até cobrir a imagem."""
    y0, y1, x0, x1 = region
    tile = im[y0:y1, x0:x1]
    th, tw = tile.shape[:2]
    reps = (im.shape[0] // th + 2, im.shape[1] // tw + 2, 1)
    big = np.tile(np.concatenate([tile, tile[::-1]], 0), (reps[0] // 2 + 1, 1, 1))
    big = np.tile(np.concatenate([big, big[:, ::-1]], 1), (1, reps[1] // 2 + 1, 1))
    return big[:im.shape[0], :im.shape[1]]


def rgba(im, mask):
    a = cv2.GaussianBlur((mask * 255).astype(np.uint8), (0, 0), 1.0)
    return np.dstack([im, a])


def img1():
    im = cv2.imread(f'{ROOT}/src/img1.png')
    x0, y0, x1, y1 = 1080, 1180, 1340, 1720  # caixas e checks
    roi = im[y0:y1, x0:x1]
    g = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    ink = ndi.binary_dilation(g < 120, iterations=5)
    lab, n = ndi.label(ink)
    boxes = [sl for sl in ndi.find_objects(lab) if sl[0].stop - sl[0].start > 60]
    cents = []
    hole_all = np.zeros(im.shape[:2], np.uint8)
    rects = []
    for sl in boxes:
        ya, yb = sl[0].start + y0 - 4, sl[0].stop + y0 + 4
        xa, xb = sl[1].start + x0 - 4, sl[1].stop + x0 + 4
        cents.append(((xa + xb) / 2, (ya + yb) / 2 + 10))
        hole_all[ya:yb, xa:xb] = 255
        rects.append((xa, ya, xb, yb))
    # base suave: inpaint; depois redesenha as pautas com o perfil das colunas vizinhas
    base = cv2.inpaint(im, hole_all, 9, cv2.INPAINT_TELEA).astype(np.float32)
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
    hp = g - cv2.GaussianBlur(g, (0, 0), 5)
    out = base.copy()
    for xa, ya, xb, yb in rects:
        pad = 40
        L = hp[ya - pad:yb + pad, xa - 14:xa - 4].mean(1)
        R = hp[ya - pad:yb + pad, xb + 4:xb + 14].mean(1)
        best = max(range(-25, 26), key=lambda d: np.dot(np.roll(L, d)[pad:-pad], R[pad:-pad]))
        span = (xb + 9) - (xa - 9)
        for x in range(xa, xb):
            f = (x - (xa - 9)) / span
            shift = best * f
            ys = np.arange(ya, yb)
            pl = np.interp(ys - shift - (ya - pad), np.arange(len(L)), L)
            pr = np.interp(ys + (best - shift) - (ya - pad), np.arange(len(R)), R)
            prof = (1 - f) * pl + f * pr
            prof = np.where(prof < -2.5, prof, 0)
            out[ya:yb, x] += prof[:, None] * 0.9
        print('caixa', xa, ya, xb, yb, 'inclinacao', best)
    rng = np.random.default_rng(3)
    grain = cv2.GaussianBlur(rng.normal(0, 4.0, g.shape).astype(np.float32), (0, 0), 0.8)
    grain += cv2.GaussianBlur(rng.normal(0, 6.0, g.shape).astype(np.float32), (0, 0), 3) 
    out += grain[..., None]
    soft = cv2.GaussianBlur((hole_all > 0).astype(np.float32), (0, 0), 1.5)[..., None]
    out = np.clip(im * (1 - soft) + out * soft, 0, 255).astype(np.uint8)
    np.save(f'{B}/img1-caixas.npy', np.array(sorted(cents, key=lambda c: c[1])))
    cv2.imwrite(f'{B}/img1-sem-check.png', out)


def img3():
    im = cv2.imread(f'{ROOT}/src/img3.png')
    sil, paper = silhouette(im, 12)
    lab, n = ndi.label(sil)
    sizes = ndi.sum(sil, lab, range(1, n + 1))
    keep = [i + 1 for i in np.argsort(sizes)[::-1][:2]]
    tex = paper_texture(im, (150, 750, 100, 1400))
    clean = im.copy()
    allm = np.zeros(sil.shape, bool)
    for i in keep:
        m = ndi.binary_dilation(lab == i, iterations=3)
        allm |= ndi.binary_dilation(m, iterations=14)
        ys, xs = np.where(m)
        crop = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
        piece = rgba(im[crop], m[crop])
        name = 'amarela' if im[crop][m[crop]][:, 2].mean() - im[crop][m[crop]][:, 0].mean() > 40 else 'cinza'
        cv2.imwrite(f'{B}/img3-tira-{name}.png', piece)
        print(name, xs.min(), ys.min(), xs.max(), ys.max())
    clean = paper_fill(clean, allm, tex)
    cv2.imwrite(f'{B}/img3-fundo.png', clean)


def img4():
    im = cv2.imread(f'{ROOT}/src/img4.png')
    sil, paper = silhouette(im, 12)
    lum = cv2.cvtColor(cv2.GaussianBlur(im, (0, 0), 2), cv2.COLOR_BGR2GRAY).astype(np.float32)
    bgr = cv2.GaussianBlur(im, (0, 0), 2).astype(np.float32)
    h, w = lum.shape
    split = np.full(w, -1)
    for x in range(w):
        col = lum[1180:1700, x]
        warm = bgr[1180:1700, x, 2] - bgr[1180:1700, x, 0]
        dark = np.where((col < 140) & (warm > 12))[0]
        # topo da cozinha: primeira linha escura seguida de 25 px escuros
        yk = None
        for y in dark:
            if (col[y:y + 25] < 150).all() and (warm[y:y + 25] > 8).all():
                yk = 1180 + y
                break
        if yk is None:
            continue
        split[x] = yk - 30
    xs = np.where(split > 0)[0]
    split = np.interp(np.arange(w), xs, split[xs]).astype(int)
    split = np.clip(split, 1250, 1400)
    split = ndi.median_filter(split, 31)
    rows = np.arange(h)[:, None]
    top = sil & (rows < split[None, :])
    bot = sil & ~top
    # fita da direita fica com a cozinha
    poly = np.zeros(sil.shape, np.uint8)
    cv2.fillPoly(poly, [np.array([(1284, 1336), (1434, 1220), (1462, 1282), (1320, 1398)], np.int32)], 1)
    tape = (poly > 0) & sil
    top &= ~tape
    bot |= tape
    top = ndi.binary_opening(top, iterations=2)
    # nuvens: camada RGBA
    ys_, xs_ = np.where(top)
    crop = (slice(ys_.min(), ys_.max() + 1), slice(xs_.min(), xs_.max() + 1))
    cv2.imwrite(f'{B}/img4-nuvens.png', rgba(im[crop], top[crop]))
    np.save(f'{B}/img4-nuvens-pos.npy', np.array([xs_.min(), ys_.min()]))
    tex = paper_texture(im, (40, 300, 80, 1440))
    fundo = paper_fill(im, ndi.binary_dilation(top, iterations=2) & ~bot, tex)
    cv2.imwrite(f'{B}/img4-fundo.png', fundo)
    dbg = im.copy()
    dbg[top] = (dbg[top] * 0.5 + np.array([0, 0, 255]) * 0.5).astype(np.uint8)
    cv2.imwrite(f'{B}/img4-debug.png', cv2.resize(dbg, (760, 1344)))


if __name__ == '__main__':
    img1()
    img3()
    img4()
