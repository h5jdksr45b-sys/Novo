# Gera index.html (HyperFrames) a partir de words_tight.json e da lista de cenas.
import json, html, sys
W = json.load(open("words_tight.json"))
GAP = 0.35
FPS = 30
# narrações em ordem e início de cada uma
ORDER = ["n1","n2b","n3","n4","n5","n6","n7"]
START = {}
t = 0.10
for n in ORDER:
    START[n] = round(t,3); t = round(t + W[n]["dur"] + GAP, 3)
END_SPEECH = round(START["n7"] + W["n7"]["dur"], 3)
FINAL_IN = round(END_SPEECH + 0.45, 2)      # tela final
DUR = round(FINAL_IN + 3.0, 2)
def wt(n, i): return round(START[n] + W[n]["words"][i]["s"], 3)
def we(n, i): return round(START[n] + W[n]["words"][i]["e"], 3)
# cenas: (id, arquivo, tipo, início, fim)
MODE = sys.argv[1] if len(sys.argv) > 1 else "img"
S2A_IN = wt("n2b",0) ; S2B_IN = wt("n2b",5) ; S3_IN = wt("n3",0) ; S4_IN = wt("n4",0)
S5_IN = wt("n5",0) ; S6_IN = wt("n6",0) ; S7_IN = wt("n7",0)
scenes = [
 ("s1","01-pia",       0.0,    S2A_IN),
 ("s2","02-despertador",S2A_IN, S2B_IN),
 ("s3","03-olhos",     S2B_IN, S3_IN),
 ("s4","04-convite",   S3_IN,  S4_IN),
 ("s5","05-calendario",S4_IN,  S5_IN),
 ("s6","06-copo-maos", S5_IN,  S6_IN),
 ("s7","07-cadeira",   S6_IN,  S7_IN),
 ("s8","08-copo",      S7_IN,  FINAL_IN),
]
def t3(x): return f"{x:.3f}"
media = []
for sid, name, a, b in scenes:
    d = round(b - a, 3)
    if MODE == "video":
        media.append(f'<div class="zoom" id="z{sid}"><video class="clip" src="assets/video/{name}.mp4" muted playsinline data-start="{t3(a)}" data-duration="{t3(d)}" data-media-start="0" data-track-index="0"></video></div>')
    else:
        media.append(f'<div class="zoom" id="z{sid}"><img class="clip" src="cenas/{name}.png" data-start="{t3(a)}" data-duration="{t3(d)}" data-track-index="0" /></div>')
media.append(f'<video class="clip" id="final" src="assets/video/tela-final.mp4" muted playsinline data-start="{t3(FINAL_IN)}" data-duration="3.000" data-media-start="0" data-track-index="0"></video>')
# legendas: (narração, índices, texto exibido por palavra, índice de ênfase)
G = []
def g(n, idxs, texts, emph=None, hold=None):
    s = wt(n, idxs[0]); e = we(n, idxs[-1])
    G.append({"s": s, "e": e, "words": list(zip(texts, [i == emph for i in idxs])), "hold": hold})
g("n1",[0,1,2],["O","que","acontece"]); g("n1",[3,4,5],["com","quem","cuida"]); g("n1",[6,7,8],["sozinho","de","alguém"]); g("n1",[9,10],["com","borderline?"])
g("n2b",[0,1,2],["Primeiro","o","sono,"],emph=2); g("n2b",[3,4],["fica","acordada"]); g("n2b",[5,6,7],["esperando","o","barulho"]); g("n2b",[8,9],["do","carro."])
g("n3",[0,1,2],["Depois","os","amigos,"],emph=2); g("n3",[3,4,5],["para","de","sair"]); g("n3",[6,7,8],["pra","não","deixar"]); g("n3",[9,10,11],["a","pessoa","sozinha."])
g("n4",[0,1],["Por","último,"]); g("n4",[2,3,4],["a","própria","saúde,"]); g("n4",[5,6,7],["a","consulta","dela"]); g("n4",[8,9,10],["adiada","de","novo."])
g("n5",[0,1,2,3],["O","que","mais","dói"]); g("n5",[4,5,6],["não","é","cansar,"]); g("n5",[7,8,9],["é","achar","que"]); g("n5",[10,11,12],["cansar","é","amar"]); g("n5",[13],["pouco."],emph=13)
g("n6",[0,1,2],["Cuidar","de","você"]); g("n6",[3,4,5],["não","é","abandonar"]); g("n6",[6],["ninguém,"]); g("n6",[7,8,9],["família","também","pode"]); g("n6",[10,11],["ter","acompanhamento."])
g("n7",[0,1,2],["Manda","pra","quem"]); g("n7",[3,4,5],["cuida","de","todo"]); g("n7",[6,7,8],["mundo","e","não"]); g("n7",[9,10,11,12],["marca","consulta","pra","si."], hold=END_SPEECH+0.4)
for i, gr in enumerate(G):
    nxt = G[i+1]["s"] if i+1 < len(G) else None
    end = gr["hold"] if gr["hold"] else (nxt if nxt and nxt - gr["e"] < 1.0 else gr["e"] + 0.45)
    gr["end"] = round(end, 3)
cap_html, cap_tl, em_tl = [], [], []
for i, gr in enumerate(G):
    spans = "".join(f'<span class="{"em" if em else "w"}">{html.escape(w)}</span> ' for w, em in gr["words"])
    cap_html.append(f'<div class="clip cap" data-start="{t3(gr["s"])}" data-duration="{t3(gr["end"]-gr["s"])}" data-track-index="3"><div class="cap-in" id="capin{i}">{spans}</div></div>')
    cap_tl.append(f'tl.fromTo("#capin{i}",{{y:26,opacity:0}},{{y:0,opacity:1,duration:0.16,ease:"power2.out"}},{t3(gr["s"])});')
    if any(e for _, e in gr["words"]):
        em_tl.append(f'tl.fromTo("#capin{i} .em",{{scale:0.86}},{{scale:1,duration:0.26,ease:"back.out(1.6)"}},{t3(gr["s"])});')
# contador CONSULTA ADIADA: chips em consulta / dela / adiada
C1 = wt("n4",5); C_IN = round(C1 - 0.3, 3); C2 = round(C1 + 0.8, 3); C3 = round(C1 + 1.6, 3); C_OUT = round(S5_IN - 0.15, 3)
HOOK_OUT = 3.2
CTA_IN = S7_IN
IG = '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="#FFFFFF" stroke="none"/></svg>'
page = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<title>Quem cuida do borderline</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
@font-face {{ font-family: "Anton"; src: url("assets/fonts/anton.woff2") format("woff2"); font-weight: 400; font-style: normal; }}
@font-face {{ font-family: "Fraunces"; src: url("assets/fonts/fraunces-italic-900.woff2") format("woff2"); font-weight: 900; font-style: italic; }}
@font-face {{ font-family: "Inter"; src: url("assets/fonts/inter-700.woff2") format("woff2"); font-weight: 700; font-style: normal; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:1080px; height:1920px; overflow:hidden; background:#000; }}
#root {{ position:relative; width:100%; height:100%; overflow:hidden; background:#000; }}
.clip {{ position:absolute; }}
.zoom {{ position:absolute; inset:0; width:1080px; height:1920px; transform-origin:50% 45%; }}
.zoom video, .zoom img, #final {{ position:absolute; inset:0; width:1080px; height:1920px; object-fit:cover; display:block; }}
.cap {{ left:60px; width:960px; top:1300px; height:220px; display:flex; align-items:center; justify-content:center; }}
.cap-in {{ display:block; width:960px; text-align:center; line-height:1.0; color:#FFFFFF; font-family:"Anton"; font-size:76px; word-spacing:.12em; -webkit-text-stroke:3px #141414; paint-order:stroke fill; text-shadow:0 4px 14px rgba(0,0,0,.35); }}
.cap-in .w {{ font-family:"Anton"; font-size:76px; letter-spacing:.015em; text-transform:uppercase; display:inline-block; vertical-align:baseline; margin:0 .09em; }}
.cap-in .em {{ font-family:"Fraunces"; font-style:italic; font-weight:900; font-variation-settings:"WONK" 0,"SOFT" 0; font-size:118px; text-transform:uppercase; letter-spacing:-.01em; color:#CC0000; display:inline-block; vertical-align:baseline; margin:0 .10em; -webkit-text-stroke:0; text-shadow:0 6px 20px rgba(0,0,0,.6), 0 0 2px rgba(0,0,0,.6); }}
.up {{ left:72px; top:120px; width:900px; height:560px; color:#FFFFFF; -webkit-text-stroke:3px #141414; paint-order:stroke fill; text-shadow:0 4px 14px rgba(0,0,0,.35); }}
.red {{ color:#CC0000; }}
.h {{ display:block; font-family:"Anton"; font-size:100px; line-height:1.02; letter-spacing:.01em; text-transform:uppercase; }}
.ps-label {{ font-family:"Inter"; font-weight:700; font-size:40px; letter-spacing:.14em; margin-bottom:22px; display:block; width:900px; }}
.chips {{ display:flex; gap:26px; width:900px; }}
.chip {{ width:150px; height:150px; border:5px solid #141414; -webkit-text-stroke:0; text-shadow:none; border-radius:26px; display:flex; align-items:center; justify-content:center; font-family:"Fraunces"; font-style:italic; font-weight:900; font-variation-settings:"WONK" 0,"SOFT" 0; font-size:96px; color:#CC0000; background:#FFFFFF; }}
.cta-in .h {{ font-size:96px; }}
.wm {{ position:absolute; left:780px; top:430px; width:260px; display:flex; flex-direction:column; align-items:center; gap:8px; }}
.wm span {{ font-family:"Anton"; font-size:26px; letter-spacing:.06em; color:#FFFFFF; -webkit-text-stroke:1.5px #141414; paint-order:stroke fill; text-shadow:0 2px 8px rgba(0,0,0,.45); }}
#zs8 {{ transform: translateY(-260px) scale(1.14); }}
#fade {{ left:0; top:0; width:1080px; height:1920px; background:#000; }}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-fps="{FPS}" data-duration="{DUR}">
{chr(10).join(media)}
<!-- marca d'água -->
<div class="clip wm" data-start="0" data-duration="{t3(FINAL_IN)}" data-track-index="1">{IG}<span>@DRFABIOSCHMIDT</span></div>
<!-- capa -->
<div class="clip up" id="hook" data-start="0" data-duration="{HOOK_OUT}" data-track-index="2">
  <div id="hookin"><span class="h">SEM AJUDA,</span><span class="h">QUEM CUIDA DO</span><span class="h"><span class="red">BORDERLINE</span> PERDE</span><span class="h">NESTA ORDEM.</span></div>
</div>
<!-- contador -->
<div class="clip up" id="ps" data-start="{t3(C_IN)}" data-duration="{t3(C_OUT-C_IN)}" data-track-index="2">
  <div class="ps-label" id="pslabel">CONSULTA ADIADA</div>
  <div class="chips"><div class="chip" id="chip1">1</div><div class="chip" id="chip2">2</div><div class="chip" id="chip3">3</div></div>
</div>
<!-- CTA -->
<div class="clip up cta-in" id="cta" data-start="{t3(CTA_IN)}" data-duration="{t3(FINAL_IN-CTA_IN)}" data-track-index="2">
  <div id="ctain"><span class="h">MANDA PRA QUEM</span><span class="h">CUIDA DE TODO MUNDO</span><span class="h">E NÃO MARCA</span><span class="h red">CONSULTA PRA SI.</span></div>
</div>
{chr(10).join(cap_html)}
<div class="clip" id="fade" data-start="{t3(FINAL_IN-0.3)}" data-duration="0.3" data-track-index="4"><div id="fade-in" style="width:1080px;height:1920px;background:#000"></div></div>
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
// zoom leve em três planos
tl.fromTo("#zs1",{{scale:1}},{{scale:1.05,duration:{t3(S2A_IN)},ease:"none"}},0);
tl.fromTo("#zs6",{{scale:1}},{{scale:1.06,duration:{t3(S6_IN-S5_IN)},ease:"none"}},{t3(S5_IN)});
tl.fromTo("#zs7",{{scale:1.04}},{{scale:1.0,duration:{t3(S7_IN-S6_IN)},ease:"none"}},{t3(S6_IN)});
// capa: fixa desde o quadro 0, sai deslizando
tl.to("#hookin",{{x:-60,opacity:0,duration:0.26,ease:"power2.in"}},{HOOK_OUT-0.3});
// contador
tl.fromTo("#pslabel",{{opacity:0,y:-16}},{{opacity:1,y:0,duration:0.25}},{t3(C_IN)});
tl.fromTo("#chip1",{{scale:0.6,opacity:0}},{{scale:1,opacity:1,duration:0.3,ease:"back.out(1.8)"}},{t3(C1)});
tl.fromTo("#chip2",{{scale:0.6,opacity:0}},{{scale:1,opacity:1,duration:0.3,ease:"back.out(1.8)"}},{t3(C2)});
tl.fromTo("#chip3",{{scale:0.6,opacity:0}},{{scale:1,opacity:1,duration:0.3,ease:"back.out(1.8)"}},{t3(C3)});
tl.to("#ps > *",{{opacity:0,duration:0.2}},{t3(C_OUT-0.2)});
// CTA
tl.fromTo("#ctain > .h",{{y:30,opacity:0}},{{y:0,opacity:1,duration:0.3,ease:"power3.out",stagger:0.12}},{t3(CTA_IN+0.05)});
// fade para a tela final
tl.fromTo("#fade-in",{{opacity:0}},{{opacity:1,duration:0.3,ease:"power1.in"}},{t3(FINAL_IN-0.3)});
{chr(10).join(cap_tl)}
{chr(10).join(em_tl)}
window.__timelines["main"] = tl;
</script>
</body>
</html>"""
open("index.html","w").write(page)
json.dump({"START":START,"scenes":scenes,"FINAL_IN":FINAL_IN,"DUR":DUR,"END_SPEECH":END_SPEECH,"counter":[C_IN,C1,C2,C3,C_OUT]}, open("timeline.json","w"), indent=1)
print("DUR",DUR,"FINAL_IN",FINAL_IN,"END_SPEECH",END_SPEECH); print("starts",START); print("scenes",[(s[0],s[2],s[3]) for s in scenes]); print("counter",C_IN,C1,C2,C3,C_OUT)
