# Gera imagens provisórias (1080x1920, P&B, com grão) para os planos de B-roll.
# Substitua cada arquivo em public/linehan/ por uma foto de arquivo com o mesmo nome.
# Uso: python3 scripts/gerar-placeholders.py
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = os.path.join(os.path.dirname(__file__), "..", "public", "linehan")
W, H = 1080, 1920
PLANOS = [
    ("01-hartford-1961.jpg", "HARTFORD · 1961", "fachada ou corredor de hospital, anos 1960"),
    ("02-janela.jpg", "JANELA", "janela alta com grade, contraluz"),
    ("03-quarto-isolamento.jpg", "ISOLAMENTO", "quarto vazio, porta pesada, piso refletindo"),
    ("04-prontuario.jpg", "PRONTUÁRIO", "folha datilografada em close"),
    ("05-universidade-1991.jpg", "1991", "prédio de universidade ou arquivo"),
    ("06-corredor-vazio.jpg", "CORREDOR", "corredor vazio com luz no fim"),
    ("07-auditorio-2011.jpg", "2011", "auditório visto do palco"),
]

def fonte(tam, negrito=False):
    caminho = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if negrito else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    try:
        return ImageFont.truetype(caminho, tam)
    except OSError:
        return ImageFont.load_default()

random.seed(7)
os.makedirs(RAIZ, exist_ok=True)
for i, (nome, palavra, descricao) in enumerate(PLANOS):
    base = Image.new("L", (W, H), 12)
    d = ImageDraw.Draw(base)
    # feixe de luz diagonal + chão refletindo, para o Ken Burns ter o que mover
    cx = random.randint(300, 780)
    for r in range(900, 0, -6):
        v = int(12 + (900 - r) / 900 * (70 + i * 6))
        d.ellipse((cx - r, 560 - r * 0.7, cx + r, 560 + r * 0.7), fill=v)
    for y in range(1200, H, 4):
        v = int(28 + (y - 1200) / (H - 1200) * 18)
        d.line((0, y, W, y), fill=v)
    # linhas de arquitetura (portas/janelas) muito sutis
    for k in range(6):
        x = 120 + k * 150
        d.rectangle((x, 420, x + 80, 1180), outline=40, width=3)
    base = base.filter(ImageFilter.GaussianBlur(14))
    # grão
    ruido = Image.effect_noise((W, H), 38).convert("L")
    img = Image.blend(base, ruido, 0.16)
    d = ImageDraw.Draw(img)
    f1 = fonte(150, True)
    f2 = fonte(28)
    d.text((W / 2, 980), palavra, fill=70, font=f1, anchor="mm")
    d.text((W / 2, 1700), "PLACEHOLDER · " + descricao, fill=120, font=f2, anchor="mm")
    img = img.convert("RGB")
    img.save(os.path.join(RAIZ, nome), quality=82)
    print("ok", nome)
