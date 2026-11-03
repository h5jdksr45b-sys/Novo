import json
from faster_whisper import WhisperModel
m = WhisperModel('/tmp/claude-0/fw/model', device='cpu', compute_type='int8')
import wave, numpy as np
w_=wave.open('audio/voz.wav');a=np.frombuffer(w_.readframes(w_.getnframes()),np.int16).astype(np.float32)/32768
import subprocess
raw=subprocess.run(['ffmpeg','-v','error','-i','audio/voz.wav','-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.float32)
segs, _ = m.transcribe(a, language='pt', word_timestamps=True, beam_size=5)
W = []
for s in segs:
    for w in s.words:
        W.append({'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)})
json.dump(W, open('audio/whisper.json', 'w'), ensure_ascii=False)
print(' '.join(f"{w['w']}[{w['s']:.2f}]" for w in W))
