"""Capa 1080x1920 no mesmo sistema do vídeo."""
import render as R
from PIL import Image
R.setup()
cv = R.PAPER.copy()
t = 50.0
R.bg_card(cv, t, 'mostarda', 960, 1180, 960, -2, 21)
R.put(cv, t, R.piece('woman'), 540, 1180, 760, -1, 1)
R.put(cv, t, R.BUB['dots'], 820, 800, 280, -1, 2, rot=4)
R.red_circle(cv, t, -1, 820, 790, 190, 125, sid=1)
R.emph(cv, t, -1, 99, ['PRECISAR DEMAIS', 'DE ALGUÉM'], 'é sinal de borderline?', cy=260, size=150)
cv.convert('RGB').save('out/capa.jpg', quality=92)
