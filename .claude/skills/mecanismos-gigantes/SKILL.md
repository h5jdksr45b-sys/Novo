---
name: mecanismos-gigantes
description: Use ao criar, revisar ou dar veredito de Reel ou carrossel do Dr. Fabio Schmidt (@drfabioschmidt, Borderline Sem Estigma), e ao fazer engenharia reversa de um post dele que performou bem. Confere a peça contra os mecanismos medidos nos 5 Reels gigantes (02/11/2026), diz qual motor de alcance ela mira e mede um post novo com a mesma receita. Lê memoria/mecanismos-gigantes.md, que é a fonte viva.
---

# Mecanismos dos gigantes

Skill estritamente focada nos mecanismos encontrados na engenharia reversa dos 5 Reels gigantes dele, a pedido dele em 02/11/2026. A síntese e os dados vivem em `memoria/mecanismos-gigantes.md`, no `main`. Esta skill diz como aplicar e como atualizar. Se a página não estiver no branch atual, leia do `main`.

Limites que valem sempre: os mecanismos são observação em 5 posts, não causa. Sem nota de viralidade, sem previsão de views, sem limiar universal. Views, alcance, envios, salvos, curtidas, comentários e retenção são métricas diferentes; cada uma responde a um motor.

## 1. Antes de criar ou revisar uma peça

Leia `memoria/mecanismos-gigantes.md` inteiro e responda por escrito, em uma linha cada:

1. **Acusação.** Qual acusação de quem convive (ou qual estigma) a peça nomeia e desfaz? Em que segundo? Nos gigantes, entre 2,7 s e 9 s. Sem acusação desfeita, a peça não tem o mecanismo 1.
2. **Protagonista.** A pessoa com borderline sai explicada ou absolvida? Quem é o "você" da fala? Se a peça critica quem convive, pare: é o padrão do flop de 31/10.
3. **Dois destinatários.** Quem convive recebe uma explicação? Quem tem TPB recebe uma frase para mostrar? Se só um lado tem motivo para enviar, diga.
4. **Motor.** Qual motor a peça mira: repost pelos Stories, retenção e salvamento, curtida e aba Reels, ou distribuição fora do nicho? A métrica do veredito é a desse motor, não views.
5. **CTA.** Pede a ação que o motor precisa? Comentário nunca foi motor nos gigantes. Salvar rendeu salvos. Enviar para uma pessoa específica continua a regra dele.
6. **Lista e fonte.** Tem lista numerada visível sem som? Tem dado com fonte conferida? Ajudam, não são condição. Não forçar.
7. **Segurança.** Autolesão, abuso, suicídio: sem CTA de identificação nos comentários, com saída e CVV 188 na legenda. O público da autolesão tinha 12,9% de 13 a 17 anos. Segurança prevalece sobre alcance.
8. **Primeira vez.** A tese é nova na conta, ou é repost, parte 2 ou regravação? Na engenharia reversa de 02/11 (`relatorio.md`), toda réplica teve ação por view igual ou melhor que o original e 8 a 28 vezes menos views. Novidade da tese é metade do mecanismo. Continuação vai como teste, nunca como feed.

O molde completo, com 13 perguntas, está em `relatorio.md`, seção 6. Os testes de uma variável por vez estão em `plano-de-teste.md`.

Depois rode o `memoria/termometro.md` e o `memoria/checklist-entrega.md` como sempre. Esta skill não substitui os dois.

## 2. Como escrever o veredito

Uma vez, por escrito, antes de ele postar:

- Mecanismos 1, 2 e 3: presente, ausente ou parcial, com a prova na própria peça (segundo, frase).
- Motor mirado e métrica que vai dizer se funcionou (exemplo: envios por mil views e fonte Stories; ou salvos por mil e pulo).
- Vizinho de tema na conta com dado (`memoria/insights.md`, skill `historico-borderline-180d`). Sem vizinho, o veredito é teste, não feed.
- Registrar no `memoria/placar-vereditos.md`.

Não dizer "vai viralizar", "tem cara de gigante" ou "não vai flopar". Dizer o que a peça tem, o que falta e o que medir.

## 3. Como fazer engenharia reversa de um post novo

Pedir a ele: prints das três abas dos Insights (visão geral com fontes das views, engajamento com a curva de curtidas, público) e o arquivo de vídeo. Não pedir mais nada; analisar só o que ele mandou. Comentários e código do post podem vir do Vamos, sem pedir a ele.

Medir o vídeo com a mesma receita, para a tabela continuar comparável:

```
F=arquivo.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height -of compact "$F"
# cortes (limiar 0,2; repetir com 0,4 para os cortes fortes)
ffmpeg -v info -i "$F" -vf "select='gt(scene,0.2)',showinfo" -vsync vfr -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | cut -d: -f2 | tr '\n' ' '
# volume integrado e faixa
ffmpeg -i "$F" -af ebur128 -f null - 2>&1 | grep -E "^\s+(I|LRA):"
# silêncios (início da fala, cartão final)
ffmpeg -i "$F" -af "silencedetect=n=-35dB:d=0.25" -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+"
# folha de contato, 1 quadro por segundo, para ler legendas e b-roll
ffmpeg -y -i "$F" -vf "fps=1,scale=150:-1,tile=10x8" sheet.png
# primeiros 5 s, 4 quadros por segundo, para o gancho
ffmpeg -y -i "$F" -vf "select='lt(t,5)',fps=4,scale=144:-1,tile=10x2" hook.png
```

Anotar: duração de conteúdo (até o silêncio final), cortes por minuto, primeira troca de imagem, blocos de b-roll com tempo, momentos de texto grande, volume, cor, lista, estudo, acusação e segundo em que é desfeita, protagonista, CTA, pedido de like, capa igual ou diferente do primeiro quadro.

Das taxas do app, copiar como estão (mais alto, mais baixo, típico). Calcular seguidores por mil views. Separar orgânico de anúncio quando houver.

Entregar: fatos (print), linha do tempo medida, estrutura em passos, fonte conferida no PubMed quando houver dado científico, hipótese separada de observação, o que o post tem de dado contra regra dele (registrar como dado, não como veto), segurança, e o que é replicável. Depois criar a página em `memoria/wiki/posts/` com o modelo `memoria/modelos/post.md`, acrescentar a coluna em `memoria/mecanismos-gigantes.md`, a linha em `memoria/insights.md` e o link em `memoria/INICIO.md`. Tudo direto no `main`.

## 4. O que esta skill não faz

- Não prevê alcance nem dá nota.
- Não transforma os mecanismos em fórmula obrigatória. O FRÁGIL tinha lista, cena e borderline na capa, e flopou.
- Não muda a voz dele nem as regras de `memoria/aprendizados.md`. Quando um gigante contradiz uma regra dele (capa com contraste, frase começando com ela), registrar em `memoria/a-decidir.md` e esperar a decisão dele.
