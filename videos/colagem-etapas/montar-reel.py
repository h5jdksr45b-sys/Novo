# Monta o áudio e a legenda do Reel colagem etapas.
# 1. Voz: frases cortadas dos áudios do Higgsfield (voz Fabio), com intervalo
#    fixo, posicionadas no tempo de cada bloco do vídeo.
# 2. Efeitos: papel colando, papel arrancando, amassado, whoosh, tique de
#    relógio e caneta, sintetizados e baixos.
# 3. Mix: voz sozinha em -15 LUFS, efeitos com agudos -6 dB e ducking pela
#    voz, final em -14 LUFS, mesma duração do vídeo.
# 4. Legenda: até três palavras por vez, tempo de cada palavra estimado pelas
#    sílabas dentro da frase.
# Uso: python3 montar-reel.py
import json, os, re, subprocess
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(AQUI, "narracao")
PUB = os.path.join(AQUI, "../../reels-remotion/public/etapas")
SRC = os.path.join(AQUI, "../../reels-remotion/src/ReelEtapas")
SR = 48000
FPS = 30

ns = {"__file__": os.path.join(AQUI, "montar-narracao.py")}
codigo = open(os.path.join(AQUI, "montar-narracao.py")).read().split("PAD = 0.03")[0]
exec(codigo, ns)
FRASES = ns["FRASES"]
PAUSA_PONTO, PAUSA_VIRGULA = ns["PAUSA_PONTO"], ns["PAUSA_VIRGULA"]

# Blocos do vídeo, em quadros, e onde a fala começa dentro de cada bloco.
BLOCOS = [  # (bloco, quadros, início da fala no bloco em s)
    (1, 310, 1.00),   # clone na mesa
    (2, 237, 0.30),   # frame 2 remapeado
    (3, 435, 0.45),   # frame 3
    (4, 333, 0.00),   # frame 4
    (5, 116, 0.15),   # clone com a etiqueta
    (6, 151, 0.15),   # clone apontando
]
inicio_bloco = {}
acc = 0
for b, n, _ in BLOCOS:
    inicio_bloco[b] = acc / FPS
    acc += n
TOTAL_Q = acc
TOTAL = TOTAL_Q / FPS

# Legenda: | separa os grupos (até três palavras), * marca o destaque.
LEGENDA = [
    "VOCÊ GRITOU|POR CAUSA DE|UM *ATRASO*",
    "QUEM ESTAVA|DO LADO|LEVOU UM *SUSTO*",
    "E VOCÊ *TAMBÉM*",
    "NÃO VEIO|DO *NADA*",
    "ESSE *GRITO*|COMEÇOU BEM *ANTES*",
    "O *GRITO*",
    "A *BRIGA*",
    "ISSO JÁ É|A ETAPA *QUATRO*",
    "ANTES DELA|TEVE A *TRÊS*",
    "A *DOIS*",
    "E A PRIMEIRA|COMEÇA *AQUI*",
    "ETAPA *UM*",
    "O PRIMEIRO *APERTO*",
    "A PESSOA CHEGA|*QUARENTA* MINUTOS|ATRASADA|E DIZ QUE|PEGOU *TRÂNSITO*",
    "ALGUMA COISA|*APERTA* POR DENTRO",
    "AINDA NÃO TEM|*RAIVA*",
    "NÃO TEM *BRIGA*",
    "É UM *INCÔMODO*|TÃO RÁPIDO QUE|VOCÊ NEM|DÁ *NOME*",
    "SE NINGUÉM|*PERCEBE*",
    "ETAPA *DOIS*",
    "A CABEÇA ESCOLHE|A *PIOR* VERSÃO",
    "NÃO SE IMPORTA|*COMIGO*",
    "ETAPA *TRÊS*",
    "O CORPO *ACELERA*",
    "TEM QUE RESOLVER|*AGORA*",
    "E AÍ VEM|O *GRITO*",
    "DÁ PRA AGIR|NESSA ETIQUETA|EM *BRANCO*",
    "PÔR *NOME*|NO APERTO|ENQUANTO ELE|AINDA É *PEQUENO*",
    "MANDA PRA QUEM|SÓ CONHECE|A SUA|*ETAPA QUATRO*",
]
assert len(LEGENDA) == len(FRASES)


def ffmpeg_f32(args):
    r = subprocess.run(["ffmpeg", "-v", "error"] + args + ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                       check=True, capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).copy()


def cortar(b, a, z):
    f = (f"atrim={max(0, a - 0.03)}:{z + 0.03},asetpts=PTS-STARTPTS,"
         "afade=t=in:d=0.015,areverse,afade=t=in:d=0.03,areverse")
    return ffmpeg_f32(["-i", f"{D}/originais/raw_{b}.wav", "-af", f])


def gravar(p, x):
    tmp = p + ".f32"
    np.asarray(x, dtype=np.float32).tofile(tmp)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", tmp,
                    "-c:a", "pcm_f32le", p], check=True)
    os.remove(tmp)


# 1. VOZ ------------------------------------------------------------------
voz = np.zeros(int(TOTAL * SR) + SR, dtype=np.float32)
frases_t = []  # (ini, fim, texto, legenda)
for b, _, fala in BLOCOS:
    t = inicio_bloco[b] + fala
    lista = [(i, f) for i, f in enumerate(FRASES) if f[0] == b]
    for k, (i, (_, a, z, txt)) in enumerate(lista):
        x = cortar(b, a, z)
        i0 = int(round(t * SR))
        voz[i0:i0 + len(x)] += x
        frases_t.append((t, t + len(x) / SR, txt, LEGENDA[i]))
        t += len(x) / SR
        if k < len(lista) - 1:
            t += PAUSA_VIRGULA if txt.endswith((",", ":")) else PAUSA_PONTO
voz = voz[:int(TOTAL * SR)]

# 2. EFEITOS --------------------------------------------------------------
rng = np.random.default_rng(7)


def passa_faixa(x, baixo, alto):
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    X[(fr < baixo) | (fr > alto)] = 0
    return np.fft.irfft(X, len(x))


def norm(x, pico_db):
    m = np.max(np.abs(x)) or 1
    return x / m * 10 ** (pico_db / 20)


def colar(forca=1.0):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-t / (0.010 + 0.006 * forca))
    x = passa_faixa(x, 500, 5200)
    return norm(x, -30 + 4 * (forca - 1))


def arrancar(dur=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    graos = (rng.random(n) < 0.05).astype(float) * rng.standard_normal(n)
    graos = np.convolve(graos, np.hanning(40), "same")
    env = np.minimum(1, t / 0.02) * np.exp(-t / (dur * 0.45))
    x = passa_faixa(graos * env + rng.standard_normal(n) * env * 0.15, 1200, 7500)
    return norm(x, -31)


def amassar():
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    graos = (rng.random(n) < 0.08).astype(float) * rng.standard_normal(n)
    graos = np.convolve(graos, np.hanning(24), "same")
    env = np.minimum(1, t / 0.008) * np.exp(-t / 0.07)
    return norm(passa_faixa(graos * env, 900, 7000), -30)


def whoosh(dur=0.22, pico=-29):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    corte = np.linspace(300, 3200, n) ** 1.0
    y = np.zeros(n)
    acc_ = 0.0
    for i in range(n):  # passa-baixa de um polo com corte subindo
        a = 1 - np.exp(-2 * np.pi * corte[i] / SR)
        acc_ += a * (x[i] - acc_)
        y[i] = acc_
    y = passa_faixa(y, 250, 9000) * np.hanning(n)
    return norm(y, pico)


def tique():
    n = int(0.012 * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-t / 0.0018)
    return norm(passa_faixa(x, 2000, 7000), -35)


def caneta(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = passa_faixa(rng.standard_normal(n), 2500, 8000)
    am = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 3.1 * t + rng.random() * 3))
    env = np.minimum(1, t / 0.03) * np.minimum(1, (dur - t) / 0.05)
    return norm(x * am * env, -38)


fx = np.zeros_like(voz)


def poe(seg, t):
    i0 = int(round(t * SR))
    if i0 >= len(fx):
        return
    seg = seg[: len(fx) - i0]
    fx[i0:i0 + len(seg)] += seg


B2, B3, B4 = inicio_bloco[2], inicio_bloco[3], inicio_bloco[4]
B5, B6 = inicio_bloco[5], inicio_bloco[6]
# troca de bloco
for t in (B2, B5, B6):
    poe(whoosh(0.22, -30), t - 0.11)
# frame 2 (tempos do remapeamento)
for dt, kind in [(0.55, 1.0), (1.45, 1.0), (3.3, 1.6), (3.7, 1.0), (5.15, 0.9), (6.05, 0.9), (7.6, 1.2)]:
    poe(colar(kind), B2 + dt)
poe(whoosh(0.35, -31), B2 + 4.05)
poe(whoosh(0.2, -32), B2 + 6.95)
# frame 3
c3 = {k: v for k, v in json.load(open(os.path.join(AQUI, "_cfg3.json"))).items()}
poe(whoosh(0.7, -31), B3 + 0.05)
for k, forca in [("faixaEtapa1", 1.3), ("subtitulo", 1.0), ("relogioCola", 1.1), ("mais40", 1.0),
                 ("folhaCola", 1.0), ("raiva", 1.0), ("briga", 1.0), ("etiquetaBranca", 1.0)]:
    poe(colar(forca), B3 + c3[k])
poe(whoosh(0.3, -32), B3 + c3["discoSai"])
for k in ("relogioSai", "raivaSai", "brigaSai"):
    poe(arrancar(), B3 + c3[k])
for t in c3["trancosAmassado"]:
    poe(amassar(), B3 + t)
for k in ("raiva", "briga"):
    poe(caneta(c3["riscoDuracao"] + 0.05), B3 + c3[k] + c3["riscoAtraso"])
# tique do relógio desacelerando até parar
t, fim = c3["relogioCola"], c3["ponteirosParam"]
while t < fim:
    p = (t - c3["relogioCola"]) / (fim - c3["relogioCola"])
    poe(tique(), B3 + t)
    t += 0.06 + 0.5 * p ** 2
# frame 4
c4 = json.load(open(os.path.join(AQUI, "_cfg4.json")))
poe(arrancar(0.25), B4 + c4["etapa1Arranca"])
poe(colar(1.3), B4 + c4["etapa2Cola"])
poe(caneta(c4["escritaFim"] - c4["escritaInicio"]), B4 + c4["escritaInicio"])
for t in c4["bolinhaTrancos"]:
    poe(amassar(), B4 + t)
poe(arrancar(0.2), B4 + c4["etapa2Arranca"])
poe(colar(1.3), B4 + c4["etapa3Cola"])
for k, v in c4["recortes"].items():
    poe(colar(0.8), B4 + v)
t = c4["recortes"]["relogio"]
while t < c4["limpa"]:  # relógio disparado
    poe(tique(), B4 + t)
    t += 0.09
poe(colar(1.9), B4 + c4["agora"])
poe(arrancar(0.18), B4 + c4["limpa"])
poe(whoosh(0.25, -30), B4 + c4["limpa"])
poe(colar(2.2), B4 + c4["circulo"])

# 3. MIX ------------------------------------------------------------------
# Sem loudnorm na aplicação: ele corta o fim do áudio (problema de 30/10).
# O volume é medido com ebur128 e aplicado como ganho, com limitador simples.
def lufs(x):
    tmp = f"{AQUI}/_med.wav"
    gravar(tmp, x)
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af", "ebur128", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    os.remove(tmp)
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", out)[-1])


def limitar(x, teto_db):
    teto = 10 ** (teto_db / 20)
    g = np.minimum(1.0, teto / np.maximum(np.abs(x), 1e-9))
    n = int(0.004 * SR)  # 4 ms antes e depois de cada pico
    from numpy.lib.stride_tricks import sliding_window_view
    gp = np.pad(g, (n, n), constant_values=1.0)
    g = sliding_window_view(gp, 2 * n + 1).min(axis=1)
    g = np.convolve(g, np.ones(n) / n, "same")
    return x * np.minimum(g, 1.0)


def ao_alvo(x, alvo, teto_db):
    y = x * 10 ** ((alvo - lufs(x)) / 20)
    for _ in range(3):  # o limitador baixa um pouco o volume; corrige
        y = limitar(y, teto_db)
        y = y * 10 ** ((alvo - lufs(y)) / 20)
    return limitar(y, teto_db)


N = int(round(TOTAL * SR))
voz = ao_alvo(voz[:N], -15.0, -2.0)
fx = fx[:N]
gravar(f"{AQUI}/_voz.wav", voz)
gravar(f"{AQUI}/_fx.wav", fx)
r = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{AQUI}/_voz.wav", "-i", f"{AQUI}/_fx.wav",
                    "-filter_complex",
                    "[1:a]treble=g=-6:f=6000[f];[0:a]asplit=2[v][sc];"
                    "[f][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=250[fd];"
                    "[v][fd]amix=inputs=2:normalize=0:duration=first[m]",
                    "-map", "[m]", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
mix = np.frombuffer(r.stdout, dtype=np.float32).copy()
mix = np.pad(mix, (0, max(0, N - len(mix))))[:N]
mix = ao_alvo(mix, -14.0, -1.5)
os.makedirs(PUB, exist_ok=True)
tmp = f"{AQUI}/_mix.f32"
mix.astype(np.float32).tofile(tmp)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", tmp,
                "-c:a", "pcm_s16le", f"{PUB}/mix.wav"], check=True)
os.remove(tmp)

# 4. LEGENDA --------------------------------------------------------------
def silabas(p):
    return max(1, len(re.findall(r"[AEIOUÁÉÍÓÚÂÊÔÃÕÀY]+", p.upper())))


grupos = []
destaque_n = 0
for ini, fim, txt, leg in frases_t:
    partes = [g.split() for g in leg.split("|")]
    palavras = [w for g in partes for w in g]
    pesos = [silabas(w.strip("*")) + 0.4 for w in palavras]
    tot = sum(pesos)
    tempos, acc_ = [], ini
    for w in pesos:
        tempos.append(acc_)
        acc_ += (fim - ini) * w / tot
    k = 0
    for g in partes:
        ws = []
        aberto = None  # destaque de mais de uma palavra usa a mesma fonte
        for w in g:
            d = aberto is not None or w.startswith("*")
            fonte = None
            if d:
                if aberto is None:
                    aberto = "serifa" if destaque_n % 2 == 0 else "sem"
                    destaque_n += 1
                fonte = aberto
                if w.endswith("*"):
                    aberto = None
            ws.append({"q": round(tempos[k] * FPS), "t": w.strip("*"), "d": d, "f": fonte})
            k += 1
        grupos.append({"ini": ws[0]["q"], "palavras": ws, "fimFrase": round(fim * FPS)})
# fim de cada grupo: quando entra o próximo, ou 0,3 s depois do fim da frase
for i, g in enumerate(grupos):
    prox = grupos[i + 1]["ini"] if i + 1 < len(grupos) else TOTAL_Q
    g["fim"] = min(prox, g["fimFrase"] + round(0.3 * FPS)) if g["fimFrase"] < prox else prox
    del g["fimFrase"]
os.makedirs(SRC, exist_ok=True)
json.dump({"total": TOTAL_Q, "blocos": {str(b): round(inicio_bloco[b] * FPS) for b, _, _ in BLOCOS},
           "grupos": grupos}, open(f"{SRC}/legenda.json", "w"), ensure_ascii=False, indent=1)

# Checagens
def db(x):
    return 20 * np.log10(max(1e-9, np.sqrt(np.mean(x ** 2))))


print(f"total {TOTAL:.3f} s, {TOTAL_Q} quadros, {len(grupos)} grupos de legenda")
for ini, fim, txt, _ in frases_t:
    print(f"  {ini:6.2f} a {fim:6.2f}  {txt}")
