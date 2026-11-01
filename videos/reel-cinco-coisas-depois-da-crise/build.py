import json, html, re
K = json.load(open("keep.json")); W = json.load(open("words.json"))
# ---- tempo: fonte -> montagem
offs=[]; acc=0.0
for a,b in K: offs.append((a,b,acc)); acc += b-a
TOTAL = round(acc,3)
def nt(t):
    for a,b,o in offs:
        if a-1e-6 <= t <= b+1e-6: return round(o + (t-a),3)
    return None
def nt_near(t):  # tempo fonte que pode cair em corte: vai para o próximo trecho
    v = nt(t)
    if v is not None: return v
    for a,b,o in offs:
        if t < a: return round(o,3)
    return TOTAL
# ---- palavras
FIX = {"seja":"já","leirem":"lerem","porquê.":"por quê.","essa":"essas"}
words=[]
for i,x in enumerate(W):
    s,e = nt(x["s"]), nt(min(x["e"], x["s"]+0.9))
    if s is None: continue
    if e is None: e = s+0.25
    w = FIX.get(x["w"], x["w"])
    if x["w"]=="e" and abs(x["s"]-4.60)<0.05: w="que"
    if x["w"]=="corpo": w="corpo."
    words.append({"w":w,"s":s,"e":e,"src":x["s"],"enum":any(abs(x["s"]-t)<0.03 for t in [8.72,16.62,24.72,36.82,45.38])})
EMPH = {"cinco","crise","erradas","quieta","frieza","vergonha","apagar","exagerar","pavor","sozinha","dorme",
        "ressaca","presentes","gesto","cobrar","errado"}
ENUM = {8.72,16.62,24.72,36.82,45.38}
used_crise=[False]
def key(w): return re.sub(r"[^\wÀ-ú]","",w.lower())
groups=[]; cur=[]
for i,x in enumerate(words):
    if cur:
        prev=cur[-1]
        if len(cur)>=3 or (re.search(r"[,.?!]$",prev["w"]) and not (len(cur)==1 and len(key(prev["w"]))<=2)) or x["s"]-prev["e"]>0.35 or x["s"]-cur[0]["s"]>1.5:
            groups.append(cur); cur=[]
    cur.append(x)
if cur: groups.append(cur)
for g in groups:
    cands=[j for j,x in enumerate(g) if key(x["w"]) in EMPH or x["enum"]]
    if any(x["enum"] for x in g): cands=[j for j,x in enumerate(g) if x["enum"]]
    if key(g[0]["w"])=="cinco" and g[0]["src"]<1: cands=[0]
    cands=[j for j in cands if not (key(g[j]["w"])=="cinco" and 50<g[j]["src"]<70)]
    for j in cands:
        if key(g[j]["w"])=="crise":
            if used_crise[0]: cands=[c for c in cands if c!=j]
            else: used_crise[0]=True
    for x in g: x["em"]=False
    if cands: g[cands[-1]]["em"]=True
for i,g in enumerate(groups):
    nxt = groups[i+1][0]["s"] if i+1<len(groups) else TOTAL
    g_end = min(nxt, g[-1]["e"]+0.6)
    g.append(round(g_end,3))
# ---- b-roll (fonte)
BR = [("b1",12.40,16.45,"brightness(.92) saturate(.88)"),
      ("b2",18.50,22.40,"brightness(.74) saturate(.78) sepia(.10) contrast(1.05)"),
      ("b3",27.55,29.50,"brightness(.95) saturate(.88)"),
      ("b4",37.25,39.50,"brightness(1.05) saturate(.9)"),
      ("b5",45.80,48.70,"brightness(.9) saturate(.86)")]
br_html=[]; br_tl=[]
for k,(name,a,b,flt) in enumerate(BR):
    s=nt_near(a); e=nt_near(b); d=round(e-s,3)
    br_html.append(f'<div class="clip broll" id="br{k}" data-start="{s:.3f}" data-duration="{d:.3f}" data-track-index="1"><div class="kb" id="kb{k}"><img src="assets/img/{name}.jpg" style="filter:{flt}" /></div><div class="vign"></div></div>')
    br_tl.append(f'tl.fromTo("#kb{k}",{{scale:1.04,y:0}},{{scale:1.13,y:-30,duration:{d:.3f},ease:"none"}},{s:.3f});')
    br_tl.append(f'tl.fromTo("#kb{k}",{{opacity:0.35}},{{opacity:1,duration:0.12,ease:"power1.out"}},{s:.3f});')
BRS=[(nt_near(a),nt_near(b)) for _,a,b,_ in BR]
# ---- esquema: banda superior (mesmo molde sempre)
# (id, num, [(t_src, label, big, style)], strike_src, end_src, sub)
SCH = [
 ("s1",8.72,"1",[(12.62,"PARECE","FRIEZA","w"),(14.70,"O QUE É","VERGONHA","r")],13.84,16.50,("que não saiu da boca",15.22)),
 ("s2",16.62,"2",[(18.74,"PARECE","NÃO SENTIU NADA","w"),(21.22,"O QUE É","APAGAR A CENA","r")],19.72,24.62,None),
 ("s3",24.72,"3",[(26.40,"PARECE","EXAGERO","w"),(33.50,"O QUE É","PAVOR","r")],32.27,36.75,("de ficar sozinha",36.20)),
 ("s4",36.82,"4",[(44.56,"O DIA SEGUINTE","RESSACA","r")],None,45.95,None),
 ("s5",45.38,"5",[(49.90,"PARECE","COMPRAR O OUTRO","w"),(51.80,"O QUE É","DESCULPA EM GESTO","r")],51.20,55.80,None),
 ("s6",None,"",[(62.15,"PODE","COBRAR","r"),(64.35,"DEPOIS QUE CONSEGUIR","OLHAR DE NOVO","r")],None,66.10,None),
 ("s7",None,"",[(69.40,"MANDA PRA QUEM","ENTENDEU ERRADO","r")],None,70.62,None),
]
sch_html=[]; sch_tl=[]
for sid,tnum,num,states,strike,end,sub in SCH:
    s0=nt_near(tnum if tnum else states[0][0]); e0=nt_near(end); 
    if sid=="s7": e0=TOTAL
    inner=[]
    if num: inner.append(f'<div class="chip" id="{sid}c">{num}<span>/5</span></div>')
    for j,(t,lab,big,sty) in enumerate(states):
        cls="big red" if sty=="r" else "big"
        inner.append(f'<div class="st" id="{sid}st{j}"><div class="lab">{html.escape(lab)}</div><div class="{cls}"><span class="bw" id="{sid}b{j}">{html.escape(big)}</span>{"<i class=strike id="+sid+"k></i>" if (j==0 and strike) else ""}</div></div>')
    if sub: inner.append(f'<div class="sub" id="{sid}sub">{html.escape(sub[0])}</div>')
    sch_html.append(f'<div class="clip band" id="{sid}" data-start="{s0:.3f}" data-duration="{e0-s0:.3f}" data-track-index="2">{"".join(inner)}</div>')
    if num: sch_tl.append(f'tl.fromTo("#{sid}c",{{x:-24,opacity:0}},{{x:0,opacity:1,duration:0.22,ease:"power3.out"}},{s0:.3f});')
    for j,(t,lab,big,sty) in enumerate(states):
        tt=nt_near(t)
        sch_tl.append(f'tl.fromTo("#{sid}st{j}",{{x:-40,opacity:0}},{{x:0,opacity:1,duration:0.26,ease:"power3.out"}},{tt:.3f});')
        if j+1<len(states):
            tn=nt_near(states[j+1][0])
            sch_tl.append(f'tl.to("#{sid}st{j}",{{x:40,opacity:0,duration:0.18,ease:"power2.in"}},{tn-0.2:.3f});')
    if strike:
        ts=nt_near(strike)
        sch_tl.append(f'tl.fromTo("#{sid}k",{{scaleX:0}},{{scaleX:1,duration:0.24,ease:"power2.out"}},{ts:.3f});')
        sch_tl.append(f'tl.to("#{sid}b0",{{opacity:0.45,duration:0.2}},{ts+0.1:.3f});')
    if sub:
        sch_tl.append(f'tl.fromTo("#{sid}sub",{{y:12,opacity:0}},{{y:0,opacity:1,duration:0.24,ease:"power2.out"}},{nt_near(sub[1]):.3f});')
    if sid!="s7":
        sch_tl.append(f'tl.to("#{sid} > *",{{opacity:0,duration:0.18}},{e0-0.2:.3f});')
# ---- legendas
cap_html=[]; cap_tl=[]
for i,g in enumerate(groups):
    ge=g[-1]; ws=g[:-1]
    spans=[]
    for j,x in enumerate(ws):
        cls="em" if x["em"] else "w"
        spans.append(f'<span class="{cls}" id="c{i}w{j}">{html.escape(x["w"])}</span>')
    cap_html.append(f'<div class="clip cap" id="cap{i}" data-start="{ws[0]["s"]:.3f}" data-duration="{ge-ws[0]["s"]:.3f}" data-track-index="3"><div class="cap-in">{" ".join(spans)}</div></div>')
    for j,x in enumerate(ws):
        t=max(ws[0]["s"], x["s"]-0.03)
        if x["em"]:
            cap_tl.append(f'tl.fromTo("#c{i}w{j}",{{opacity:0,scale:0.7,y:10}},{{opacity:1,scale:1,y:0,duration:0.22,ease:"back.out(2)"}},{t:.3f});')
        else:
            cap_tl.append(f'tl.fromTo("#c{i}w{j}",{{opacity:0,y:14}},{{opacity:1,y:0,duration:0.14,ease:"power2.out"}},{t:.3f});')
# ---- zoom nos trechos de câmera (alternado, mascara jump cut)
cuts_src=[3.6,19.8,45.3333]
bounds=sorted(set([0.0]+[o for _,_,o in offs][1:]+[nt(c) for c in cuts_src if nt(c) is not None]+[TOTAL]))
segs=[(bounds[i],bounds[i+1]) for i in range(len(bounds)-1) if bounds[i+1]-bounds[i]>0.05]
zoom_tl=[]; clicks=[]
for i,(a,b) in enumerate(segs):
    sc = 1.0 if i%2==0 else 1.1
    if a>=nt_near(66.16)-0.01: sc=1.14
    zoom_tl.append(f'tl.set("#arollz",{{scale:{sc}}},{a+0.02:.3f});')
    if i>0: clicks.append(round(a,3))
json.dump({"total":TOTAL,"brolls":BRS,"clicks":clicks,"segs":segs},open("timing.json","w"),indent=1)
# ---- gancho
hook = '''<div class="clip hook" id="hook" data-start="0" data-duration="3.10" data-track-index="2"><div id="hookin"><div class="hl">DEPOIS DA CRISE,</div><div class="hl">QUASE TODO MUNDO LÊ</div><div class="hl">O <span class="redh">BORDERLINE</span> ERRADO.</div></div></div>'''
CSS = '''
@font-face { font-family:"Anton"; src:url("assets/fonts/anton.woff2") format("woff2"); font-weight:400; font-style:normal; }
@font-face { font-family:"Fraunces"; src:url("assets/fonts/fraunces-italic-900.woff2") format("woff2"); font-weight:900; font-style:italic; }
@font-face { font-family:"Inter"; src:url("assets/fonts/inter-700.woff2") format("woff2"); font-weight:700; font-style:normal; }
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1080px; height:1920px; overflow:hidden; background:#000; }
#root { position:relative; width:100%; height:100%; overflow:hidden; background:#000; }
.clip { position:absolute; }
#arollz { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin:50% 6%; }
#aroll { position:absolute; left:0; top:0; width:1080px; height:1920px; object-fit:cover; }
.broll { left:0; top:0; width:1080px; height:1920px; overflow:hidden; background:#000; }
.kb { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin:50% 45%; }
.kb img { width:1080px; height:1920px; object-fit:cover; display:block; }
.vign { position:absolute; left:0; top:0; width:1080px; height:1920px; background:radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%); }
.cap { left:130px; top:1170px; width:780px; height:260px; display:flex; align-items:center; justify-content:center; }
.cap-in { display:block; width:780px; text-align:center; line-height:1.02; font-family:"Anton"; font-size:76px; color:#fff; word-spacing:.06em; }
.cap-in span { display:inline-block; vertical-align:baseline; -webkit-text-stroke:7px #0d0d0d; paint-order:stroke fill; text-shadow:0 6px 18px rgba(0,0,0,.55); }
.cap-in .w { text-transform:uppercase; letter-spacing:.015em; }
.cap-in .em { font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:112px; color:#E0141B; text-transform:uppercase; letter-spacing:-.01em; -webkit-text-stroke:8px #0d0d0d; }
.band { left:64px; top:128px; width:880px; height:330px; }
.chip { display:inline-flex; align-items:baseline; gap:3px; background:#0d0d0d; color:#fff; font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:58px; line-height:1; padding:8px 18px 12px; border-radius:14px; border:3px solid #fff; box-shadow:0 6px 18px rgba(0,0,0,.45); }
.chip span { font-family:"Inter"; font-style:normal; font-weight:700; font-size:26px; opacity:.8; }
.st { position:absolute; left:0; top:92px; width:880px; }
.lab { display:block; font-family:"Inter"; font-weight:700; font-size:36px; letter-spacing:.12em; color:#fff; -webkit-text-stroke:5px #0d0d0d; paint-order:stroke fill; text-shadow:0 4px 12px rgba(0,0,0,.5); }
.big { position:relative; display:inline-block; white-space:nowrap; margin-top:6px; font-family:"Anton"; font-size:92px; line-height:1.0; color:#fff; letter-spacing:.01em; -webkit-text-stroke:7px #0d0d0d; paint-order:stroke fill; text-shadow:0 6px 18px rgba(0,0,0,.55); }
.big.red { font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:80px; color:#fff; background:#E0141B; padding:4px 22px 12px 18px; border-radius:10px; -webkit-text-stroke:0; text-shadow:none; box-shadow:0 8px 22px rgba(0,0,0,.45); letter-spacing:-.005em; }
.bw { display:inline-block; }
.strike { position:absolute; left:-8px; right:-8px; top:50%; height:12px; margin-top:-6px; background:#E0141B; border:3px solid #0d0d0d; border-radius:6px; transform-origin:0 50%; display:block; }
.sub { position:absolute; left:0; top:252px; width:880px; font-family:"Fraunces"; font-style:italic; font-weight:900; font-size:52px; color:#fff; -webkit-text-stroke:5px #0d0d0d; paint-order:stroke fill; text-shadow:0 4px 12px rgba(0,0,0,.5); }
.hook { left:72px; top:120px; width:900px; height:360px; }
#hookin { display:block; width:900px; }
.hl { display:block; font-family:"Anton"; font-size:94px; line-height:1.02; color:#fff; letter-spacing:.01em; -webkit-text-stroke:8px #0d0d0d; paint-order:stroke fill; text-shadow:0 6px 18px rgba(0,0,0,.55); }
.redh { color:#E0141B; }
#flash { left:0; top:0; width:1080px; height:1920px; }
#flash-in { width:1080px; height:1920px; background:#fff; }
#fade { left:0; top:0; width:1080px; height:1920px; }
#fade-in { width:1080px; height:1920px; background:#000; }
'''
f1s=BRS[0][0]; f1e=BRS[0][1]
page=f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>Cinco coisas depois da crise</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>{CSS}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-fps="30" data-duration="{TOTAL:.3f}">
  <div id="arollz"><video id="aroll" class="clip" src="assets/video/aroll.mp4" muted playsinline data-start="0" data-duration="{TOTAL:.3f}" data-media-start="0" data-track-index="0"></video></div>
  {"".join(br_html)}
  {hook}
  {"".join(sch_html)}
  {"".join(cap_html)}
  <div class="clip" id="flash" data-start="{f1s-0.04:.3f}" data-duration="0.2" data-track-index="4"><div id="flash-in"></div></div>
  <div class="clip" id="flash2" data-start="{f1e-0.04:.3f}" data-duration="0.2" data-track-index="4" style="left:0;top:0;width:1080px;height:1920px"><div id="flash2-in" style="width:1080px;height:1920px;background:#fff"></div></div>
  <div class="clip" id="fade" data-start="{TOTAL-0.16:.3f}" data-duration="0.16" data-track-index="5"><div id="fade-in"></div></div>
</div>
<script>
const tl = gsap.timeline({{ paused:true }});
{chr(10).join(zoom_tl)}
tl.to("#hookin",{{x:-60,opacity:0,duration:0.24,ease:"power2.in"}},2.86);
tl.fromTo("#flash-in",{{opacity:0.85}},{{opacity:0,duration:0.12,ease:"power1.out"}},{f1s-0.04:.3f});
tl.fromTo("#flash2-in",{{opacity:0.85}},{{opacity:0,duration:0.12,ease:"power1.out"}},{f1e-0.04:.3f});
tl.fromTo("#fade-in",{{opacity:0}},{{opacity:1,duration:0.15,ease:"power1.in"}},{TOTAL-0.16:.3f});
{chr(10).join(br_tl)}
{chr(10).join(sch_tl)}
{chr(10).join(cap_tl)}
window.__timelines["main"] = tl;
</script>
</body></html>
'''
open("index.html","w").write(page)
print("total",TOTAL,"grupos",len(groups),"segs",len(segs))
for g in groups: print(f'{g[0]["s"]:6.2f}', " ".join((x["w"].upper() if x["em"] else x["w"]) for x in g[:-1]))
