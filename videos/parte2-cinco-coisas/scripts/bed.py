"""Cama de som neutra: pad suave em lá menor, sem melodia, com respiração lenta. Saída estéreo 48 kHz."""
import sys, wave, numpy as np
SR = 48000
dur = float(sys.argv[1]); out = sys.argv[2]
n = int(dur * SR); t = np.arange(n) / SR
rng = np.random.default_rng(3)
def voice(f, amp, det=0.0, ph=0.0):
    s = np.zeros(n)
    for k, a in ((1, 1.0), (2, .35), (3, .18), (4, .08)):
        s += a * np.sin(2 * np.pi * f * k * (1 + det) * t + ph)
    # vibrato lentíssimo
    s *= 1 + .06 * np.sin(2 * np.pi * .07 * t + ph)
    return amp * s
# acordes: Lá menor (0-28 s), Fá maior (28-46 s), Lá menor (46-fim), com transição suave
A = [(110.0, .9), (164.81, .55), (220.0, .5), (261.63, .35)]      # A2 E3 A3 C4
F = [(87.31, .8), (174.61, .5), (220.0, .5), (261.63, .35)]       # F2 F3 A3 C4
def chord(ch, ph):
    s = np.zeros(n)
    for i, (f, a) in enumerate(ch):
        s += voice(f, a, 0.0, ph + i) + voice(f, a * .6, .0018, ph + i + 1.3) + voice(f, a * .6, -.0018, ph + i + 2.1)
    return s
am, fm = chord(A, 0.0), chord(F, 0.5)
w = np.clip((t - 27.0) / 2.5, 0, 1) * np.clip((45.5 - t) / 2.5, 0, 1)   # peso do Fá
w = np.sin(w * np.pi / 2) ** 2
pad = am * (1 - w) + fm * w
# filtro passa-baixa simples (duas passagens) para tirar brilho
def lp(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y
pad = lp(lp(pad, 900), 900)
# respiração: sobe e desce devagar
pad *= .78 + .22 * np.sin(2 * np.pi * .045 * t - 1.2)
# ar: ruído muito baixo filtrado
air = rng.standard_normal(n); air = lp(air, 400) * 6.0
pad += air * .012
# envelope: entra em 1,5 s, sai em 2 s
env = np.clip(t / 1.5, 0, 1) * np.clip((dur - t) / 2.0, 0, 1)
pad *= env
pad /= np.max(np.abs(pad)) + 1e-9
left = pad * (1 + .05 * np.sin(2 * np.pi * .03 * t)); right = pad * (1 - .05 * np.sin(2 * np.pi * .03 * t))
st = np.stack([left, right], 1) * 0.5
wv = wave.open(out, 'wb'); wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR)
wv.writeframes((st * 32767).astype('<i2').tobytes()); wv.close()
print('bed ok', dur, 's')
