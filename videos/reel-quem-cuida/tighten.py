# Aperta pausas: 0,35 s depois de ponto/interrogação, 0,15 s depois de vírgula, 0,12 s entre palavras.
# Entrada: words_raw.json (tempos por arquivo). Saída: audio/<nome>-t.wav + words_tight.json
import json, subprocess, numpy as np, sys, os
SR=48000
raw=json.load(open("words_raw.json"))
out=json.load(open("words_tight.json")) if os.path.exists("words_tight.json") else {}
os.makedirs("audio",exist_ok=True)
def load(f):
    b=subprocess.run(["ffmpeg","-v","error","-i",f,"-f","f32le","-ac","1","-ar",str(SR),"-"],capture_output=True).stdout
    return np.frombuffer(b,dtype=np.float32)
def rms_env(a,win=int(0.01*SR)):
    n=len(a)//win; e=np.sqrt((a[:n*win].reshape(n,win)**2).mean(1)); return e
for f in sys.argv[1:]:
    words=raw[f]; a=load(f); env=rms_env(a); thr=env.max()*0.04
    # refina início/fim de cada palavra pelo envelope (whisper erra em pausas longas)
    def speech_bounds(s,e):
        i0=int(s*100); i1=int(e*100)
        seg=env[i0:i1+1]
        idx=np.where(seg>thr)[0]
        if len(idx)==0: return s,e
        return (i0+idx[0])/100.0,(i0+idx[-1]+1)/100.0
    segs=[]
    for w in words:
        s,e=speech_bounds(w["s"],w["e"])
        segs.append([w["w"],s,e])
    # junta segmentos de fala contínua e calcula cortes
    pieces=[]; t_out=0.0; newwords=[]
    LEAD=0.05
    cur_start=max(0.0,segs[0][1]-LEAD); 
    prev_end=None; prev_word=None
    # construir lista de (src_start, src_end) e mapear palavras
    cuts=[]  # (src_from, src_to) trechos a remover
    for i,(w,s,e) in enumerate(segs):
        if prev_end is not None:
            gap=s-prev_end
            target=0.35 if prev_word[-1] in ".?!" else (0.15 if prev_word[-1] in ",;:" else 0.12)
            if gap>target+0.02:
                cuts.append((prev_end+target*0.5, s-target*0.5))
        prev_end=e; prev_word=w
    src_end=min(len(a)/SR, segs[-1][2]+0.12)
    # montar áudio
    keep=[]; pos=cur_start
    for c0,c1 in cuts:
        keep.append((pos,c0)); pos=c1
    keep.append((pos,src_end))
    chunks=[]; 
    def map_t(t):
        o=0.0
        for k0,k1 in keep:
            if t<=k1: return o+max(0.0,t-k0)
            o+=k1-k0
        return o
    for k0,k1 in keep:
        seg=a[int(k0*SR):int(k1*SR)]
        # fade curto nas emendas
        n=min(int(0.004*SR),len(seg)//2)
        if n>0:
            seg=seg.copy(); seg[:n]*=np.linspace(0,1,n); seg[-n:]*=np.linspace(1,0,n)
        chunks.append(seg)
    y=np.concatenate(chunks)
    for w,s,e in segs:
        newwords.append({"w":w,"s":round(map_t(s),3),"e":round(map_t(e),3)})
    name=os.path.splitext(os.path.basename(f))[0]
    outf=f"audio/{name}-t.wav"
    subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","1","-i","-","-c:a","pcm_s16le",outf],input=y.astype(np.float32).tobytes())
    out[name]={"file":outf,"dur":round(len(y)/SR,3),"words":newwords}
    print(name, "dur", round(len(y)/SR,2), "cuts", len(cuts), " ".join(f"{w['w']}[{w['s']}]" for w in newwords))
json.dump(out,open("words_tight.json","w"),ensure_ascii=False,indent=1)
