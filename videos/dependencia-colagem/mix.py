"""Efeitos de papel sintetizados + pad baixo; voz normalizada sozinha a -15 LUFS,
fundo com ducking pela voz, mix final -14 LUFS (regra de 31/10)."""
import json, math, wave, subprocess
import numpy as np
SR = 48000
T = json.load(open('audio/timeline.json'))
EV = json.load(open('audio/events.json'))
N = int(T['end'] * SR)
rng = np.random.default_rng(5)
def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bandnoise(dur, lo, hi, a, d, level):
    n = int(dur * SR); x = rng.normal(0, 1, n); X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    X[(fr < lo) | (fr > hi)] = 0; x = np.fft.irfft(X, n); x /= np.abs(x).max() + 1e-9
    return (x * env(n, a, d) * level).astype(np.float32)
def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 900 * np.exp(-t * 18) + 300
    return (np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t / 0.03) * 0.35).astype(np.float32)
def whoosh():
    n = int(0.5 * SR); x = bandnoise(0.5, 300, 3000, 0.2, 0.15, 1.0)
    return x * np.sin(np.linspace(0, math.pi, n)) * 0.35
SOUNDS = {
    'paper': lambda: bandnoise(0.16, 1500, 6000, 0.01, 0.05, 0.25),
    'snip': lambda: np.concatenate([bandnoise(0.05, 3000, 9000, 0.001, 0.008, 0.25), np.zeros(int(0.07 * SR), np.float32), bandnoise(0.05, 3000, 9000, 0.001, 0.008, 0.2)]),
    'pop': pop,
    'fall': lambda: bandnoise(0.6, 800, 5000, 0.05, 0.25, 0.25),
    'rip': lambda: bandnoise(0.5, 800, 7000, 0.02, 0.25, 0.4),
    'whoosh': whoosh,
}
sfx = np.zeros(N, np.float32)
for t, kind in EV:
    s = SOUNDS[kind](); i = int(t * SR); j = min(N, i + len(s))
    if 0 <= i < N:
        sfx[i:j] += s[:j - i]
t = np.arange(N) / SR
chords = [(220.0, 261.6, 329.6), (174.6, 220.0, 261.6), (261.6, 329.6, 392.0), (196.0, 246.9, 293.7)]
pad = np.zeros(N, np.float32); seg = 4.0
for k in range(int(T['end'] / seg) + 2):
    c = chords[k % 4]; i0 = int(k * seg * SR); n = int((seg + 1.0) * SR); tt = np.arange(n) / SR
    e = np.minimum(1, tt / 1.2) * np.minimum(1, np.maximum(0, (seg + 1.0 - tt)) / 1.2)
    w = sum(np.sin(2 * math.pi * f * tt) + 0.25 * np.sin(2 * math.pi * f * 2 * tt) for f in c) * e
    j = min(N, i0 + n)
    if i0 < N:
        pad[i0:j] += w[:j - i0].astype(np.float32)
pad /= np.abs(pad).max()
fade = np.minimum(1, t / 0.8) * np.minimum(1, np.maximum(0, (T['end'] - t)) / 1.2)
bed = sfx + pad * 0.08 * fade
def wav(path, x):
    with wave.open(path, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
wav('audio/fundo.wav', bed)
D = T['end']
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'audio/voz.wav', '-i', 'audio/fundo.wav', '-filter_complex',
    f'[0:a]aresample=48000,loudnorm=I=-15:TP=-2:LRA=11,apad,atrim=0:{D}[v];'
    f'[1:a]volume=-15dB,treble=g=-6[f];[v]asplit[v1][v2];'
    f'[f][v2]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[fd];'
    f'[v1][fd]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[m]',
    '-map', '[m]', '-ar', '48000', '-ac', '2', 'audio/mix.wav'], check=True)
print('ok')
