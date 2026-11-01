import json, html
W = json.load(open("words.json"))
OFF = {"n1-gancho":0.30, "n2-ps-ida":10.70, "n3-abandono-a":20.70}
# caption groups: (narration, [word indexes], emphasis index or None)
def words(n): return W[n]["words"]
groups = []
def G(n, idxs, emph=None, hold_to=None):
    ws = words(n); o = OFF[n]
    s = round(o + ws[idxs[0]]["s"], 3); e = round(o + ws[idxs[-1]]["e"], 3)
    txt = [(ws[i]["w"].replace("-socorro","socorro").strip(), i==emph) for i in idxs]
    # join "pronto" + "-socorro"
    groups.append({"s":s,"e":e,"words":txt,"hold":hold_to})
# n1
G("n1-gancho",[0,1,2]); G("n1-gancho",[3,4],emph=4); G("n1-gancho",[5,6])
G("n1-gancho",[7,8,9],emph=9); G("n1-gancho",[10,11],emph=11); G("n1-gancho",[12,13,14],emph=14)
G("n1-gancho",[15,16,17]); G("n1-gancho",[18,19,20],emph=20, hold_to=9.7)
# n2
G("n2-ps-ida",[0,1],emph=1); G("n2-ps-ida",[2,3,4]); G("n2-ps-ida",[5,6,7]); G("n2-ps-ida",[8,9,10],emph=10)
G("n2-ps-ida",[11,12]); G("n2-ps-ida",[13,14,15]); G("n2-ps-ida",[16],emph=16); G("n2-ps-ida",[17],emph=17); G("n2-ps-ida",[18,19,20], hold_to=18.9)
# n3
G("n3-abandono-a",[0,1,2,3]); G("n3-abandono-a",[4,5,6,7]); G("n3-abandono-a",[8,9,10],emph=10); G("n3-abandono-a",[11,12],emph=12)
G("n3-abandono-a",[13]); G("n3-abandono-a",[14,15]); G("n3-abandono-a",[16,17],emph=17); G("n3-abandono-a",[18],emph=18); G("n3-abandono-a",[19,20,21],emph=21, hold_to=29.1)
# fix pronto-socorro merge: group [13,14,15] = ao pronto -socorro -> "ao pronto-socorro"
for g in groups:
    ws = [w for w,_ in g["words"]]
    if [x.strip(",.") for x in ws[-2:]] == ["pronto","socorro"]:
        g["words"] = g["words"][:-2] + [("pronto-socorro,", False)]
# durations: until next group start (continuous), or hold
for i,g in enumerate(groups):
    nxt = groups[i+1]["s"] if i+1 < len(groups) else None
    end = g["hold"] if g["hold"] else (nxt if nxt and nxt - g["e"] < 1.2 else g["e"] + 0.5)
    g["end"] = round(end,3)
def t(x): return f"{x:.3f}"
cap_html = []
for i,g in enumerate(groups):
    spans = "".join(f'<span class="{"em" if em else "w"}">{html.escape(w)}</span> ' for w,em in g["words"])
    cap_html.append(f'<div class="clip cap" id="cap{i}" data-start="{t(g["s"])}" data-duration="{t(g["end"]-g["s"])}" data-track-index="3"><div class="cap-in" id="capin{i}">{spans}</div></div>')
cap_tl = "\n".join(f'tl.fromTo("#capin{i}",{{y:26,opacity:0}},{{y:0,opacity:1,duration:0.16,ease:"power2.out"}},{t(g["s"])});' for i,g in enumerate(groups))
em_tl = "\n".join(f'tl.fromTo("#capin{i} .em",{{scale:0.86}},{{scale:1,duration:0.26,ease:"back.out(1.6)"}},{t(g["s"])});' for i,g in enumerate(groups) if any(e for _,e in g["words"]))
upper = f"""
<!-- gancho -->
<div class="clip up dark" id="hook" data-start="0" data-duration="3.2" data-track-index="2">
  <div class="hook-in" id="hookin"><span class="h">SEM TRATAMENTO,</span><span class="h">O <span class="red">BORDERLINE</span> PERDE</span><span class="h">NESTA ORDEM.</span></div>
</div>
<!-- contador PS -->
<div class="clip up light" id="ps" data-start="15.05" data-duration="3.9" data-track-index="2">
  <div class="ps-label" id="pslabel">PRONTO-SOCORRO</div>
  <div class="chips"><div class="chip" id="chip1">1</div><div class="chip" id="chip2">2</div><div class="chip" id="chip3">3</div></div>
  <div class="ps-sub" id="pssub">no mesmo mês</div>
</div>
<!-- medo de abandono -->
<div class="clip up dark" id="medo" data-start="22.95" data-duration="3.7" data-track-index="2">
  <div class="big2" id="medoin"><span class="h">MEDO DE</span><span class="h red">ABANDONO</span></div>
</div>
<!-- tratamento -->
<div class="clip up dark" id="trat" data-start="26.80" data-duration="2.5" data-track-index="2">
  <div class="big2" id="tratin"><span class="h">TRATAMENTO</span><span class="comp">devolve o volante</span></div>
</div>
<!-- CTA -->
<div class="clip cta dark" id="cta" data-start="29.35" data-duration="2.6" data-track-index="2">
  <div class="cta-in" id="ctain"><span class="h">MANDA PRA QUEM</span><span class="h">ESTÁ ADIANDO</span><span class="h"><span class="red">O TRATAMENTO.</span></span><span class="handle">@drfabioschmidt</span></div>
</div>
"""
page = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<title>Borderline sem tratamento</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
@font-face {{ font-family: "Anton"; src: url("assets/fonts/anton.woff2") format("woff2"); font-weight: 400; font-style: normal; }}
@font-face {{ font-family: "Fraunces"; src: url("assets/fonts/fraunces-italic-900.woff2") format("woff2"); font-weight: 900; font-style: italic; }}
@font-face {{ font-family: "Inter"; src: url("assets/fonts/inter-700.woff2") format("woff2"); font-weight: 700; font-style: normal; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:1080px; height:1920px; overflow:hidden; background:#000; }}
#root {{ position:relative; width:100%; height:100%; overflow:hidden; background:#000; }}
.clip {{ position:absolute; }}
.zoom {{ position:absolute; inset:0; width:1080px; height:1920px; transform-origin:50% 42%; }}
.zoom video, .zoom img {{ position:absolute; inset:0; width:1080px; height:1920px; object-fit:cover; display:block; }}
.cap {{ left:60px; width:840px; top:1300px; height:220px; display:flex; align-items:center; justify-content:center; }}
.cap-in {{ display:block; width:840px; text-align:center; line-height:1.0; color:#FFFFFF; font-family:"Anton"; font-size:78px; word-spacing:.12em; -webkit-text-stroke:3px #141414; paint-order:stroke fill; text-shadow:0 4px 14px rgba(0,0,0,.35); }}
.cap-in .w {{ font-family:"Anton"; font-size:78px; letter-spacing:.015em; text-transform:uppercase; display:inline-block; vertical-align:baseline; margin:0 .09em; }}
.cap-in .em {{ font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:118px; text-transform:uppercase; letter-spacing:-.01em; color:#CC0000; display:inline-block; vertical-align:baseline; margin:0 .10em; -webkit-text-stroke:4px #141414; text-shadow:0 5px 18px rgba(0,0,0,.55); }}
.up {{ left:72px; top:120px; width:840px; height:520px; }}
.dark {{ color:#FFFFFF; -webkit-text-stroke:3px #141414; paint-order:stroke fill; text-shadow:0 4px 14px rgba(0,0,0,.35); }}
.light {{ color:#FFFFFF; -webkit-text-stroke:3px #141414; paint-order:stroke fill; text-shadow:0 4px 14px rgba(0,0,0,.35); }}
.red {{ color:#CC0000; -webkit-text-stroke:4px #141414; text-shadow:0 5px 18px rgba(0,0,0,.55); }}
.hook-in {{ display:block; width:840px; }}
.h {{ display:block; font-family:"Anton"; font-size:108px; line-height:1.0; letter-spacing:.01em; text-transform:uppercase; }}
.li {{ display:flex; align-items:baseline; gap:22px; width:840px; margin-bottom:10px; }}
.li .num {{ font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:86px; color:#CC0000; width:70px; display:inline-block; }}
.li .big {{ font-family:"Anton"; font-size:104px; line-height:1.0; letter-spacing:.01em; display:inline-block; }}
.ps-label {{ font-family:"Inter"; font-weight:700; font-size:40px; letter-spacing:.14em; margin-bottom:22px; display:block; width:840px; }}
.chips {{ display:flex; gap:26px; width:840px; }}
.chip {{ width:150px; height:150px; border:5px solid #141414; -webkit-text-stroke:0; text-shadow:none; border-radius:26px; display:flex; align-items:center; justify-content:center; font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:96px; color:#CC0000; background:#FFFFFF; }}
.ps-sub {{ font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:64px; margin-top:26px; display:block; width:840px; }}
.big2 {{ display:block; width:840px; }}
.big2 .h {{ font-size:104px; }}
.comp {{ display:block; font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:64px; margin-top:14px; }}
.cta {{ left:72px; top:130px; width:900px; height:700px; }}
.cta-in {{ display:block; width:900px; }}
.cta-in .h {{ font-size:112px; }}
.handle {{ display:block; font-family:"Inter"; font-weight:700; font-size:44px; letter-spacing:.06em; margin-top:34px; }}
#fade {{ left:0; top:0; width:1080px; height:1920px; background:#000; }}
#fade-in {{ width:1080px; height:1920px; background:#000; }}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-fps="24" data-duration="32.0">
  <div class="zoom" id="z1"><video id="v1" class="clip" src="assets/video/01-quarto.mp4" muted playsinline data-start="0" data-duration="10" data-media-start="0" data-track-index="0"></video></div>
  <div class="zoom" id="z2"><video id="v2" class="clip" src="assets/video/02-corredor.mp4" muted playsinline data-start="10" data-duration="10" data-media-start="0" data-track-index="0"></video></div>
  <div class="zoom" id="z3"><video id="v3" class="clip" src="assets/video/03-cozinha.mp4" muted playsinline data-start="20" data-duration="10.02" data-media-start="0" data-track-index="0"></video><img id="hold3" class="clip" src="assets/video/freeze-cozinha.png" data-start="30.0" data-duration="2.0" data-track-index="0" /></div>
{upper}
{"".join(cap_html)}
  <div class="clip" id="fade" data-start="31.7" data-duration="0.3" data-track-index="4"><div id="fade-in"></div></div>
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
// zoom punches, leves, um trecho inteiro entre cortes
tl.fromTo("#z1",{{scale:1}},{{scale:1.06,duration:2.0,ease:"power1.out"}},8.0);
tl.fromTo("#z2",{{scale:1}},{{scale:1.05,duration:2.0,ease:"power1.out"}},16.0);
tl.fromTo("#z3",{{scale:1}},{{scale:1.06,duration:2.0,ease:"power1.out"}},24.0);
tl.set("#z3",{{scale:1}},26.0);
tl.set("#z1",{{scale:1}},10.0); tl.set("#z2",{{scale:1}},20.0);
// gancho: visível já no quadro 0 (sem fade de entrada), sai deslizando
tl.to("#hookin",{{x:-60,opacity:0,duration:0.26,ease:"power2.in"}},2.9);
// contador PS
tl.fromTo("#pslabel",{{opacity:0,y:-16}},{{opacity:1,y:0,duration:0.25}},15.1);
tl.fromTo("#chip1",{{scale:0.6,opacity:0}},{{scale:1,opacity:1,duration:0.3,ease:"back.out(1.8)"}},15.24);
tl.fromTo("#chip2",{{scale:0.6,opacity:0}},{{scale:1,opacity:1,duration:0.3,ease:"back.out(1.8)"}},16.52);
tl.fromTo("#chip3",{{scale:0.6,opacity:0}},{{scale:1,opacity:1,duration:0.3,ease:"back.out(1.8)"}},17.24);
tl.fromTo("#pssub",{{opacity:0,x:-30}},{{opacity:1,x:0,duration:0.28,ease:"power3.out"}},17.5);
tl.to("#ps > *",{{opacity:0,duration:0.2}},18.72);
// medo de abandono / tratamento
tl.fromTo("#medoin .h",{{x:-50,opacity:0}},{{x:0,opacity:1,duration:0.32,ease:"power3.out",stagger:0.3}},22.95);
tl.to("#medoin",{{opacity:0,duration:0.2}},26.42);
tl.fromTo("#tratin",{{x:-50,opacity:0}},{{x:0,opacity:1,duration:0.32,ease:"power3.out"}},26.82);
tl.to("#tratin",{{opacity:0,duration:0.2}},29.08);
// CTA
tl.fromTo("#ctain > .h",{{y:30,opacity:0}},{{y:0,opacity:1,duration:0.3,ease:"power3.out",stagger:0.12}},29.4);
tl.fromTo("#ctain .handle",{{opacity:0}},{{opacity:1,duration:0.3}},29.9);
// fade final
tl.fromTo("#fade-in",{{opacity:0}},{{opacity:1,duration:0.3,ease:"power1.in"}},31.7);
// legendas
{cap_tl}
{em_tl}
window.__timelines["main"] = tl;
</script>
</body>
</html>
"""
open("index.html","w").write(page)
print(len(groups),"grupos")
for g in groups: print(f'{g["s"]:6.2f}-{g["end"]:6.2f}', " ".join((w.upper() if e else w) for w,e in g["words"]))
