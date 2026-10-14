"""Gera os efeitos sonoros do projeto do zero, sem arquivo de terceiros.

Uso: python3 scripts/gerar-sfx.py  (a partir de reels-remotion/)
Saída: public/sfx/*.wav, 48 kHz, mono, 16 bits.
"""

import wave
from pathlib import Path

import numpy as np

SR = 48000
OUT = Path("public/sfx")
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def bandpass(x, lo, hi):
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    spec[(freqs < lo) | (freqs > hi)] = 0
    return np.fft.irfft(spec, len(x))


def fade(x, ms=4):
    n = int(SR * ms / 1000)
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def save(name, x, peak=0.7):
    x = fade(x.astype(np.float64))
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


# Pop: bolha curta, tom descendo.
tt = t(0.09)
freq = 820 * np.exp(-tt * 18) + 260
pop = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt * 45)
save("pop", pop, 0.6)

# Clique seco, tipo botão.
tt = t(0.035)
clique = rng.standard_normal(len(tt)) * np.exp(-tt * 400)
clique = bandpass(clique, 1800, 9000) + 0.4 * np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 250)
save("clique", clique, 0.5)

# Whoosh: ruído com faixa subindo e descendo.
tt = t(0.45)
ruido = rng.standard_normal(len(tt))
env = np.sin(np.pi * np.clip(tt / 0.45, 0, 1)) ** 2
whoosh = np.zeros_like(tt)
for i, (lo, hi) in enumerate([(200, 900), (500, 1800), (900, 3200), (500, 1800), (250, 1000)]):
    seg = bandpass(ruido, lo, hi)
    janela = np.exp(-(((tt / 0.45) - i / 4) ** 2) / 0.03)
    whoosh += seg * janela
save("whoosh", whoosh * env, 0.45)

# Papel: grãos curtos e irregulares.
tt = t(0.32)
papel = np.zeros_like(tt)
for _ in range(38):
    c = rng.integers(0, len(tt) - 600)
    n = rng.integers(80, 600)
    g = rng.standard_normal(n) * np.exp(-np.arange(n) / (n / 3))
    papel[c : c + n] += g * rng.uniform(0.3, 1)
papel = bandpass(papel, 1500, 11000) * np.exp(-tt * 4)
save("papel", papel, 0.4)

# Risco de caneta: ruído com vai e vem.
tt = t(0.55)
risco = bandpass(rng.standard_normal(len(tt)), 2200, 7000)
risco *= 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 7 * tt))
risco *= np.minimum(1, tt / 0.03) * np.exp(-tt * 1.5)
save("risco", risco, 0.4)

# Impacto grave e curto para a frase de abertura.
tt = t(0.32)
grave = np.sin(2 * np.pi * (70 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 11)
grave += bandpass(rng.standard_normal(len(tt)), 80, 2500) * np.exp(-tt * 60) * 0.6
save("impacto", grave, 0.75)

# Estalo: algo pequeno quebrando.
tt = t(0.22)
estalo = bandpass(rng.standard_normal(len(tt)), 1200, 10000) * np.exp(-tt * 90)
for atraso in (0.03, 0.06, 0.11):
    i = int(atraso * SR)
    n = 900
    estalo[i : i + n] += bandpass(rng.standard_normal(n), 2000, 9000) * np.exp(-np.arange(n) / 150) * 0.5
save("estalo", estalo, 0.55)

# Ding suave para o fechamento.
tt = t(1.1)
ding = (np.sin(2 * np.pi * 880 * tt) + 0.35 * np.sin(2 * np.pi * 1760 * tt) + 0.12 * np.sin(2 * np.pi * 2640 * tt)) * np.exp(-tt * 4.5)
save("ding", ding, 0.35)

print("SFX gerados em", OUT)
