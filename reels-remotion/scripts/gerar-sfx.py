# Gera efeitos sonoros sintéticos para a demonstração (public/sfx).
# drone.wav: cama grave com pulso lento. riser.wav: sopro agudo que sobe até o corte.
# impacto.wav: batida grave curta. Troque por biblioteca licenciada no vídeo final.
import os, wave
import numpy as np

SR = 44100
RAIZ = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(RAIZ, exist_ok=True)

def salvar(nome, x):
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(RAIZ, nome), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print("ok", nome, f"{len(x)/SR:.1f}s")

rng = np.random.default_rng(3)

# drone: 16 s em loop. Duas senoides graves + ruído filtrado + pulso a cada 3 s.
t = np.arange(SR * 16) / SR
drone = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.25 * np.sin(2 * np.pi * 110.3 * t) + 0.12 * np.sin(2 * np.pi * 82.4 * t)
lfo = 0.75 + 0.25 * np.sin(2 * np.pi * t / 16)  # período igual ao loop, sem salto
ruido = rng.normal(0, 1, len(t))
# passa-baixa simples (média móvel) para o ruído virar "ar"
kernel = np.ones(400) / 400
ar = np.convolve(ruido, kernel, mode="same")
pulso = np.zeros_like(t)
for k in range(0, 16, 3):
    idx = int(k * SR)
    n = min(int(SR * 1.2), len(t) - idx)
    env = np.exp(-np.linspace(0, 6, n))
    pulso[idx: idx + n] += 0.8 * np.sin(2 * np.pi * 48 * np.arange(n) / SR) * env
drone = (drone * lfo + 1.5 * ar + pulso) * 0.28
salvar("drone.wav", drone)

# riser: 1.1 s de ruído com passa-alta progressiva e volume subindo.
n = int(SR * 1.1)
t = np.arange(n) / SR
ruido = rng.normal(0, 1, n)
suave = np.convolve(ruido, np.ones(40) / 40, mode="same")
mistura = np.linspace(0, 1, n) ** 2
riser = (suave * (1 - mistura) + ruido * mistura) * (np.linspace(0.02, 1, n) ** 2.2)
varredura = np.sin(2 * np.pi * np.cumsum(np.linspace(180, 1400, n)) / SR) * mistura * 0.15
riser = (riser * 0.35 + varredura)
riser[-int(SR * 0.02):] *= np.linspace(1, 0, int(SR * 0.02))
salvar("riser.wav", riser)

# impacto: sub de 50 Hz caindo para 38 Hz, com clique curto.
n = int(SR * 1.4)
t = np.arange(n) / SR
freq = 50 * np.exp(-t * 1.6) + 36
fase = 2 * np.pi * np.cumsum(freq) / SR
env = np.exp(-t * 3.2)
sub = np.sin(fase) * env
clique = rng.normal(0, 1, n) * np.exp(-t * 90) * 0.5
impacto = (sub * 0.9 + clique) * 0.8
salvar("impacto.wav", impacto)
