# Borderline não é psicopata (vídeo do carrossel)

Versão em vídeo do carrossel TODO BORDERLINE TEM SEU LADO PSICOPATA? (out/2026), feita em 26/10/2026.
9:16, 1080x1920, 30 fps, 46,5 s, sem narração. Só tem efeitos sonoros baixos (pico de -24 dBFS): a música entra no Instagram.

## Roteiro

1. Gancho: um celular recebe o comentário "Todo borderline tem seu lado psicopata"; o texto TODO BORDERLINE TEM SEU LADO PSICOPATA? aparece sobre uma faixa preta.
2. Psicopatia, em palavras simples: machuca e não sente culpa; engana e usa pessoas com frieza; raramente pede ajuda.
3. Quanto isso aparece: grade de 100 pontos, de 1 a 6 em cada 100 pessoas (estimativas para psicopatia e narcisismo na população geral, número do carrossel).
4. Borderline, em palavras simples: sente tudo muito forte; tem pavor de ser deixado; explode e depois sofre com o que fez.
5. Tabela Depois de machucar alguém: culpa, pedir ajuda e como machuca, em psicopatia e em borderline.
6. Os dois podem aparecer juntos? Diagrama de dois círculos: às vezes sim, mas ter borderline não torna ninguém psicopata. Quem avalia é um profissional.
7. Por trás da explosão, quase sempre tem DOR. Dor explica. Não autoriza machucar.
8. Manda pra quem ainda acredita nisso, com botão Enviar e assinatura com CRM.

Ficaram fora do vídeo, de propósito: o slide 5 do carrossel (a % de borders com essas comorbidades é igual à da população geral), que contradiz o NESARC (Grant et al., 2008, doi 10.4088/jcp.v69n0404, que encontrou associação forte entre TPB e TP narcisista), e o número de 15 a 20% de sobreposição, que estava sem fonte.

## Elementos

Nenhuma imagem do carrossel foi reaproveitada. Os elementos foram gerados no Higgsfield (GPT Image 2.5), com fundo removido, em colagem de meio-tom:

| Arquivo | Geração | Fundo removido |
| --- | --- | --- |
| celular.png | ed9bbdc8-fbbe-46dc-afde-31c99a866cf7 | 56a8681f-3d15-4d8c-a99c-670be5dbbe54 |
| xadrez.png | 779e3d35-5483-449b-8c6c-ad7b97102dd9 | 9b899fd0-97e7-4eb7-ba51-2c19cbc43a56 |
| multidao.jpg | 3e1b164a-5bee-4bfc-8a99-754dc57e68e2 | (foto inteira) |
| rapaz.png | f0d91f61-68a9-45af-af39-63a616717ec1 | b11bad3b-fd1c-4d3a-92cc-84e7e3fdeabe |
| gelo.png | 61aebb82-acbb-4dc0-adb8-3412359bd38d | 2c5f840c-26ff-4de5-bef3-f92c3f9c0234 |
| fosforo.png | 85342e7f-ced3-4589-9ad7-ea852fbd3236 | 0dd3b294-f437-4b3b-b86b-074d8fd3b43f |
| prato.png | e700f66d-15ed-41a3-9468-22c4a8bf5306 | 568e3b71-26b5-4e56-a414-9d4a2973a332 |
| aviao.png | 57c7b23e-f925-4e40-aee5-f5dc3a18e594 | 638b9ed5-da41-4bea-b0f8-ecc14076733f |
| lupa.png | 32e80d46-b3dc-4150-b368-57326b9deff7 | 6c20c676-326a-45cc-b3ce-95ace6b8e195 |

Os recortes passam por `convert -trim` antes de entrar em `assets/img/`. Os PNG não estão no repositório porque a rede da sessão bloqueia o CDN do Higgsfield; o render foi feito no ambiente do próprio Higgsfield. `assets/img/grain0..3.png` são texturas de ruído feitas com ffmpeg.

## Como renderizar

Precisa de Node com Playwright, ffmpeg e Python com numpy.

    node scripts/render.mjs 2.2,21          # prévias JPG nesses tempos
    node scripts/render.mjs                 # todos os quadros, SFX e MP4 em renders/

Para dividir o trabalho, rode vários processos com `FROM` e `TO` (números de quadro) e depois `FROM=1395 TO=1395 node scripts/render.mjs` para só gerar o áudio e montar o MP4.

Cada quadro é uma função do tempo (`seek(t)` em `index.html`), então o render é determinístico. Os sons são sintetizados por `scripts/sfx.py` a partir da lista `SFX` em `index.html`.
