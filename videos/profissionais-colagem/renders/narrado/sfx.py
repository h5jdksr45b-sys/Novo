import json,numpy as np,subprocess,sys
S=sys.argv[1]; LIB=sys.argv[2]; EP=sys.argv[3]
d=json.load(open(S+'/dump.json')); KN=d['KN']; e=d['e']
cap={(c[0],c[1]):c[2] for c in d['caps']}
def inv(t):
    for (a0,b0),(a1,b1) in zip(KN,KN[1:]):
        if t<=b1: return a0+(a1-a0)*(t-b0)/(b1-b0)
    return t
SR=48000; N=int(30*SR); out=np.zeros(N)
rng=np.random.default_rng(7)
def load(f):
    r=subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    x=np.frombuffer(r,dtype=np.float32).astype(float); return x/np.abs(x).max()
def hp(x,fc):  # simple one-pole high-pass
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); p=0;px=0
    for i,v in enumerate(x): p=a*(p+v-px); px=v; y[i]=p
    return y
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); p=0
    for i,v in enumerate(x): p=(1-a)*v+a*p; y[i]=p
    return y
def paper(dur=.09):
    n=int(dur*SR); x=rng.standard_normal(n)*np.exp(-np.linspace(0,7,n)); x=hp(lp(x,6000),900); return x/np.abs(x).max()
def tock():
    n=int(.12*SR); t=np.arange(n)/SR
    body=np.sin(2*np.pi*260*t)*np.exp(-t*45)+.5*np.sin(2*np.pi*410*t)*np.exp(-t*60)
    nz=hp(rng.standard_normal(n),1500)*np.exp(-t*120)*.6
    x=hp(body+nz,180); return x/np.abs(x).max()
LIBS={'type':load(LIB+'/typing.mp3')[:int(0.7*48000)],'key':load(EP+'/Futurista_Click4.mp3'),'wh':load(EP+'/Whoosh_Swipe9.mp3'),'wh2':load(EP+'/Whoosh_Fino6.mp3'),'click':load(LIB+'/click-soft.mp3'),'pop':load(EP+'/HUD_Pop-Up2.mp3')}
def add(t,x,db):
    i=int(t*SR); g=10**(db/20); x=x[:max(0,N-i)]; out[i:i+len(x)]+=x*g
ev=[]
W=-15  # pico alvo base dBFS
# entradas e saídas de cena (whoosh)
for j,to in enumerate([0.05,3.9,9.95,13.95,20.95,25.95]): ev.append((inv(to),'wh' if j%2==0 else 'wh2',-17))
# cena 1: placa presa, porta fecha
ev.append((inv(0.9),'paper',-16)); ev.append((inv(2.62),'tock',-14))
# cena 2: ênfase e portas batendo
e2=e[1]; ev.append((inv(e2+.03),'paper',-15))
for k in range(5): ev.append((inv(e2+.2+k*.22+.18),'tock',-17))
# cena 3: crachás
for i in range(4): ev.append((inv(cap[(2,i)]-.05+.25),'paper',-15))
# cena 4: fichas e portas reabrindo
s4=cap[(3,4)]; s4e=e[3]
for k in range(5): ev.append((inv(s4+(s4e-s4)*k/5+.12),'paper',-17)); ev.append((inv(s4+(s4e-s4)*(k+.6)/5),'click',-21))
ev.append((inv(s4e+.03),'paper',-15))
# cena 5: porta vira
ev.append((inv(cap[(4,1)]),'wh2',-20))
# cena 6: ênfase, etiquetas, cartão final
e6=e[5]; ev.append((inv(e6+.03),'paper',-15))
for i in range(10): ev.append((inv(27.0+i*.09),'paper',-22))
ev.append((inv(e6+.5),'pop',-20))
# extras: número digitado, cliques leves nas legendas-chave
ev.append((inv(cap[(1,1)]),'type',-22))
for key in [(0,3),(1,7),(3,2),(4,5),(5,2),(5,3)]: ev.append((inv(cap[key]),'key',-22))
ev=[(t,k,db+3) for t,k,db in ev]
for t,k,db in ev:
    x={'paper':paper(),'tock':tock()}.get(k) if k in('paper','tock') else LIBS[k]
    add(t,x,db)
pk=20*np.log10(np.abs(out).max()); print('events',len(ev),'peak',round(pk,1))
out.astype(np.float32).tofile(S+'/a/sfx.f32')
json.dump([(round(t,3),k,db) for t,k,db in ev],open(S+'/a/sfx_events.json','w'))
