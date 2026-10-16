import re, html, json

DUR = 42.2
TEXTO_NO_VIDEO = False  # legendas e texto grande saem do vídeo e vão para o .srt
# Trechos de fala alinhados pelas pausas detectadas no áudio (ffmpeg silencedetect)
SEG = [
 (4.11, 5.95, ["Pra muita gente", "com *borderline*,", "naquela hora,"]),
 (6.41, 8.49, ["ser *mal entendido*", "parece o primeiro passo", "para *perder a pessoa*."]),
 (8.82, 10.57, ["Então cada frase", "tenta *impedir* isso."]),
 (10.93, 11.64, ["Daí ele *explica*,"]),
 (11.88, 15.11, ["depois explica a *explicação*,", "e os áudios", "vão *crescendo*", "junto com o *medo*."]),
 (15.36, 19.98, ["Do *outro lado*,", "quem recebe tanto áudio", "depois de uma briga", "muitas vezes", "*para no começo*."]),
 (20.25, 22.83, ["E tudo bem", "falar assim:", "olha, eu só vi", "o *começo*,"]),
 (25.58, 27.83, ["Se é você", "que grava", "um áudio longo,", "*tudo bem*."]),
 (28.24, 31.29, ["Depois de uma *briga*,", "escreve antes *numa linha*"]),
 (31.52, 32.88, ["o que você quer", "que a pessoa *entenda*."]),
 (34.41, 35.66, ["Se ela *quiser*,", "você explica o *resto*."]),
 (36.10, 38.45, ["Se *ninguém nunca*", "tinha te falado isso,"]),
]
# Texto grande: substitui a legenda pequena nesses intervalos
GRANDE = [
 (0.00, 1.15, "Por que o *borderline*"),
 (1.15, 2.17, "manda tanto áudio"),
 (2.17, 3.95, "depois de uma *briga*?"),
 (23.11, 25.45, "me fala o *principal*"),
 (33.20, 34.35, "manda essa *linha primeiro*"),
 (38.45, 39.20, "manda esse vídeo"),
 (39.20, 40.00, "para aquela pessoa"),
 (40.00, 40.56, "que sempre ouve"),
 (40.56, 42.20, "*mil áudios*"),
]
# Efeitos sonoros: sempre nas pausas da fala e em volume baixo; o riser fica baixo e entra em fade
SFX = [
 ("sfx-clique-1", "assets/sfx/clique_a.mp3", 6.26, 0.50, 0.0, 0.07, None),
 ("sfx-whoosh-grava", "assets/sfx/whoosh_fino_a.mp3", 10.45, 0.75, 0.0, 0.25, [(0,1),(0.55,1),(0.75,0)]),
 ("sfx-swipe-recebe", "assets/sfx/swipe_d.mp3", 15.00, 0.44, 0.0, 0.09, None),
 ("sfx-riser-virada", "assets/sfx/riser_longo_fino.mp3", 25.10, 3.00, 6.34, 0.15, [(0,0),(1.5,1),(3.0,1)]),
 ("sfx-clique-2", "assets/sfx/clique_a.mp3", 33.10, 0.50, 0.0, 0.07, None),
]
# Zoom punch no rosto: entra junto com o clique e volta no próximo trecho
PUNCH = [(6.41, 8.82), (33.20, 34.41)]
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

def marca(t):
    t = html.escape(t)
    return re.sub(r"\*(.+?)\*", r"<em>\1</em>", t)

def limpa(t):
    return marca(t.rstrip(",:"))

partes = []
z = 2
for id_, src, a, b, ms in BROLL:
    partes.append(f'''      <video id="{id_}" class="clip broll" src="{src}" muted playsinline
        data-start="{a}" data-duration="{round(b-a,2)}" data-media-start="{ms}" data-track-index="1"
        style="z-index:{z}"></video>''')
for i, (s, d, t) in (enumerate(cues2) if TEXTO_NO_VIDEO else []):
    partes.append(f'      <div id="leg-{i:02d}" class="clip legenda" data-start="{s}" data-duration="{d}" data-track-index="2"><span>{limpa(t)}</span></div>')
for i, (a, b, t) in (enumerate(GRANDE) if TEXTO_NO_VIDEO else []):
    partes.append(f'      <div id="grande-{i}" class="clip grande" data-start="{a}" data-duration="{round(b-a,2)}" data-track-index="3"><span>{marca(t)}</span></div>')
for id_, src, a, d, ms, vol, env in SFX:
    auto = ""
    if env:
        pts = ",".join('{"t":%s,"v":%s}' % (x, y) for x, y in env)
        auto = f""" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{pts}]}}]}}'"""
    partes.append(f'      <audio id="{id_}" class="clip" src="{src}" data-start="{a}" data-duration="{d}" data-media-start="{ms}" data-volume="{vol}" data-track-index="4"{auto}></audio>')

linhas = []
for i, (a, b, t) in (enumerate(GRANDE) if TEXTO_NO_VIDEO else []):
    linhas.append(f'      tl.from("#grande-{i} span", {{ opacity: 0, y: 34, scale: 0.94, duration: 0.24, ease: "power3.out" }}, {a});')
    if "*" in t:
        linhas.append(f'      tl.from("#grande-{i} em", {{ opacity: 0, y: 18, rotation: -4, duration: 0.3, ease: "back.out(2)" }}, {round(a+0.14,2)});')
    linhas.append(f'      tl.to("#grande-{i} span", {{ opacity: 0, y: -22, duration: 0.16, ease: "power2.in" }}, {round(b-0.17,2)});')
for i, (s0, d, t) in (enumerate(cues2) if TEXTO_NO_VIDEO else []):
    linhas.append(f'      tl.from("#leg-{i:02d} span", {{ opacity: 0, y: 16, duration: 0.15, ease: "power3.out" }}, {s0});')
    if "*" in t:
        linhas.append(f'      tl.from("#leg-{i:02d} em", {{ opacity: 0, y: 10, scale: 1.25, duration: 0.24, ease: "back.out(2.2)" }}, {round(s0+0.07,2)});')
    if d > 0.45:
        linhas.append(f'      tl.to("#leg-{i:02d} span", {{ opacity: 0, y: -10, duration: 0.1, ease: "power2.in" }}, {round(s0+d-0.11,2)});')
for a, b in PUNCH:
    linhas.append(f'      tl.to("#a-visual", {{ scale: 1.12, duration: 0.12, ease: "power2.out" }}, {a});')
    linhas.append(f'      tl.set("#a-visual", {{ scale: 1 }}, {b});')
anim = "\n".join(linhas)

doc = f'''<!doctype html>
<html lang="pt-BR" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      @font-face {{ font-family: "Anton"; src: url("assets/fonts/anton.woff2") format("woff2"); }}
      @font-face {{ font-family: "Instrument Serif"; font-style: italic; src: url("assets/fonts/instrument-serif-italic.woff2") format("woff2"); }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: #000; }}
      #a-visual {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; overflow: hidden; z-index: 1; transform-origin: 50% 30%; }}
      #a-roll, .broll {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; object-fit: cover; }}
      .legenda, .grande {{ position: absolute; left: 0; width: 1080px; display: flex; justify-content: center; text-align: center; z-index: 20; }}
      .legenda {{ top: 1010px; }}
      .legenda span {{
        display: inline-block; max-width: 880px; font-family: "Inter", sans-serif; font-weight: 800; font-size: 52px; line-height: 1.2;
        color: #fff; text-shadow: 0 0 6px rgba(0,0,0,.9), 0 2px 3px rgba(0,0,0,.9);
      }}
      .legenda em, .grande em {{
        display: inline-block; font-family: "Instrument Serif", serif; font-style: italic; font-weight: 400;
        text-transform: none; color: #FFD23F; letter-spacing: 0;
        text-shadow: 0 0 12px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1), 0 3px 4px rgba(0,0,0,.95);
      }}
      .legenda em {{ font-size: 1.32em; line-height: 0.9; padding: 0 0.04em; }}
      .grande em {{ font-size: 1.28em; line-height: 0.9; padding: 0 0.05em; }}
      .legenda span {{ text-shadow: 0 0 10px rgba(0,0,0,.95), 0 0 4px rgba(0,0,0,.95), 0 2px 3px rgba(0,0,0,.9) !important; }}
      .grande {{ top: 1100px; }}
      .grande span {{
        display: inline-block; max-width: 900px; font-family: "Anton", sans-serif; font-size: 92px; line-height: 1.05; text-transform: uppercase;
        color: #fff; text-shadow: 0 0 14px rgba(0,0,0,.85), 0 4px 6px rgba(0,0,0,.9);
      }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
      <div id="a-visual" class="inner">
        <video id="a-roll" class="clip" src="assets/fala.mp4" playsinline data-has-audio="true"
          data-start="0" data-duration="{DUR}" data-track-index="0"></video>
      </div>
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

# legenda em arquivo .srt (texto corrigido, até 4 palavras por bloco)
def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"
todos = sorted([(s0, s0 + d, t) for s0, d, t in cues2] + [(a, b, t) for a, b, t in GRANDE])
with open("renders/reel-audio-depois-da-briga.srt", "w") as f:
    for n_, (a, b, t) in enumerate(todos, 1):
        f.write(f"{n_}\n{ts(a)} --> {ts(b)}\n{t.replace('*','')}\n\n")
