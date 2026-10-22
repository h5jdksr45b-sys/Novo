# Alinha um texto transcrito com o áudio usando só as pausas da fala (sem modelo de voz).
# Serve quando o Whisper não está disponível. Gera o mesmo JSON de legendas que o sub.mjs.
# Uso: python3 scripts/alinhar-por-pausas.py public/reel-noir/fala.mp4 public/reel-noir/fala.txt public/reel-noir/fala.json
import json, re, subprocess, sys, tempfile, os
import numpy as np

video, texto, saida = sys.argv[1:4]
tmp = tempfile.mkdtemp()
wav = os.path.join(tmp, "a.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)

import wave
w = wave.open(wav); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
hop = int(sr * 0.01)
rms = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a) - hop, hop)])
limiar = max(0.004, np.percentile(rms, 35) * 0.6)
voz = rms > limiar
# fecha buracos menores que 120 ms e descarta trechos de voz menores que 80 ms
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
        if j - i >= 8: segs.append((i * 0.01, j * 0.01))
        i = j
    else:
        i += 1
print("trechos de fala:", len(segs), "pausas significativas:", [round(segs[k + 1][0] - segs[k][1], 2) for k in range(len(segs) - 1) if segs[k + 1][0] - segs[k][1] >= 0.2])

# eixo de "tempo de fala" (sem pausas)
cum = [0.0]
for s, e in segs: cum.append(cum[-1] + (e - s))
T = cum[-1]
def real(t):  # tempo de fala -> tempo real
    for k, (s, e) in enumerate(segs):
        if t <= cum[k + 1] + 1e-9: return s + (t - cum[k])
    return segs[-1][1]
def fala(tr):  # tempo real -> tempo de fala
    for k, (s, e) in enumerate(segs):
        if tr <= e: return cum[k] + max(0.0, tr - s)
    return T

frases = [f.strip() for f in re.split(r"(?<=[.!?])\s+", open(texto, encoding="utf-8").read().strip()) if f.strip()]
peso = lambda p: len(re.sub(r"[^\wÀ-ú]", "", p)) + 1.5
pesos_frase = [sum(peso(p) for p in f.split()) for f in frases]
total = sum(pesos_frase)

# estimativa inicial das fronteiras de frase no eixo de fala, depois encaixe na pausa mais próxima
pausas = [(segs[k][1], segs[k + 1][0]) for k in range(len(segs) - 1) if segs[k + 1][0] - segs[k][1] >= 0.18]
fronteiras = [0.0]
acum = 0
for pf in pesos_frase[:-1]:
    acum += pf
    est = T * acum / total
    est_real = real(est)
    cand = [p for p in pausas if abs(p[0] - est_real) <= 0.9]
    if cand:
        p = min(cand, key=lambda p: abs(p[0] - est_real))
        fronteiras.append(fala(p[0]))
        pausas = [q for q in pausas if q[0] > p[0]]
    else:
        fronteiras.append(est)
fronteiras.append(T)

caps = []
for fi, f in enumerate(frases):
    ini, fim = fronteiras[fi], fronteiras[fi + 1]
    pals = f.split(); ps = [peso(p) for p in pals]; soma = sum(ps)
    t = ini
    for p, pp in zip(pals, ps):
        d = (fim - ini) * pp / soma
        a_, b_ = real(t), real(t + d * 0.92)
        caps.append({"text": " " + p, "startMs": round(a_ * 1000), "endMs": round(max(b_, a_ + 0.05) * 1000), "timestampMs": None, "confidence": None})
        t += d
json.dump(caps, open(saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("palavras:", len(caps), "primeira em", caps[0]["startMs"], "ms, última termina em", caps[-1]["endMs"], "ms")
for fi, f in enumerate(frases):
    print(f"{real(fronteiras[fi]):6.2f}s  {f[:70]}")
