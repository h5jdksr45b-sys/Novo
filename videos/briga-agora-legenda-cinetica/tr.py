import sys,json
from faster_whisper import WhisperModel
m=WhisperModel(sys.argv[3],device="cpu",compute_type="int8")
import numpy as np
segs,_=m.transcribe(np.fromfile(sys.argv[1],dtype=np.float32),language="pt",word_timestamps=True,vad_filter=False)
w=[]
for s in segs:
  for x in s.words: w.append({"text":x.word.strip(),"start":round(x.start,3),"end":round(x.end,3)})
json.dump(w,open(sys.argv[2],"w"),ensure_ascii=False,indent=0)
print(" ".join(f"{x['text']}[{x['start']}]" for x in w))
