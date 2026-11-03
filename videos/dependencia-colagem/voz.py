"""Corta silêncio de cada bloco com folga (-55 dB, 0,12 s antes, 0,30 s depois),
encurta pausas internas > 0,6 s e junta os blocos com 0,35 s. Gera audio/voz.wav e audio/blocos.json."""
import json, subprocess, wave
import numpy as np
SR = 48000
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()
def db(x):
    return 20 * np.log10(np.maximum(1e-9, x))
def env(x, win=0.01):
    n = int(win * SR); k = len(x) // n
    return db(np.sqrt((x[:k * n].reshape(k, n) ** 2).mean(1))), n
out, blocks, t = [], [], 0.0
GAP = 0.35
for i in range(1, 11):
    x = load(f'audio/b{i}.wav')
    e, n = env(x)
    on = np.where(e > -55)[0]
    s = max(0, on[0] * n - int(0.12 * SR)); f = min(len(x), (on[-1] + 1) * n + int(0.30 * SR))
    x = x[s:f]
    # pausas internas
    e, n = env(x)
    quiet = e < -50
    keep = np.ones(len(x), bool)
    j = 0
    while j < len(quiet):
        if quiet[j]:
            k = j
            while k < len(quiet) and quiet[k]:
                k += 1
            dur = (k - j) * n / SR
            if dur > 0.6 and j > 0 and k < len(quiet):
                cut = dur - 0.45
                a = j * n + int((dur - cut) / 2 * SR)
                keep[a:a + int(cut * SR)] = False
            j = k
        else:
            j += 1
    x = x[keep]
    blocks.append({'k': i, 's': round(t, 3), 'e': round(t + len(x) / SR, 3)})
    out.append(x); t += len(x) / SR
    out.append(np.zeros(int(GAP * SR), np.float32)); t += GAP
y = np.concatenate(out)
with wave.open('audio/voz.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump(blocks, open('audio/blocos.json', 'w'), indent=1)
print(blocks, round(t, 2))
