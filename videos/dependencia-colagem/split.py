"""Separa as folhas src/S*.png (fundo transparente) em peças."""
import numpy as np
from PIL import Image
from scipy import ndimage
NAMES = {
    1: ['woman', 'plate', 'clock', 'chair'],
    2: ['back', 'friend1', 'friend2', 'friend3', 'guitar', 'book'],
    3: ['leaving', 'bowed', 'door', 'stool'],
    4: ['wave', 'seated', 'flames', 'face'],
    5: ['frame', 'match', 'clipboard', 'cups'],
}
for i, names in NAMES.items():
    im = np.array(Image.open(f'src/S{i}.png').convert('RGBA'))
    a = im[..., 3] > 40
    a = ndimage.binary_closing(a, iterations=3)
    a = ndimage.binary_fill_holes(a) if i != 5 else a
    lab, n = ndimage.label(a)
    objs = [(sl, k) for k, sl in enumerate(ndimage.find_objects(lab), 1) if (lab[sl] == k).sum() > 3000]
    cols = 3 if len(names) == 6 else 2
    def key(o):
        sl = o[0]; cy = (sl[0].start + sl[0].stop) / 2; cx = (sl[1].start + sl[1].stop) / 2
        return (int(cy > 1024), int(cx * cols / 2048))
    objs.sort(key=key)
    print(i, len(objs), [(o[0][0].start, o[0][1].start) for o in objs])
    if len(objs) != len(names):
        continue
    for (sl, k), name in zip(objs, names):
        m = (lab == k)
        out = im.copy()
        out[..., 3] = np.where(m, im[..., 3], 0)
        Image.fromarray(out[sl], 'RGBA').save(f'pieces/{name}.png')
