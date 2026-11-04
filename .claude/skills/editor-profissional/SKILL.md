---
name: editor-profissional
description: Use para editar qualquer vídeo do Dr. Fabio Schmidt (@drfabioschmidt, Borderline Sem Estigma) como um editor profissional, do bruto ao arquivo final: Reel falado com a gravação dele, corte de podcast ou entrevista, vídeo de colagem, narração com clone, CTA, capa e legenda do post. Combina as skills de análise (video-analysis, historico-borderline-180d), montagem e movimento (HyperFrames ou Remotion), legenda, b-roll (gbro-collage-broll), som (media-use, hyperframes-audio, earshot) e checagem final num fluxo só, com um sistema visual único de entradas, transições, legendas e efeitos sonoros já aprovados por ele e uma lista do que deixa o vídeo brega. Use também quando ele pedir "edita", "monta", "mais profissional", "efeitos", "entradas", "legenda dinâmica", "sfx", "zoom" ou mandar uma gravação.
---

# Editor profissional

Esta skill é o maestro. Ela não substitui as outras: diz qual usar em cada etapa, com quais valores, e o que fica de fora.
O objetivo é um vídeo que pareça feito por editor caro: poucos recursos, sempre os mesmos, executados com precisão.

Regra de ouro: **um sistema só**. Uma família de entrada, um molde de ênfase, uma cor de destaque, um tipo de som por função.
Variar é mudar tamanho e momento dentro do sistema, nunca trocar de estilo a cada frase ("legendas mudam do nada de estilo", 31/10).

## Antes de abrir o editor

1. Leia `memoria/efeitos-video-aprovados.md`, `memoria/reels-certeiros.md` e as linhas de vídeo mais recentes de `memoria/correcoes.md`.
   Quando esta skill e a memória divergirem, vale a correção mais nova da memória. Avise a divergência em uma linha.
2. Avise todos os limites técnicos de uma vez, logo no começo (rede bloqueia Hugging Face, CDN do Higgsfield e download.pytorch.org; arquivo acima de cerca de 30 MB não sobe no chat dele).
3. Se ele nomear a ferramenta (Remotion, HyperFrames, CapCut, Higgsfield), use a que ele nomeou. Sem nome: HyperFrames.

## O fluxo, etapa por etapa

| Etapa | O que fazer | Skill ou ferramenta |
|---|---|---|
| 1. Ler o material | Transcrever com tempo por palavra. Ver quem fala (em podcast, só trechos dele). Achar tomadas repetidas, silêncios, palavras trocadas pelo Whisper ("insegurança" no lugar de "em segurança"). | `video-analysis`; transcrição pela `media-use` (`transcribe`) ou faster-whisper pelo caminho de `correcoes.md` |
| 2. Veredito do gancho | Comparar os 3 primeiros segundos com os gigantes de `memoria/insights.md` e dizer por escrito: feed, teste ou refazer. Primeiro quadro tem rosto e texto. | `historico-borderline-180d`, `memoria/reels-certeiros.md` |
| 3. Corte | Tirar silêncio e tomada ruim. Folga de 0,12 s antes e 0,30 s depois de cada fala. Nenhum retalho com menos de 1 s. Reel falado mira 45 a 50 s. | ffmpeg; plano de cortes em JSON |
| 4. Plano de edição | Antes de animar, escrever a tabela de eventos: tempo, fala, o que entra na tela, som. Ver `references/plano-de-edicao.md`. | esta skill |
| 5. Montagem e movimento | Base em vídeo, zooms, b-roll, cartões e esquemas, só com os movimentos de `references/movimento.md`. | `hyperframes` → `hyperframes-core`, `hyperframes-animation`, `hyperframes-keyframes`; ou `remotion-best-practices` |
| 6. Legenda | Sistema único de `references/sistema-visual.md`. Palavra por palavra, até 3 palavras, sempre no mesmo lugar. | `hyperframes` (captions) ou `remotion-captions`; `embedded-captions` só para título atrás da pessoa, quando ele pedir |
| 7. B-roll e colagem | Uma cena por inserção, por cima da fala, áudio mudo. Gerar e inserir, não só sugerir. | `gbro-collage-broll` (colagem), Higgsfield (imagem e clipe), `media-use` (recorte de fundo) |
| 8. Som | Voz primeiro, depois efeitos com ducking, depois trilha. Valores em `references/som.md`. | `hyperframes-audio` (mix e ducking), `media-use` (efeitos e música), `earshot` (`sfx`, `kit`, `measure`) |
| 9. Checagem | Rodar `scripts/checar.py` e olhar os quadros das emendas em tamanho real. Ver `references/checagem.md`. | esta skill |
| 10. Entrega | Vídeo no chat, capa e legenda do post juntos. Registrar o resultado em `memoria/correcoes.md`. | `SendUserFile` |

## O que deixa o vídeo brega (não usar sem pedido dele)

Cada item aqui já foi rejeitado por ele ou contradiz o padrão aprovado.

- Glitch, separação RGB, chiado de TV, VHS, CRT, scanline.
- Texto que gira em 3D, letras empilhadas simulando volume, flip de letras, efeito hacker.
- Degradê passando dentro da letra, brilho neon, glow em volta da palavra.
- Contorno grosso na legenda. Usar contorno fino e sombra macia ("Uma sombra não fica mais elegante?", 03/11).
- Emoji, adesivo de rede social, seta piscando, ícone do Instagram como marca d'água.
- Transição de giro, cubo, página virando, explosão em pedaços, distorção, onda, círculo abrindo.
- Quadro preto ou branco no meio do vídeo. Flash só os dois de 0,1 s do padrão.
- Boom grave, impacto de trailer, riser longo, swoosh alto. Efeito acima da voz.
- Zoom que pula de escala parado. O zoom é movimento contínuo e lento.
- Tremida de câmera, balanço, bounce exagerado (overshoot acima de 6%).
- Cada frase com uma animação diferente. Uma entrada para a legenda inteira.
- Texto grande que não é a fala daquele instante, ou que aparece antes de ser dito.
- Tiras de papel, pílulas e caixas atrás de palavra sem motivo ("recortes aleatórios", 31/10).
- Mão segurando celular como b-roll. Imagem com textura granulada, pele de IA, texto inventado pela IA.
- Música triste, pesada ou sem ligação com a cena. Piano genérico.

## Calibragem do "mais"

Quando ele pedir "mais viral", "mais profissional" ou "mais efeito", suba **um** degrau: mais um zoom, mais um esquema, legenda um pouco maior. Nunca dobrar tudo ("Não exagera heim", 27/10).
Quando ele rejeitar um elemento, trocar por outro do sistema, não só remover ("Não é pra concluir q é pra tirar e sim trocar", 31/10).

## Arquivos desta skill

- `references/sistema-visual.md`: fontes, cores, tamanhos, áreas seguras, legenda e ênfase.
- `references/movimento.md`: entradas, saídas, zooms, transições e b-roll, com duração e curva.
- `references/som.md`: níveis, ducking, sincronia e normalização.
- `references/plano-de-edicao.md`: a tabela que vem antes de animar.
- `references/checagem.md`: o que conferir antes de entregar.
- `scripts/checar.py`: mede áudio, duração, quadros pretos e primeiro quadro de um MP4.
