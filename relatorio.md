# Engenharia reversa dos Reels que explodiram

Data: 02/11/2026. Base: 5 vencedores enviados por ele (vídeo + prints dos Insights), transcrição por faster-whisper com tempo por palavra, quadros extraídos com ffmpeg, Windsor (conector instagram) para as semanas em volta de cada vencedor e para as réplicas, comentários lidos pelo Vamos só no sumiço, estudos conferidos no PubMed.

Marcação: [dado] vem de print, Windsor ou transcrição. [observação do vídeo] vem dos quadros e do áudio medidos. [hipótese] é leitura editorial. Com cinco vídeos não há prova causal. Nada aqui é regra, nota ou previsão.

Pastas: `reels/vencedores/<nome>/` (vídeo, prints, legenda), `reels/replicas/<nome>/` (legenda; vídeos faltam, ver `dados/faltando.md`), `transcricoes/`, `frames/`, `dados/`.

## 1. Métricas contra a média do período

Linha de base: mediana dos Reels publicados nas 2 semanas antes e 2 depois de cada vencedor, sem o vencedor (Windsor). Multiplicador = vencedor dividido pela mediana. Envios por mil = compartilhamentos por mil views.

| Vencedor | Janela | Reels na janela | Views (x mediana) | Alcance (x) | Envios (x) | Envios/mil (vencedor vs mediana) | Salvos/mil | Tempo médio (vencedor vs mediana) | Pulo 3 s |
|---|---|---|---|---|---|---|---|---|---|
| Sumiço, 03/04/2026 | 21/03 a 17/04 | 59 | 161.484 (32x) | 125.469 (40x) | 2.543 (121x) | 15,7 vs 4,7 | 9,7 vs 6,1 | 8,7 s vs 12,5 s (0,7x) | 65% vs 60% (pior) |
| Autolesão, 06/03/2026 | 20/02 a 19/03 | 50 | 187.726 (30x) | 149.619 (33x) | 6.075 (162x) | 32,4 vs 6,2 | 16,7 vs 7,2 | 16,6 s vs 12,8 s (1,3x) | 52% vs 57% (melhor) |
| 5 coisas, 18/06/2026 (orgânico, Windsor) | 03/06 a 30/06 | 55 | 147.851 (85x) | 107.472 (82x) | 4.430 (492x) | 30,0 vs 4,8 | 20,5 vs 6,3 | 25,7 s vs 10,8 s (2,4x) | 43% vs 50% (melhor) |
| Mini-manual, data desconhecida | sem janela | | 118.682 | 92.340 | 4.400 | 37,1 | 20,2 | 20 s de 64 | 47% (app: mais baixo) |
| Vida sexual, 14/04/2024 | Windsor de 2024 inconsistente | | 1.400.000 (app) | n/d | não aparece | n/d | 2,1 | n/d | n/d |

Taxas do app, sobre views, com a comparação que o próprio app dá:

| | Sumiço | Mini-manual | Autolesão | Vida sexual | 5 coisas (total com anúncio) |
|---|---|---|---|---|---|
| Curtidas | 6,4% (mais baixo) | 11,9% (mais alto) | 14,0% (mais alto) | 2,9% | 6,8% |
| Compartilhamentos | 2,0% (mais alto) | 4,7% (mais alto) | 3,9% (mais alto) | n/d | 2,3% |
| Reposts | 0,9% (mais alto) | 1,2% (mais alto) | 1,9% (mais alto) | 16 no total | n/d |
| Salvamentos | 1,2% (mais baixo) | 2,6% (mais alto) | 2,0% (mais alto) | 0,2% | 1,7% |
| Comentários | 0,4% (típico) | 0,2% (mais baixo) | 0,2% (mais baixo) | 0,05% | 0,1% |
| Seguidores por mil views | 2,3 | 5,5 | 4,6 | n/d | 5,4 (com anúncio) |
| Não seguidores | 67% | 71% | 88% | n/d | n/d |
| Fonte principal das views | Reels 31%, Stories 27% | Reels 44%, Feed 28% | Reels 70% | n/d | n/d |

**Qual métrica explodiu em cada um** [dado]:
- Sumiço: compartilhamentos (121x a mediana; 3,3x mais envios por mil). Retenção abaixo da mediana (8,7 s contra 12,5 s; pulo pior). O alcance veio de repost: 27,5% das views pelos Stories, 4 a 20 vezes mais que nos outros dois com fonte conhecida.
- Autolesão: compartilhamentos (162x) e curtidas (14%, a maior dos cinco). Retenção só um pouco melhor que a mediana. Distribuição pela aba Reels (70%) para 88% de não seguidores, público mais jovem (13 a 17: 12,9%; 18 a 24: 36%).
- 5 coisas: tudo, e principalmente retenção: 2,4x o tempo médio da janela, com 30 envios por mil (6x). É o único em que o vídeo prendeu muito mais que o normal da conta.
- Mini-manual: salvamentos (2,6%) e seguidores (5,5 por mil, o maior em orgânico). Sem janela para multiplicar.
- Vida sexual (2024): views e alcance, com a menor ação por view de todos (curtida 2,9%, salvo 0,2%). Padrão de distribuição em massa fora do nicho.

Contexto das janelas [dado]: a conta publicava 2 a 3 Reels por dia, e a mediana de views dos Reels era 5.036 (março e abril), 6.366 (fevereiro e março) e 1.745 (junho). Muitos posts das janelas têm 100 a 500 views e legenda genérica. Os vencedores saíram no meio disso. Não dá para dizer que o volume ajudou ou atrapalhou.

## 2. Mecanismo de cada vencedor em três linhas

**Sumiço.** Nomeia a acusação de quem fica (frieza, descaso) na pergunta do título e a desfaz aos 18 s, absolvendo quem some. Dá a quem some uma frase para encaminhar e um CTA que não custa nada ("não precisa explicar o motivo"). O alcance veio de repost (27,5% pelos Stories), não de retenção, que ficou abaixo da mediana. [dado + hipótese]

**Mini-manual.** Promete um manual em 3 s (título fixo) e entrega três frases prontas para dizer na crise, cada uma com o erro, a fala e uma regra de uma linha. Quem convive salva para usar e manda para quem "quer ajudar e não sabe". Motor: retenção, salvamento e seguidor (5,5 por mil). [dado + observação]

**Autolesão.** Nega a acusação mais comum ("chamar atenção") aos 4 s e entrega aos 10 s um dado contraintuitivo com fonte (a frequência cardíaca cai), que a pessoa pode mostrar a quem a acusa. Quatro funções numeradas, saída e terapia no fim. Motor: curtida (14%) e distribuição pela aba Reels para 88% de não seguidores, mais jovens. [dado + hipótese]

**Vida sexual (2024).** Pergunta na capa com palavra disfarçada, correção do estereótipo (hipersexual) em 9 s, dado de risco, os dois lados (evita ou usa). Distribuição em massa fora do nicho com a menor ação por view dos cinco. Era outra fase do algoritmo; não serve de modelo de alcance. [dado + hipótese]

**5 coisas.** Cinco comportamentos que o parceiro lê como defeito, cada um devolvido com a função (pavor de não pertencer, único lugar seguro) e o fecho "é uma forma de amar". Número sobreposto no b-roll faz a lista se ler sem som. Único que prendeu muito acima da conta (2,4x o tempo médio) além de enviar 6x mais por view. [dado + observação]

## 3. Mecanismo comum, para aplicar em tema novo

Escrito como receita. É hipótese editorial apoiada em 5 vencedores, 5 réplicas e as janelas em volta; não é regra nem previsão.

1. **Comece pela acusação, não pelo sintoma.** Pegue a frase que quem convive diz sobre o comportamento, com as palavras dela (ingrata, mentirosa, fria, exagerada, era só drama). Ponha a cena em que a frase é dita.
2. **Diga a acusação em voz alta nos primeiros 3 segundos e desfaça até os 8.** Se a entrega ficar depois dos 10 segundos, a maioria sai antes dela; no sumiço, o tempo médio foi 8,7 s e a absolvição veio aos 18 s.
3. **Mostre o que está por baixo** com uma coisa só: um mecanismo em uma frase, um dado com fonte conferida, ou uma lista curta de funções. Não os três.
4. **Devolva o comportamento com outro nome, em uma frase que caiba numa mensagem.** Essa frase é o que vai ser enviado. Sem fórmula de contraste.
5. **Escreva para dois leitores ao mesmo tempo.** Quem convive recebe a explicação e uma coisa para fazer. Quem tem borderline recebe a absolvição e uma frase para mostrar. Dois leitores, dois motivos de envio.
6. **Preserve o limite de quem foi machucado em uma frase.** "Isso não apaga o que a briga fez." Sem isso, o vídeo vira passar pano; com isso, a família também envia.
7. **Peça a ação do motor.** Salvar, ou enviar para uma pessoa nomeada. Comentário não foi motor em nenhum dos cinco.
8. **Diga isso pela primeira vez.** A tese tem que ser nova na conta, não só o exemplo. Repost, parte 2 e regravação renderam 8 a 28 vezes menos com a mesma ação por view. Novidade não é detalhe do mecanismo; é a metade dele que as réplicas não copiaram.
9. **Faça a estrutura se ler sem som.** Título fixo, número no quadro, texto grande só nas 2 a 4 frases que a pessoa vai citar.
10. **Decida o motor antes de gravar e meça por ele.** Envio por mil e fonte Stories; ou salvos por mil e tempo médio; ou curtida e não seguidores. Views sozinhas não dizem qual parte funcionou.

## Anexo A. Cada vídeo em camadas

### 2.1 O sumiço borderline (DWrHk3yjuV8, 03/04/2026, sexta, 11h59 Brasília, 26 s)

- **Tese** [transcrição]: sumir não é frieza nem descaso; é um colapso silencioso de quem tenta sobreviver sem te machucar. Era nova na conta em abril de 2026? Não dá para confirmar antes de fevereiro; nas janelas puxadas não há outro Reel com essa tese antes de 03/04 [dado parcial]. A crença que mexe: "ela sumiu porque não liga para mim".
- **Público**: a fala é dirigida a quem fica ("você manda mensagem, nada"). Quem se reconhece: quem some. Nos 88 comentários lidos (de 476), os 15 mais curtidos são de quem some ("é como se a nossa bateria social acabasse", 194 curtidas; "sei cativar, mas não cultivar", 122; "vontade de dormir 3 dias", 77). Nenhum marcou alguém, nenhum discordou [dado]. Quem manda para quem: quem some manda para quem ficou esperando [hipótese sustentada pelos comentários e pelos 27,5% de Stories].
- **Gancho (0 a 3 s)**. Fala: "O que o border some do nada?" (0,0 a 1,4 s; na gravação ele diz "por que"), "Você manda mensagem, nada, liga, nada" (1,7 s em diante). Imagem [observação do vídeo]: rosto dele em preto e branco, microfone na mão, 0 a 1,4 s; corte para mulher de costas entre plantas, olhando por cima do ombro, 1,4 a 2,4 s; volta ao rosto. Texto: título fixo POR QUE O BORDERLINE SOME "DO NADA"? em 0 s; legenda pequena a partir de 1,7 s. Tensão: a pergunta do título. Fecha na frase? Não: a resposta fica pendente até os 6 s ("isso tem uma explicação que a maioria não conhece") e só vem aos 14 s.
- **Promessa e entrega**: promete explicação aos 4,5 s ("explicação que a maioria não conhece"); entrega o mecanismo aos 6 a 11 s (intensidade passa de certo nível, colapso silencioso), o reenquadre aos 14 s (sumir parece mais seguro do que decepcionar) e a absolvição aos 18 s (não é frieza nem descaso). Metade do público já tinha saído antes dos 8,7 s [dado: tempo médio], ou seja, a maioria viu a promessa e não a entrega.
- **Estrutura e ritmo** [observação do vídeo]: 20 trocas de imagem em 26 s (46 por minuto), plano médio 1,3 s. Viradas: 1,4 s b-roll; 9 a 11 s texto grande CÉREBRO ENTRA EM COLAPSO com prédios sobrepostos; 13 s flashes brancos; 15 a 17 s texto grande SUMIR PARECE MAIS SEGURO QUE DECEPCIONAR; 21 s rua aérea; 22,6 s CTA; 26 a 30 s cartão. Curva de curtidas do app: pico aos 2 s e queda; pequena subida no fim. Não há curva de retenção disponível.
- **Motivo de envio** [hipótese]: a frase que a pessoa manda é a absolvição ("não é por frieza nem descaso, é alguém tentando sobreviver sem te machucar"). Manda para quem ficou no vácuo. O que quer dizer: "eu não consigo explicar, mas é isso". O CTA "não precisa explicar o motivo" é essa mesma frase virada em convite.
- **Linguagem** [transcrição]: 88 palavras em 25,7 s (206 por minuto, o mais rápido dos cinco). Frases de 6 a 15 palavras. Dois termos: "colapso silencioso" (metáfora, sem fonte), "intensidade emocional". Tom direto, segunda pessoa.
- **Visual e áudio** [observação do vídeo]: preto e branco, rosto, 4 b-rolls (mulher, prédios, névoa, rua), legenda pequena abaixo do queixo, texto grande em 2 momentos, -14,1 LUFS, LRA 4,4, fundo contínuo entre falas (piso -36 dBFS; provável música baixa). Cartão final de 4 s sem fala.
- **Legenda e CTA** [dado]: legenda longa e genérica, termina em "Assista ao vídeo e compartilhe para espalhar compreensão" e cinco hashtags. CTA falado pede comentário; comentários ficaram em 0,4% (típico). Ele comentou o Protocolo 7 Dias em 15/04.
- **Contexto externo** [dado]: sexta-feira 11h59, post cruzado no Facebook, sem anúncio. No mesmo dia saíram uma imagem (11.949 views) e outro Reel (7.536). Reposts 1,1 mil.

### 2.2 Mini-manual para família (código e data não encontrados, 64 s)

- **Tese** [transcrição]: conviver com borderline não exige paciência, exige inteligência emocional, e ninguém te ensinou. Três coisas para dizer na crise. Crença que mexe: "o problema é que me falta paciência". Novidade na conta: não verificável sem a data.
- **Público**: família e parceiro ("ninguém te ensinou"). Quem se reconhece: quem já disse "que você tem?" e "vai passar". Quem manda para quem: quem convive manda para outro familiar; a pessoa com TPB manda para a família como pedido ("faz assim comigo") [hipótese].
- **Gancho (0 a 3 s)** [observação do vídeo]: abre do preto com fade de 0,9 s; você girando uma ampulheta azul, camisa vermelha; legenda "Conviver com border", "não exige paciência". Título fixo MINI-MANUAL PARA FAMÍLIA entra aos 3 s. Fala: "Conviver com border não exige paciência, exige inteligência emocional, e ninguém te ensinou" (0 a 4,2 s). Tensão: contradição (não é paciência) e promessa (ninguém te ensinou, eu vou). Fecha na frase? Não: promete um manual.
- **Promessa e entrega**: promete aos 4 s; entrega o item 1 aos 4,2 s ("não pergunta, permaneça"), a primeira fala pronta aos 10 s ("pô, eu tô aqui do teu lado"), a primeira regra aos 15 s (PRESENÇA É MAIS CURATIVA QUE RESPOSTA). Tempo médio de 20 s: a maioria viu o item 1 inteiro e o começo do 2.
- **Estrutura e ritmo**: três itens numerados na tela (1 aos 5 s, 2 aos 20 s, 3 aos 34 s), cada um com erro + fala pronta + regra em texto grande; ressalva aos 50 s; CTA duplo aos 53 s. Cerca de 24 cortes por minuto fora os flashes (clusters em 5, 15, 17, 23, 33, 36 e 52 s); b-roll só na troca de item (mãos na crise 8 s, pernas 27 s, sala 34 s, abajur 45 s). Curva de curtidas: pico aos 3 s, segundo pico aos 20 s (entrada do item 2), subida no fim.
- **Motivo de envio** [hipótese]: as frases prontas. Quem convive não sabe o que dizer; o vídeo entrega três. Manda para "quem quer ajudar e não sabe" (o próprio CTA). Salva para usar na próxima crise (salvos 2,6%, o maior dos cinco).
- **Linguagem** [transcrição]: 177 palavras em 57,6 s (185 por minuto). Frases curtas, imperativas, com a fala pronta em discurso direto. Termos: "inteligência emocional", "previsibilidade". Sem estudo.
- **Visual e áudio**: cor, camisa vermelha, palavra-chave em amarelo na legenda, texto grande nas 3 regras, -14,7 LUFS, LRA 4,9, fundo quase inaudível (piso -49,5 dBFS).
- **Legenda e CTA**: legenda não obtida. CTA falado: "salva isso aqui pra rever quando o vínculo voltar a doer e manda pra quem tenta ajudar e não sabe como". Pediu as duas ações que subiram.
- **Contexto externo**: data desconhecida; post cruzado no Facebook; sem anúncio.

### 2.3 Quando a dor vira alívio, autolesão (DVhb2JZjvph, 06/03/2026 00h13 UTC, quinta 21h13 Brasília, 73 s)

- **Tese** [transcrição]: autolesão no borderline não é para chamar atenção; estudos mostram que a frequência cardíaca cai durante o corte em quem tem o transtorno e sobe em quem não tem; existem quatro motivos (alívio da dor emocional, expressão de sentimentos, sensação de controle, punição); existem outras formas de lidar e a terapia ajuda. Novidade na conta: nas janelas puxadas (20/02 a 19/03) não há outro Reel sobre autolesão [dado parcial]. Crença que mexe: "ela se corta para chamar atenção".
- **Público**: quem se corta (protagonista) e quem convive (recebe a explicação). Quem manda para quem: quem se corta manda para quem a acusou; mãe manda para o pai [hipótese]. O público foi o mais jovem dos cinco e 88% não seguidores [dado].
- **Gancho (0 a 3 s)** [observação do vídeo]: rosto dele em cor, estante vermelha, tira os óculos no primeiro segundo; texto AUTOLESÃO NO BORDERLINE em 0 s e "por que isso acontece?" a partir de 1,5 s; título fixo POR QUE O BORDER SE CORTA? a partir de 3 s. Fala (transcrição, 0 a 4 s): "Autolesão no borderline, por que isso acontece?" Tensão: pergunta. Fecha? Não.
- **Promessa e entrega**: aos 4 s nega a acusação (NÃO é para chamar atenção, X vermelho); aos 7 a 17 s entrega o dado (eletrocardiograma, relógio, "estudos mostram: a frequência cardíaca diminui; em quem não tem o transtorno, aumenta"); aos 18 s "existe um motivo"; aos 23 s pede like; aos 26 s começa a lista de 4 motivos; aos 57 s a saída; aos 69 s o CTA. Tempo médio de 16,6 s: a maioria viu a negação e o dado, e saiu antes da lista.
- **Estrutura e ritmo**: 31 cortes em 73 s (25 por minuto). Viradas: 4 s negação; 7 s b-roll de eletrocardiograma; 11 s relógio; 23 s animação de like; 26 s item 1 com rosto sombrio; 33 s item 2; 35 s olho; 41 s item 3; 48 s item 4 com mãos na cabeça; 55 s X vermelho; 57 s saída; 65 s terapia; 69 s CTA; 70 a 77 s cartões. Curva de curtidas: pico aos 2 s, queda rápida, sem segundo pico.
- **Motivo de envio** [hipótese]: o dado. "A frequência cardíaca diminui" é uma frase que a pessoa mostra para quem diz que é para chamar atenção. Curtida de 14% é o sinal mais forte: identificação imediata no gancho (pico aos 2 s).
- **Linguagem** [transcrição]: 229 palavras em 70 s (196 por minuto). Frases de 5 a 12 palavras. Termos: "frequência cardíaca", "autolesão", "regulação" não aparece; "punição pessoal". Um dado científico sem nome de estudo.
- **Fonte do dado** (conferida no PubMed): Reitz e col., 2012, J Pers Disord 26(4):605-15, 14 pacientes com TPB e 18 controles: depois da incisão, tensão e frequência cardíaca caíram no grupo TPB; nos controles a tensão subiu (https://doi.org/10.1521/pedi.2012.26.4.605). Reitz e col., 2015, Br J Psychiatry 207(2):165-72, 21 mulheres com TPB e 17 controles: queda maior da tensão e da atividade da amígdala depois da incisão (https://doi.org/10.1192/bjp.bp.114.153379). O vídeo está certo no essencial; amostras pequenas; "em quem não tem, a frequência aumenta" pede o texto completo [verificar].
- **Visual e áudio**: cor, 5 b-rolls, texto grande no título e nos 4 itens, -14,5 LUFS, LRA 4,1, fundo baixo (piso -46 dBFS).
- **Legenda e CTA** [dado]: legenda curta, em frases de uma linha, com o dado e a ressalva ("isso não significa que a dor faz bem"), termina em "salva esse vídeo". CTA falado pede comentário de quem se identificou; comentários 0,2%.
- **Contexto externo**: quinta 21h13 Brasília; post cruzado no Facebook; sem anúncio; traduções para espanhol (2,4 mil) e inglês (2,2 mil); Brasil 68,7%.
- **Segurança** [dado + regra dele]: 12,9% do público tinha 13 a 17 anos; o CTA pede identificação com autolesão nos comentários; sem CVV. O vídeo não descreve método e fecha com saída e terapia.

### 2.4 Borderline, vida sexual e abusos (C5uQNTqOh_7, 14/04/2024 01h03 UTC, sábado 22h03 Brasília, 78 s)

- **Tese** [transcrição]: apesar do estereótipo de hipersexualidade, grande parte evita a vida sexual; quem tem borderline tem mais chance que a média de sofrer agressões; o sexo pode servir de regulação, aceitação e proximidade; no padrão oito ou oitenta vira risco; abusos na origem e revitimização na vida adulta. Crença que mexe: "borderline é hipersexual".
- **Público**: quem tem borderline. Quem manda para quem: não dá para saber; as ações por view foram as menores (salvos 0,2%, comentários 0,05%) [dado].
- **Gancho (0 a 3 s)** [observação do vídeo]: 0 s quadro com a pergunta "Borderline mais propenso à abusos s3xu4is?" sobre o rosto, camisa branca, parede com desenho de bicicleta; 0,5 s quadro escuro; 1 a 3 s rosto com legenda "a relação do borderline... sua vida sexual já é muito complexa". Fala (transcrição): "A relação do borderline com sua vida sexual já é muito complexa. Apesar do estereótipo de hipersexualidade..." Tensão: pergunta na capa com palavra disfarçada. Fecha? Não.
- **Promessa e entrega**: a capa promete responder se é mais propenso; o dado vem aos 10 a 17 s ("maior probabilidade que a média de sofrerem agressões"); pede like aos 19 s; a função do sexo aos 22 a 34 s; o risco aos 35 a 54 s; os abusos e a revitimização aos 55 a 69 s; CTA aos 70 s. Sem tempo médio disponível.
- **Estrutura e ritmo**: 22 cortes em 78 s (17 por minuto, o mais lento), -18,2 LUFS (o mais baixo), três blocos de b-roll (casal 29 s, mulher na cama 44 s, silhuetas e choro 67 s), glitch no pedido de like.
- **Motivo de envio** [hipótese]: a correção do estereótipo e a validação de quem evita sexo ou quem foi abusada. Sem comentários lidos.
- **Linguagem** [transcrição]: 236 palavras em 73 s (193 por minuto). Frases mais longas (até 25 palavras). Tom explicativo, dois lados.
- **Fontes dos dados** (PubMed): de Aquino Ferreira e col., 2018, Psychiatry Res 262:70-77, revisão sistemática de 40 estudos: abuso sexual na infância é fator de risco para TPB; abuso sexual na vida adulta é mais frequente no TPB que em outros transtornos de personalidade (https://doi.org/10.1016/j.psychres.2018.01.043). Hailes e col., 2019, Lancet Psychiatry 6(10):830-839: abuso sexual na infância associado a TPB, razão de chances 2,9 (https://doi.org/10.1016/S2215-0366(19)30286-X). "Grande parte evita a vida sexual" está sem fonte conferida [verificar].
- **Legenda e CTA** [dado]: "Borderline, vida sexual e abusos ⚠️ 🚨alerta para gatilhos" e hashtags (#empoderamentofemimino entre elas). CTA falado pede relato de abuso nos comentários.
- **Contexto externo**: sábado 22h03 Brasília, 2024, outra fase do algoritmo e da conta (os Reels da semana tinham 8 mil a 41 mil views no Windsor, e 260 mil em 17/04). Windsor de 2024 inconsistente para linha de base. Reposts 16 (recurso quase inexistente na época).

### 2.5 5 coisas que borderline faz se gosta de verdade (DZtQewqu1Ii, 18/06/2026 00h30 UTC, quarta 21h30 Brasília, 58 s)

- **Tese** [transcrição]: cinco comportamentos que parecem o contrário de amor (invade a sua vida, lembra de tudo, precisa de afago, surta só com você, pavor de perder) são a forma de amar de quem tem borderline, sem o manual convencional. Novidade na conta em junho: nas janelas puxadas não há lista parecida antes [dado parcial]. Crença que mexe: "ela não me ama, me controla".
- **Público**: o parceiro ("você"), com "ela" explicada. Quem se reconhece: os dois. Quem manda para quem: ela manda para ele ("é assim que eu amo"); ele salva [hipótese]. Legenda termina com "Salva e manda pra quem precisa ler isso com você" [dado].
- **Gancho (0 a 3 s)** [observação do vídeo, 4 quadros por segundo]: rosto dele, terno, fundo escuro, título fixo 5 COISAS QUE BORDERLINE FAZ SE GOSTA DE VERDADE (BORDERLINE em vermelho) em 0 s; zoom com flash aos 2,7 s e entra a linha "e parecem o contrário". Fala: "Cinco coisas que o borderline faz se gosta de verdade e parecem o contrário" (0 a 3,5 s). Tensão: parecem o contrário. Fecha? Não: promete cinco.
- **Promessa e entrega**: item 1 aos 4,7 s (b-roll da mulher espiando), função do item 1 aos 9 a 12 s (pavor de ficar de fora, DE NÃO PERTENCER); item 2 aos 14,5 s; item 3 aos 22,4 s; item 4 aos 30 s com a regra VOCÊ É ESSE ÚNICO LOCAL aos 40 s; item 5 aos 42 s; fecho É UMA FORMA DE AMAR aos 52 s; CTA aos 55 s. Tempo médio de 25,7 s: a maioria viu até o item 3 [dado].
- **Estrutura e ritmo**: 25 trocas em 58 s (26 por minuto), plano médio 2,3 s; 5 blocos de b-roll de 3,3 a 5,1 s, um por item, com o número sobreposto (a estrutura se lê sem som); 4 textos grandes; flash branco aos 26 s. Curva de curtidas: pico aos 2 s, segunda subida leve aos 20 s, subida no fim.
- **Motivo de envio** [hipótese]: a lista inteira é uma defesa pronta. A frase é o fecho ("quase tudo que parece defeito é uma forma de amar sem o manual convencional"). Ela manda para ele; ele salva (salvos 20,5 por mil, 3x a mediana).
- **Linguagem** [transcrição]: 196 palavras em 58 s (202 por minuto). Frases curtas, cada item com cena ("a data, o prato"). Termos: nenhum clínico. Sem estudo.
- **Visual e áudio**: cor, fundo escuro, terno, legenda com palavra em branco, texto grande em 4 momentos, mesma atriz em todos os b-rolls, -15,0 LUFS, LRA 5,0, fundo mais presente (piso -29,8 dBFS; provável música).
- **Legenda e CTA** [dado]: legenda reescreve a lista em texto, com ressalva ("isso não significa aguentar tudo") e dois CTAs: salva e manda; COMEÇAR na DM. CTA falado: "salva isso daqui pra quem não [entende]".
- **Contexto externo**: quarta 21h30 Brasília; post cruzado no Facebook; anúncio em 22/08 (28.538 views, meta visitas ao perfil). Em junho a mediana de views dos Reels da conta era 1.745, a menor das três janelas [dado].

## Anexo B. Cruzamento: o que se repete no nível do mecanismo

Primeiro, o que é só hábito dele (aparece também nas réplicas e nos posts médios, logo não explica) [dado das janelas e dos registros]: rosto dele em talking head; legenda pequena com palavra-chave colorida; b-roll de banco de imagem; cortes a cada 2 a 4 s; volume perto de -14 LUFS; hashtags; "salva e manda" na legenda; "Conteúdo educativo" no rodapé. Está em quase tudo que ele publica.

O que se repete nos cinco e falta na maioria dos posts médios:

1. **Uma acusação de quem convive, dita em voz alta e desfeita cedo** [observação do vídeo, 5 de 5]. Frieza e descaso (sumiço, dita aos 0 s pela pergunta e desfeita aos 18 s); falta de paciência (manual, 0 a 4 s); chamar atenção (autolesão, 4 s); hipersexual (vida sexual, 1 a 9 s); parece o contrário de amor (5 coisas, 2,7 s). Nos posts médios das janelas, as legendas descrevem a experiência por dentro ou dão conceito ("montanha-russa emocional", "dissociação é um disjuntor") sem nomear a acusação. Provavelmente causal: é o que o item 2 de `memoria/reels-certeiros.md` já apontava em dois levantamentos, e é o que os comentários do sumiço confirmam (todo mundo se defendendo).
2. **A pessoa com borderline sai explicada ou absolvida, e o limite de quem foi machucado não é apagado** [observação, 5 de 5]. Nenhum dos cinco critica quem convive. O FRÁGIL (31/10), que criticava a família, flopou. Provavelmente causal junto com o item 1.
3. **Dois destinatários no mesmo vídeo** [observação, 4 de 5]: quem convive recebe explicação; quem tem borderline recebe uma frase para mostrar. Isso dá dois motivos de envio. Provavelmente causal para compartilhamento; é a única explicação coerente com 27,5% de Stories no sumiço e com os comentários.
4. **Uma coisa concreta para fazer ou mostrar** [observação, 4 de 5]: frases prontas (manual), dado para mostrar (autolesão), lista para mandar (5 coisas), absolvição para encaminhar (sumiço). Correlaciona com salvos acima da mediana em todos com janela.
5. **Comentário nunca é o motor** [dado, 5 de 5: 0,05% a 0,4%]. Três pediram comentário e não subiu.
6. **Não há um motor único** [dado]: sumiço por repost com retenção ruim; 5 coisas por retenção e envio; autolesão por curtida e aba Reels; vida sexual por distribuição fora do nicho. Qualquer plano precisa dizer qual motor mira.
7. **Primeira vez da tese naquele formato** [dado parcial, 3 de 5 verificáveis nas janelas; é a peça central da seção 4].

O que é comum só na superfície e não separa [dado]: lista numerada (3 de 5), dado com fonte (2 de 5), preto e branco (1 de 5), duração (26 a 78 s), cortes por minuto (17 a 46), pedido de like (2 de 5), texto grande (0 a 4 momentos), horário (11h59, 21h13, 21h30, 22h03), dia (quinta, quarta, sexta, sábado), primeira troca de imagem antes de 1,5 s (3 de 5). A leitura de 26/10 dizia 5 de 6; medido, é 3 de 5.

## 4. Por que as réplicas falharam

Réplicas com dado (Windsor e histórico; vídeos não disponíveis, ver `dados/faltando.md`):

| Réplica | O que é | Views | x mediana da própria semana | Envios/mil | Salvos/mil | Tempo médio | Pulo | Views do original |
|---|---|---|---|---|---|---|---|---|
| Repost do sumiço, 06/08 (Dbssy3iudgI) | mesmo arquivo, mesma legenda | 19.327 | 13x (mediana 1.503) | 19,8 | 12,3 | 12,4 s | 54% | 161.484 (8x) |
| Mais 5 coisas, 29/10 (DfDw-Jtuo17) | parte 2 da lista | 17.312 | 12x (mediana 1.456) | 21,7 | 18,9 | 25,7 s | 48% | 147.851 (8,5x) |
| 5 coisas depois da crise, 02/11 (DfODDwCuoMG) | terceira lista de 5 | 7.551 com 13 h | cedo | 9,8 | 12,6 | n/d | n/d | cedo demais para comparar |
| Por que a autolesão acontece, 18/09 (DdcFbafORcD) | mesmo tema, outro vídeo | 19.990 | n/d | 16,5 | 13,9 | 12,4 s | 50% | 187.726 (9x) |
| Sexualidade 8 ou 80, 08/10 (DeNtB4nu3ck) | regravação da tese de 2024, com anúncio | 49.223 | n/d | 13,5 (23,9 sobre 27.866 orgânicas de 13/10) | 14,9 | 22,3 s | 46% | 1.400.000 (28x) |

**O achado mais importante** [dado]: em toda réplica com dado, a ação por view foi igual ou melhor que a do original. O repost do sumiço teve mais envios por mil (19,8 contra 15,7), mais salvos por mil (12,3 contra 9,7), mais tempo médio (12,4 s contra 8,7 s) e menos pulo (54% contra 65%) que o vídeo idêntico de abril. A parte 2 do 5 coisas prendeu o mesmo tempo (25,7 s) e teve 21,7 envios por mil contra 30,0. A regravação da vida sexual teve curtida 4% contra 2,9% e salvo 1,5% contra 0,2%. As réplicas não falharam em prender nem em provocar a ação. Falharam em alcance: 8 a 28 vezes menos views, com 12 a 13 vezes a mediana da própria semana.

**O que isso diz sobre o mecanismo** [hipótese sustentada pelos dados acima]: o vencedor tem duas partes. A primeira é o conteúdo (acusação desfeita, absolvição, dois destinatários, coisa para mostrar), e ela se copia bem: as réplicas provaram isso. A segunda é a ignição: a primeira vez em que aquela tese chega àquele público e a cadeia de envio alcança gente que não segue a conta (67% a 88% de não seguidores nos vencedores). Essa parte não se copia dizendo a mesma coisa de novo para o mesmo público. O repost idêntico é o experimento mais limpo que existe sobre isso: zero diferença de conteúdo, 8 vezes menos alcance.

**O que foi copiado, o que mudou sem perceber, o que ficou de fora**, por réplica:

- *Repost do sumiço* [dado]: copiado tudo. Mudou: a data (quatro meses depois), o horário (9h21 de quinta, contra 11h59 de sexta), o número de posts da conta no mesmo dia (dois Reels em 06/08) e o fato de os seguidores já terem visto. Ficou de fora: a novidade. Não há nada para corrigir no vídeo; não repostar.
- *Mais 5 coisas, parte 2* [dado da legenda e do registro de 29/10; vídeo não visto]: copiado o formato de lista de 5, a duração, o rosto, a legenda com "manda pra quem". Mudou sem perceber: (a) os cinco sinais da parte 2 já parecem amor ("some de todo mundo e continua respondendo você", "avisa que o dia está ruim antes que você leve a culpa"); não há acusação para desfazer, logo o item 1 do mecanismo saiu; (b) o gancho se apoia na parte 1 ("esta é a parte 2 da outra lista"), que quem não seguia a conta não viu; (c) sem música, 720p, microfone na mão abaixo do queixo (registro de 29/10); (d) 14 inserções de 0,5 a 1,2 s e colagem em stop motion, uma edição muito mais densa que a do original (5 b-rolls de 3 a 5 s com o número sobreposto). Ficou de fora: a tensão "parecem o contrário" e a primeira vez da tese.
- *5 coisas depois da crise* [dado da legenda e dos registros de 01/11]: aqui o item 1 existe ("quem convive lê tudo ao contrário"). O que mudou: terceira lista de 5 em quatro meses na mesma conta; gravação de 65 s cortada para 54; duas rodadas de correção de palavras cortadas e efeitos. Está com 13 h; não dá para julgar. Vale medir em 7 dias com o mesmo quadro do vencedor (envios por mil, tempo médio, fonte Stories).
- *Por que a autolesão acontece* [dado da legenda; vídeo não visto]: a legenda é genérica ("Entenda os motivos por trás desse comportamento e saiba como apoiar quem precisa. Marque alguém"), com emoji e três hashtags, no padrão dos posts de 100 a 500 views da conta. Sem a negação da acusação na legenda, sem o dado da frequência cardíaca, sem a lista. Mesmo assim fez 20 mil views e 16,5 envios por mil, 2,7x a mediana da conta. Ficou de fora, pelo que se vê: a acusação desfeita, o dado contraintuitivo e a novidade (o tema já tinha saído em 06/03, 04/07, 28/07 e 17/08).
- *Sexualidade 8 ou 80* [dado da legenda; vídeo não visto]: a legenda reproduz a tese de 2024 quase ponto a ponto (estereótipo, evitação, anestesia, 8 ou 80, vulnerabilidade, revitimização). Mudou: a plataforma de 2024 para a de 2026, a conta já tinha publicado a mesma tese como carrossel (Hipersexual riscado, 119 mil views) e a réplica recebeu anúncio. Ficou de fora: a novidade e a pergunta na capa. O alcance de 2024 não é reproduzível em 2026 por nenhuma mudança de roteiro [hipótese].

**Resumo do motivo principal** [hipótese sustentada por 5 pares de dados]: as réplicas disseram a mesma tese, para o mesmo público, pela segunda, terceira ou quarta vez. O conteúdo funcionou igual ou melhor por view. O que não se repetiu foi a primeira exposição, que é o que faz a cadeia de envio chegar fora da conta. Em duas delas (parte 2 e autolesão de 18/09), também faltou a acusação desfeita no gancho.

## 5. O que corrigir nos vencedores

- **Sumiço**: 65% pulam nos 3 s e o tempo médio é 8,7 s; a entrega (reenquadre e absolvição) só vem aos 14 e 18 s. Trazer a absolvição para os 5 s e deixar o mecanismo depois. O b-roll da mulher aos 1,4 s não diz nada específico. "Cérebro entra em colapso" é metáfora sem fonte. Cartão final de 4 s sem fala derruba a conclusão. CTA pede comentário e rende 0,4%: trocar por envio a uma pessoa específica.
- **Mini-manual**: abre do preto (0,9 s); item 2 ("saca a mentira no olhar") sem fonte; 64 s para 20 s de tempo médio: os itens 2 e 3 não são vistos pela maioria. Versão de 35 s com os três itens em 10 s cada, ou três Reels de um item.
- **Autolesão**: pedido de like aos 23 s interrompe antes da lista; a lista começa aos 26 s e a maioria sai aos 16 s; cortar "existe um motivo" e o like e começar a lista aos 18 s. CTA pede identificação com autolesão; com 12,9% de público de 13 a 17 anos, pôr o CVV 188 na legenda e na tela final, e trocar o título "a dor vira alívio" por um neutro. Volume de SFX e flash estão bem.
- **Vida sexual**: lento (17 cortes por minuto) e baixo (-18 LUFS); CTA pede relato de abuso; "mais que a média" solto; palavra disfarçada. Se regravar, abrir pela correção do estereótipo em 3 s, pôr a fonte na legenda e um CTA de envio.
- **5 coisas**: a tensão ("parecem o contrário") só entra aos 2,7 s e o pico de curtidas está aos 2 s; dizer a contradição na primeira frase. Capa com fórmula de contraste e legendas começando com "ela" contrariam a regra atual dele (dado contra regra, pendente em `memoria/a-decidir.md`). Item 3 ("afago") é o mais fraco e cai no meio, onde a maioria sai (25,7 s). Atriz de banco pode ler como genérico.

## 6. Molde de criação

Perguntas que um roteiro novo precisa responder, por escrito, antes de ser gravado. Sem resposta para 1, 2, 5 e 9, não gravar.

1. **Acusação.** Qual frase quem convive diz sobre esse comportamento, com as palavras dela? Em que cena ela aparece (mensagem, mesa, carro, festa)?
2. **Segundo.** Em que segundo a acusação é dita e em que segundo é desfeita? Alvo: dita até 3 s, desfeita até 8 s. A entrega não pode ficar depois do tempo médio da conta (10 a 13 s).
3. **Por baixo.** O que está por baixo do comportamento: função, medo, mecanismo? Tem dado com fonte conferida? Qual? Se não tem, dizer que é raciocínio clínico.
4. **Novo nome.** Com que frase o comportamento sai do vídeo? Uma linha, sem fórmula de contraste. É a frase que vai ser enviada.
5. **Quem manda para quem.** Quem é o "você"? Quem se reconhece? Escrever a frase de envio e o que a pessoa quer dizer ao mandar. Se só um lado tem motivo para enviar, o vídeo tem um motor a menos.
6. **Coisa para fazer ou mostrar.** O que a pessoa com borderline ganha para mostrar? O que quem convive ganha para fazer na próxima vez?
7. **Limite.** Onde está, em uma frase, o limite de quem foi machucado? Sem isso o vídeo vira passar pano, e ele não publica assim.
8. **Primeira vez.** Essa tese já foi dita na conta (histórico de 180 dias, `memoria/wiki/posts/`, `memoria/ja-produzido.md`)? Se já foi, o que muda de verdade: a acusação, o público ou o mecanismo? Continuação e repost caem 8 a 28 vezes.
9. **Motor e métrica.** Qual motor a peça mira (envio e repost; retenção e salvamento; curtida e aba Reels) e qual número vai dizer se funcionou em 7 dias (envios por mil, salvos por mil, tempo médio, fonte Stories)?
10. **CTA.** Pede a ação do motor? Salvar ou enviar para uma pessoa nomeada. Nunca comentário sobre crise, autolesão ou violência.
11. **Segurança.** Tema de autolesão, suicídio ou abuso: sem método, com saída, CVV 188 na legenda e na tela, título neutro. O público pode ter menores.
12. **Sem som.** A estrutura se lê com o som desligado (título fixo, números, texto grande nos 2 a 4 momentos de ênfase)?
13. **Duração.** Qual a duração alvo e onde está a virada aos 20 s para quem ainda está assistindo?

Roteiros aplicando o molde: `roteiros/`. Testes: `plano-de-teste.md`.
