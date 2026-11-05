import json, sys, subprocess, numpy as np
from faster_whisper import WhisperModel
M = "/tmp/claude-0/-home-user-Novo/f0efae46-0049-598c-91ff-f9396aa832ff/scratchpad/wmodel/package"
model = WhisperModel(M, device="cpu", compute_type="int8")
import os
out = json.load(open("words_raw.json")) if os.path.exists("words_raw.json") else {}
for f in sys.argv[1:]:
    a = np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",f,"-f","f32le","-ac","1","-ar","16000","-"],capture_output=True).stdout, dtype=np.float32)
    segs, info = model.transcribe(a, language="pt", word_timestamps=True, beam_size=5, vad_filter=False)
    words = []
    for s in segs:
        for w in s.words:
            words.append({"w": w.word.strip(), "s": round(w.start,3), "e": round(w.end,3)})
    out[f] = words
    print(f, " ".join(f"{w['w']}[{w['s']}-{w['e']}]" for w in words))
json.dump(out, open("words_raw.json","w"), ensure_ascii=False, indent=1)
