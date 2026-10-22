GOAL:    Quem foi o filho que não dava trabalho se reconhece e manda o vídeo para a mãe ou o pai.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps. Instagram Reels.
TIME:    20 s x 30 = 600 frames. Sem música nesta entrega (sem fonte de áudio na máquina); o Reel pode receber trilha no app.
LOOK:    Noir editorial em cinco fotografias (Higgsfield, gpt_image_2_5, 2k, preto e branco, grão 35 mm): uma janela iluminada vista de dentro de um quarto escuro, com dois vasos no parapeito.
         Chão/quarto #0b0a09 sem gradiente. Luz da janela: radial de #e8e3d8 (centro) a #a9a399 (borda), vidro sem textura.
         Plantas, vasos, caixilho e regador: silhuetas pretas #0b0a09 contra a luz, nenhum contorno, nenhum brilho.
         Tinta do texto: #0f0e0c sobre a luz da janela; #ece7dd quando a câmera está no vaso escuro (shot 4).
         Um acento: caixa #e2c84a atrás de duas palavras, uma vez no filme (estar bem, shot 4).
         Display: Playfair Display Italic 400, 88 px (4,6% da altura), tracking -0.01em, altura de linha 1.12, até 2 linhas por frase, largura máxima 860 px.
         Apoio: Inter 500, 30 px, tracking 0.06em, só na assinatura.
         Grão de filme: overlay do registry a 12% de opacidade, 2 frames por quadro de ruído. Vinheta: radial, transparente até 48%, rgba(0,0,0,0.62) na borda.
OBJECTS: Janela: vidro luminoso 840 x 1130 com caixilho preto de 48 px e cruz central (28 px). Parapeito: tábua preta de 56 px com sombra de 22 px.
         Dois vasos iguais: trapézio 230/180 x 190 px com aro de 30 px; terra em elipse #3a3530 no topo.
         Planta: caule de 14 px com seis folhas em lente (210 px a maior), alternadas, diminuindo até a ponta. Esquerda e direita idênticas no frame 0.
         Regador: corpo 260 x 180 com bico e alça, silhueta. Água: feixe preto afunilado do bico até a terra.
         Terra seca: rachaduras de 3 px #8a8378 desenhadas sobre a elipse de terra do vaso da direita.
MOTION:  Câmera (Ken Burns): um movimento contínuo por shot em ease none, 6 a 8% de escala em 4 s. Cortes secos: salto de câmera no frame do corte, sem dissolve.
         Palavras: blur 8 px -> 0, opacidade 0 -> 1, escala 0.97 -> 1 em 0.32 s power3.out, 0.09 s entre palavras. Linha pousada fica parada.
         Saída da linha: blur 8 px e opacidade 0 em 0.2 s power2.in, 6 frames antes do corte.
         Murchar: folhas giram 55 graus para baixo e a planta encolhe 12% em altura em 2.4 s power2.inOut.
         Regador: entra em 0.7 s expo.out, inclina 30 graus em 0.5 s power2.inOut, o feixe de água cresce em 0.4 s power2.out.
         Folha que cai: 1.6 s power1.in, gira 40 graus, pousa no parapeito.
         Rachaduras: traçado de 0 a 100% em 1.6 s power2.inOut, uma a uma com 0.15 s de atraso.
SHOTS:   1  f0-120   (0-4 s)   Plano aberto, zoom in 1.00 -> 1.06. Lê: Você era o filho que não dava trabalho. (7 palavras, 2.6 s de leitura). Corte.
         2  f120-240 (4-8 s)   Planta da esquerda murcha com o regador (foto 2), zoom out 1.10 -> 1.02. Texto escuro no vidro, entre o caixilho e o regador. Lê: Uma murcha. depois Toda a água vai para ela. (acumulam). Corte.
         3  f240-360 (8-12 s)  Planta da direita com a folha caída no parapeito (foto 3), zoom in 1.00 -> 1.08. Texto escuro alinhado à esquerda, no vidro. Lê: A outra parece bem. depois Ninguém rega. Corte.
         4  f360-480 (12-16 s) Macro no vaso da direita (foto 4), push in 1.06 -> 1.12 com a foto 50 a 70 px para cima. Terra rachada. Lê: Parecer bem / e estar bem / são coisas diferentes, em tinta clara sobre o vaso. Caixa amarela em estar bem. Corte.
         5  f480-600 (16-20 s) Plano aberto (foto 5), push in 1.12 -> 1.16 com a foto 100 a 120 px para baixo. As duas plantas; a da direita caída, com uma folha no parapeito. Lê: Manda pra sua mãe / ou seu pai. em tinta clara na parede (segura 3.5 s). Assinatura logo abaixo a partir de 17.6 s.
BANNED:  Vazio preto com elementos pequenos flutuando no meio; glow, bloom, partículas; gradiente na tela inteira; papel creme com serifa e rótulos numerados;
         tudo entrando com fade e slide para cima; texto que continua escalando depois de pousar; dissolve entre shots; logo no canto;
         emoji, aspas e travessão no texto; mais de uma caixa de acento no filme.
QA:      f0: janela, parapeito, dois vasos iguais, nenhum texto, nada preto. f36: a frase inteira do shot 1 pousada e legível.
         f190: regador inclinado sobre a planta da esquerda, feixe de água visível, planta esquerda caída. f300: folha no ar entre a planta e o parapeito.
         f430: rachaduras visíveis na terra, caixa amarela em estar bem, texto claro legível sobre o vaso. f540: as duas plantas, CTA pousado, assinatura no topo.
         Fita de cortes em 4, 8, 12 e 16 s: salto de enquadramento nítido, sem frame intermediário. Folha de 360 px: todas as linhas legíveis.
