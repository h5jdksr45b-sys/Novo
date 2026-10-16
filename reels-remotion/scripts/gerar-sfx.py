# Gera os efeitos sonoros sintéticos usados no Reel Imprevisto.
# Uso: python3 scripts/gerar-sfx.py public/sfx
import sys, wave, os
import numpy as np

SR = 48000
out = sys.argv[1]
rng = np.random.default_rng(7)

def t(d):
    return np.arange(int(SR * d)) / SR

def env(n, a=0.005, r=None):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    if r:
        e *= np.exp(-np.arange(n) / (r * SR))
    return e

def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")

def save(name, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], axis=1)
    with wave.open(os.path.join(out, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

# Pop curto
tt = t(0.12)
f = 900 * np.exp(-tt * 30) + 300
save("pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.03), 0.6)

# Tecla
tt = t(0.04)
save("tecla.wav", lowpass(rng.standard_normal(len(tt)), 3) * env(len(tt), 0.001, 0.006), 0.35)

# Envio: whoosh ascendente
tt = t(0.45)
n = rng.standard_normal(len(tt))
sweep = np.concatenate([lowpass(n[i:i+2400], max(2, int(30 - 28 * i / len(tt)))) for i in range(0, len(tt), 2400)])[:len(tt)]
shape = np.sin(np.pi * np.linspace(0, 1, len(tt))) ** 2
save("whoosh.wav", sweep * shape, 0.55)

# Notificação: dois toques de sino
def bell(f, d):
    tt = t(d)
    return (np.sin(2*np.pi*f*tt) + 0.4*np.sin(2*np.pi*2.01*f*tt) + 0.2*np.sin(2*np.pi*3.02*f*tt)) * env(len(tt), 0.003, 0.18)
a = bell(1318.5, 0.6); b = bell(1760, 0.8)
x = np.zeros(int(SR * 0.95)); x[:len(a)] += a; s = int(SR * 0.13); x[s:s+len(b)] += b
save("notificacao.wav", x, 0.5)

# Impacto grave
tt = t(0.9)
f = 110 * np.exp(-tt * 4) + 42
body = np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.002, 0.28)
click = lowpass(rng.standard_normal(len(tt)), 4) * env(len(tt), 0.001, 0.012)
save("impacto.wav", body + 0.5 * click, 0.85)

# Peso: baque abafado
tt = t(0.5)
f = 70 * np.exp(-tt * 6) + 38
save("peso.wav", np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.003, 0.14) + 0.2*lowpass(rng.standard_normal(len(tt)), 40)*env(len(tt),0.001,0.05), 0.7)

# Alívio: ruído que desce e some, como uma expiração
tt = t(1.1)
n = lowpass(rng.standard_normal(len(tt)), 18)
save("alivio.wav", n * np.sin(np.pi * np.linspace(0, 1, len(tt)) ** 0.6) ** 2, 0.4)

# Riser curto
tt = t(1.0)
f = 200 + 900 * tt ** 2
x = np.sin(2*np.pi*np.cumsum(f)/SR) * 0.3 + lowpass(rng.standard_normal(len(tt)), 6) * 0.5
save("riser.wav", x * (tt / tt[-1]) ** 2, 0.4)

# Tique de transição
tt = t(0.06)
save("tique.wav", np.sin(2*np.pi*2400*tt) * env(len(tt), 0.001, 0.012), 0.3)

# Laço: dois toques que giram (para o ciclo)
tt = t(0.5)
f = 500 + 300 * np.sin(2*np.pi*4*tt)
save("laco.wav", np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.01, 0.15), 0.35)
print("ok")
