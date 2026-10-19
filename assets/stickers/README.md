# Biblioteca de stickers de colagem

220 recortes em PNG com fundo transparente, extraídos das 16 pranchas de colagem do Pinterest (por Drfabioschmidt). Base para animações cinematográficas feitas com as skills de vídeo (gbro-collage-broll, hyperframes, motion-graphics, general-video, Remotion).

## Estrutura

| Pasta | Qtd | O que tem |
|---|---|---|
| `objetos/` | 67 | lâmpadas, livros, lupas, canetas, câmeras, globos, relógios, caveiras, balança, martelo de juiz, cérebro, DNA, objetos góticos |
| `maos/` | 36 | mãos de marionete, garras, apontando, silêncio, joinhas, lupas na mão, aperto de mão, escrevendo, punho, mãos acorrentadas |
| `figuras/` | 20 | pessoas com mãos na cabeça, homem coberto de post-its, terno sem cabeça, silhuetas, figuras vintage |
| `rostos/` | 18 | rostos sem feição, cabeças deitadas, mãos tapando o rosto, rosto dissolvido, Who are you |
| `simbolos/` | 18 | interrogações, exclamações, raios, X de fita, estrelas, explosão, alvo, código de barras |
| `bocas/` | 17 | bocas desenhadas, gritos halftone, bocas com megafone, língua |
| `olhos/` | 10 | olhos em espiral, olhos empilhados, olho com lágrima, globo ocular |
| `megafones/` | 10 | megafones halftone, com raios, gato com megafone, Speak Up |
| `balao_texto/` | 10 | balões, KARMA, Help, ingressos em branco, NEWS, frases recortadas |
| `texturas/` | 6 | espiral hipnótica, onda Hokusai, listras, mancha marmorizada, tiras de jornal |
| `_uso_restrito/` | 8 | logos de marca (Coca-Cola, Vans, YSL, Zara), perfume de marca, foto de filme com ator reconhecível, imagens sensuais |

- `catalogo.json`: id, categoria, arquivo, largura, altura, prancha de origem e marcação `uso_restrito` de cada sticker.
- `_previews/`: uma folha de contato por categoria, para escolher sticker sem abrir arquivo por arquivo.

## Como usar nas animações

Referencie pelo caminho relativo à pasta, por exemplo `assets/stickers/maos/dedo_apontando_para_voce.png`. Copie para a pasta `public/` ou `assets/` do projeto de vídeo antes de renderizar.

## Cuidados

- `_uso_restrito/`: não usar no feed. Marcas registradas, pessoa real reconhecível de filme e imagens sensuais não combinam com conteúdo de saúde mental de um médico.
- As imagens vieram do Pinterest. Os direitos ficam com os autores originais. Para peças comerciais ou anúncios, prefira os itens de domínio público (gravuras antigas, Hokusai, Méliès) ou substitua por versões licenciadas.
- Alguns recortes têm pequenas sobras de borda ou da marca d'água do Pinterest. Confira a prévia antes de usar em close.
