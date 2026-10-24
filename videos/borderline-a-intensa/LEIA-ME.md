# Clipes: Borderline, a intensa

Música gerada no Suno pelo Dr. Fabio em 24/10/2026. O corte vai do verso
"Sofrer calada pra quê" até o fim da música (1:06,6 a 1:34,7 do original),
mais um cartão final de 2 s com a chamada. Total: 30 s, 1080x1920, 30 fps.

Composição: `reels-remotion/src/BorderlineIntensa/index.tsx`.
Render: `cd reels-remotion && npx remotion render src/index.ts BorderlineIntensa out/borderline-a-intensa.mp4 --browser-executable=<chrome>`.

Cada verso virou um gráfico de interface: toggle de som, busca por perto,
barra de progresso, player com visualizador de áudio, contador de rodadas,
notificações e medidor que transborda. Letra em grupos de até três palavras,
destaques em vermelho #CC0000 alternando Montserrat ExtraBold e Playfair itálico.
Som normalizado em -14 LUFS. Sem efeitos sonoros, porque a música já preenche.

## Versão 2: começo da música (borderline-a-intensa-inicio.mp4, capa-inicio.png)

Pedido do Dr. Fabio em 24/10: os primeiros trechos da música e mais interface.
Corte de 0:07 a 0:34 do original (do refrão de abertura até "rainha da avalanche"),
27 s de música com fade curto, mais cartão final de 2 s. Total: 29 s.
Composição: `reels-remotion/src/BorderlineIntensa/Inicio.tsx`, peças em `comum.tsx`.

Telas: player com toque no play, visualizador e contador de rodadas; notificações
com contador no sino e medidor que passa de 100%; lista de pessoas com filtro
"respeita o que eu peço"; gráfico antes e hoje com seletor de emoção e linha que
para antes da parede; configurações com intensidade de fábrica e botão de restaurar
que não muda nada; folha de envio no final. Barra de abas e toques na tela em
todas as telas.

Pendente de aprovação do Dr. Fabio.
