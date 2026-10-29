"""Enxuga as pausas longas da narração e grava os tempos de cada frase.

Saída: audio/narracao.wav (-14 LUFS) e build/tempos.json.
As 13 frases do roteiro batem uma a uma com os 13 trechos de fala separados por pausa.
"""
import json
import re
import subprocess

import numpy as np

ROOT = __file__.rsplit('/', 1)[0]
SR = 48000
FRASES = ['Você parou de se machucar.', 'E a vida', 'ainda não andou.',
          'Um estudo seguiu 290 pessoas com borderline por dezesseis anos.', 'E mediu duas chegadas diferentes.',
          'Quase todas saíram do diagnóstico.', 'Seis em cada dez recuperaram trabalho e vínculo.',
          'O que assusta sai primeiro.', 'O que demora', 'é o vazio', 'e o medo de ficar só.',
          'Parar a crise é a primeira chegada.', 'O tratamento não acaba nela.']
GAP_MAX, GAP_ALVO, PRE, POS = 0.45, 0.36, 0.10, 0.14


def main():
    src = f'{ROOT}/audio/narracao-original.mp3'
    log = subprocess.run(['ffmpeg', '-i', src, '-af', 'silencedetect=n=-40dB:d=0.18', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', log)]
    en = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', log)]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy()
    dur = len(a) / SR
    # início da fala: primeiro ponto acima de -40 dB
    env = np.convolve(np.abs(a), np.ones(480) / 480, 'same')
    first = np.argmax(env > 10 ** (-40 / 20)) / SR
    falas, s0 = [], first
    for s, e in zip(st, en):
        falas.append((s0, s))
        s0 = e
    if s0 < dur - 0.05:
        falas.append((s0, dur))
    assert len(falas) == len(FRASES), (len(falas), falas)

    out, tempos, cur = [], [], 0.0
    fade = int(0.015 * SR)

    def piece(t0, t1):
        x = a[int(t0 * SR):int(t1 * SR)].copy()
        r = np.linspace(0, 1, fade)
        x[:fade] *= r
        x[-fade:] *= r[::-1]
        return x

    for i, (s, e) in enumerate(falas):
        a0 = max(0.0, s - PRE) if i == 0 else s - PRE
        a1 = e + POS
        if i + 1 < len(falas):
            gap = falas[i + 1][0] - e
            if gap <= GAP_MAX:
                a1 = falas[i + 1][0] - PRE  # mantém a pausa inteira
            else:
                a1 = e + (GAP_ALVO - PRE)
        seg = piece(a0, a1)
        tempos.append({'frase': FRASES[i], 'ini': round(cur + (s - a0), 3), 'fim': round(cur + (e - a0), 3)})
        out.append(seg)
        cur += len(seg) / SR
    audio = np.concatenate(out)
    tmp = f'{ROOT}/build/narr-raw.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', tmp],
                   input=audio.tobytes(), check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR),
                    f'{ROOT}/audio/narracao.wav'], check=True)
    json.dump({'duracao': round(cur, 3), 'frases': tempos}, open(f'{ROOT}/build/tempos.json', 'w'),
              ensure_ascii=False, indent=1)
    print('duração', round(cur, 2))
    for t in tempos:
        print(f"{t['ini']:6.2f} {t['fim']:6.2f}  {t['frase']}")


if __name__ == '__main__':
    main()
