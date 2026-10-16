import re, html, json

DUR = 42.2
# Trechos de fala alinhados pelas pausas detectadas no áudio (ffmpeg silencedetect)
SEG = [
 (4.11, 5.95, ["Pra muita gente com borderline,", "naquela hora,"]),
 (6.41, 8.49, ["ser mal-entendido", "parece o primeiro passo", "para perder a pessoa."]),
 (8.82, 10.57, ["Então cada frase", "tenta impedir isso."]),
 (10.93, 11.64, ["Daí ele explica,"]),
 (11.88, 15.11, ["depois explica a explicação,", "e os áudios vão crescendo", "junto com o medo."]),
 (15.36, 19.98, ["Do outro lado,", "quem recebe tanto áudio", "depois de uma briga", "muitas vezes para no começo."]),
 (20.25, 22.83, ["E tudo bem falar assim:", "olha, eu só vi o começo,"]),
 (25.58, 27.83, ["Se é você que grava", "um áudio longo, tudo bem."]),
 (28.24, 31.29, ["Depois de uma briga,", "escreve antes numa linha"]),
 (31.52, 32.88, ["o que você quer", "que a pessoa entenda."]),
 (34.41, 35.66, ["Se ela quiser,", "você explica o resto."]),
 (36.10, 38.45, ["Se ninguém nunca", "tinha te falado isso,"]),
]
# Texto grande: substitui a legenda pequena nesses intervalos
GRANDE = [
 (0.00, 3.95, "Por que o borderline manda tanto áudio depois de uma briga?"),
 (23.11, 25.45, "me fala o principal"),
 (33.20, 34.35, "manda essa linha primeiro"),
 (38.45, 42.20, "manda esse vídeo pra quem sempre ouve mil áudios"),
]
BROLL = [
 ("broll-grava", "assets/broll_756.mp4", 10.93, 15.11, 0.30),
 ("broll-recebe", "assets/broll_677.mp4", 15.11, 19.98, 0.10),
 ("broll-caderno", "assets/broll_a8.mp4", 28.10, 32.95, 0.15),
]

def silabas(w):
    w = w.lower()
    n = len(re.findall(r"[aeiouáéíóúâêôãõà]+", w))
    return max(1, n)

def blocos(texto, maxw=4):
    palavras = texto.split()
    out, cur = [], []
    for p in palavras:
        cur.append(p)
        if len(cur) >= maxw or re.search(r"[,:.?]$", p):
            out.append(cur); cur = []
    if cur: out.append(cur)
    # junta blocos de 1 palavra ao anterior quando possível
    res = []
    for b in out:
        if res and len(b) == 1 and len(res[-1]) < 5:
            res[-1] += b
        else:
            res.append(b)
    return res

cues = []
for ini, fim, chunks in SEG:
    bl = [c.split() for c in chunks]
    pesos = [sum(silabas(p) for p in b) for b in bl]
    tot = sum(pesos); t = ini
    for b, p in zip(bl, pesos):
        d = (fim - ini) * p / tot
        cues.append((round(t, 2), round(d, 2), " ".join(b)))
        t += d
# a última legenda de cada trecho fica na tela até o próximo começar (sem piscar)
starts = sorted([c[0] for c in cues] + [g[0] for g in GRANDE] + [DUR])
cues2 = []
for s, d, t in cues:
    prox = min(x for x in starts if x > s + 0.01)
    gap = prox - (s + d)
    if 0 < gap < 0.6:
        d = prox - s
    cues2.append((s, round(d, 2), t))

def limpa(t):
    return html.escape(t.rstrip(",:"))

partes = []
z = 2
for id_, src, a, b, ms in BROLL:
    partes.append(f'''      <video id="{id_}" class="clip broll" src="{src}" muted playsinline
        data-start="{a}" data-duration="{round(b-a,2)}" data-media-start="{ms}" data-track-index="1"
        style="z-index:{z}"></video>''')
for i, (s, d, t) in enumerate(cues2):
    partes.append(f'      <div id="leg-{i:02d}" class="clip legenda" data-start="{s}" data-duration="{d}" data-track-index="2"><span>{limpa(t)}</span></div>')
for i, (a, b, t) in enumerate(GRANDE):
    partes.append(f'      <div id="grande-{i}" class="clip grande" data-start="{a}" data-duration="{round(b-a,2)}" data-track-index="3"><span>{html.escape(t)}</span></div>')

anim = "\n".join(
    f'      tl.from("#grande-{i} span", {{ opacity: 0, y: 24, duration: 0.18, ease: "power2.out" }}, {a});'
    for i, (a, b, t) in enumerate(GRANDE))

doc = f'''<!doctype html>
<html lang="pt-BR" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      @font-face {{ font-family: "Anton"; src: url("assets/fonts/anton.woff2") format("woff2"); }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: #000; }}
      #a-roll, .broll {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; object-fit: cover; }}
      .legenda, .grande {{ position: absolute; left: 0; width: 1080px; display: flex; justify-content: center; text-align: center; z-index: 20; }}
      .legenda {{ top: 1010px; }}
      .legenda span {{
        max-width: 860px; font-family: "Inter", sans-serif; font-weight: 800; font-size: 46px; line-height: 1.2;
        color: #fff; text-shadow: 0 0 6px rgba(0,0,0,.9), 0 2px 3px rgba(0,0,0,.9);
      }}
      .grande {{ top: 1100px; }}
      .grande span {{
        max-width: 900px; font-family: "Anton", sans-serif; font-size: 92px; line-height: 1.05; text-transform: uppercase;
        color: #fff; text-shadow: 0 0 14px rgba(0,0,0,.85), 0 4px 6px rgba(0,0,0,.9);
      }}
      #grande-0 {{ top: 1060px; }}
      #grande-0 span {{ font-size: 84px; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
      <video id="a-roll" class="clip" src="assets/fala.mp4" playsinline data-has-audio="true"
        data-start="0" data-duration="{DUR}" data-track-index="0" style="z-index:1"></video>
{chr(10).join(partes)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
{anim}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
open("index.html", "w").write(doc)
json.dump([{"start": s, "dur": d, "text": t} for s, d, t in cues2], open("scripts/legendas.json", "w"), ensure_ascii=False, indent=1)
print(len(cues2), "legendas;", len(GRANDE), "textos grandes;", len(BROLL), "b-rolls")
for s, d, t in cues2: print(f"{s:6.2f} {s+d:6.2f}  {t}")
