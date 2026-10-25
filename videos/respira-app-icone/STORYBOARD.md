---
mode: autonomous
message: "O RESPIRA JÁ! vira app na tela do celular em três toques, sem baixar nada"
audience: seguidores que abriram o respira.base44.app no Safari do iPhone
canvas: 1080x1920
fps: 30
duration: 24
---

Peça de um arquivo só (`index.html`): um celular fica em cena o tempo inteiro e a tela dele muda de estado; os textos entram em cima, no terço superior. Nada nos 20% de baixo nem na lateral direita.

## Frame 1 — Abertura (0,0 a 2,4 s)

- status: outline
- src: index.html
- motion: `device-frame-stage` (subida e assentamento do aparelho, 0,72 s power3.out passando do repouso, 0,18 s settle) + `kinetic-beat-slam` para o título + `waterfall-entry` para o selo e a linha serifada.
- Tela: gravação real do Safari com o app (safari-app.mp4, mudo).
- Texto: selo GRATUITO · SEM BAIXAR NADA; título VIRA APP NA SUA TELA (APP em vermelho); linha serifada: em três toques.
- Som: flash branco de 0,1 s na abertura (sem som); whoosh baixo no assentamento.

## Frame 2 — Passo 1, Compartilhar (2,4 a 5,2 s)

- status: outline
- src: index.html
- motion: `yt-feather-highlight` (holofote no botão compartilhar) + `gesture-tap` (círculo de contato aparece no alvo, pressiona, solta) + `cursor-click-ripple`.
- Tela: a gravação continua até 3,0 s e congela no quadro safari-parado.png.
- Texto: chip PASSO 1 DE 3; título TOQUE EM COMPARTILHAR; serifada: o quadrado com a seta, no alto do Safari.
- Som: clique no toque.

## Frame 3 — Passo 2, Adicionar à Tela de Início (5,2 a 9,6 s)

- status: outline
- src: index.html
- motion: `sheet-spring-up` (tabela de mola, reescalada para a tela do celular) + `cursor-drag` curto (rolar a lista) + `gesture-tap` na linha + `press-release-spring` na linha pressionada.
- Tela: folha de compartilhar recriada, genérica (nome RESPIRA JÁ!, respira.base44.app, fileira de apps dos ícones instalados, lista de ações). Nenhum contato real.
- Texto: chip PASSO 2 DE 3; título ROLE E TOQUE EM ADICIONAR À TELA DE INÍCIO (TELA DE INÍCIO em vermelho); serifada: fica mais para baixo na lista.
- Som: whoosh na folha, clique no toque.

## Frame 4 — Passo 3, Confirmar (9,6 a 13,2 s)

- status: outline
- src: index.html
- motion: `scale-swap-transition` entre as duas folhas + `gesture-tap` no botão Adicionar + `press-release-spring`.
- Tela: folha de confirmação recriada: Cancelar, título, Adicionar em azul; ícone, nome RESPIRA JÁ!, respira.base44.app; interruptor Abrir como app web ligado.
- Texto: chip PASSO 3 DE 3; título CONFIRME EM ADICIONAR (ADICIONAR em vermelho); serifada: só isso.
- Som: clique no toque.

## Frame 5 — Ícone na tela e app aberto (13,2 a 19,2 s)

- status: outline
- src: index.html
- motion: folha desce (`sheet-spring-up` invertida, mais curta), tela inicial entra por fade; ícone RESPIRA JÁ! com `spring-pop-entrance` + anel de resposta da `gesture-tap`; toque no ícone; app abre com zoom a partir do ícone (`coordinate-target-zoom`).
- Tela: tela inicial genérica (papel de parede azul escuro, ícones instalados, dock), depois app-cheio.mp4 em tela cheia.
- Texto: título PRONTO. VIROU APP (PRONTO. em vermelho); serifada: abre em tela cheia, sem barra do navegador.
- Som: pop no ícone, chime curto, clique no toque.

## Frame 6 — Fecho (19,2 a 24,0 s)

- status: outline
- src: index.html
- motion: `waterfall-entry` do texto final; cartão Android com a mola da `native-notification-pop` (um único banner, geometria iOS) acima do celular; fade para preto nos últimos 0,15 s.
- Tela: app-cheio.mp4 continua.
- Texto: título SALVA E MANDA PRA QUEM PRECISA RESPIRAR HOJE (MANDA em vermelho); banner: NO ANDROID · Chrome, três pontos, Adicionar à tela inicial.
- Som: nenhum novo.
