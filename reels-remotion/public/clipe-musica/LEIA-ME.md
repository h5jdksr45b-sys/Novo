musica.m4a: áudio original do vídeo enviado.

musica-radio.m4a: a mesma faixa com filtro leve de rádio. O sinal filtrado
(corta abaixo de 300 Hz e acima de 3,8 kHz, leve realce em 1,5 kHz e
compressão) fica na frente, com o original baixo por baixo para não perder
corpo. Volume final normalizado em -14 LUFS.

Comando:
ffmpeg -i musica.m4a -filter_complex "[0:a]asplit[seco][r];[r]highpass=f=300,highpass=f=300,lowpass=f=3800,lowpass=f=3800,equalizer=f=1500:t=q:w=1:g=4,acompressor=threshold=-20dB:ratio=3,volume=2.2[radio];[seco]volume=0.35[s];[radio][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 160k musica-radio.m4a

Para voltar ao som original, troque o arquivo em MUSICA no index.tsx.
