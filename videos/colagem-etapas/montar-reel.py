# Monta o áudio e a legenda do Reel colagem etapas.
# 1. Voz: frases cortadas dos áudios do Higgsfield (voz Fabio), com intervalo
#    fixo, posicionadas no tempo de cada bloco do vídeo.
# 2. Efeitos: papel colando, papel arrancando, amassado, whoosh, tique de
#    relógio e caneta, sintetizados e baixos.
# 3. Mix: voz sozinha em -15 LUFS, efeitos com agudos -6 dB e ducking pela
#    voz, final em -14 LUFS, mesma duração do vídeo.
# 4. Legenda: até três palavras por vez, tempo de cada palavra estimado pelas
#    sílabas dentro da frase.
# Uso (a partir de reels-remotion, para exportar os tempos dos frames 3 e 4):
#   node --experimental-strip-types -e "Promise.all([import('./src/Frame3/config.ts'),import('./src/Frame4/config.ts')]).then(([a,b])=>{const fs=require('fs');fs.writeFileSync('../videos/colagem-etapas/_cfg3.json',JSON.stringify(a.CONFIG_FRAME3));fs.writeFileSync('../videos/colagem-etapas/_cfg4.json',JSON.stringify(b.CONFIG_FRAME4))})"
#   python3 ../videos/colagem-etapas/montar-reel.py
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
    (1, 322, None),   # clone na mesa (fala original do clipe)
    (2, 237, 0.30),   # frame 2 remapeado
    (3, 435, 0.45),   # frame 3
    (4, 333, 0.00),   # frame 4
    (5, 182, None),   # clone com a etiqueta (fala original do clipe)
    (6, 151, None),   # clone apontando (fala original do clipe)
]
inicio_bloco = {}
acc = 0
for b, n, _ in BLOCOS:
    inicio_bloco[b] = acc / FPS
    acc += n
TOTAL_Q = acc
TOTAL = TOTAL_Q / FPS

# Cenas em que ele aparece falando: usa o áudio original do clipe do
# Higgsfield, alinhado com a montagem (desloc = tempo no clipe no início do
# bloco). Palavras e tempos vêm da transcrição (faster-whisper).
CLONES = {
    1: {"arquivo": "clones/voz-fabio-a.mp4", "desloc": 0.958,
        "palavras": [("A", 1.20), ("CRISE", 2.04), ("DO", 2.38), ("BORDERLINE", 2.60), ("NÃO", 3.30),
                     ("COMEÇA", 3.62), ("NO", 4.04), ("GRITO", 4.24), ("NEM", 4.60), ("NA", 4.78),
                     ("BRIGA", 4.96), ("ELA", 5.56), ("TEM", 6.38), ("EXATAMENTE", 6.60), ("QUATRO", 7.18),
                     ("ETAPAS", 7.72), ("E", 8.84), ("VOCÊ", 9.26), ("SÓ", 9.50), ("CONSEGUE", 9.72),
                     ("INTERROMPER", 10.28), ("NA", 10.92), ("PRIMEIRA", 11.10)],
        "fim": 11.52,
        "legenda": "A CRISE|DO *BORDERLINE*|NÃO COMEÇA|NO *GRITO*|NEM NA *BRIGA*|ELA TEM|EXATAMENTE|"
                   "*QUATRO* ETAPAS|E VOCÊ SÓ|CONSEGUE INTERROMPER|NA *PRIMEIRA*"},
    5: {"arquivo": "clones/voz-fabio-e.mp4", "desloc": 0.067,
        "palavras": [("SABE", 0.00), ("AQUELA", 0.22), ("ETIQUETA", 0.38), ("EM", 0.72), ("BRANCO", 0.78),
                     ("NA", 1.28), ("ETAPA", 1.38), ("UM", 1.66), ("O", 1.88), ("TRABALHO", 1.94), ("É", 2.18),
                     ("ESCREVER", 2.30), ("NELA", 2.48), ("ISSO", 3.06), ("ME", 3.20), ("INCOMODOU", 3.32),
                     ("SE", 3.96), ("VOCÊ", 4.02), ("NÃO", 4.20), ("ESCREVE", 4.30), ("A", 4.70),
                     ("CABEÇA", 4.74), ("ESCREVE", 4.94), ("A", 5.34), ("PIOR", 5.38), ("VERSÃO", 5.54)],
        "fim": 5.86,
        "legenda": "SABE AQUELA|ETIQUETA|EM *BRANCO*|NA ETAPA *UM*|O TRABALHO|É ESCREVER NELA|ISSO ME|"
                   "*INCOMODOU*|SE VOCÊ|NÃO ESCREVE|A CABEÇA ESCREVE|A *PIOR* VERSÃO"},
    6: {"arquivo": "clones/voz-fabio-f.mp4", "desloc": 0.04,
        "palavras": [("ESSE", 0.00), ("PONTINHO", 0.26), ("AQUI", 0.68), ("É", 0.86), ("A", 1.10),
                     ("ETAPA", 1.34), ("UM", 1.64), ("EM", 2.24), ("QUE", 2.32), ("NÚMERO", 2.40),
                     ("VOCÊ", 2.64), ("COSTUMA", 2.88), ("PERCEBER", 3.22), ("ME", 3.88), ("RESPONDE", 4.06),
                     ("AQUI", 4.44), ("EMBAIXO", 4.54)],
        "fim": 4.76,
        "legenda": "ESSE *PONTINHO*|AQUI É A|ETAPA *UM*|EM QUE NÚMERO|VOCÊ COSTUMA|*PERCEBER*|"
                   "ME RESPONDE|AQUI *EMBAIXO*"},
}

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
    x = np.asarray(x, dtype=np.float32)
    canais = 1 if x.ndim == 1 else x.shape[1]
    x.tofile(tmp)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", str(canais), "-i", tmp,
                    "-c:a", "pcm_f32le", p], check=True)
    os.remove(tmp)


# 1. VOZ ------------------------------------------------------------------
voz = np.zeros(int(TOTAL * SR) + SR, dtype=np.float32)
partes_clone = []  # (início, áudio) das cenas com fala original
frases_t = []  # (ini, fim, texto, legenda, tempos das palavras ou None)
dur_bloco = {b: n / FPS for b, n, _ in BLOCOS}
for b, _, fala in BLOCOS:
    if b in CLONES:
        c = CLONES[b]
        x = ffmpeg_f32(["-ss", str(c["desloc"]), "-t", f"{dur_bloco[b]:.4f}", "-i", os.path.join(AQUI, c["arquivo"]),
                        "-af", "afade=t=in:d=0.01,areverse,afade=t=in:d=0.03,areverse"])
        partes_clone.append((inicio_bloco[b], x))
        t0 = inicio_bloco[b] - c["desloc"]
        tempos = [max(inicio_bloco[b], t0 + w[1]) for w in c["palavras"]]
        frases_t.append((tempos[0], t0 + c["fim"], " ".join(w[0] for w in c["palavras"]), c["legenda"], tempos))
        continue
    t = inicio_bloco[b] + fala
    lista = [(i, f) for i, f in enumerate(FRASES) if f[0] == b]
    for k, (i, (_, a, z, txt)) in enumerate(lista):
        x = cortar(b, a, z)
        i0 = int(round(t * SR))
        voz[i0:i0 + len(x)] += x
        frases_t.append((t, t + len(x) / SR, txt, LEGENDA[i], None))
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
for t in (B2, B6):  # depois do grito fica o silêncio
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
    pico = np.abs(x) if x.ndim == 1 else np.abs(x).max(axis=1)
    g = np.minimum(1.0, teto / np.maximum(pico, 1e-9))
    n = int(0.004 * SR)  # 4 ms antes e depois de cada pico
    from numpy.lib.stride_tricks import sliding_window_view
    gp = np.pad(g, (n, n), constant_values=1.0)
    g = sliding_window_view(gp, 2 * n + 1).min(axis=1)
    g = np.convolve(g, np.ones(n) / n, "same")
    g = np.minimum(g, 1.0)
    return x * (g if x.ndim == 1 else g[:, None])


def ao_alvo(x, alvo, teto_db):
    y = x * 10 ** ((alvo - lufs(x)) / 20)
    for _ in range(3):  # o limitador baixa um pouco o volume; corrige
        y = limitar(y, teto_db)
        y = y * 10 ** ((alvo - lufs(y)) / 20)
    return limitar(y, teto_db)


N = int(round(TOTAL * SR))
voz = ao_alvo(voz[:N], -15.0, -2.0)  # narração (frames 2, 3 e 4)
for t0, x in partes_clone:  # fala original dos clones, cada uma em -15 LUFS
    x = ao_alvo(x, -15.0, -2.0)
    i0 = int(round(t0 * SR))
    x = x[: N - i0]
    voz[i0:i0 + len(x)] += x
fx = fx[:N]
gravar(f"{AQUI}/_voz.wav", voz)
gravar(f"{AQUI}/_fx.wav", fx)

# TRILHA: Cold Silence (Suno). Mapa da faixa a 150 BPM: parte calma de
# 128,3 a 141,1 s, clímax de 141,1 a 153 s, final de 153 a 157 s.
# Um trecho contínuo vai do começo do vídeo até o GRITO, com a batida
# 151,46 s da faixa caindo no quadro em que o círculo cola. Assim a parte
# calma entra na etapa 1 e o clímax entra junto com o frame 4.
# Depois do grito: silêncio, pad da introdução no clone com a etiqueta e o
# final real da música na chamada final.
r = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(AQUI, "trilha/cold-silence.m4a"),
                    "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
musica = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()


def trecho(a, b, fin, fout):
    seg = musica[int(round(a * SR)):int(round(b * SR))].copy()
    ni, no = int(fin * SR), int(fout * SR)
    if ni:
        seg[:ni] *= np.linspace(0, 1, ni)[:, None]
    if no:
        seg[-no:] *= np.linspace(1, 0, no)[:, None]
    return seg


trilha = np.zeros((N, 2), dtype=np.float32)


def poe_trilha(seg, t):
    i0 = int(round(t * SR))
    seg = seg[: max(0, N - i0)]
    trilha[i0:i0 + len(seg)] += seg


GRITO = B4 + c4["circulo"]
BATIDA_GRITO = 151.46
desloc = BATIDA_GRITO - GRITO
poe_trilha(trecho(desloc, BATIDA_GRITO, 0.12, 0.012), 0.0)
FINAL_FAIXA = (152.25, 157.04)  # do último compasso do clímax ao fim da música
inicio_final = TOTAL - (FINAL_FAIXA[1] - FINAL_FAIXA[0])  # termina junto com o vídeo
intro = min(6.0, inicio_final - B5)  # pad da introdução, até a batida entrar
poe_trilha(trecho(6.0 - intro, 6.0 + 0.15, 0.3, 0.15), inicio_final - intro)
poe_trilha(trecho(FINAL_FAIXA[0], FINAL_FAIXA[1], 0.15, 0.05), inicio_final)
print(f"trilha: faixa {desloc:.2f} a {BATIDA_GRITO:.2f} s no vídeo 0 a {GRITO:.2f} s; "
      f"calma entra em {128.32 - desloc:.2f} s, clímax em {141.08 - desloc:.2f} s")
alvo_trilha = -15.0 - 13.0  # 13 dB abaixo da voz, antes do ducking
trilha = trilha * 10 ** ((alvo_trilha - lufs(trilha)) / 20)
# quando a última fala termina, a trilha sobe 7 dB até o fim
fim_fala = frases_t[-1][1] + 0.15
ganho = np.ones(N, dtype=np.float32)
i0 = min(N, int(fim_fala * SR))
rampa = np.linspace(1, 10 ** (7 / 20), int(0.5 * SR))[: N - i0]
ganho[i0:i0 + len(rampa)] = rampa
ganho[i0 + len(rampa):] = 10 ** (7 / 20)
trilha = trilha * ganho[:, None]
gravar(f"{AQUI}/_trilha.wav", trilha)

r = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{AQUI}/_voz.wav", "-i", f"{AQUI}/_fx.wav",
                    "-i", f"{AQUI}/_trilha.wav", "-filter_complex",
                    "[1:a]treble=g=-6:f=6000,pan=stereo|c0=c0|c1=c0[f];"
                    "[2:a]treble=g=-4:f=6000[t];"
                    "[0:a]pan=stereo|c0=c0|c1=c0,asplit=3[v][sc1][sc2];"
                    "[f][sc1]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=250[fd];"
                    "[t][sc2]sidechaincompress=threshold=0.05:ratio=3:attack=30:release=400[td];"
                    "[v][fd][td]amix=inputs=3:normalize=0:duration=first[m]",
                    "-map", "[m]", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
mix = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()
mix = np.pad(mix, ((0, max(0, N - len(mix))), (0, 0)))[:N]
mix = ao_alvo(mix, -14.0, -1.5)
os.makedirs(PUB, exist_ok=True)
gravar(f"{PUB}/_mix_f32.wav", mix)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{PUB}/_mix_f32.wav", "-c:a", "pcm_s16le", f"{PUB}/mix.wav"],
               check=True)
os.remove(f"{PUB}/_mix_f32.wav")

# 4. LEGENDA --------------------------------------------------------------
def silabas(p):
    return max(1, len(re.findall(r"[AEIOUÁÉÍÓÚÂÊÔÃÕÀY]+", p.upper())))


grupos = []
destaque_n = 0
for ini, fim, txt, leg, tempos_reais in frases_t:
    partes = [g.split() for g in leg.split("|")]
    palavras = [w for g in partes for w in g]
    if tempos_reais is not None:
        assert len(tempos_reais) == len(palavras), (leg, len(tempos_reais), len(palavras))
        tempos = tempos_reais
    else:
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
                    aberto = "sem"  # uma fonte só no destaque (pedido de 02/11)
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
for ini, fim, txt, *_ in frases_t:
    print(f"  {ini:6.2f} a {fim:6.2f}  {txt}")
