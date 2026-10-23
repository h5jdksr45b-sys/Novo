"""Gera index.html, compositions/legendas.html e compositions/graficos.html do video Protocolo 7 Dias."""
import json, sys, pathlib

OUT = pathlib.Path(sys.argv[1])
W, H, DUR = 1080, 1920, 36.0
VOZ = 0.3  # a narracao comeca aos 0,3 s; tempos abaixo ja somam esse atraso

DARK, WHITE = "#141414", "#F4F1EC"
WINE, RED = "#7E1621", "#D24A4A"

# cenas: id, arquivo, inicio, duracao, playback (cortes nas pausas longas da narracao)
SCENES = [
    ("v1", "1-celular", 0.0, 4.6, 1.0),
    ("v2", "2-corredor", 4.6, 5.7, 0.88),
    ("v3", "3-soleira", 10.3, 4.3, 1.0),
    ("v4", "4-timer", 14.6, 7.7, 0.65),
    ("v5", "5-sala", 22.3, 8.6, 0.58),
]

# Legendas: (id, ini, fim, top, tinta, linhas)
# linha: (texto, estilo, tamanho, atraso, destaque)  estilo i=italico r=romano
def L(t, s="i", size=150, d=0.0, acc=False):
    return (t, s, size, d, acc)

CAPS = [
    # Cena 1, mesa clara: tinta escura
    ("c1", 0.45, 1.00, 400, DARK, [L("Ela sumiu", size=180)]),
    ("c2", 1.00, 1.80, 400, DARK, [L("por", "r", 60), L("dois dias.", size=200, acc=True)]),
    ("c3", 1.80, 2.25, 400, DARK, [L("Voltou", size=180)]),
    ("c4", 2.25, 3.05, 400, DARK, [L("como se nada", size=150)]),
    ("c5", 3.05, 4.50, 400, DARK, [L("tivesse", "r", 60), L("acontecido.", size=170, d=0.55)]),
    # Cena 2, corredor: branco
    ("c6", 4.98, 5.42, 380, WHITE, [L("E você", size=180)]),
    ("c7", 5.42, 6.50, 380, WHITE, [L("passou", "r", 60), L("esses dias", size=170, d=0.3)]),
    ("c8", 6.53, 7.00, 380, WHITE, [L("medindo", size=210)]),
    ("c9", 7.00, 7.95, 380, WHITE, [L("cada", "r", 60), L("palavra.", size=210, d=0.25, acc=True)]),
    ("c10", 8.27, 10.20, 380, WHITE, [L("do lado de fora", "r", 60), L("da porta.", size=180, d=0.7)]),
    # Cena 3, soleira: branco
    ("c11", 10.95, 11.55, 460, WHITE, [L("Entender", size=190)]),
    ("c12", 11.58, 12.47, 460, WHITE, [L("o pânico", size=170), L("de perder", "r", 64, 0.4)]),
    ("c13", 12.47, 14.50, 440, WHITE, [L("não obriga você", "r", 64), L("a aguentar", size=190, d=0.75),
                                        L("tudo.", size=260, d=1.2, acc=True)]),
    # Cena 4, timer: tinta escura
    ("c14", 15.12, 15.67, 380, DARK, [L("Uma pausa", size=180)]),
    ("c15", 15.67, 16.17, 380, DARK, [L("combinada", size=180)]),
    ("c16", 16.17, 17.85, 330, DARK, [L("de", "r", 60), L("20", size=330, d=0.1, acc=True), L("minutos.", size=150, d=0.5)]),
    ("c17", 17.89, 19.95, 380, DARK, [L("Uma frase", "r", 64), L("fixa.", size=210, d=0.6)]),
    ("c18", 20.05, 22.15, 380, DARK, [L("um roteiro para", "r", 60), L("depois da crise.", size=140, d=0.75)]),
    # Cena 5, sala: branco
    ("c19", 23.25, 24.85, 380, WHITE, [L("Sete", size=230, acc=True), L("procedimentos.", size=130, d=0.3)]),
    ("c20", 25.00, 25.88, 380, WHITE, [L("um por dia.", size=170)]),
    ("c21", 25.90, 28.95, 380, WHITE, [L("para quem mora com", "r", 60), L("alguém com", size=150, d=0.75),
                                        L("borderline.", size=150, d=1.6)]),
    ("c22", 29.08, 30.40, 380, WHITE, [L("ela não precisa", "r", 60), L("participar.", size=170, d=0.6)]),
]


def line_html(cid, i, ln, ink):
    t, s, size, d, acc = ln
    color = WINE if (acc and ink == DARK) else ink
    box = acc and ink == WHITE
    fam = "'Instrument Serif'"
    style = "italic" if s == "i" else "normal"
    ls = "-0.035em" if s == "i" else "0.01em"
    lh = 0.92 if s == "i" else 1.15
    glow = ("0 0 22px rgba(255,255,255,0.38), 0 0 3px rgba(255,255,255,0.45)" if ink == WHITE
            else "0 0 18px rgba(255,255,255,0.25)")
    return (f'<div class="ln" id="{cid}-l{i}" style="font-family:{fam};font-style:{style};font-size:{size}px;'
            f'letter-spacing:{ls};line-height:{lh};color:{color};text-shadow:{"none" if box else glow}">'
            + (f'<span style="background:{WINE};padding:0 0.14em 0.06em 0.08em;display:inline-block">{t}</span>' if box else t)
            + '</div>')


def legendas():
    groups, tweens = [], []
    for cid, a, b, top, ink, lines in CAPS:
        inner = "".join(line_html(cid, i, ln, ink) for i, ln in enumerate(lines))
        groups.append(f'    <div id="{cid}" class="clip grp" data-start="{a}" data-duration="{round(b - a, 3)}" '
                      f'style="top:{top}px">{inner}</div>')
        for i, ln in enumerate(lines):
            tweens.append(f'tl.fromTo("#{cid}-l{i}", {{opacity:0, filter:"blur(10px)"}}, '
                          f'{{opacity:1, filter:"blur(0px)", duration:0.2, ease:"expo.out"}}, {round(a + ln[3], 3)});')
        tweens.append(f'tl.to("#{cid} .ln", {{opacity:0, filter:"blur(8px)", duration:0.13, ease:"power2.in"}}, {round(b - 0.13, 3)});')
    return f"""<template>
  <style>
    @font-face {{ font-family: 'Instrument Serif'; font-style: italic; src: url('assets/fonts/instrument-serif-latin-400-italic.woff2') format('woff2'); }}
    @font-face {{ font-family: 'Instrument Serif'; font-style: normal; src: url('assets/fonts/instrument-serif-latin-400-normal.woff2') format('woff2'); }}
    #root {{ position: absolute; inset: 0; }}
    .grp {{ position: absolute; left: 0; width: 100%; text-align: center; overflow: visible; }}
    .ln {{ opacity: 0; white-space: nowrap; }}
  </style>
  <div id="root" data-composition-id="legendas" data-width="{W}" data-height="{H}">
{chr(10).join(groups)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {chr(10).join('    ' + t for t in tweens).strip()}
    window.__timelines["legendas"] = tl;
  </script>
</template>
"""


# Graficos: etiquetas com seta, numeros 1 a 7 e cartao final
def tag(gid, a, b, x, y, text, path, ink, size=46):
    stroke = ink
    return (f'    <div id="{gid}" class="clip" data-start="{a}" data-duration="{round(b - a, 3)}" '
            f'style="position:absolute;inset:0" data-layout-allow-overflow>\n'
            f'      <div id="{gid}-box" class="tag" style="left:{x}px;top:{y}px;font-size:{size}px">{text}</div>\n'
            f'      <svg class="arrow" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><path id="{gid}-arr" d="{path}" '
            f'fill="none" stroke="{stroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>\n'
            f'    </div>')


def graficos():
    els, tw = [], []
    # Cena 1: etiqueta perto do celular (celular ~ x544 y1155 apos punch 1.5 com origem no celular)
    els.append(tag("t1", 1.85, 4.48, 600, 690, "visto há 2 dias",
                   "M 760 762 C 790 820, 760 880, 690 905 M 690 905 L 718 912 M 690 905 L 708 884", WINE))
    # Cena 2: etiqueta na mulher (cabeca ~ x420 y1000)
    els.append(tag("t2", 5.0, 6.48, 650, 1010, "quem cuida",
                   "M 700 1085 C 700 1130, 670 1160, 615 1175 M 615 1175 L 640 1188 M 615 1175 L 634 1155", WHITE))
    # Cena 4: seta do 20 para o timer (timer ~ x244 y1280)
    els.append(f'    <div id="t4" class="clip" data-start="16.5" data-duration="1.35" style="position:absolute;inset:0" data-layout-allow-overflow>\n'
               f'      <svg class="arrow" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><path id="t4-arr" '
               f'd="M 380 900 C 300 990, 250 1080, 255 1170 M 255 1170 L 238 1145 M 255 1170 L 275 1150" fill="none" '
               f'stroke="{WINE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>\n    </div>')
    # Cena 3: sublinhado removido; destaque em caixa vinho
    False and els.append(f'    <div id="u3" class="clip" data-start="13.2" data-duration="1.75" style="position:absolute;inset:0" data-layout-allow-overflow>\n'
               f'      <svg class="arrow" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><path id="u3-arr" '
               f'd="M 380 1010 C 470 1000, 600 1004, 700 996" fill="none" stroke="{RED}" stroke-width="7" '
               f'stroke-linecap="round" pathLength="1"/></svg>\n    </div>')
    for gid, a, b in (("t1", 1.85, 4.48), ("t2", 5.0, 6.48)):
        tw.append(f'tl.fromTo("#{gid}-box", {{opacity:0, scale:0.86}}, {{opacity:1, scale:1, duration:0.32, ease:"back.out(1.6)"}}, {a});')
        tw.append(f'tl.fromTo("#{gid}-arr", {{strokeDashoffset:1}}, {{strokeDashoffset:0, duration:0.4, ease:"power2.out"}}, {a + 0.15});')
        tw.append(f'tl.to(["#{gid}-box", "#{gid}-arr"], {{opacity:0, duration:0.12, ease:"power2.in"}}, {b - 0.12});')
    tw.append('tl.fromTo("#t4-arr", {strokeDashoffset:1}, {strokeDashoffset:0, duration:0.45, ease:"power2.out"}, 16.5);')
    tw.append('tl.to("#t4-arr", {opacity:0, duration:0.12}, 17.73);')

    # Cena 5: numeros 1 a 7 acendendo
    dots = "".join(f'<div class="dia" id="d{i}">{i}</div>' for i in range(1, 8))
    els.append(f'    <div id="dias" class="clip" data-start="25.0" data-duration="3.95" style="position:absolute;inset:0">\n'
               f'      <div class="row">{dots}</div>\n    </div>')
    for i in range(1, 8):
        t0 = round(25.05 + (i - 1) * 0.11, 3)
        tw.append(f'tl.fromTo("#d{i}", {{opacity:0, y:14}}, {{opacity:1, y:0, duration:0.25, ease:"expo.out"}}, {t0});')
        tw.append(f'tl.to("#d{i}", {{backgroundColor:"{RED}", borderColor:"{RED}", duration:0.2}}, {round(t0 + 0.25, 3)});')
    tw.append('tl.to("#dias .dia", {opacity:0, duration:0.13, stagger:0.02}, 28.75);')

    # Escurecimento final e cartao
    els.append(f'    <div id="fim" class="clip" data-start="30.4" data-duration="{round(DUR - 30.4, 3)}" style="position:absolute;inset:0">\n'
               f'      <div id="fim-dim" style="position:absolute;inset:0;background:#0d0d0d;opacity:0"></div>\n'
               f'      <div class="card">\n'
               f'        <div id="f1" class="r" style="font-size:64px">Protocolo</div>\n'
               f'        <div id="f2" class="i" style="font-size:280px"><span style="color:{RED}">7</span> Dias</div>\n'
               f'        <div id="f3" class="r" style="font-size:46px;margin-top:10px">para quem mora com alguém com borderline</div>\n'
               f'        <div id="f4" class="tag" style="position:relative;display:inline-block;margin-top:70px;font-size:58px">COMEÇAR</div>\n'
               f'        <div id="f5" class="r" style="font-size:34px;margin-top:120px;color:#9a958e">Dr. Fabio Schmidt · Médico · CRM-SP 183549</div>\n'
               f'      </div>\n    </div>')
    tw.append('tl.fromTo("#fim-dim", {opacity:0}, {opacity:1, duration:0.55, ease:"power2.inOut"}, 30.4);')
    for fid, t0 in (("f1", 31.5), ("f2", 32.47), ("f3", 33.1), ("f4", 33.5), ("f5", 33.85)):
        tw.append(f'tl.fromTo("#{fid}", {{opacity:0, filter:"blur(10px)"}}, {{opacity:1, filter:"blur(0px)", duration:0.25, ease:"expo.out"}}, {t0});')

    return f"""<template>
  <style>
    @font-face {{ font-family: 'Instrument Serif'; font-style: italic; src: url('assets/fonts/instrument-serif-latin-400-italic.woff2') format('woff2'); }}
    @font-face {{ font-family: 'Instrument Serif'; font-style: normal; src: url('assets/fonts/instrument-serif-latin-400-normal.woff2') format('woff2'); }}
    #root {{ position: absolute; inset: 0; }}
    .tag {{ position: absolute; background: {WINE}; color: #F4F1EC; font-family: 'Instrument Serif'; padding: 6px 18px 10px;
            line-height: 1; letter-spacing: 0.01em; opacity: 0; }}
    .arrow {{ position: absolute; left: 0; top: 0; overflow: visible; }}
    .arrow path {{ stroke-dasharray: 1; stroke-dashoffset: 1; }}
    .row {{ position: absolute; left: 0; width: 100%; top: 820px; display: flex; justify-content: center; gap: 22px; }}
    .dia {{ width: 92px; height: 92px; border-radius: 50%; border: 3px solid rgba(244,241,236,0.8); color: #F4F1EC;
            font-family: 'Instrument Serif'; font-style: italic; font-size: 56px; line-height: 84px; text-align: center; opacity: 0; }}
    .card {{ position: absolute; left: 0; width: 100%; top: 470px; text-align: center; color: #F4F1EC; font-family: 'Instrument Serif'; }}
    .card .i {{ font-style: italic; letter-spacing: -0.035em; line-height: 0.9; text-shadow: 0 0 26px rgba(255,255,255,0.3); }}
    .card .r {{ letter-spacing: 0.01em; }}
    .card > div {{ opacity: 0; }}
  </style>
  <div id="root" data-composition-id="graficos" data-width="{W}" data-height="{H}">
{chr(10).join(els)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {chr(10).join('    ' + t for t in tw).strip()}
    window.__timelines["graficos"] = tl;
  </script>
</template>
"""


# Cortes de aproximacao (punch-in) dentro das cenas: (wrapper, tempo, escala, origem)
PUNCH = [("w1", 1.8, 1.5, "50% 60%"), ("w2", 6.53, 1.6, "39% 57%"), ("w4", 17.89, 1.4, "28% 66%")]
DIPS = [4.5, 10.2, 22.2]


# Efeitos (Pixabay, uso comercial livre): (id, arquivo, momento do impacto na tela, pico do arquivo, volume)
SFX = ([("sx-w1", "whoosh", 4.6, 0.164, 0.3), ("sx-w2", "whoosh-short", 10.3, 0.164, 0.26),
        ("sx-w3", "whoosh", 22.3, 0.164, 0.3), ("sx-p1", "pop", 1.95, 0.122, 0.22),
        ("sx-p2", "pop", 5.1, 0.122, 0.2), ("sx-fim", "impact-bass-2", 32.47, 2.066, 0.35)]
       + [(f"sx-d{i}", "click-soft", round(25.05 + (i - 1) * 0.11 + 0.1, 3), 0.075, 0.12) for i in range(1, 8)])


def sfx_tags():
    out = []
    durs = {"whoosh": 0.57, "whoosh-short": 0.57, "pop": 0.72, "click-soft": 0.37, "impact-bass-2": 2.59}
    for n, (sid, f, hit, peak, vol) in enumerate(SFX):
        start = round(hit + 1 / 30 - peak, 3)  # pico um quadro depois da imagem
        track = 6 + (n % 4 if f == "click-soft" else (1 if f == "pop" else 0))  # cliques seguidos se sobrepoem: faixas alternadas
        out.append(f'      <audio id="{sid}" class="clip" src="assets/sfx/{f}.mp3" data-start="{start}" '
                   f'data-duration="{durs[f]}" data-volume="{vol}" data-track-index="{track}"></audio>')
    return "\n".join(out)


def index():
    vids = []
    for n, (vid, f, a, d, rate) in enumerate(SCENES, start=1):
        rate_attr = f' data-playback-rate="{rate}"' if rate != 1.0 else ""
        vids.append(f'      <div id="w{n}" class="wrap" style="z-index:{n}">\n'
                    f'        <video id="{vid}" class="clip" src="assets/clips/{f}.mp4" data-start="{a}" data-duration="{d}"'
                    f'{rate_attr} data-track-index="1" muted playsinline></video>\n      </div>')
    tw = []
    for w, t, s, o in PUNCH:
        tw.append(f'tl.fromTo("#{w}", {{scale:{round(s * 1.04, 3)}, transformOrigin:"{o}"}}, '
                  f'{{scale:{s}, transformOrigin:"{o}", duration:0.35, ease:"power3.out"}}, {t});')
    for k, t in enumerate(DIPS):
        ir = "" if k == 0 else ", immediateRender:false"
        tw.append(f'tl.fromTo("#dip", {{opacity:0}}, {{opacity:0.45, duration:0.1, ease:"power2.in"{ir}}}, {t});')
        tw.append(f'tl.set("#dip", {{opacity:0}}, {round(t + 0.1, 3)});')
    return f"""<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/js/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: #0d0d0d; }}
      #root {{ position: relative; width: 100%; height: 100%; overflow: hidden; }}
      #ground {{ position: absolute; inset: 0; background: #0d0d0d; }}
      .wrap {{ position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; }}
      .wrap video {{ position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; object-fit: cover; }}
      #dip {{ position: absolute; inset: 0; background: #000; opacity: 0; z-index: 20; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="{W}" data-height="{H}">
      <div id="ground"></div>
{chr(10).join(vids)}
      <!-- Trilha Warm Resolve (Suno): corte de 0,76 s para a abertura cair no corte da sala (22,3 s) e o acorde no 7 Dias (32,5 s) -->
      <audio id="musica" class="clip" src="assets/audio/musica.m4a" data-start="0" data-duration="{DUR}" data-media-start="0.76" data-volume="1" data-track-index="5"
        data-automation="{{&quot;version&quot;: 1, &quot;lanes&quot;: [{{&quot;target&quot;: &quot;volume&quot;, &quot;points&quot;: [{{&quot;t&quot;: 0, &quot;v&quot;: 0.22}}, {{&quot;t&quot;: 21.6, &quot;v&quot;: 0.22}}, {{&quot;t&quot;: 22.1, &quot;v&quot;: 0.42}}, {{&quot;t&quot;: 23.1, &quot;v&quot;: 0.42}}, {{&quot;t&quot;: 23.4, &quot;v&quot;: 0.22}}, {{&quot;t&quot;: 33.1, &quot;v&quot;: 0.22}}, {{&quot;t&quot;: 33.6, &quot;v&quot;: 0.6}}, {{&quot;t&quot;: 35.0, &quot;v&quot;: 0.6}}, {{&quot;t&quot;: 35.95, &quot;v&quot;: 0.0}}]}}]}}"></audio>
{sfx_tags()}
      <audio id="narracao" class="clip" src="assets/audio/narracao.wav" data-start="{VOZ}" data-volume="1" data-track-index="4"></audio>
      <div id="dip"></div>
      <div id="graficos" data-composition-id="graficos" data-composition-src="compositions/graficos.html"
        data-start="0" data-duration="{DUR}" data-track-index="2" data-track-kind="graphics"
        data-width="{W}" data-height="{H}" style="z-index:30"></div>
      <div id="legendas" data-composition-id="legendas" data-composition-src="compositions/legendas.html"
        data-start="0" data-duration="{DUR}" data-track-index="3" data-track-kind="captions"
        data-width="{W}" data-height="{H}" style="z-index:40"></div>
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      {chr(10).join('      ' + t for t in tw).strip()}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""


(OUT / "compositions").mkdir(exist_ok=True)
(OUT / "index.html").write_text(index(), encoding="utf-8")
(OUT / "compositions" / "legendas.html").write_text(legendas(), encoding="utf-8")
(OUT / "compositions" / "graficos.html").write_text(graficos(), encoding="utf-8")
print("ok")
