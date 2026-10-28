"""Separa as folhas de recortes (src/C*.jpg + máscara src/A*.png) em peças com fundo transparente."""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

NAMES = {
    1: ['crowd', 'speaker', 'woman', 'grip'],
    2: ['phone_hand', 'photo1', 'photo2', 'photo3', 'dress', 'heart_lock'],
    3: ['bouquet', 'open_hand', 'cal1', 'cal2'],
    4: ['phone_a', 'phone_b', 'phone_c', 'point_r', 'point_l'],
    5: ['bottle', 'pinch', 'chain', 'peel'],
    6: ['binoculars', 'megaphone', 'door', 'point_down', 'gavel'],
    7: ['woman_back', 'walk_left', 'walk_right'],
    8: ['tv', 'queue', 'ticket_hand', 'torn_strip'],
}
for i, names in NAMES.items():
    c = np.array(Image.open(f'src/C{i}.jpg').convert('RGB'))
    a = np.array(Image.open(f'src/A{i}.png').convert('L')) > 127
    lab, n = ndimage.label(a)
    objs = [(sl, k) for k, sl in enumerate(ndimage.find_objects(lab), 1)]
    objs = [(sl, k) for sl, k in objs if (lab[sl] == k).sum() > 4000]
    # ordem de leitura: linhas por faixa de altura, depois esquerda para direita
    objs.sort(key=lambda o: (round((o[0][0].start + o[0][0].stop) / 700), o[0][1].start))
    assert len(objs) == len(names), (i, len(objs), [o[0] for o in objs])
    for (sl, k), name in zip(objs, names):
        m = lab == k
        al = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
        al = np.array(al)
        ys, xs = np.where(al > 3)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        out = np.dstack([c, al])[y0:y1, x0:x1]
        Image.fromarray(out, 'RGBA').save(f'pieces/{name}.png')
        print(i, name, out.shape[:2])
