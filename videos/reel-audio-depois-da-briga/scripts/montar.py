import re, html, json

DUR = 42.2
TEXTO_NO_VIDEO = True
# Tempos de início de cada bloco: linhas do CapCut (transcrição real, em segundos inteiros)
# presas ao início de fala medido nas pausas do áudio (ffmpeg silencedetect, precisão de 10 ms).
# Texto: a transcrição corrigida pelo Dr. Fabio. Até 4 palavras por bloco.
LEGENDAS = [
 (2.90, "Pra muita gente"),
 (3.40, "com *borderline*,"),
 (4.11, "naquela hora,"),
 (4.83, "ser *mal entendido*"),
 (6.41, "parece o primeiro passo"),
 (7.23, "para *perder a pessoa*."),
 (8.82, "Então cada frase"),
 (9.63, "tenta *impedir* isso."),
 (10.93, "Daí ele *explica*,"),
 (11.88, "depois explica"),
 (12.55, "a *explicação*,"),
 (13.12, "e os áudios"),
 (13.58, "vão *crescendo*"),
 (14.04, "junto com o *medo*."),
 (14.92, "Do *outro lado*,"),
 (15.36, "quem recebe tanto áudio"),
 (17.05, "depois de uma briga"),
 (18.66, "muitas vezes"),
 (19.25, "*para no começo*."),
 (20.25, "E tudo bem"),
 (20.95, "falar assim:"),
 (21.63, "olha, eu só vi"),
 (22.53, "o *começo*,"),
 (24.28, "Se é você"),
 (24.85, "que grava"),
 (25.58, "um áudio longo"),
 (26.51, "pra contar como foi"),
 (27.12, "seu dia,"),
 (27.59, "*tudo bem*."),
 (28.24, "Depois de uma *briga*,"),
 (29.72, "escreve antes *numa linha*"),
 (31.52, "o que você quer"),
 (32.10, "que a pessoa *entenda*."),
 (34.41, "Se ela *quiser*,"),
 (35.02, "você explica o *resto*."),
 (36.10, "Se *ninguém nunca*"),
 (36.55, "tinha te falado isso,"),
]
# Texto grande: substitui a legenda pequena nesses intervalos
GRANDE = [
 (0.00, 0.96, "Por que o *borderline*"),
 (0.96, 1.69, "manda tanto áudio"),
 (1.69, 2.85, "depois de uma *briga?*"),
 (23.11, 24.25, "me fala o *principal*"),
 (33.27, 34.38, "manda essa *linha primeiro*"),
 (37.18, 38.70, "então manda esse vídeo"),
 (38.70, 39.60, "para aquela pessoa"),
 (39.60, 40.70, "que sempre ouve"),
 (40.70, 42.20, "*mil áudios*"),
]
# Efeitos sonoros: nas pausas da fala, volume calculado para o pico ficar 13 a 19 dB abaixo do pico da voz
SFX = [
 ("sfx-pop-gancho", "assets/sfx/pop.mp3", 0.05, 0.60, 0.0, 0.15, None),
 ("sfx-clique-1", "assets/sfx/clique_a.mp3", 6.26, 0.50, 0.0, 0.07, None),
 ("sfx-whoosh-grava", "assets/sfx/whoosh_fino_a.mp3", 10.45, 0.75, 0.0, 0.25, [(0,1),(0.55,1),(0.75,0)]),
 ("sfx-swipe-recebe", "assets/sfx/swipe_d.mp3", 14.70, 0.44, 0.0, 0.09, None),
 ("sfx-pop-principal", "assets/sfx/pop.mp3", 22.92, 0.50, 0.0, 0.12, None),
 ("sfx-riser-virada", "assets/sfx/riser_longo_fino.mp3", 25.10, 3.00, 6.34, 0.15, [(0,0),(1.5,1),(3.0,1)]),
 ("sfx-clique-2", "assets/sfx/clique_a.mp3", 33.10, 0.50, 0.0, 0.07, None),
]
# Zoom punch no rosto: entra junto com o clique e volta no próximo trecho
PUNCH = [(6.41, 8.82), (33.27, 34.41)]
BROLL = [
 ("broll-grava", "assets/broll_756.mp4", 10.93, 14.92, 0.30),
 ("broll-recebe", "assets/broll_677.mp4", 14.92, 19.98, 0.00),
 ("broll-caderno", "assets/broll_a8.mp4", 28.10, 32.95, 0.15),
]

# fim de cada legenda: começo do próximo bloco (legenda ou texto grande), sem passar de 1,6 s depois da fala
marcos = sorted([a for a, _ in LEGENDAS] + [a for a, _, _ in GRANDE] + [DUR])
cues2 = []
for a, t in LEGENDAS:
    prox = min(x for x in marcos if x > a + 0.01)
    cues2.append((a, round(min(prox, a + 1.6) - a, 2), t))

def marca(t):
    t = html.escape(t)
    return re.sub(r"\*(.+?)\*", r"<em>\1</em>", t)

def limpa(t):
    return marca(re.sub(r"[.,:]$", "", re.sub(r"\*([.,:])$", "*", t)))

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
        <video id="a-roll" class="clip" src="assets/fala_hq.mp4" playsinline data-has-audio="true"
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
