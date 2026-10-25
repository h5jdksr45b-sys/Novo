# RESPIRA JÁ! vira app na tela (HyperFrames)

Animação de 24 s, 9:16, mostrando como transformar o respira.base44.app em ícone na tela inicial do iPhone: Compartilhar, Adicionar à Tela de Início, Adicionar.

- `index.html`: a composição inteira (um celular contínuo, seis blocos de texto, folhas recriadas, tela inicial genérica, abertura do app, sons).
- `assets/video/`: trechos da gravação de tela dele (Safari com o app; app sem a barra do Safari; quadro parado em 3,0 s).
- `assets/som/`: sons da biblioteca da skill media-use, baixos (clique, pop, whoosh, chime).
- `assets/icons/`: ícones genéricos instalados pelo bloco ios26-liquid-glass da registry. A tela inicial e os contatos reais dele não aparecem.
- `assets/js/gsap.min.js`: GSAP local, porque o Chrome do renderizador não alcança o CDN nesta rede.
- `compositions/`: blocos e componentes instalados da registry para consulta (moldura, toque, folha com mola, notificação, holofote). As receitas foram levadas para dentro do `index.html`.
- `renders/respira-app-icone.mp4`: saída final.

Comandos: `npm run check` (lint, layout, contraste), `npx hyperframes snapshot --at 1.4,7.9,13.9 -o /tmp/quadros`, `npm run render -- --quality looks --output renders/respira-app-icone.mp4`.

Para trocar um texto: os blocos `#texto-1` a `#texto-6` no `index.html`. Para trocar a gravação da tela: substitua os MP4 em `assets/video/` mantendo 1080x1920.
