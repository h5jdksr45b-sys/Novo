#!/usr/bin/env python3
"""Checagem final de um vídeo antes de entregar ao Dr. Fabio.

Uso: python3 checar.py video.mp4 [--limite-mb 30]

Mede com ffmpeg/ffprobe, sem nenhuma dependência além delas:
- duração do áudio contra a do vídeo (o loudnorm já cortou o fim da voz uma vez);
- loudness integrado (-14 LUFS) e pico real (até -1 dBTP);
- volume médio dos últimos 3 s (fim sem som);
- quadros pretos fora do último 0,3 s (quadro preto no meio é erro);
- brilho do primeiro quadro (o render às vezes entrega o 1º quadro escuro);
- tamanho do arquivo contra o limite do chat.
Sai com código 1 se houver FALHA.
"""
import argparse
import json
import os
import re
import subprocess
import sys


def rodar(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def duracoes(path):
    out = rodar(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,duration:format=duration",
                 "-of", "json", path]).stdout
    data = json.loads(out or "{}")
    vid = aud = None
    for s in data.get("streams", []):
        d = float(s["duration"]) if s.get("duration") not in (None, "N/A") else None
        if s.get("codec_type") == "video" and vid is None:
            vid = d
        if s.get("codec_type") == "audio" and aud is None:
            aud = d
    total = float(data.get("format", {}).get("duration", 0) or 0)
    return vid or total, aud, total


def loudness(path):
    err = rodar(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    i = re.findall(r"I:\s+(-?[\d.]+) LUFS", err)
    p = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", err)
    return (float(i[-1]) if i else None), (float(p[-1]) if p else None)


def volume_final(path, total):
    ini = max(0.0, total - 3.0)
    err = rodar(["ffmpeg", "-hide_banner", "-nostats", "-ss", f"{ini:.3f}", "-i", path, "-vn",
                 "-af", "volumedetect", "-f", "null", "-"]).stderr
    m = re.search(r"mean_volume:\s+(-?[\d.]+) dB", err)
    return float(m.group(1)) if m else None


def quadros_pretos(path):
    err = rodar(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-vf", "blackdetect=d=0.03:pic_th=0.97",
                 "-an", "-f", "null", "-"]).stderr
    return [(float(a), float(b)) for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)]


def brilho_primeiro_quadro(path):
    err = rodar(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-vf", "signalstats,metadata=print",
                 "-frames:v", "1", "-an", "-f", "null", "-"]).stderr
    m = re.search(r"lavfi\.signalstats\.YAVG=([\d.]+)", err)
    return float(m.group(1)) if m else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--limite-mb", type=float, default=30.0)
    a = ap.parse_args()
    if not os.path.isfile(a.video):
        sys.exit(f"checar: arquivo não encontrado: {a.video}")

    linhas, falhas = [], 0

    def item(ok, texto, aviso=False):
        nonlocal falhas
        marca = "ok   " if ok else ("AVISO" if aviso else "FALHA")
        if not ok and not aviso:
            falhas += 1
        linhas.append(f"[{marca}] {texto}")

    vid, aud, total = duracoes(a.video)
    if aud is None:
        item(False, "sem faixa de áudio")
    else:
        item(abs(vid - aud) <= 0.1, f"duração: vídeo {vid:.2f} s, áudio {aud:.2f} s")

    lufs, pico = loudness(a.video)
    if lufs is not None:
        item(-15.0 <= lufs <= -13.0, f"loudness integrado {lufs:.1f} LUFS (alvo -14)")
    if pico is not None:
        item(pico <= -1.0, f"pico real {pico:.1f} dBTP (máximo -1)")

    fim = volume_final(a.video, total)
    if fim is not None:
        item(fim > -40.0, f"volume médio dos últimos 3 s {fim:.1f} dB", aviso=fim > -50.0)

    pretos = [(s, e) for s, e in quadros_pretos(a.video) if s < total - 0.3]
    item(not pretos, "quadros pretos no meio: " + (", ".join(f"{s:.2f}-{e:.2f} s" for s, e in pretos) or "nenhum"))

    y = brilho_primeiro_quadro(a.video)
    if y is not None:
        item(y >= 40, f"brilho do primeiro quadro {y:.0f} (abaixo de 40 costuma ser quadro vazio)", aviso=y >= 25)

    mb = os.path.getsize(a.video) / 1e6
    item(mb <= a.limite_mb, f"tamanho {mb:.1f} MB (limite do chat {a.limite_mb:.0f} MB)", aviso=True)

    print("\n".join(linhas))
    print("\nResultado:", "pode entregar" if falhas == 0 else f"{falhas} falha(s), voltar para a edição")
    sys.exit(1 if falhas else 0)


if __name__ == "__main__":
    main()
