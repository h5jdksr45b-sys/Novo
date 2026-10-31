"""Sons de moeda e papel sintetizados, trilha baixa e mixagem com a voz."""
import json, math, wave, subprocess
import numpy as np
ROOT = __file__.rsplit('/', 1)[0]
SR = 48000
T = json.load(open(f'{ROOT}/audio/timeline.json'))
EV = json.load(open(f'{ROOT}/audio/events.json'))
N = int((T['end'] + 0.5) * SR)
rng = np.random.default_rng(5)
sfx = np.zeros(N, np.float32)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def coin(level=0.5, pitch=1.0):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, np.float32)
    for f, d, a in ((2380, 0.22, 1.0), (3710, 0.16, 0.7), (5520, 0.10, 0.5), (7140, 0.06, 0.35)):
        f *= pitch * rng.uniform(0.98, 1.02)
        out += a * np.sin(2 * math.pi * f * t) * np.exp(-t / d)
    click = rng.normal(0, 1, n) * np.exp(-t / 0.004)
    return (out * 0.5 + click * 0.6) * level


def bandnoise(dur, lo, hi, a, d, level):
    n = int(dur * SR)
    x = rng.normal(0, 1, n)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    X[(fr < lo) | (fr > hi)] = 0
    x = np.fft.irfft(X, n)
    x /= np.abs(x).max() + 1e-9
    return (x * env(n, a, d) * level).astype(np.float32)


def rip():
    n = int(0.55 * SR)
    x = bandnoise(0.55, 800, 7000, 0.02, 0.3, 1.0)
    crack = (rng.random(n) < 0.02).astype(np.float32) * rng.uniform(0.5, 1, n)
    crack = np.convolve(crack, np.exp(-np.arange(200) / 30), 'same')
    return (x * 0.5 + crack * 0.25) * 0.55


SOUNDS = {
    'coin': lambda: coin(0.45, rng.uniform(0.9, 1.15)),
    'coin_soft': lambda: coin(0.18, rng.uniform(0.95, 1.1)),
    'flip': lambda: np.concatenate([bandnoise(0.06, 2000, 8000, 0.005, 0.02, 0.15), coin(0.38, 1.05)]),
    'paper': lambda: bandnoise(0.18, 1500, 6000, 0.01, 0.05, 0.22),
    'flick': lambda: bandnoise(0.10, 2500, 8000, 0.005, 0.03, 0.12),
    'snip': lambda: np.concatenate([bandnoise(0.05, 3000, 9000, 0.001, 0.008, 0.25), np.zeros(int(0.07 * SR), np.float32), bandnoise(0.05, 3000, 9000, 0.001, 0.008, 0.2)]),
    'hit': lambda: bandnoise(0.3, 60, 400, 0.005, 0.12, 0.25) + bandnoise(0.3, 1500, 5000, 0.002, 0.03, 0.08),
    'glow': lambda: coin(0.22, 0.8),
    'rip': rip,
}
for t, kind in EV:
    s = SOUNDS[kind]().astype(np.float32)
    i = int(t * SR)
    j = min(N, i + len(s))
    if i < N:
        sfx[i:j] += s[:j - i]

# trilha: pad suave em lá menor, bem baixo
t = np.arange(N) / SR
chords = [(220.0, 261.6, 329.6), (174.6, 220.0, 261.6), (196.0, 246.9, 293.7), (164.8, 207.7, 246.9)]
pad = np.zeros(N, np.float32)
seg = 4.0
for k in range(int(T['end'] / seg) + 2):
    c = chords[k % 4]
    i0 = int(k * seg * SR)
    n = int((seg + 1.0) * SR)
    tt = np.arange(n) / SR
    e = np.minimum(1, tt / 1.2) * np.minimum(1, np.maximum(0, (seg + 1.0 - tt)) / 1.2)
    w = sum(np.sin(2 * math.pi * f * tt) + 0.3 * np.sin(2 * math.pi * f * 2 * tt) for f in c) * e
    j = min(N, i0 + n)
    if i0 < N:
        pad[i0:j] += w[:j - i0].astype(np.float32)
pad /= np.abs(pad).max()
pad *= 0.035
fade = np.minimum(1, t / 0.8) * np.minimum(1, np.maximum(0, (T['end'] - t)) / 1.0)
mix = sfx + pad * fade


def wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x * 32767).astype(np.int16).tobytes())


wav(f'{ROOT}/audio/fundo.wav', mix)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{ROOT}/audio/voz_esticada.wav', '-i', f'{ROOT}/audio/fundo.wav',
                '-filter_complex', '[0:a]apad[v];[v][1:a]amix=inputs=2:duration=shortest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[m]',
                '-map', '[m]', '-ar', '48000', '-ac', '2', f'{ROOT}/audio/mix.wav'], check=True)
print('ok')
