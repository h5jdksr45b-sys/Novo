"""Recorta cada sticker (img6) e cada ícone (img7) em PNG separado, sem o halo do fundo.

As folhas já vêm com transparência, mas o contorno tem um degradê de brilho
(halo preto e cinza). Aqui o alfa é cortado num limiar, o contorno é encolhido
1 px e suavizado, e a cor da borda é limpa para não carregar o halo.
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = __file__.rsplit('/', 1)[0]

STICKERS = {  # ordem de leitura na folha: (linha, coluna aproximada)
    'check': (0, 0), 'bandeira-xadrez': (0, 1), 'fita': (0, 2),
    'ampulheta': (1, 0), 'coracao': (1, 1), 'fita-crepe': (1, 2),
    'seta': (2, 1), 'estrela': (2, 2),
}
ICONS = ['maleta', 'maos', 'raio', 'ampulheta', 'bandeira', 'calendario', 'pessoa', 'porta']


def cut(sheet, thr, edge_rgb=None):
    a = np.array(Image.open(sheet).convert('RGBA'))
    solid = a[..., 3] >= thr
    solid = ndi.binary_fill_holes(ndi.binary_opening(solid, iterations=2))
    lab, n = ndi.label(solid)
    out = []
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        m = lab[sl] == i
        if m.sum() < 20000:
            continue
        m = ndi.binary_erosion(m, iterations=2)
        alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(
            __import__('PIL.ImageFilter', fromlist=['x']).GaussianBlur(1.1))
        rgb = a[sl][..., :3].copy()
        if edge_rgb is not None:
            ring = m & ~ndi.binary_erosion(m, iterations=5)
            rgb[ring] = edge_rgb
        piece = Image.fromarray(np.dstack([rgb, np.array(alpha)]), 'RGBA')
        bb = piece.getbbox()
        out.append(((sl[0].start + sl[0].stop) / 2, (sl[1].start + sl[1].stop) / 2, piece.crop(bb)))
    return out


def main():
    st = cut(f'{ROOT}/src/img6.png', 200, edge_rgb=(250, 248, 242))
    rows = sorted(st, key=lambda p: p[0])
    # 3 linhas: 3, 3, 2 peças; ordena cada linha por x
    st_sorted = sorted(rows[:3], key=lambda p: p[1]) + sorted(rows[3:6], key=lambda p: p[1]) + sorted(rows[6:], key=lambda p: p[1])
    names = list(STICKERS)
    assert len(st_sorted) == 8, len(st_sorted)
    for name, (_, _, img) in zip(names, st_sorted):
        img.save(f'{ROOT}/pieces/sticker-{name}.png')

    ic = cut(f'{ROOT}/src/img7.png', 128)
    assert len(ic) == 8, len(ic)
    ic = sorted(ic, key=lambda p: (round(p[0] / 300), p[1]))
    for name, (_, _, img) in zip(ICONS, ic):
        img.save(f'{ROOT}/pieces/icone-{name}.png')
    print('ok', len(st_sorted), len(ic))


if __name__ == '__main__':
    main()
