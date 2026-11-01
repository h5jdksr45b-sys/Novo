#!/bin/bash
set -e
cd "$(dirname "$0")"
# voz: ganho medido para -17 LUFS cada, limitador suave, sem cortar pontas
ffmpeg -v error -y -i src/n1-gancho.mp3    -af "volume=3.8dB,alimiter=limit=0.79:attack=3:release=60" -ar 48000 -ac 2 audio/v1.wav
ffmpeg -v error -y -i src/n2-ps-ida.mp3    -af "volume=3.1dB,alimiter=limit=0.79:attack=3:release=60" -ar 48000 -ac 2 audio/v2.wav
ffmpeg -v error -y -i src/n3-abandono-a.mp3 -af "volume=4.6dB,alimiter=limit=0.79:attack=3:release=60" -ar 48000 -ac 2 audio/v3.wav
# ambiente dos clipes (som diegético gerado), baixo, agudos atenuados
ffmpeg -v error -y -i src/01-quarto.mp4   -vn -ar 48000 -ac 2 -t 10 audio/a1.wav
ffmpeg -v error -y -i src/02-corredor.mp4 -vn -ar 48000 -ac 2 -t 10 audio/a2.wav
ffmpeg -v error -y -i src/03-cozinha.mp4  -vn -ar 48000 -ac 2 -t 10 audio/a3.wav
ffmpeg -v error -y -i audio/v1.wav -i audio/v2.wav -i audio/v3.wav -i audio/a1.wav -i audio/a2.wav -i audio/a3.wav -filter_complex "
[0:a]adelay=300|300[v1];[1:a]adelay=10700|10700[v2];[2:a]adelay=20700|20700[v3];
[v1][v2][v3]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=32[voz];
[3:a]volume=-6dB[a1];[4:a]volume=-12dB,adelay=10000|10000[a2];[5:a]volume=-12dB,adelay=20000|20000[a3];
[a1][a2][a3]amix=inputs=3:normalize=0:duration=longest,highshelf=f=3500:g=-7,volume=-11dB,apad=whole_dur=32[amb0];
[voz]asplit=2[vozA][vozB];
[amb0][vozB]sidechaincompress=threshold=0.02:ratio=7:attack=12:release=380:makeup=1[amb];
[vozA][amb]amix=inputs=2:normalize=0:duration=longest,atrim=0:32,afade=t=out:st=31.4:d=0.6[mix]
" -map "[mix]" -ar 48000 audio/mix-pre.wav
# normalização final em duas passagens, linear
ffmpeg -v error -y -i audio/mix-pre.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | tail -12 > audio/ln.json
