# Assets do Reel "Borderline mente" (memória depois da briga)

## Fala

- `fala.mp4`: o take do Fabio (47 s). É o áudio e a imagem dos planos em que ele aparece.
- `fala.txt`: a transcrição literal, uma frase por ponto final. É o texto que vira legenda e tipografia.
- `fala.json`: tempo de cada palavra. Hoje foi gerado por `scripts/alinhar-por-pausas.py`
  (alinha o texto pelas pausas do áudio, sem modelo de voz). Para um alinhamento palavra a
  palavra mais fino, rode `node sub.mjs public/reel-noir/fala.mp4` num computador com acesso
  à internet: ele baixa o Whisper e sobrescreve o JSON no mesmo formato.

Se regravar a fala: troque `fala.mp4`, ajuste `fala.txt` se mudou alguma palavra, rode o
alinhador (ou o sub.mjs) e renderize. O roteiro em `src/ReelNoir/roteiro.ts` precisa ter
exatamente as mesmas palavras do `fala.txt`.

## Imagens de B-roll (4 planos, 1080x1920 ou maior, qualquer cor: o código converte para P&B)

| Arquivo | O que buscar |
|---|---|
| `01-cachorro-dentes.jpg` | Close extremo dos dentes de um cachorro bravo, fundo escuro |
| `02-coleira.jpg` | Coleira de couro com plaquinha, muito perto e fora de foco |
| `03-palavra.jpg` | Uma palavra escrita à mão numa folha pautada, circulada a lápis, luz de janela |
| `04-duas-poltronas.jpg` | Sala vazia com duas poltronas de frente uma para a outra, luz baixa de fim de tarde |

As versões atuais são placeholders (`scripts/gerar-placeholders.py`). As imagens geradas no
Higgsfield têm os links no briefing. A pasta `linehan-antigo/` guarda as fotos do tema anterior.

## SFX (public/sfx)

`drone.wav`, `riser.wav` e `impacto.wav` são sintéticos (`scripts/gerar-sfx.py`).
Para o final, troque por biblioteca licenciada mantendo os nomes.
