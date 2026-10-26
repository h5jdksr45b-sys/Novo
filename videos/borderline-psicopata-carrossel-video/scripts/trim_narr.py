"""Corte cuidadoso das falas geradas (narr/n{i}.wav -> narr/c{i}.wav).

Detecta início e fim em -55 dB, guarda 0,12 s antes e 0,30 s depois, e só encurta pausas
internas maiores que 0,6 s, tirando o miolo (nunca a borda das palavras). O corte por sox
(silence -42 dB) usado em 26/10 comia o começo e o fim das palavras: não usar.
"""
import io, subprocess, sys, wave
import numpy as np

SR = 48000

def load(f):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'wav', '-'], capture_output=True).stdout
    w = wave.open(io.BytesIO(out))
    return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(float) / 32768

def env(x, win=0.01):
    n = int(SR * win)
    return np.sqrt(np.convolve(x ** 2, np.ones(n) / n, 'same'))

def save(f, x):
    x = np.clip(x, -1, 1)
    st = np.repeat(x[:, None], 2, axis=1)
    w = wave.open(f, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes()); w.close()

def trim(x, lead=.12, tail=.30, th_db=-55, pause_db=-50, max_pause=.6, keep=.2):
    e = env(x)
    loud = np.where(e > 10 ** (th_db / 20))[0]
    a = max(0, loud[0] - int(lead * SR)); b = min(len(x), loud[-1] + int(tail * SR))
    x = x[a:b]; e = e[a:b]
    pad = max(0, int(lead * SR) - loud[0])  # quando o arquivo já começa com voz
    quiet = e < 10 ** (pause_db / 20)
    out = [np.zeros(pad)]; j = 0; n = len(x)
    while j < n:
        k = j
        while k < n and quiet[k] == quiet[j]: k += 1
        if quiet[j] and k - j > int(max_pause * SR):
            kp = int(keep * SR); fade = int(.02 * SR)
            sa = x[j:j + kp].copy(); sb = x[k - kp:k].copy()
            sa[-fade:] *= np.linspace(1, 0, fade); sb[:fade] *= np.linspace(0, 1, fade)
            out += [sa, np.zeros(int(.05 * SR)), sb]
        else:
            out.append(x[j:k])
        j = k
    y = np.concatenate(out)
    f = int(.03 * SR); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y

if __name__ == '__main__':
    d = sys.argv[1] if len(sys.argv) > 1 else 'narr'
    for i in range(1, 9):
        y = trim(load(f'{d}/n{i}.wav'))
        save(f'{d}/c{i}.wav', y)
        print(f'c{i}: {len(y) / SR:.2f} s')
