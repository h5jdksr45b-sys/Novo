"""Vinheta do logo Atalho: animação 3D completa + pausa, com o começo da Marimba Lift."""
import subprocess, wave
import numpy as np
from engine import *
from videos import OUT, BEAT0

DUR = LOGO_N / 12 + 1.4
sc = [Scene(DUR, None, [], overlays=[logo_overlay(1)], whoosh=False)]
f, tot = render_video('atalho-logo', '#191340', sc, OUT)
w = wave.open(f'{ROOT}/musica/full48.wav')
sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
y = x[int(BEAT0 * sr):int((BEAT0 + tot) * sr)].copy()
fade = int(0.9 * sr)
y[-fade:] *= np.linspace(1, 0, fade)[:, None]
with wave.open(f'{OUT}/atalho-logo-musica.wav', 'wb') as o:
    o.setnchannels(2); o.setsampwidth(2); o.setframerate(sr)
    o.writeframes((y * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{OUT}/atalho-logo-noaudio.mp4', '-i', f'{OUT}/atalho-logo-musica.wav',
                '-af', 'loudnorm=I=-14:TP=-1.5', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest',
                '-movflags', '+faststart', f'{OUT}/atalho-logo-3d.mp4'], check=True)
print(f'{OUT}/atalho-logo-3d.mp4', round(tot, 2))
