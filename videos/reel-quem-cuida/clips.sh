#!/bin/bash
# uso: clips.sh <nome-cena> <url>  -> baixa, redimensiona para 1080x1920 e converte para 30 fps (interpolação) em assets/video/<nome>.mp4
set -e
n=$1; u=$2
curl -sS -o "src/$n-orig.mp4" "$u"
fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "src/$n-orig.mp4")
ffmpeg -v error -y -i "src/$n-orig.mp4" -an -vf "scale=1080:1920:flags=lanczos,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p "assets/video/$n.mp4"
echo "$n fps_orig=$fps dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 assets/video/$n.mp4) size=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 src/$n-orig.mp4)"
