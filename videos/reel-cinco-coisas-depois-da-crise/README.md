# Reel: 5 coisas que o borderline faz depois de uma crise (01/11/2026)

Gravação dele (70,7 s) cortada para 49,6 s (v2, a pedido dele: "diminui"). Saíram também: "Se você convive com alguém que tem transtorno, já ouviu todas", "para conseguir assim ficar no mesmo ambiente que você", "que a pessoa tem da convicção", "a crise gasta toda a energia do corpo", "que não deu para concatenar em palavras", "Nenhuma das cinco vem com explicação. Mas agora você tem todas elas". Primeira versão (65 s): silêncios curtos encurtados, "pois é" retirado, "e a imunidade vai lá para baixo" retirado (afirmação sem base clara), trecho "As pessoas até olham e perguntam o que está acontecendo" retirado no corte que já existia na gravação (29,5 a 32,27 s). Cortes em `keep.json`.

Montagem HyperFrames 0.8.228 (`build.py` gera `index.html`). O vídeo da gravação (`assets/video/aroll.mp4`) e o áudio não estão no repositório pelo tamanho; refazer com o comando de corte do ffmpeg a partir do .mov original e `keep.json`.

- Legenda palavra por palavra, até três palavras, Anton branca com contorno; destaque em Fraunces itálica vermelha caixa alta, maior.
- Faixa de cima, mesmo molde nos cinco itens: número 1/5 a 5/5, PARECE + leitura errada riscada, O QUE É + tarja vermelha com a leitura certa.
- B-roll: 5 imagens GPT Image 2.5 (cozinha à noite, pano no balcão, mãos com lenço, quarto de cortina fechada, prato e presente) com movimento lento, vinheta, flash branco curto no primeiro.
- Zoom: aproximação contínua em cada trecho (1,0 para 1,07, alternando a base entre cortes), punch de 0,14 s nos números; 1,12 no CTA. Flash branco curto na entrada de cada b-roll.
- Som: voz a -15 LUFS com compressor leve; whoosh a -19 dBFS na entrada e -23 na saída dos b-rolls; clique nos cortes e punches (-21/-19), tique nos números, pop nas tarjas, swipe no risco (-19 a -21); trilha Pulso Calmo (Suno dele) a -15 dB com ducking pela voz (fica em torno de -34 dB); final -14 LUFS. Na v1 os efeitos a -27 dBFS não foram percebidos por ele.
