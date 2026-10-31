"""Estica a narração com respiros entre frases e gera timeline.json e words.json."""
import json, subprocess
ROOT = __file__.rsplit('/', 1)[0]
raw = json.load(open(f'{ROOT}/audio/words_raw.json'))
SCRIPT = ('Nove moedas. Cada uma é um critério do borderline. Cara, a pessoa tem. Coroa, não tem. '
          'Com cinco caras ou mais, fecha o diagnóstico. Isso dá 256 jeitos diferentes. '
          'Duas pessoas podem tirar cinco caras e dividir uma moeda só. Mesmo diagnóstico. '
          'Vidas que quase não se parecem. Por isso, você não tem cara de borderline não quer dizer nada. '
          'Ninguém tira borderline na sorte. A moeda só mostra a conta.').split()
assert len(SCRIPT) == len(raw), (len(SCRIPT), len(raw))
# cortes no silêncio entre frases (s no áudio original) e respiro depois de cada trecho
CUTS = [0.0, 3.40, 5.60, 8.15, 10.50, 13.90, 17.24, 20.20, 24.448]
GAPS = [0.35, 0.35, 1.20, 0.90, 0.90, 0.40, 0.50, 0.0]
KEYS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']
starts, t = [], 0.0
for i in range(8):
    starts.append(t)
    t += (CUTS[i + 1] - CUTS[i]) + GAPS[i]
def remap(x):
    for i in range(8):
        if CUTS[i] <= x <= CUTS[i + 1]:
            return round(starts[i] + x - CUTS[i], 3)
    return x
words = [{'w': SCRIPT[i], 's': remap(w['s']), 'e': remap(w['e'])} for i, w in enumerate(raw)]
def at(word, nth=0):
    hits = [w for w in words if w['w'].strip('.,') == word]
    return hits[nth]
T = {k: round(v, 3) for k, v in zip(KEYS, starts)}
T['e256'] = at('256')['s']
T['edim'] = at('dividir')['s']
T['ecomum'] = at('moeda', 0)['s'] - 0.15
T['erasga'] = at('nada')['s'] - 0.1
T['credit'] = round(words[-1]['e'] + 0.35, 3)
T['end'] = round(T['credit'] + 1.6, 3)
json.dump(T, open(f'{ROOT}/audio/timeline.json', 'w'), indent=1)
json.dump(words, open(f'{ROOT}/audio/words.json', 'w'), ensure_ascii=False)
# áudio esticado
parts = []
for i in range(8):
    parts.append(f'[0:a]atrim={CUTS[i]}:{CUTS[i+1]},asetpts=PTS-STARTPTS,apad=pad_dur={GAPS[i]}[a{i}]')
filt = ';'.join(parts) + ';' + ''.join(f'[a{i}]' for i in range(8)) + 'concat=n=8:v=0:a=1[v]'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{ROOT}/audio/voz.wav', '-filter_complex', filt,
                '-map', '[v]', '-ar', '48000', '-ac', '1', f'{ROOT}/audio/voz_esticada.wav'], check=True)
print(json.dumps(T))
