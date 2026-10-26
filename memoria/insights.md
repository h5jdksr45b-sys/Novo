# Memória de insights

Métricas dos posts do @drfabioschmidt, registradas a cada leitura. Ativada em 26/10/2026, a pedido dele ("Ativa memória de insights").

## Regras deste arquivo

- Sempre que chegar métrica nova (print, CSV, relatório, puxada do Windsor), registre aqui na hora, antes de continuar o trabalho. Grave direto no `main`, como o resto de `memoria/`.
- Uma seção por leitura, mais recente no topo: data da leitura, origem, período e tabela.
- Leia este arquivo antes de criar ou revisar peça, depois de `conta.md`. Ele mostra o que a conta fez nos últimos dias. O histórico longo (13/04 a 12/10) continua na skill `historico-borderline-180d`.
- Número aqui é observação de post, não regra. Não dar nota de viralidade, não prever alcance, não tirar causa de poucos posts. Views, alcance, envios, salvamentos e retenção são métricas separadas.
- Posts com menos de 7 dias ainda acumulam números. Marque a idade quando comparar.
- Veredito sincero comparando com os gigantes dele continua valendo (`aprendizados.md`, seção 1). Este arquivo serve de base para essa comparação.

## Como puxar do Windsor

Conector `instagram`, conta 17841401503370732. Janela de até 14 dias por chamada.
- Conteúdo: `timestamp, media_type, media_permalink, media_caption, media_views, media_reach, media_shares, media_saved`.
- Retenção, em chamada separada: `media_permalink, media_reel_avg_watch_time, media_reel_skip_rate`.
- Curtidas e comentários vieram vazios em 26/10. Se precisar deles, pedir print a ele.

## Leitura de 26/10/2026, tarde (vídeos dele: Reels gigantes x Reels médios)

Ele mandou 6 Reels que chama de "os grandes de todos os tempos" e 5 que "funcionaram mas não muito nem perto desses outros grandes". Disse que não mandou os que floparam. Claude transcreveu (Whisper small local) e mediu os arquivos. Views dos gigantes não vieram; pedir a ele.

Gigantes: Por que se cortar (1:30); TPB e TEA existe conexão (0:50); Por que o borderline some do nada (0:30); 5 coisas que borderline faz se gosta de verdade (0:59); Por que quando tá mal prefere sumir, endorfina (1:16); Conviver com border não exige paciência, mini-manual para família (1:04).
Médios (views do CSV de 24/10): Estabilizador não funciona (17.829); Termina e 1 minuto depois implora (15.833); Precisa ficar sozinho (15.205); A dor que não consegue esquecer (22.305); Dá conta de tudo e desaba sozinho (24.418, histórico).

| Medida | Gigantes | Médios |
|---|---|---|
| Troca de imagem antes de 1,5 s | 5 de 6 | 0 de 5 (primeira entre 1,9 e 4,0 s) |
| Cortes por minuto (detector de cena, subconta jump cut) | 17 a 36, mediana 33 | 8 a 24, mediana 11 |
| Lista numerada ou em itens | 3 de 6 | 0 de 5 |
| Legenda palavra a palavra grande no centro | 3 de 6 | 0 de 5 (legenda pequena, texto grande só na ênfase) |
| Fala para quem está do outro lado (parceiro, família) | 4 de 6 | 1 de 5 |
| Comportamento visto de fora + acusação desfeita (atenção, frieza, chantagem, defeito) | 4 de 6 | 1 de 5 (termina e implora) |
| Duração | 30 a 90 s | 37 a 63 s |
| Palavras por minuto | 178 a 205 | 165 a 209 |
| Volume integrado | -14 a -18 LUFS | -14,5 LUFS |

Leitura (hipótese editorial, 11 vídeos, sem os flops): duração, velocidade de fala e volume não separam os grupos. O que separa é ritmo de imagem no começo e no miolo, formato de lista, e o tema ser um comportamento que assusta quem convive, explicado de um jeito que tira a acusação. Os médios falam mais da experiência por dentro ou de tratamento. Era diferente (2025 x 2026) e algoritmo diferente também podem explicar parte.

Cuidados para reaproveitar: 3 gigantes usam neurobiologia (frequência cardíaca na autolesão, "endorfinas caem mais de 60%", cérebro em colapso). O 60% está sem fonte conferida. Se cortar pede comentário de quem se identificou com autolesão, o que hoje ele veta. Três pedem like no meio do vídeo.

## Leitura de 26/10/2026, 12h34 (prints dele: posts que mais deram seguidores)

Ranking do app, Insights > Conteúdo > Seguidores, período que ele escolheu na tela. "Anúncio" = post impulsionado; o número de seguidores mistura orgânico e pago. Seg/mil = seguidores por mil views, conta de Claude.

| Post | Data | Formato | Seguidores | Views | Visitas perfil | Envios | Salvos | Anúncio | Seg/mil |
|---|---|---|---|---|---|---|---|---|---|
| Quem tem TPB... (diagrama do cérebro, rejeição e dor física) | 28/09 | Reel 1:08 | 264 | 48.110 | 264 atividade | 1,1 mil | 756 | sim, meta compras | 5,5 |
| Borderline adoece a família ou a família adoece o borderline? | 26/09 | Carrossel | 250 | 121.407 | 518 | 1,6 mil | 1,4 mil | não | 2,1 |
| Dizem por aí que o borderline é apenas hipersexual | 07/10 | Reel 1:08 | 243 | 49.012 | 243 atividade | 1,1 mil | 1,2 mil | sim, meta compras | 5,0 |
| Quem mais teme o abandono abandona antes | 28/09 | Carrossel | 184 | 152.532 | 354 | 1.862 | 1.867 | não | 1,2 |
| O bloqueio, o sumiço e a volta | 12/10 | Carrossel | 158 | 54.379 | 306 | 499 | 1.087 | não | 2,9 |
| Por que o borderline manda tanto áudio (mil áudios) | 16/10 | Reel 0:34 | 146 | 16.762 (6.426 do anúncio) | 226 pelo anúncio, R$0,31 cada | 118 | 156 | sim, meta visitas ao perfil | 8,7 |
| Duas mensagens seguidas: termina e implora pra voltar | 30/09 | Reel 0:40 | 131 | 16.922 (7.632 do anúncio) | 296 pelo anúncio | 86 | 133 | sim, meta visitas ao perfil | 7,7 |
| Quem mais ama o borderline (lugar mais seguro) | 29/09 | Carrossel | 96 | 111.386 | 230 | 1,8 mil | 984 | não | 0,9 |
| Por que quem tem borderline não consegue deixar uma injustiça | 09/10 | Reel | 81 | n/d | n/d | 781 | n/d | n/d | n/d |
| Um dia perfeito não protege (apagou meses de amor) | 03/10 | Reel | 81 | n/d | n/d | n/d | n/d | n/d | n/d |

Curtidas por slide (o app mostra quando a pessoa curtiu):
- Abandono: capa 4,1 mil; último slide (quem tem borderline sobrevive) 1,6 mil; miolo 343 a 994.
- Família: capa 1,6 mil; slides 2 a 4 entre 276 e 398.
- Bloqueio: capa 670; último slide (confundir sofrimento com cálculo) 177; miolo 67 a 115.

Observações (fato dos prints, base pequena):
- Os 4 Reels impulsionados ficaram entre 5,0 e 8,7 seguidores por mil views. Os 4 carrosséis orgânicos, entre 0,9 e 2,9. A diferença inclui o efeito do anúncio; não dá para separar orgânico de pago no print.
- Visitas ao perfil que viraram seguidor, nos 4 carrosséis: 42% a 52%. O perfil converte cerca de metade de quem chega.
- Entre os carrosséis orgânicos, os de envio alto e identificação (lugar mais seguro 0,9; abandono 1,2) deram menos seguidor por view que os que respondem uma pergunta ou explicam uma diferença (família 2,1; bloqueio 2,9). Hipótese editorial com 4 posts, coerente com Quieta na mesa (maior alcance, menor ganho de seguidores, em `conta.md`).
- O Reel que mais deu seguidores usa diagrama do cérebro. Ponto em aberto sobre neurobiologia no feed em `a-decidir.md`.
- Mil áudios: 16.762 views no print, 10.293 no Windsor. A diferença (cerca de 6.400) bate com as views do anúncio. Leitura provável: o Windsor traz só as views orgânicas.

## Leitura de 26/10/2026 (Windsor, posts de 13 a 25/10)

36 publicações. Ret = tempo médio assistido, em segundos (não é percentual; a duração não veio). Pulo = fração que saiu nos 3 primeiros segundos. Envios = `media_shares`.

### Carrosséis (10)

| Data | Código | Tema | Views | Alcance | Envios | Salvos |
|---|---|---|---|---|---|---|
| 25/10 | De7YMH7FGxF | Preciso de espaço pede prazo (COMEÇAR) | 15.798 | 7.041 | 19 | 37 |
| 24/10 | De4-B7clDvu | Vazio: melhor sábado do mês, à noite nada vale | 64.882 | 36.263 | 699 | 736 |
| 24/10 | De2zvbLlBqB | Diagnóstico contado, a família vira ré (Bailey e Grenyer) | 31.316 | 17.701 | 223 | 192 |
| 21/10 | DewzSpIlJXg | Grudenta, fria, dramática: nomes que ligam no TPB (Zanarini 2010) | 20.213 | 11.563 | 84 | 167 |
| 21/10 | DevKEQtlDBG | Parou a droga, a família achou que tinha acabado | 24.392 | 11.002 | 40 | 91 |
| 20/10 | DeuRRAHlOEv | Diagnóstico como acusação: os 9 critérios, procure maldade | 29.983 | 15.177 | 63 | 108 |
| 19/10 | Derx6hvlHVs | Parei de ir no almoço de domingo | 69.218 | 44.486 | 190 | 216 |
| 18/10 | DenYhywFJME | 22h41 precisamos conversar, 22h42 já sei que acabou | 12.117 | 5.541 | 29 | 38 |
| 16/10 | DeiPFFjFB0U | Todo borderline tem seu lado psicopata? | 35.161 | 19.913 | 236 | 378 |
| 14/10 | Deer1ORlDlO | Borderline faz love bombing? | 64.644 | 37.834 | 608 | 954 |

### Reels (26)

| Data | Código | Tema | Views | Alcance | Envios | Salvos | Ret s | Pulo |
|---|---|---|---|---|---|---|---|---|
| 25/10 | De70qB-OBCq | Escolha 3 pessoas para a crise (PodPeople #140) | 1.236 | 1.026 | 0 | 1 | 5,1 | 0,61 |
| 25/10 | De7GrPHuuMY | Perder faz parte (legenda genérica) | 1.172 | 1.046 | 0 | 0 | 6,1 | 0,61 |
| 25/10 | De5eMsNurko | Casa pegando fogo (PodPeople #140) | 7.328 | 4.816 | 29 | 79 | 13,0 | 0,62 |
| 24/10 | De5ESXqOvxb | Chefe não deu bom dia: raciocínio emocional | 1.873 | 1.643 | 2 | 2 | 7,3 | 0,37 |
| 24/10 | De4YchAOWr- | Alto funcionamento: amigos há anos, ninguém sabe da semana | 1.288 | 1.145 | 1 | 1 | 5,8 | 0,54 |
| 23/10 | De2dgLvue-u | Pediu ajuda e te chamaram de louco | 113 | 112 | 0 | 0 | 2,4 | 0,73 |
| 23/10 | De0QlKZukbw | Cada um lembra um pedaço da briga | 5.096 | 3.867 | 34 | 51 | 17,6 | 0,49 |
| 23/10 | De0Oq07u6bI | Você não me ama: responder ao medo, não com provas | 2.580 | 2.124 | 10 | 5 | 20,8 | 0,57 |
| 22/10 | De0Kx_luHd9 | Junta do cabeçote (fora do tema, conferir se foi engano) | 34 | 32 | 0 | 0 | 1,9 | 0,88 |
| 22/10 | DezI2SQup4A | Elogio parece engano, crítica parece verdade | 124 | 106 | 0 | 0 | 2,6 | 0,81 |
| 22/10 | DexsJ1_uj3R | Avó nervosa: três gerações, estudo genético (COMEÇAR) | 14.156 | 10.475 | 482 | 196 | 21,0 | 0,44 |
| 21/10 | Dexdl60ua1b | Em segundos decide o que vai lamentar (COMEÇAR) | 2.022 | 1.514 | 12 | 11 | 8,8 | 0,58 |
| 21/10 | DevPYV6uAyx | Programa da Tina (humor) | 113 | 113 | 0 | 0 | 2,4 | 0,85 |
| 20/10 | Deu9S3VO471 | Perto de alguém você vira essa pessoa (identidade) | 4.276 | 3.023 | 32 | 35 | 12,6 | 0,53 |
| 19/10 | DesWg2-uJaE | Cacto em vídeo: quem vê só o pico da raiva | 11.767 | 8.490 | 208 | 168 | 10,2 | 0,51 |
| 19/10 | DesTdhHOSvT | Esperou a raiva baixar e viraram castigo | 239 | 152 | 0 | 0 | 4,5 | 0,58 |
| 19/10 | Derfx9sOKGp | Mito ou verdade, 4 afirmações | 1.409 | 1.191 | 5 | 3 | 11,2 | 0,50 |
| 18/10 | DepRTVdOkfc | Muros altos do dia para a noite (legenda genérica) | 1.775 | 1.376 | 3 | 0 | 5,6 | 0,49 |
| 17/10 | Dek1kYHuePe | Chorar mais, rir mais alto, desmoronar | 123 | 112 | 0 | 0 | 4,7 | 0,78 |
| 16/10 | DekkE5rOO_N | Mil áudios depois da briga | 10.293 | 7.189 | 105 | 99 | 10,4 | 0,49 |
| 16/10 | Dej2dkNuOFU | Raiva antes de pensar (Tomás de Aquino) | 108 | 104 | 0 | 0 | 2,2 | 0,83 |
| 16/10 | Dejyu26u0rq | Fatos sobre borderline pra falar e sair correndo (humor) | 20.754 | 12.989 | 167 | 144 | 12,2 | 0,50 |
| 15/10 | Deh8HvzOoo4 | Dependência emocional e identidade (legenda genérica) | 205 | 186 | 0 | 0 | 4,6 | 0,68 |
| 14/10 | DefheX6vdJb | Foi só uma brincadeira e virou briga | 313 | 278 | 3 | 0 | 6,3 | 0,73 |
| 14/10 | DedRCpuurPT | Inteligência melhora ou piora o borderline? | 150 | 133 | 0 | 0 | 3,6 | 0,84 |
| 13/10 | Dece-XpuoRB | Fala se eu não tenho razão: triangulação | 207 | 175 | 0 | 0 | 4,2 | 0,75 |

### O que os números mostram (observação, não regra)

- Carrosséis: 12 mil a 69 mil views. Os três maiores: almoço de domingo (69.218), vazio do sábado (64.882), love bombing (64.644). Os mais novos ainda acumulam.
- Envios nos carrosséis: vazio (699) e love bombing (608) muito acima dos outros; almoço de domingo teve as maiores views e 190 envios.
- Reels: 34 a 20.754 views. Acima de 10 mil: fatos pra sair correndo (20.754), avó nervosa (14.156), cacto em vídeo (11.767), mil áudios (10.293). Onze Reels ficaram abaixo de 400 views.
- Nos Reels abaixo de 400 views, o pulo nos 3 primeiros segundos ficou entre 0,58 e 0,88. Nos quatro acima de 10 mil, entre 0,44 e 0,51. É correlação em 26 Reels, não causa: alcance baixo e pulo alto podem ter a mesma origem (distribuição para um público pior), e o tempo assistido depende da duração, que não veio.
- Pedido de COMEÇAR apareceu em três peças (avó, segundos, preciso de espaço). Desde 24/10 a regra dele é sem venda no orgânico.
- Publicação fora do tema em 22/10 (junta do cabeçote, 34 views). Perguntar se foi engano antes de tirar qualquer leitura da semana.
- Psicopata: 35.161 views e 236 envios no Windsor, coerente com os prints de 26/10 (34,7 mil, 233 envios).

### Perguntas em aberto

- Os Reels sem legenda própria ou com legenda genérica (Perder faz parte, Muros altos, Dependência emocional) foram feitos por ele, por equipe ou por ferramenta automática?
- Duração de cada Reel, para transformar tempo médio em percentual assistido.
