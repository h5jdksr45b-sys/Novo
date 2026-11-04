# Som

## Ordem da mixagem

1. Voz sozinha: limpar, normalizar a -15 LUFS num arquivo separado, com `apad` até a duração do vídeo. Nunca normalizar dentro do mesmo filtro da mixagem: cortou os últimos 3 s da voz em 30/10.
2. Efeitos: cada um na sua faixa, com ducking pela voz.
3. Trilha: -15 dB abaixo da voz, agudos -6 dB, ducking pela voz (`sidechaincompress`).
4. Master: -14 LUFS integrado, pico real até -1 dBTP.

Em HyperFrames, mix e ducking pela `hyperframes-audio`. Em ffmpeg, a mesma ordem.

## Níveis dos efeitos

- Pico do efeito em torno de -20 dBFS, sempre abaixo da média da voz. A -27 dBFS ele não ouve (01/11); acima da voz ele reclama (31/10).
- Medir com `earshot measure` ou `volumedetect` antes de entregar.

## Que efeito em que momento

| Momento | Efeito | Duração | Onde fica o pico |
|---|---|---|---|
| Entrada de b-roll | whoosh curto e macio | 0,2 a 0,3 s | no corte |
| Zoom punch | clique seco | cerca de 12 ms | no corte |
| Cartão ou esquema entra | pop de interface arredondado ou toque de madeira | 0,05 a 0,1 s | no primeiro quadro visível |
| Item de lista marcado | tique leve | menos de 0,1 s | quando o check fecha |
| Colagem em stop motion | papel | 0,1 a 0,2 s por peça, nem toda peça | na chegada |
| Ênfase grande | nada, ou um tom curto de glockenspiel quando a frase pedir | até 0,4 s | na palavra |

Toques (clique, pop, tique) chegam junto ou 1 quadro antes do corte; o pico do whoosh cai no corte ou logo depois.
Entre dois efeitos, pelo menos 0,4 s. Sem boom grave, sem riser longo, sem impacto.

## De onde vêm os sons

- Biblioteca já usada com ele: whooshes do EditorPro e os sintetizados dos projetos em `videos/`.
- `earshot sfx list` e `earshot sfx render ID --dur --apex`: 252 sons feitos em código, com pop de interface, toques de madeira e plástico, whoosh curto, glockenspiel e papel. Funciona sem modelo, nesta nuvem.
- `earshot kit init -o kit.json` monta o kit de efeitos do vídeo e mede onde cai cada pico. Preset `calm` (padrão) para Reel falado; `launch` só quando o vídeo é guiado por música.
- `media-use resolve --type sfx` quando a biblioteca não tiver o som.

## Trilha

- Primeiro perguntar que música já funcionou com ele. Para o Suno, prompt de até 400 caracteres, com marcação de tempo, nem triste nem pesado.
- Cortes caem no tempo da música quando o vídeo é guiado por ela.
- Quando a cena já tem fala (clone do Higgsfield), não pôr trilha que brigue com a fala (02/11).
