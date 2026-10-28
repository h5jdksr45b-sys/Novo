# Atalho Plantão: vídeo de demonstração

`out/atalho-plantao-demo.mp4`: 9:16, 1080x1920, 30 qps, 32,5 s, -14 LUFS.

Como refazer (a partir da pasta de rascunho com Playwright):
1. `node scripts/cap.js telas` captura as telas do app (`atalho-plantao/index.html`) com os dados de exemplo, a 3x.
2. `ffmpeg -ss 2.0 -i logo/atalho-logo-3d.mp4 -t 4.6 -vf fps=30 -q:v 2 logo/quadros/%03d.jpg` extrai o final com o logo 3D.
3. `node scripts/render.js quadros` grava os quadros de `comp.html` (cenas, legendas, toques e tempos estão lá).
4. Áudio: Marimba Lift do começo (tempo 0,085 s, 106,95 BPM) por 54 tempos, depois salto para o tempo 118 até o final seco; clique nos toques, pop nas notificações, whoosh nas trocas; loudnorm -14 LUFS e limitador.

Música e logo vêm de `videos/atalho-colagem/` (branch `claude/great-archimedes-9dj9i3`).
