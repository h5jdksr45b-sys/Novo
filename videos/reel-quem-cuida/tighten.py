# Aperta pausas cortando SÓ dentro de silêncios detectados pelo ffmpeg (-40 dB, >= 0,18 s),
# com margem de 0,06 s em cada lado. Alvo: 0,35 s depois de ponto/interrogação, 0,15 s depois de vírgula,
# 0,12 s nas outras. Nunca encosta na fala. Saída: audio/<nome>-t.wav e words_tight.json (tempos por transcrição do arquivo final).
import json, subprocess, re, sys, os, numpy as np
SR=48000; MARG=0.06
raw=json.load(open("words_raw.json"))
os.makedirs("audio",exist_ok=True)
out=json.load(open("words_tight.json")) if os.path.exists("words_tight.json") else {}
def silences(f):
    o=subprocess.run(["ffmpeg","-v","info","-i",f,"-af","silencedetect=n=-40dB:d=0.18","-f","null","-"],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",o)]; en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",o)]
    return list(zip(st,en))
def load(f):
    return np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",f,"-f","f32le","-ac","1","-ar",str(SR),"-"],capture_output=True).stdout,dtype=np.float32)
for f in sys.argv[1:]:
    a=load(f); total=len(a)/SR; words=raw[f]; sil=silences(f)
    keep=[]; pos=0.0
    for s,e in sil:
        if s<=0.01:            # silêncio inicial: deixa 0,05 s
            pos=max(0.0,e-0.05); continue
        if e>=total-0.12:      # silêncio final: deixa 0,12 s
            keep.append((pos,min(total,s+0.12))); pos=None; break
        # palavra antes do silêncio
        prev=[w for w in words if w["e"]<=s+0.15]
        pw=prev[-1]["w"] if prev else ""
        target=0.35 if pw[-1:] in ".?!" else (0.15 if pw[-1:] in ",;:" else 0.12)
        gap=e-s
        if gap-2*MARG>target:
            cut0=s+MARG; cut1=e-MARG; excess=(cut1-cut0)-target
            keep.append((pos,cut0+ (cut1-cut0-excess)/2)); pos=cut1-(cut1-cut0-excess)/2
    if pos is not None: keep.append((pos,total))
    chunks=[]
    for k0,k1 in keep:
        seg=a[int(k0*SR):int(k1*SR)].copy(); n=min(int(0.004*SR),len(seg)//2)
        if n>0: seg[:n]*=np.linspace(0,1,n); seg[-n:]*=np.linspace(1,0,n)
        chunks.append(seg)
    y=np.concatenate(chunks); name=os.path.splitext(os.path.basename(f))[0]; outf=f"audio/{name}-t.wav"
    subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","1","-i","-","-c:a","pcm_s16le",outf],input=y.astype(np.float32).tobytes(),check=True)
    out[name]={"file":outf,"dur":round(len(y)/SR,3),"words":[]}
    print(name,"dur",round(len(y)/SR,2),"trechos",len(keep),"cortes em",[(round(s,2),round(e,2)) for s,e in sil])
json.dump(out,open("words_tight.json","w"),ensure_ascii=False,indent=1)
