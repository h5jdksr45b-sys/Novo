# Mixagem final com a Morning Plucks: voz (audio/voz.wav, de mix.py) + corte da trilha já no nível (-26 LUFS), ganho final para -14 LUFS.
import subprocess, re
def lufs(f):
    o=subprocess.run(["ffmpeg","-v","info","-i",f,"-af","ebur128=framelog=quiet:peak=true","-f","null","-"],capture_output=True,text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS",o)[-1]), float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS",o)[-1])
subprocess.run(["ffmpeg","-v","error","-y","-i","audio/voz.wav","-i","musica-corte-morning-plucks.m4a","-filter_complex",
 "[0:a]aformat=sample_rates=48000:channel_layouts=stereo[v];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[m];[v][m]amix=inputs=2:normalize=0:duration=longest[o]",
 "-map","[o]","-c:a","pcm_s16le","audio/mix2-raw.wav"],check=True)
L,_=lufs("audio/mix2-raw.wav"); g=-14.0-L
subprocess.run(["ffmpeg","-v","error","-y","-i","audio/mix2-raw.wav","-af",f"volume={g:.2f}dB,alimiter=limit=0.84:attack=3:release=80","audio/final2.wav"],check=True)
print("final", lufs("audio/final2.wav"))
