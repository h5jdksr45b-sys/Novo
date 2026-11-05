# Mixagem: voz (blocos apertados nos tempos de timeline.json) + trilha baixa com ducking. Saída audio/final.wav
import json, subprocess, re, sys
T=json.load(open("timeline.json")); W=json.load(open("words_tight.json"))
DUR=T["DUR"]; FINAL_IN=T["FINAL_IN"]
def lufs(f):
    o=subprocess.run(["ffmpeg","-v","info","-i",f,"-af","ebur128=framelog=quiet","-f","null","-"],capture_output=True,text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS",o)[-1]), float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS",o)[-1]) if "Peak:" in o else None
# 1) voz: concatena com adelay
inputs=[]; fc=[]; names=[]
for i,(n,st) in enumerate(T["START"].items()):
    inputs+=["-i",W[n]["file"]]; fc.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=mono,adelay={int(st*1000)}|{int(st*1000)}[v{i}]"); names.append(f"[v{i}]")
fc.append("".join(names)+f"amix=inputs={len(names)}:normalize=0,apad=whole_dur={DUR}[voz]")
subprocess.run(["ffmpeg","-v","error","-y",*inputs,"-filter_complex",";".join(fc),"-map","[voz]","-c:a","pcm_s16le","audio/voz-raw.wav"],check=True)
L,_=lufs("audio/voz-raw.wav"); g=-16.0-L
subprocess.run(["ffmpeg","-v","error","-y","-i","audio/voz-raw.wav","-af",f"volume={g:.2f}dB,alimiter=limit=0.8:attack=3:release=80","audio/voz.wav"],check=True)
print("voz LUFS antes",L,"ganho",round(g,2),"depois",lufs("audio/voz.wav"))
# 2) trilha: entra em 0, fade in 1,2 s, cerca de 22 dB abaixo da voz, ducking leve pela voz, fade out antes do fim
Lm,_=lufs("src/musica-a.mp3"); gm=(-16.0-18.0)-Lm
fo=DUR-1.6
subprocess.run(["ffmpeg","-v","error","-y","-i","src/musica-a.mp3","-i","audio/voz.wav","-filter_complex",
  f"[0:a]aformat=sample_rates=48000:channel_layouts=mono,atrim=0:{DUR},asetpts=PTS-STARTPTS,volume={gm:.2f}dB,afade=t=in:st=0:d=1.2,afade=t=out:st={fo:.2f}:d=1.5[m];"
  f"[1:a]asplit=2[vA][vB];[m][vB]sidechaincompress=threshold=0.02:ratio=4:attack=30:release=600:makeup=1[md];"
  f"[vA][md]amix=inputs=2:normalize=0,apad=whole_dur={DUR},atrim=0:{DUR}[out]",
  "-map","[out]","-c:a","pcm_s16le","audio/mix-raw.wav"],check=True)
Lx,_=lufs("audio/mix-raw.wav"); gx=-14.0-Lx
subprocess.run(["ffmpeg","-v","error","-y","-i","audio/mix-raw.wav","-af",f"volume={gx:.2f}dB,alimiter=limit=0.84:attack=3:release=80","-ac","2","audio/final.wav"],check=True)
print("trilha LUFS",Lm,"ganho",round(gm,2)); print("final",lufs("audio/final.wav"))
# medir nível da trilha sozinha nos trechos de fala
subprocess.run(["ffmpeg","-v","error","-y","-i","src/musica-a.mp3","-af",f"volume={gm+gx:.2f}dB,atrim=5:10","-f","null","-"])
o=subprocess.run(["ffmpeg","-v","info","-i","src/musica-a.mp3","-af",f"volume={gm+gx:.2f}dB,atrim=5:10,astats=measure_overall=RMS_level:measure_perchannel=none","-f","null","-"],capture_output=True,text=True).stderr
print("trilha RMS na mix (sem ducking):",re.findall(r"RMS level dB: (-?[\d.]+)",o))
o=subprocess.run(["ffmpeg","-v","info","-i","audio/voz.wav","-af","atrim=5:10,astats=measure_overall=RMS_level:measure_perchannel=none","-f","null","-"],capture_output=True,text=True).stderr
print("voz RMS 5-10s:",re.findall(r"RMS level dB: (-?[\d.]+)",o))
