# Stories consulta GPM (refeito, 40,3 s, 1080x1920, 30 fps)

Refação do compilado "Consultas Stories - compilado GPM v2" num sistema visual único de colagem:
papel creme liso #F2EADB, recorte com borda rasgada, fita, tinta #151312, vermelho #CC0000,
Inter Display Black + Fraunces itálica, margem lateral de 108 px (10%), nada nos 250 px do topo.

Áudio original intacto (fala da entrevista na Metropolitana de 0 a 14,4 s, trilha depois), só
normalizado para -14 LUFS, pico -1,4 dBFS. Nenhum corte de fala.

Blocos: A entrevista em P&B na janela rasgada, legenda pequena até 3 palavras (0 a 12,05) ·
medidor PUTZ / EXAGEREI / PASSEI DO PONTO (12,05 a 14,6) · Borderline é tratável + agenda HOJE
circulada (14,6 a 18,6) · Modelo GPM, 5 cartões (18,6 a 23) · gráfico da distância e objetivo do
tratamento (23 a 31) · Consulta online, 3 cartões (31 a 35,3) · assinatura e Agende pelo link (35,3 a 40,3).

Render: `src/index.html` + `src/render.js` (Playwright, quadro a quadro) + ffmpeg. Quadros da
entrevista: crop=1080:805:0:450 do original, escala 864x644, cinza. Tudo feito por código, sem crédito.
