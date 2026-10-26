"""Corta silêncios > 0,2 s da gravação, deixando folga nas pontas. Gera base.mp4 e mapa.json."""
import json, subprocess, re, sys
src, out_dir = sys.argv[1], sys.argv[2]
log = subprocess.run(["ffmpeg","-i",src,"-af","silencedetect=n=-35dB:d=0.2","-f","null","-"],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r"silence_start: ([0-9.]+)",log)]
en=[float(x) for x in re.findall(r"silence_end: ([0-9.]+)",log)]
dur=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src],capture_output=True,text=True).stdout)
PAD_IN, PAD_OUT = 0.10, 0.06  # folga antes da fala e depois da fala
keep=[]; cur=0.0
for s,e in zip(st,en):
    a=max(cur, s+PAD_OUT) if s>0 else 0
    if s<=0.01: cur=max(0,e-PAD_IN); continue
    keep.append([cur, s+PAD_OUT]); cur=max(s+PAD_OUT, e-PAD_IN)
if cur<dur-0.05: keep.append([cur,dur])
keep=[[round(a,3),round(b,3)] for a,b in keep if b-a>0.05]
t=0; segs=[]
for a,b in keep: segs.append({"src_in":a,"src_out":b,"out_in":round(t,3)}); t+=b-a
json.dump({"segments":segs,"duration":round(t,3)},open(f"{out_dir}/mapa.json","w"),indent=1)
parts=[]; fc=""
for i,(a,b) in enumerate(keep):
    fc+=f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30[v{i}];"
    fc+=f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b-a-0.012:.3f}:d=0.012[a{i}];"
fc+="".join(f"[v{i}][a{i}]" for i in range(len(keep)))+f"concat=n={len(keep)}:v=1:a=1[v][a]"
subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-filter_complex",fc,"-map","[v]","-map","[a]","-c:v","libx264","-crf","16","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-ar","48000",f"{out_dir}/base.mp4"],check=True)
print(len(keep),"trechos; duração final",round(t,2),"s (antes",round(dur,2),")")
