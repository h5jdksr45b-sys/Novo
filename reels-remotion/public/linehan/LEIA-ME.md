# Assets do Reel "1961" (Marsha Linehan)

Tudo aqui é provisório. Substitua mantendo o nome do arquivo e o código recalcula o resto.

## Fala (obrigatório para o vídeo final)

- `fala.mp4`: um único take do Fabio, vertical 1080x1920, com o roteiro inteiro
  (`src/Linehan1961/roteiro.ts`), lido na ordem, sem parar a gravação entre blocos.
  Pode errar e repetir uma frase: o alinhamento usa a primeira ocorrência de cada
  palavra na sequência; corte os erros grosseiros antes, se preferir.
- `fala.json`: gerado por `node sub.mjs public/linehan/fala.mp4` (Whisper, modelo
  `medium`, idioma `pt`, configurado em `whisper-config.mjs`). É o que faz os cortes
  caírem na primeira palavra de cada cena. Sem ele, o reel usa tempos estimados.

## Imagens de B-roll (7 planos, 1080x1920 ou maior, qualquer cor: o código converte para P&B)

| Arquivo | O que buscar |
|---|---|
| `01-hartford-1961.jpg` | Fachada ou corredor de hospital psiquiátrico dos anos 1960, vazio, luz dura de janela |
| `02-janela.jpg` | Janela alta com grade fina vista de dentro, contraluz, parede lisa, sem pessoa |
| `03-quarto-isolamento.jpg` | Quarto vazio com porta pesada e visor, piso refletindo luz fria, enquadramento frontal |
| `04-prontuario.jpg` | Folha datilografada em close, máquina de escrever desfocada ao fundo |
| `05-universidade-1991.jpg` | Prédio de universidade americana nos anos 1990 ou arquivo com pastas de papel |
| `06-corredor-vazio.jpg` | Corredor de hospital vazio com luz no fim, simétrico, chão brilhando |
| `07-auditorio-2011.jpg` | Auditório visto do palco, cadeiras vazias ou plateia desfocada, um foco de luz |

Onde buscar sem risco de direito de imagem: Wikimedia Commons (filtre por domínio público
ou CC0), Library of Congress (coleção HABS/HAER tem hospitais e corredores), Unsplash e Pexels
para corredores e auditórios genéricos. Evite fotos reais de pacientes identificáveis.
Se gerar com IA, mantenha a estética de foto de arquivo e não gere rosto de pessoa real.

Não use foto da Marsha Linehan sem licença: a cena 11 funciona com o auditório e o rótulo.

## SFX (public/sfx)

`drone.wav`, `riser.wav` e `impacto.wav` são sintéticos (`scripts/gerar-sfx.py`).
Para o final, troque por biblioteca licenciada mantendo os nomes:
- drone: cama grave, 50 a 110 Hz, sem melodia, com pulso lento;
- riser: sopro agudo de 1 a 1,2 s que termina no corte;
- impacto: batida grave curta, sem reverb longo.
