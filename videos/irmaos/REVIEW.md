# Review: Os irmãos (20 s, 1080 x 1920, 30 fps)

Revisado em 2026-10-22, depois do check passar e das folhas de prova em 0.05, 1.3, 4.6, 6.6, 9.9, 14.6, 17.9 e 19.6 s, mais a fita do primeiro corte (3.7 a 4.3 s).

## Decisões criativas

- Cinco fotografias geradas no Higgsfield (gpt_image_2_5, 2k), uma por shot, com a primeira como referência de ambiente. O vídeo é feito de cortes secos entre elas, com Ken Burns lento dentro de cada uma. Não há animação da planta murchando: a mudança acontece entre os cortes, como numa sequência documental.
- A tinta do texto muda conforme a foto: clara sobre a parede escura (shots 1 e 5), escura sobre o vidro (shots 2 e 3), clara sobre o vaso e a sombra (shot 4). Uma caixa amarela no filme inteiro, em estar bem.
- O shot 5 tem a foto empurrada 100 a 120 px para baixo pela câmera, para a parede escura receber a chamada e a assinatura.
- Sem música. A máquina não tem fonte de áudio (sem login HeyGen, sem modelo local). O Reel recebe trilha no app do Instagram ou no CapCut.
- Não foram escritas três storylines: o roteiro veio pronto do lote de Reels sobre estigmas.

## O que foi medido e o que foi só olhado

- Medido: `check` passa com 0 erros; contraste 34 de 34 amostras aprovadas depois de mover o texto do shot 2 para o vidro (antes, a palavra Toda caía sobre o caixilho escuro, 1.63:1).
- Olhado: as oito folhas de prova e a fita do corte em 4 s. A frase do shot 1 sai desfocada em 3.94 s e o corte em 4.0 s é seco, sem frame intermediário.
- Ninguém checou: o som, porque não há som. A legibilidade a 360 px não foi medida com a folha de telefone.

## O shot mais fraco

O shot 4 (macro na terra). A foto é a mais escura da série e o texto fica sobre o vaso, não sobre a terra. Com mais tempo: pedir ao Higgsfield uma versão com a terra ocupando a metade de cima e sombra limpa embaixo, e colocar o texto ainda mais baixo.

## Avisos mantidos de propósito

- `film_silent`: entrega silenciosa, pela falta de fonte de áudio na máquina.
- Avisos de estrutura (track com 5 elementos, elementos aninhados dentro de clips): o filme foi escrito num arquivo só, de propósito, para o Dr. Fabio renderizar e editar com um único `index.html`. Para edição no Studio, cada shot poderia virar uma sub-composição.
