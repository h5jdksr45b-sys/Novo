# Transcrição alternativa quando o Hugging Face está bloqueado (sessões em
# nuvem). Usa sherpa-onnx com o modelo NVIDIA Parakeet TDT 0.6b v3 (multilíngue,
# inclui português), baixado dos releases do GitHub de k2-fsa/sherpa-onnx.
# Gera o mesmo JSON no formato Caption do @remotion/captions que o sub.mjs gera.
#
# Uso:
#   python3 -m venv .venv-asr && .venv-asr/bin/pip install sherpa-onnx numpy soundfile
#   ffmpeg -i public/video.mp4 -vn -ac 1 -ar 16000 temp/video.wav
#   .venv-asr/bin/python scripts/transcrever-parakeet.py temp/video.wav \
#       <pasta-do-modelo> public/video.json
#
# Na máquina local, prefira `node sub.mjs`, que usa Whisper.cpp.

import sys, json
import numpy as np
import soundfile as sf
import sherpa_onnx

wav_path, model_dir, out_path = sys.argv[1], sys.argv[2], sys.argv[3]

rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{model_dir}/encoder.int8.onnx",
    decoder=f"{model_dir}/decoder.int8.onnx",
    joiner=f"{model_dir}/joiner.int8.onnx",
    tokens=f"{model_dir}/tokens.txt",
    num_threads=4,
    model_type="nemo_transducer",
)
audio, sr = sf.read(wav_path, dtype="float32")
if audio.ndim > 1:
    audio = audio.mean(axis=1)
s = rec.create_stream()
s.accept_waveform(sr, audio)
rec.decode_stream(s)
r = s.result
print("TEXT:", r.text)
tokens = list(r.tokens)
times = list(r.timestamps)
print("n tokens", len(tokens), "n timestamps", len(times))

# Agrupa subpalavras (sentencepiece: espaco inicial = nova palavra) em palavras
words = []
for tok, t in zip(tokens, times):
    starts_word = tok.startswith(" ") or tok.startswith("▁")
    clean = tok.replace("▁", " ")
    if starts_word or not words:
        words.append({"text": clean if clean.startswith(" ") else " " + clean, "start": t, "end": t})
    else:
        words[-1]["text"] += clean
        words[-1]["end"] = t
# fim de cada palavra = inicio da proxima (limitado), ultima +400ms
caps = []
for i, w in enumerate(words):
    start_ms = int(round(w["start"] * 1000))
    if i + 1 < len(words):
        nxt = int(round(words[i + 1]["start"] * 1000))
        end_ms = min(nxt, max(int(round(w["end"] * 1000)) + 350, start_ms + 120))
    else:
        end_ms = int(round(w["end"] * 1000)) + 500
    caps.append({
        "text": w["text"],
        "startMs": start_ms,
        "endMs": end_ms,
        "timestampMs": int(round((start_ms + end_ms) / 2)),
        "confidence": None,
    })
json.dump(caps, open(out_path, "w"), ensure_ascii=False, indent=2)
print("palavras:", len(caps))
