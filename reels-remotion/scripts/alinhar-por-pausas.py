# Alinha um texto transcrito com o áudio sem modelo de voz, em duas camadas:
#  1. fronteiras de frase encaixadas nas pausas do áudio;
#  2. dentro da frase, cada palavra recebe os picos de energia (um pico por sílaba, aproximadamente).
# Gera o mesmo JSON de legendas que o sub.mjs (Whisper). O Whisper continua sendo mais preciso.
# Uso: python3 scripts/alinhar-por-pausas.py public/reel-noir/fala.mp4 public/reel-noir/fala.txt public/reel-noir/fala.json
import json, re, subprocess, sys, tempfile, os, wave
import numpy as np

video, texto, saida = sys.argv[1:4]
tmp = tempfile.mkdtemp()
wav = os.path.join(tmp, "a.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
w = wave.open(wav); sr = w.getframerate()
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
HOP = 0.01
hop = int(sr * HOP)
rms = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a) - hop, hop)])
# envelope suavizado (40 ms) para achar núcleos de sílaba
env = np.convolve(rms, np.ones(4) / 4, mode="same")

limiar = max(0.004, np.percentile(rms, 35) * 0.6)
voz = rms > limiar
def suavizar(m, minimo):
    m = m.copy(); i = 0
    while i < len(m):
        j = i
        while j < len(m) and m[j] == m[i]: j += 1
        if not m[i] and j - i < minimo and i > 0 and j < len(m): m[i:j] = True
        i = j
    return m
voz = suavizar(voz, 12)
segs = []
i = 0
while i < len(voz):
    if voz[i]:
        j = i
        while j < len(voz) and voz[j]: j += 1
        if j - i >= 8: segs.append((i * HOP, j * HOP))
        i = j
    else:
        i += 1

cum = [0.0]
for s, e in segs: cum.append(cum[-1] + (e - s))
T = cum[-1]
def real(t):
    for k, (s, e) in enumerate(segs):
        if t <= cum[k + 1] + 1e-9: return s + (t - cum[k])
    return segs[-1][1]
def fala(tr):
    for k, (s, e) in enumerate(segs):
        if tr <= e: return cum[k] + max(0.0, tr - s)
    return T

frases = [f.strip() for f in re.split(r"(?<=[.!?])\s+", open(texto, encoding="utf-8").read().strip()) if f.strip()]

def silabas(p):
    p = p.lower()
    grupos = re.findall(r"[aeiouáéíóúâêôãõàü]+", p)
    return max(1, len(grupos))

pesos_frase = [sum(silabas(p) + 0.4 for p in f.split()) for f in frases]
total = sum(pesos_frase)

# 1) fronteiras de frase nas pausas (>= 180 ms), pela proporção de sílabas
pausas = [(segs[k][1], segs[k + 1][0]) for k in range(len(segs) - 1) if segs[k + 1][0] - segs[k][1] >= 0.18]
fronteiras = [0.0]
acum = 0
for pf in pesos_frase[:-1]:
    acum += pf
    est_real = real(T * acum / total)
    cand = [p for p in pausas if abs(p[0] - est_real) <= 0.9]
    if cand:
        p = min(cand, key=lambda q: abs(q[0] - est_real))
        fronteiras.append(fala(p[0]))
        pausas = [q for q in pausas if q[0] > p[0]]
    else:
        fronteiras.append(T * acum / total)
fronteiras.append(T)

# 2) dentro da frase: picos do envelope como núcleos de sílaba
def nucleos(t0, t1):
    i0, i1 = int(t0 / HOP), int(t1 / HOP)
    tr = env[i0:i1]
    if len(tr) < 5: return []
    lim = max(limiar * 1.2, np.percentile(tr, 30))
    picos = []
    k = 1
    while k < len(tr) - 1:
        if tr[k] >= tr[k - 1] and tr[k] >= tr[k + 1] and tr[k] > lim:
            if not picos or (k - picos[-1]) >= 8:  # 80 ms entre núcleos
                picos.append(k)
            elif tr[k] > tr[picos[-1]]:
                picos[-1] = k
        k += 1
    return [(i0 + p) * HOP for p in picos]

def onset_antes(t_pico, t_min):
    # volta do pico até o vale anterior (início da sílaba), sem passar de t_min
    k = int(t_pico / HOP); kmin = int(t_min / HOP)
    while k - 1 > kmin and env[k - 1] <= env[k] * 1.001 and env[k - 1] > limiar * 0.8:
        k -= 1
    return max(t_min, k * HOP)

caps = []
relatorio = []
for fi, f in enumerate(frases):
    ini_r, fim_r = real(fronteiras[fi]), real(fronteiras[fi + 1])
    pals = f.split()
    sil = [silabas(p) for p in pals]
    picos = nucleos(ini_r, fim_r)
    usa_picos = len(picos) >= 0.6 * sum(sil) and len(picos) >= len(pals)
    if usa_picos:
        # distribui os picos entre as palavras na proporção das sílabas
        n = len(picos); tot = sum(sil)
        cortes = [0]
        acc = 0
        for s_ in sil[:-1]:
            acc += s_
            cortes.append(int(round(n * acc / tot)))
        cortes.append(n)
        tempos = []
        for wi, p in enumerate(pals):
            a_i, b_i = cortes[wi], max(cortes[wi] + 1, cortes[wi + 1])
            b_i = min(b_i, n)
            p0 = picos[min(a_i, n - 1)]
            inicio = onset_antes(p0, ini_r if wi == 0 else tempos[-1][1])
            fim = picos[b_i - 1] + 0.12 if b_i - 1 < n else fim_r
            tempos.append((inicio, min(fim, fim_r)))
        # garante ordem e fim antes do início seguinte
        for wi in range(len(tempos) - 1):
            if tempos[wi][1] > tempos[wi + 1][0]:
                tempos[wi] = (tempos[wi][0], tempos[wi + 1][0])
        tempos[0] = (ini_r, tempos[0][1])
        tempos[-1] = (tempos[-1][0], fim_r)
    else:
        # proporcional por sílabas no eixo de fala
        ini, fim = fronteiras[fi], fronteiras[fi + 1]
        pesos = [s_ + 0.4 for s_ in sil]; soma = sum(pesos)
        t = ini; tempos = []
        for pp in pesos:
            d = (fim - ini) * pp / soma
            tempos.append((real(t), real(t + d)))
            t += d
    relatorio.append((ini_r, "picos" if usa_picos else "proporcional", len(picos), sum(sil), f[:60]))
    for p, (t0, t1) in zip(pals, tempos):
        caps.append({"text": " " + p, "startMs": round(t0 * 1000), "endMs": round(max(t1, t0 + 0.06) * 1000), "timestampMs": None, "confidence": None})

json.dump(caps, open(saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("palavras:", len(caps))
for r in relatorio:
    print(f"{r[0]:6.2f}s  {r[1]:12s} picos={r[2]:3d} silabas={r[3]:3d}  {r[4]}")
