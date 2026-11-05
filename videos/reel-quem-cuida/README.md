# Reel: Quem cuida do borderline perde nesta ordem (05/11/2026)

Reel ilustrado no mesmo estilo do Sem tratamento de 01/11. Roteiro e falas do Dr. Fabio.

- `cenas/`: 8 imagens das cenas (GPT Image 2.5 Sunburst, alta, 2k, 9:16; referência: personagem f1d8a229 e cozinha ccdcab74 do histórico do Higgsfield). `cenas-alternativas/`: versões descartadas.
- `assets/video/`: clipes animados no MiniMax H3 (2K, 24 fps) convertidos para 1080x1920 a 30 fps com interpolação (`clips.sh`); `tela-final.mp4` vem do vídeo original.
- `src/`: narrações da voz clonada Fabio (seed_audio) e trilha (elevenlabs_music_v2_5). `tighten.py` aperta pausas só dentro de silêncio medido (-40 dB), 0,35 s depois de ponto e 0,15 s depois de vírgula.
- `build.py img|video` gera `index.html` (HyperFrames 0.8.228) a partir de `words_tight.json`. `mix.py` faz a mixagem (voz -16 LUFS, trilha 18 dB abaixo com ducking, final -14 LUFS).
- Render: `npx --yes hyperframes@0.8.228 render --fps 30 --quality delivery --output renders/final-mudo.mp4`, depois mux com `audio/final.wav`.
- Entrega: `reel_quem_cuida.mp4` (34,9 s) e `legenda.txt`.
