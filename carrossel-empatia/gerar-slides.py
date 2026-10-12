from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/home/user/Novo/carrossel-empatia"
os.makedirs(OUT, exist_ok=True)
W, H = 1080, 1350
BG = (250, 249, 246)
INK = (24, 24, 26)
EMO = (214, 72, 60)      # emoção
ENT = (58, 104, 190)     # entendimento
F = "/usr/share/fonts/opentype/inter/"
REG = F + "Inter-Regular.otf"
SEMI = F + "Inter-SemiBold.otf"
BOLD = F + "Inter-Bold.otf"

# (linhas, ênfase, raio emoção, raio entendimento, modo)
# modo: "cover" = emoção centralizada cobrindo entendimento; "split" = lado a lado
slides = [
    (["Você sente tudo que", "a outra pessoa sente."], False, 150, 150, "side"),
    (["Ela chega triste e, em segundos,", "a tristeza dela já é sua."], False, 190, 130, "cover"),
    (["Você fica mal antes de saber", "o que aconteceu."], False, 230, 100, "cover"),
    (["Você responde ao que sentiu,", "não ao que ela disse."], False, 260, 70, "cover"),
    (["Ela tenta explicar.", "Você já está cuidando", "do que ficou em você."], False, 290, 40, "cover"),
    (["Aí ela diz que você não entende.", "E você pensa:", "mas eu senti tudo."], True, 250, 0, "cover"),
    (["Sentir junto e entender", "são coisas diferentes.", "", "Sentir junto é a dor dela", "chegar em você.", "Entender é saber o que", "está acontecendo com ela."], False, 170, 110, "apart"),
    (["Quando a emoção sobe demais,", "entender o outro fica difícil.", "Isso vale para qualquer pessoa.", "", "No borderline, a emoção sobe", "mais rápido e demora mais", "para baixar."], False, 150, 130, "apart"),
    (["Do lado dela, a sensação", "foi outra.", "", "Ela falou e não foi ouvida.", "Isso também dói."], False, 140, 140, "apart"),
    (["Antes de responder,", "pergunte o que aconteceu.", "", "Fique com o que é seu.", "Deixe com ela a parte", "que é dela."], True, 150, 150, "side"),
]

def circle(d, cx, cy, r, color):
    if r > 0:
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)

for i, (lines, emph, re_, ren, mode) in enumerate(slides, 1):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    cy = 440
    if mode == "cover":
        circle(d, 540, cy, re_, EMO)
        circle(d, 540, cy, ren, ENT)
    elif mode == "side":
        circle(d, 540 - re_ - 30, cy, re_, EMO)
        circle(d, 540 + ren + 30, cy, ren, ENT)
    elif mode == "apart":
        circle(d, 540 - re_ - 60, cy, re_, EMO)
        circle(d, 540 + ren + 60, cy, ren, ENT)

    size = 60 if emph else 46
    font = ImageFont.truetype(BOLD if emph else REG, size)
    small = ImageFont.truetype(REG, 40)
    lh = int(size * 1.35)
    total = sum(lh if l else lh // 2 for l in lines)
    y = 860 - total // 2 + 40
    for l in lines:
        if not l:
            y += lh // 2
            continue
        f = font
        w = d.textlength(l, font=f)
        d.text(((W - w) / 2, y), l, font=f, fill=INK)
        y += lh

    foot = ImageFont.truetype(REG, 26)
    t = "DR. FABIO SCHMIDT  ·  CRM-SP 183549"
    w = d.textlength(t, font=foot)
    d.text(((W - w) / 2, H - 90), t, font=foot, fill=(150, 150, 150))
    n = f"{i}/10"
    d.text((W - 60 - d.textlength(n, font=foot), 50), n, font=foot, fill=(150, 150, 150))
    im.save(f"{OUT}/slide-{i:02d}.png")
print("ok")
