# Reel: Borderline sem tratamento (01/11/2026)

Montagem em HyperFrames 0.8.228 dos três clipes ilustrados (quarto, corredor do pronto-socorro, cozinha) gerados no Higgsfield (minimax_h3) com a narração clonada "Fabio" (elevenlabs, text2speech_v2).

- `index.html`: composição gerada por `build.py` a partir de `words.json` (tempos de palavra do faster-whisper small, modelo CTranslate2 vindo do npm `@skillninja/shortmovie-telop-model-p0..p3`).
- `mix.sh`: voz a -17 LUFS com limitador, ambiente dos clipes -17 dB com agudos -7 dB e ducking pela voz, fade final; ganho linear final para -14 LUFS.
- Render: `npx hyperframes@0.8.228 render --fps 24 --quality delivery --output renders/video-mudo.mp4`, depois mux com `audio/final.wav` e fade de 0,3 s no ffmpeg.
- Os clipes de vídeo em `assets/video/` são os arquivos originais do Higgsfield (1440x2560, 24 fps). As narrações `n2b` e `n3b` são variantes não usadas.
