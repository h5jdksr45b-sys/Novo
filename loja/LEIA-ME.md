# Lojinha TPB: como subir na Hostinger

Suba para `public_html/loja/`:

| Arquivo local | Destino na Hostinger |
|---|---|
| `index.html` | `public_html/loja/index.html` |
| `capas/og-loja.jpg` | `public_html/loja/capas/og-loja.jpg` |
| suas capas | `public_html/loja/capas/` |
| seus vídeos e posters | `public_html/loja/videos/` |

Este LEIA-ME não precisa subir.

## Nomes dos arquivos (já ligados no array PRODUTOS)

Basta subir com o mesmo nome. Enquanto o arquivo não existir, a página mostra a capa em CSS e não quebra.

| Produto | Capa (2:3; curso 3:4) | Vídeo 4:5 | Poster 4:5 |
|---|---|---|---|
| Protocolo 7 Dias | capas/protocolo-7-dias.jpg | videos/protocolo-7-dias.mp4 | videos/protocolo-7-dias.jpg |
| Protocolo da Crise | capas/protocolo-da-crise.jpg | videos/protocolo-da-crise.mp4 | videos/protocolo-da-crise.jpg |
| Kit de Regulação | capas/kit-de-regulacao.jpg | videos/kit-de-regulacao.mp4 | videos/kit-de-regulacao.jpg |
| Quando Escolher Não É Possível | capas/quando-escolher.jpg | videos/quando-escolher.mp4 | videos/quando-escolher.jpg |
| Começar | capas/comecar.jpg | sem vídeo | sem vídeo |
| TPB no CAPS | capas/tpb-no-caps.jpg | sem vídeo | sem vídeo |

Capas: cerca de 600 x 900 px (curso 600 x 800), JPG abaixo de 150 KB.
Vídeos: 8 a 12 s, 4:5 (ex.: 800 x 1000), H.264, sem áudio, abaixo de 1,5 MB. Poster é o primeiro quadro em JPG.

## Editar preço, texto ou link

Tudo fica no array `PRODUTOS`, no topo do `index.html`.

## Links diretos para usar no Instagram

- drfabioschmidt.net/loja/#protocolo-7-dias
- drfabioschmidt.net/loja/#protocolo-da-crise
- drfabioschmidt.net/loja/#kit-de-regulacao
- drfabioschmidt.net/loja/#quando-escolher
- drfabioschmidt.net/loja/#comecar
- drfabioschmidt.net/loja/#tpb-no-caps

Cada link abre a loja já com a janela do produto aberta. Parâmetros utm_* da URL são repassados para a Hotmart e para curso.drfabioschmidt.net. Links da Hotmart recebem também src=loja.
