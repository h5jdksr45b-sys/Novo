#!/bin/sh
# Masterizacao do audio depois do render: o mix do HyperFrames sai cerca de 3 dB baixo com varias faixas.
# Uso: sh scripts/masterizar.sh ../protocolo-7-dias-final.mp4
set -e
ffmpeg -v error -y -i "$1" -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k "$1.master.mp4"
mv "$1.master.mp4" "$1"
