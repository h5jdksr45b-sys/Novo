import json
from PIL import Image, ImageDraw
W='/home/user/Novo/videos/clipe-1027/'
O='/tmp/claude-0/v2/'
keeps=json.load(open(W+'keeps.json'))
snap=lambda t: round(t*30)/30
K=[(snap(a),snap(b)) for a,b in keeps]
starts=[];acc=0
for a,b in K: starts.append(acc); acc+=b-a
DUR=63.5
def m(t):
    for (a,b),s in zip(K,starts):
        if a-0.05<=t<=b+0.05: return max(0,min(s+(min(max(t,a),b)-a),DUR))
    if 18.2<t<24.0: return None
    best=min(range(len(K)),key=lambda i:min(abs(t-K[i][0]),abs(t-K[i][1])))
    a,b=K[best];return starts[best]+(min(max(t,a),b)-a)
words=[]
for l in open(W+'words.txt'):
    a,b,w=l.split(' ',2); a=float(a);b=float(b);w=w.strip()
    ma,mb=m(a),m(b)
    if ma is None or mb is None: continue
    words.append([ma,mb,w])
# chunk <=3 words, break after punctuation
FN={'a','o','de','do','da','no','na','num','um','uma','e','que','por','como','só','ou','se','em','faz','às','para','mas','com','esse','nós','eu','suas','sente','não','muito'}
chunks=[];cur=[]
for w in words:
    cur.append(w)
    if w[2][-1] in '.,':
        chunks.append(cur);cur=[]
    elif len(cur)==3:
        carry=[]
        while len(cur)>1 and cur[-1][2].lower() in FN: carry.insert(0,cur.pop())
        chunks.append(cur);cur=carry
if cur: chunks.append(cur)
# split chunks that grew beyond 3 after carry
out=[]
for c in chunks:
    while len(c)>3: out.append(c[:2]); c=c[2:]
    out.append(c)
chunks=out
# avoid dangling 1-word chunk of tiny word: merge forward
HL={'borderline','tom','confissão','culpa','trágico','assusta','confiança','armadilha','antecipadas','fantasma','manual','transbordam','crise','três','desabar','lado','gatilho','20','minutos','segredo','roteiro','medo','segurança','diagnóstico'}
def ts(t):
    h=int(t//3600);mi=int(t%3600//60);s=t%60
    return f"{h}:{mi:02d}:{s:05.2f}"
ev=[]
for i,c in enumerate(chunks):
    st=c[0][0]; en=chunks[i+1][0][0] if i+1<len(chunks) else c[-1][1]+0.3
    en=min(en, c[-1][1]+0.6, DUR)
    parts=[]
    for w in c:
        t=w[2].strip('.,').upper()
        key=w[2].strip('.,').lower()
        if key in HL:
            parts.append(r"{\fnDM Serif Display\fs88\c&H0000CC&}"+t+r"{\fnMontserrat ExtraBold\fs64\c&H1E1E1E&}")
        else: parts.append(t)
    ev.append(f"Dialogue: 1,{ts(st)},{ts(en)},Cap,,0,0,0,,{{\\fad(60,0)\\t(0,90,\\fscx104\\fscy104)\\t(90,160,\\fscx100\\fscy100)}}"+' '.join(parts))
HOOK_END=3.4
cta_start=m(68.46)
hook=r"{\fad(0,200)}COMO CONTAR\NO DIAGNÓSTICO\NSEM ASSUSTAR"
ev.append(f"Dialogue: 2,{ts(0)},{ts(HOOK_END)},Hook,,0,0,0,,"+hook)
ev.append(f"Dialogue: 2,{ts(HOOK_END)},{ts(cta_start)},Title,,0,0,0,,"+r"{\fad(250,200)}COMO CONTAR O DIAGNÓSTICO\N{\fnMontserrat\b0\fs38\c&HD9D9D9&}sem assustar quem está com você")
ev.append(f"Dialogue: 2,{ts(cta_start)},{ts(DUR)},Hook,,0,0,0,,"+r"{\fad(250,0)}ENVIE PARA QUEM\N{\fnDM Serif Display\c&H3B3BE0&\fs92}você vai contar")
hdr=f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Montserrat ExtraBold,64,&H001E1E1E,&H001E1E1E,&H00E4EEF2,&H00E4EEF2,0,0,0,0,100,100,1,0,4,18,0,2,80,80,420,1
Style: Hook,Montserrat ExtraBold,86,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,0,4,8,60,60,92,1
Style: Title,Montserrat ExtraBold,50,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,0,3,8,60,60,170,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open(O+'subs.ass','w').write(hdr+'\n'.join(ev)+'\n')
# punch segments: keep index of 'A armadilha', 'Explique...transbordam', 'Você troca'
def seg_of(t):
    for i,(a,b) in enumerate(K):
        if a<=t<=b: return i
P=[seg_of(24.5),seg_of(41.0),seg_of(65.0)]
punch=[(starts[i],starts[i]+K[i][1]-K[i][0]) for i in P]
json.dump({'punch':punch,'cta':cta_start},open(O+'meta.json','w'))
print('punch',punch,'cta',cta_start,'chunks',len(chunks))
# rounded mask 960x1280
mk=Image.new('L',(960,1280),0);ImageDraw.Draw(mk).rounded_rectangle([0,0,959,1279],radius=34,fill=255);mk.save(O+'mask.png')
