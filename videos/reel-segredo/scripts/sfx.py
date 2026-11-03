# Efeitos de papel sintetizados, baixos, sem grave. Saida: wav 48 kHz estereo com a duracao da cena.
import sys, numpy as np, wave
SR = 48000; DUR = float(sys.argv[2]); OUT = sys.argv[1]
rng = np.random.default_rng(11)
buf = np.zeros(int(DUR * SR))
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))
def put(t, sig, peak_db):
    sig = sig / (np.max(np.abs(sig)) + 1e-9) * 10 ** (peak_db / 20)
    i = int(t * SR); j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i]
def env(n, a=0.004, d=0.05):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)
def flick(dur=0.07): n = int(dur * SR); return band(rng.normal(0, 1, n), 2000, 7000) * env(n, 0.002, 0.018)
def stamp(): n = int(0.09 * SR); return band(rng.normal(0, 1, n), 450, 3200) * env(n, 0.001, 0.022)
def tape():
    n = int(0.16 * SR); x = band(rng.normal(0, 1, n), 1500, 8000)
    crack = (rng.random(n) < 0.004).astype(float); crack = np.convolve(crack, np.ones(60), 'same')
    return x * (0.4 + crack) * env(n, 0.003, 0.08)
def pen(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = band(rng.normal(0, 1, n), 1500, 5500) * (0.55 + 0.45 * np.sin(2 * np.pi * 17 * t))
    return x * np.minimum(t / 0.02, 1) * np.minimum((dur - t) / 0.05, 1)
def rustle(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = band(rng.normal(0, 1, n), 1000, 7000)
    crack = np.convolve((rng.random(n) < 0.003).astype(float), np.ones(120), 'same')
    return x * (0.3 + crack) * np.minimum(t / 0.03, 1) * np.minimum((dur - t) / 0.1, 1)
for i in range(6): put(0.2 + i * 0.26 + 0.62, flick(), -31)
put(1.95, stamp(), -27)
put(2.89, tape(), -30)
put(5.695, pen(0.36), -30)
put(9.035, rustle(0.5), -30)
st = np.stack([buf, buf], 1)
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(st, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
print('sfx ok')
