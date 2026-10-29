"""Sintetiza os efeitos sonoros do vídeo a partir de eventos [tempo, tipo] em JSON."""
import json, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)

def db(x): return 10 ** (x / 20)
def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def norm(x, peak_db):
    return x / (np.max(np.abs(x)) + 1e-9) * db(peak_db)

def bandnoise(n, lo, hi):
    f = np.fft.rfft(rng.standard_normal(n))
    fr = np.fft.rfftfreq(n, 1 / SR)
    f[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(f, n)

def whoosh():
    n = int(.26 * SR); t = np.arange(n) / SR
    x = bandnoise(n, 300, 5000)
    # varredura: filtro passa-baixa móvel simples
    out = np.zeros(n); y = 0
    for i in range(n):
        a = .03 + .5 * (i / n)
        y += a * (x[i] - y); out[i] = y
    e = np.sin(np.pi * t / t[-1]) ** 1.6
    return norm(out * e, -27)
def click():
    n = int(.012 * SR); return norm(bandnoise(n, 1500, 9000) * env(n, .0003, .003), -26)
def tick():
    n = int(.01 * SR); return norm(bandnoise(n, 2500, 9000) * env(n, .0002, .002), -33)
def pop():
    n = int(.09 * SR); t = np.arange(n) / SR
    f = 700 + 500 * np.exp(-t / .02)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .03), -28)
def ping():
    n = int(.45 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 1320 * t) * env(n, .003, .12)
    s2 = np.zeros(n); k = int(.09 * SR)
    s2[k:] = np.sin(2 * np.pi * 1760 * t[:n - k]) * env(n - k, .003, .16)
    return norm(s + s2, -24)
def swipe():
    n = int(.4 * SR); t = np.arange(n) / SR
    return norm(bandnoise(n, 2000, 7000) * np.sin(np.pi * t / t[-1]) ** .8, -33)
def tap():
    n = int(.06 * SR); t = np.arange(n) / SR
    return norm((bandnoise(n, 150, 1200) + .5 * np.sin(2 * np.pi * 180 * t)) * env(n, .001, .015), -28)
def rise():
    n = int(.8 * SR); t = np.arange(n) / SR
    f = 300 + 500 * (t / t[-1]) ** 2
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / t[-1]) ** 2
    return norm(s + .4 * bandnoise(n, 500, 3000) * np.sin(np.pi * t / t[-1]), -32)

def flame():
    n = int(.6 * SR); t = np.arange(n) / SR
    return norm(bandnoise(n, 800, 6000) * env(n, .01, .2) * (1 + .5 * np.sin(2 * np.pi * 18 * t)), -31)
def crash():
    n = int(.5 * SR); out = np.zeros(n)
    for k, (d, lo) in enumerate([(0, 2500), (.03, 3500), (.07, 2000), (.12, 4500), (.19, 3000)]):
        i = int(d * SR); m = int(.12 * SR)
        out[i:i + m] += bandnoise(m, lo, lo * 2.2) * env(m, .0005, .03) * (1 - k * .12)
    return norm(out, -25)

def paper():
    n = int(.22 * SR); t = np.arange(n) / SR
    out = bandnoise(n, 1800, 7000) * env(n, .004, .05)
    for d in (.06, .11):
        i = int(d * SR); m = int(.05 * SR)
        out[i:i + m] += bandnoise(m, 2500, 8000) * env(m, .001, .012) * .8
    return norm(out, -30)

GEN = dict(flame=flame, crash=crash, whoosh=whoosh, click=click, tick=tick, pop=pop, ping=ping, swipe=swipe, tap=tap, rise=rise, paper=paper)

events, dur, out = json.load(open(sys.argv[1])), float(sys.argv[2]), sys.argv[3]
mix = np.zeros((int(dur * SR) + SR, 2))
for t, kind, *pan in events:
    s = GEN[kind](); p = pan[0] if pan else 0
    i = int(t * SR); j = min(len(mix), i + len(s))
    mix[i:j, 0] += s[:j - i] * (1 - max(0, p)); mix[i:j, 1] += s[:j - i] * (1 + min(0, p))
mix = mix[:int(dur * SR)]
pk = np.max(np.abs(mix))
if pk > db(-1): mix *= db(-1) / pk
w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix * 32767).astype('<i2').tobytes()); w.close()
print('sfx ok', len(events), 'eventos, pico', round(20 * np.log10(np.max(np.abs(mix)) + 1e-9), 1), 'dBFS')
