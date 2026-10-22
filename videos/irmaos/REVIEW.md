# Review: Os irmãos (20 s, 1080 x 1920, 30 fps)

Segunda versão, revisada em 2026-10-22: a cinematográfica, com transições, câmera na mão, cintilação, vazamento de luz e efeitos sonoros. A primeira versão (cortes secos e Ken Burns, sem som) está no histórico do git.

## Decisões criativas

- Cinco fotografias geradas no Higgsfield (gpt_image_2_5, 2k), uma por shot, com a primeira como referência de ambiente. A foto 4 foi refeita com a terra na metade de cima e sombra limpa embaixo, para o texto.
- Uma transição com causa por corte, nunca a mesma duas vezes: zoom através (1 para 2), chicote lateral com desfoque só horizontal (2 para 3), zoom através (3 para 4), mergulho no preto com vazamento de luz (4 para 5). O vazamento de luz é o bloco do registry em tons de cinza, com o pico reduzido de 0.9 para 0.6 para a chamada final ficar legível.
- Câmera na mão pelo helper camera-shake do registry, perfil de teleobjetiva, leve, com frequência diferente em cada shot para o movimento não se repetir.
- Cintilação de projetor em soft-light, grão e vinheta por cima de tudo.
- Som: quatro efeitos da biblioteca embutida do media-use (licença Pixabay, sem exigência de crédito), cada um colocado pelo pico medido com `hyperframes audio`: o pico cai um frame depois da imagem. Sem música, porque a máquina não tem fonte de música; a trilha entra no app do Instagram ou no CapCut.
- Não foram escritas três storylines: o roteiro veio pronto do lote de Reels sobre estigmas.

## O que foi medido e o que foi só olhado

- Medido: `check` passa com 0 erros; contraste 32 de 32 amostras aprovadas; nenhum aviso de áudio sobreposto depois de dar duração a cada efeito.
- Olhado: fitas de 8 frames em cada transição (3.5 a 4.5, 7.6 a 8.5, 11.5 a 12.5, 15.7 a 16.7 s), os frames de texto de cada shot e o trecho do vazamento de luz sob a chamada (16.45, 16.9, 17.3 s).
- Medido, não ouvido: o render foi analisado com `hyperframes audio` para confirmar que o som existe e onde bate. Ninguém escutou o resultado.
- Não medido: a legibilidade a 360 px com a folha de telefone.

## O shot mais fraco

O shot 1. É o único sem uma ação dentro da foto, e segura 3.6 s antes do zoom através. Com mais tempo: trocar a foto por uma com um detalhe vivo (cortina, chuva no vidro) ou começar já em movimento.

## Avisos mantidos de propósito

- Avisos de estrutura (track com 5 elementos, elementos aninhados dentro de clips): o filme foi escrito num arquivo só, de propósito, para o Dr. Fabio renderizar e editar com um único `index.html`.
- Infos de texto oculto: o mergulho no preto e o vazamento de luz cobrem o texto por 3 frames, de propósito.
