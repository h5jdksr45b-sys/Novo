"""Recorte justo das peças pelo alfa; moedas em quadrado."""
import numpy as np
from PIL import Image
ROOT = __file__.rsplit('/', 1)[0]
for name, square in (('heads', 1), ('tails', 1), ('hand_throw', 0), ('hand_gather', 0)):
    im = Image.open(f'{ROOT}/pieces/{name}.png').convert('RGBA')
    a = np.array(im)[..., 3]
    a2 = np.where(a > 128, a, 0)
    ys, xs = np.where(a2 > 0)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    im = im.crop(box)
    arr = np.array(im)
    arr[..., 3] = np.where(arr[..., 3] > 128, arr[..., 3], 0)
    im = Image.fromarray(arr)
    if square:
        s = max(im.size)
        sq = Image.new('RGBA', (s, s), (0, 0, 0, 0))
        sq.paste(im, ((s - im.width) // 2, (s - im.height) // 2))
        im = sq
    im.save(f'{ROOT}/pieces/{name}.png')
    print(name, im.size)
