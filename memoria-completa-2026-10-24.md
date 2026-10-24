# Memória completa: Borderline Sem Estigma

Cópia de tudo o que está em `memoria/` no branch principal, gerada em 24/10/2026. Última atualização da memória: 24/10/2026 10:56 ("Memória: reação dele aos clipes da música e pedido de mais interface").

## Índice

1. Correções mais recentes (correcoes.md)
2. Aprendizados (aprendizados.md)
3. Pontos em aberto (a-decidir.md)
4. Conta e negócio (conta.md)
5. Já produzido (ja-produzido.md)
6. Padrão de efeitos de vídeo (efeitos-video-aprovados.md)
7. Análise de carrosséis v2 (dados/conclusoes-v2-2026-10-24.md)
8. Métricas de 56 posts (dados/insights-2026-10-24.csv)
9. Histórico de gravações da memória

---

## Registro de correções

Toda correção, rejeição ou aprovação nova do Dr. Fabio entra aqui na hora, antes de continuar o trabalho. Uma linha por item: data, o que foi feito, a frase dele. Quando a mesma lição aparecer duas vezes, suba para `aprendizados.md`.

- 2026-10-24: Claude disse que o Hindsight não compensava. Ele: "Oxi mas é exatamente oq eu precisos". Lição: o problema é perder o aprendizado entre sessões; memória é prioridade.
- 2026-10-24: "Você sempre esquece o aprendiAdo e volta em looping a de falas absolutamente genéricas e flop antes". Causa encontrada: aprendizados ficavam presos em branches que nunca entravam no principal.
- 2026-10-24: Reel Ninguém sabe da semana (HyperFrames). Ele: "Imagem cortada no começo", "Imagem ainda cortada olha as bolinhas no início". Causa: os círculos do diagrama passavam da borda do svg, que corta por padrão (overflow hidden). Claude entregou duas vezes sem ver, porque conferiu só miniaturas. Lição: antes de entregar vídeo, abrir o primeiro quadro em tamanho real e olhar cada elemento nas bordas; em svg, pôr overflow visible ou manter tudo dentro da caixa.
- 2026-10-24: Ele pediu b-roll rápido ("frames rápidos tipo de meio ou um segundo") a partir de vídeo ilustrado gerado no Higgsfield. Entraram só as cenas sem texto; as cenas com texto gerado por IA tinham erros de ortografia (REJEÇION, AMAÇA, SOCINNO) e ficaram de fora. Aguardando a reação dele.
- 2026-10-24: Ele perguntou "Não seria bom eu aparecer no gancho?". Claude respondeu que vale testar, com gravação de 4 s dizendo só a primeira frase. Sem decisão dele ainda.
- 2026-10-24: Skills de interface. Ele: "Eu quero tudo que melhore inter face, ui, etc" e "Prefira skills de fora (não as que criamos)". Instaladas 18 skills externas de UI em `.claude/skills/` (PR #10, merge feito por pedido dele). Nos Stories do mesmo dia: "Só imagens" (sem b-roll de vídeo).
- 2026-10-24: Música "Borderline, a intensa" (Suno, feita por ele). Claude fez três clipes em Remotion com gráficos de interface (fim, começo, meio; `videos/borderline-a-intensa/`). Depois do primeiro ele pediu "E mais ui interface": o padrão aprovado passa a incluir abas, toques na tela, avisos e telas de aplicativo. Ele: "Ficou bom né qual é o melhor". Claude rankeou o do começo (borderline em 1,3 s, tese da marca, mais interface). Ele: "Não concordo mas ok manda descrições". Não disse qual prefere nem o critério. Lição: antes de rankear versões, perguntar o critério dele ou entregar os três sem ranking; o critério "palavra borderline no primeiro segundo" não é o que decide para ele.

---

## Aprendizados com o Dr. Fabio

Correções, rejeições e aprovações dele, tiradas de 48 sessões entre 19/09 e 24/10/2026. As frases entre aspas são dele, copiadas como ele escreveu. Cada regra vem com a prova.

Isto vale junto com as preferências fixas dele (voz, título profissional, fontes). Quando uma correção daqui parecer bater com uma preferência fixa, siga a mais específica e avise.

### 1. Como responder

- Responda só o que ele perguntou, curto. "Não perguntei isso", "Só a fórmula", "Só fala OK", "mande escrito só".
- Quando ele perguntar qual trecho, o que ajustar ou onde colocar, responda em texto e não mexa em arquivo. "não muda o vídeo só vê qual trecho ponho", "só me fala oq ajusto aqui no CapCut".
- Sem ressalva de que não dá para prever. Compare com os posts gigantes dele e dê um veredito sincero, uma vez, antes de ele gravar ou postar. "Pule a parte de não é certeza já sei", "Consegue sim / É só fazer comparações", "Ficou bom? Sincero", "Brutalmente sincero".
- Avise todo limite técnico no começo, não aos poucos depois que ele já gravou. "eu pedi pra vc passo a paso e depois que gravo flopa".
- Decida e faça. "Decida tudo", "sim pra tudo só faz", "Vai logo".
- Faça o trabalho em vez de devolver para ele. "esse comando é impossível / Vou ficar horas".
- Entregue o arquivo pronto e usável: PNG separado um a um, texto escrito no chat, vídeo fechado. "Não quero github quero as imagens", "Mande imagens png separada uma a uma".
- Links: um por mensagem, senão só aparece a prévia de um.
- Na quantidade pedida. "16 imagens??? Pq tudo isso? / são 5 dias / Um por dia", "(máximo 4)".
- Opções de verdade diferentes, cada uma com por que pode funcionar e por que tende a não flopar. "Explica 1. Opções 2. Pq podem funcionar mto 3. Pq não tendem flop", "3 TOTALMWNRE diferentes".
- Não dê opinião moral ou estratégica que ele não pediu. Chamar o vídeo da Tina de algo que dilui a autoridade médica gerou "Vc foi homofóbico". "Esquece suas sugestões não vou seguir".
- Análise precisa de fundamento. "Tudo q vc falou não tem fundamento", "Faça funcionar e tenha embasamento técnico".
- Use a ferramenta que ele nomear: CutCraft, Remotion, GPT Image 2.5. "Cutcraft como eu pedi desde o início".
- Prefira skills profissionais de fora às que foram criadas aqui. "(não as que criamos)", "alguma skill que não formos nós que fizemos".

### 2. Nunca genérico, nunca repetido

O motivo central das reclamações.

- Clichê é rejeitado. "Ta ruim ta clichê", "Está mto clichê tente outros", "Todas vão flopar", "Não está uma bosta?".
- Não repita frase, gancho, sugestão ou música de uma rodada ou sessão anterior. "A mesma frase não / Sempre usa isso / Seja mais criativo", "Sempre a msm indicação? Não dá", "Fale outro diferente que não tenh nos que já fizemos", "Vc copiou".
- Revisão tem que mudar de verdade. "Vc mandou igual".
- Mas não estrague o que funcionava. Na revisão, mude a cena e não a frase boa. "é o gancho agora tá zoado", "Não dá pra deixar a anterior e mudar a cena só ?", "A outra tava melhor".
- Se o tema é bom, mantenha o tema e suba o nível. "Se aquele tema era bom mantém / Mas eu quero que seja bom como os grandes".
- Quando ele disser para não mudar o texto, não mude uma palavra. "SEM / UDAR NADA Q TÁ ESCRITO / MAS COM VISUAL MELHOR".
- Os "motores" antigos (conjuntos de regras) dele foram abandonados por ele mesmo. "Esquece meus motores estão me fazendo flopar". Não aplique fórmula às cegas. Isso inclui a "régua" e o MOTOR do branch arena.
- O eixo família está liberado desde 02/10. A proibição antiga (C1) foi suspensa por ele.
- Palavras que afastam: manipuladora, narcisista como rótulo, cura, transforme sua vida.

### 3. Capa e gancho

- A referência é o próprio post gigante dele. "Olha como eram as capas dos meus virais", "bom como os grandes", "Está lado a lado com meus gigantes / Então tem que ir pro feed".
- A regra dele: só vai pro feed o que fica lado a lado com os gigantes. Senão vai como teste ou não sai. "Senão eu vou no trial ou lixo".
- Imagem e frase precisam ter uma ligação que se entende de relance. "Tem que ter uma ligação genial que prenda institinvamente ao de olhar", "consonância da imagem com o texto", "bate olho entende", "Não é uma metáfora rápida".
- Gancho contraintuitivo e forte. O modelo que ele deu: "borderline adoece a família ou a família adoece o borderline?". "Quero outras opções mais fortes / Contraintuitivas".
- Nenhuma frase pode começar com pronome, sobretudo ele ou ela. "Não pode começar com pronome", "Audite para não ter nenhuma frase começando com ele ou ela".
- A palavra borderline vai na capa. "Postei mas não sei pq não tem borderline na capa".
- Linguagem neutra de gênero quando couber. "Faz neutro genero".
- No vídeo, o texto de abertura na tela não repete o gancho falado. "início viral texto na tela que prenda sem repetir o gancho".
- Ele desconfia de gancho pedido por fórmula. "sempre q Pedi isso deu merda". Gancho tem que nascer de cena ou contraste real.
- Português natural, nada que soe tradução do inglês. "tire 'da sala' nada a ver isso deve ser uma forma de falar em inglês traduzida".
- Nenhum ângulo que reforce estigma, soe ameaçador ou provoque briga. "Vai parecer q tô falando que borderline tem treco de pedir dinheiro", "parece que induz ameaçar", "esse final não tá legal vá dar briga".
- Sem drama e sem comédia sem querer. "Drama não", "o começo do um é levemente cômico".

### 4. Carrossel e imagem

- Carrossel sem fundo preto. "Não quero fundo preto", "Dispare sem esse estilo fundo preto".
- Legível. "Prexiso que fique mais legível". Quebra de linha ruim é erro: "A palavra 'ir' isolada ficou estranha".
- Menos informação por slide, padronizado, objetivo. "menos informação por slide e mais padronizado", "não está mto objetivo".
- No miolo, alternar tipografia pura, tipografia com imagem de apoio e tipografia presa a uma imagem, sempre com hierarquia visual. "oscilar entre tipografia, tipografia + imagem de apoio", "pra não ficar monótono". Em um slide, quebrar o tom ou as cores.
- Misturar fonte serifada com sem serifa. "Misturar uma serifada com não serifada".
- Criativo sem exagero. "Seja criativo sem exageros".
- Imagens: GPT Image 2.5, alta qualidade, 9:16 em Stories. "Gpt image 2.5 sunbust sempre alta qualidade".
- Nada de textura estranha, pele com cara de IA, rosto distorcido ou sangue. "sem deixar a imagem com textura estranha", "a textura das pessoas", "rosto vermelho distorcido", "O sangue não atrapalha?".
- Chega de mão e celular. "não aguento mais mão e celular". Sem motivo de eletrocardiograma.
- Use os estilos de referência que ele manda, um de cada, sem copiar o conteúdo deles e sem exagerar no uso. "Use os estilos q mandei um de cada", "sem considerar conteúdo deles", "Não precisa usar tanto q mandei".
- Stories de venda precisam de imagem, ícone ou gráfico, não só texto. "Não quero só texto na tela".
- Texto embutido na imagem gerada, não montado por cima depois. "montar flopa".
- Carrossel com no máximo 7 slides. Rejeitou um de 11: "muito slide".
- Capa concreta: cena, gesto, objeto ou número. Nada de sensação, paz ou caos. Rejeitou mulher de costas na cama com celular ("clichê") e aprovou rosto pintado em retrato a óleo.
- Sem frase entre aspas atribuída a alguém.
- Ele mede o post na primeira hora.

Estas cinco vêm de anotações de sessão, não de fala dele copiada inteira (branch `claude/install-arena-skill-6onf90`).

### 5. Vídeo

- Profissional, dinâmico, cinematográfico, sem exagero. "Está muito simples e pouco dinâmico e lento", "Precisa ser profissional mas não deixar assim", "Mais curto".
- Legenda: no máximo três palavras por vez, destaques maiores, sem quebrar feio, com hierarquia, destaques em vermelho e alternando serifada com sem serifa. "Três palavras por vez na legenda no máximo", "E destaques maiores", "A legenda pequena tudo errado também quebrando".
- Tipografia forte e movimento que desliza. "melhore a porra das topografias bold", "Tipografia e movimentos tem q deslizar".
- Efeitos sonoros baixos, e só os da biblioteca já extraída. "Sfx baixos", "só aqueles que já tínhamos extraído lembra?". Som fora de lugar ou piano sem ligação é erro. Impacto só com pedido.
- Padrão de edição aprovado: `memoria/efeitos-video-aprovados.md`. Use só ele, salvo pedido. "os únicos efeitos qu tenhamos guardados sejam os do vídeo que te mandei".
- Narração: não cortar o começo das palavras, tirar silêncio, voz natural e com ritmo. "Está cortando início da palavra e mto silêncio", "parece literalmente um robô", "sussurra as vezes fica mto teatral".
- CTA final só com imagem e efeito sonoro, sem narração, quando ele pedir assim.
- Respeite escolhas dele no material. "o corte é proposital".
- Vídeo vai sempre com legenda do post e capa. "Mande tbm descrição e Thumb".
- Arquivos acima de cerca de 30 MB não sobem no chat dele.
- Música para o Suno: um prompt de até 400 caracteres, com marcação de tempo, volume estável, nem triste nem pesada. "Tá mto triste quero algo mais presente", "Ficou mto pesado", "Coloque timestumps".

### 6. Sinais que ele mesmo deu sobre o que funcionou

Observação dele ou de post. Não é regra nem previsão.

- Reels com o rosto dele: ele afirma que flopam. "Tudo q aparece meu rosto flopa". Os dados de out/2026 mostram Reels recentes com bem menos views que os carrosséis (ver `conta.md`). Os dados não separam Reels com e sem rosto.
- Família e estigma é o tema que ele vê como viral. "Tem um vídeo que bombou disso".
- "Quero sumir" foi citado por ele como um viral dele.
- Aprovados: capa da boia; capa sépia "BORDERLINE NÃO PEGA / O ESTIGMA PEGA NA FAMÍLIA INTEIRA"; clipe com Remotion e gráficos de interface ("Nossa ficou mto bom"); vídeo vertical cinematográfico de 22/10 ("não está com cara de flopar").

### 7. Decisões de 24/10/2026

Ele aprovou com "Ok" as recomendações abaixo.

- Nenhuma frase começa com ele ou ela, nem capa, nem miolo, nem narração. Você é permitido.
- Fundo preto proibido só no carrossel. Vídeo e Stories podem usar fundo escuro, como o padrão do Protocolo (#0D0D0D).
- Vídeo: padrão de `efeitos-video-aprovados.md` (Montserrat ExtraBold no gancho), com serifada e sem serifa alternando nos destaques. Vermelho #CC0000. Efeitos sonoros sem grave, sem impacto e sem glitch, salvo pedido.
- Reel com o rosto dele: pergunte antes de propor. Os dados não separam Reel com e sem rosto; não afirme que o rosto é a causa.
- Título: médico, pós-graduado em psiquiatria, ou médico com foco em TPB. Nunca psiquiatra.
- COMEÇAR: no feed, comentar. Nos Stories, responder no story ou no direct.

---

## Pontos em aberto

Contradições ainda sem decisão do Dr. Fabio. Até ele decidir, registre aqui a regra provisória e pergunte quando a peça depender disso. Quando ele decidir, mova para `aprendizados.md` e apague daqui.

Nenhum ponto aberto. Os oito pontos de 24/10/2026 foram decididos e estão em `aprendizados.md`, seção 7.

---

## Conta e negócio

### Fatos informados pelo Dr. Fabio

- Protocolo 7 Dias: R$219 (12x R$21,90). Para quem mora com alguém com borderline. Um procedimento por dia. A pessoa com borderline não precisa assistir nem concordar. CTA: comentar COMEÇAR. Site: curso.drfabioschmidt.net. PDFs na Hotmart, para quem comprou.
- Livro "Quem sofre não escolhe como gritar": R$69.
- Guias interativos: só para clientes dos planos dele.
- Agenda do consultório com bastante horário livre (23/10). Objetivo atual dele: vender ("FOCO TOTAL / Preciso vender").
- Anúncios Meta que deram compra (23/10): estático minimalista "Tudo que voce fala" (2 compras) e vídeo "Minha filha" (2 compras). Público: mulheres de 35 a 65 anos e pais de adolescentes.
- Depoimento autorizado: uma mãe em outra cidade conduziu a filha numa crise por mensagem no celular.
- Conta de referência para efeitos: timelinestudios_official.
- Fatos pessoais para Stories: família, Deus, explicar e quebrar estigma, pescar, colecionar selos, barzinho com rock ou MPB.

### Mais fatos, de anotações antigas (branches lidos em 24/10)

- 105 mil seguidores em 12/10. Consulta R$700 (R$650 em outra tabela); pacotes R$2.200 e R$2.900. Atende também online.
- Protocolo 7 Dias, um por dia: frase de presença; limite sem briga; pausa de 20 minutos; pós-crise de 10 minutos; parar de discutir detalhe no auge; previsibilidade; autocuidado de quem cuida. Garantia de 7 dias. Checkout pay.hotmart.com/S104212285E. Preço riscado de R$297 nunca foi praticado.
- Sem cupom nem desconto nos anúncios. Ele mandou tirar o DESCONTO25 em 13/10.
- Livro: 2ª edição expandida de "Quando Escolher Não É Possível", 160 páginas, 21 capítulos. 11 vendas em 60 dias sem anúncio.
- Outros produtos: Protocolo da Crise R$27; Kit de Regulação R$27, para quem tem TPB.
- Anúncios, 90 dias pelo pixel: R$2.970 gastos, 13 compras, R$228 por compra. Empate em cerca de R$188 a R$195. Mulheres 45+: 8 compras a R$178. Homens: R$407 sem compra. Stories é o posicionamento mais barato (R$170). Em abril e maio: cerca de 48 compras a R$80, com "Você não está em paz" direto ao checkout.
- Campanha de 12 a 19/10: 3 compras a R$212. Melhor anúncio: L2 minimalista navy.
- Pixel 2562728947535171. Contas de anúncio: 1454243259689590 (Protocolo) e 2453219348224260 (livro, sem forma de pagamento em 20/10).
- Funil de Stories de 5 dias no ManyChat, com as palavras COMEÇAR, ANTES, DURANTE e DEPOIS, respondidas no story ou no direct.
- Leitura do Claude, não fato: o vazamento está na página de venda, onde 3% das visitas clicam em comprar.

### Dados de desempenho

Arquivos enviados por ele em 24/10/2026:
- `dados/insights-2026-10-24.csv`: 56 posts com métricas. Carrosséis e Reels.
- `dados/conclusoes-v2-2026-10-24.md`: análise de 8 carrosséis, com hipóteses e perguntas em aberto.

O que os arquivos mostram (fato, não regra):
- Carrosséis da base: 36 mil a 437 mil views. Maior: "Quieta na mesa" (437 mil). Depois "Três gerações" (232 mil), "Cacto" (134 mil).
- Reels de set e out/2026: 1,2 mil a 39 mil views. Exceção recente: Reel de 21/06/2026 sobre sumir e bloquear (100 mil). Reels de 2025 chegaram a 390 mil.
- "Quieta na mesa" teve o maior alcance e o menor ganho de seguidores entre os 6 com dado.
- Os 3 carrosséis com 2 mil salvamentos ou mais tratam origem e ambiente (genética, três gerações, cacto). Base pequena.

O histórico completo de 180 dias e as regras de leitura das métricas estão na skill `historico-borderline-180d`.

---

## Já produzido ou publicado

Antes de propor tema, confira aqui e no histórico de 180 dias. Trocar exemplo ou palavra sem mudar a explicação central é repetição. Fonte: anotações de branches antigos, lidas em 24/10/2026.

### Gigantes (carrosséis e imagem)

Alcance em 60 dias pelo Windsor, como registrado no branch `claude/install-arena-skill-6onf90`. Alcance não é visualização: `conta.md` traz views, que são outro número.

| Post | Alcance | Share |
|---|---|---|
| Quieta na mesa (DdnAOglFEm2) | 266.760 | 0,21% |
| Avó chorava trancada, três gerações (DdCcopoFHzy) | 140.163 | 2,89% |
| Semente e solo (DdJlwmYDlhM) | 66.868 | 3,19% |
| Adoece a família (Ddw88RTlInA) | 60.402 | 1,89% |
| Abandona antes (Dd2PA-JFGC7) | 56.269 | 2,10% |
| A crise tem 4 etapas (Dc6kv6jFGnK) | 55.366 | 2,83% |
| Me deixa em paz... por favor não vá (Dbvd7_9DgVd) | 49.315 | 3,22% |
| Lugar mais seguro (Dd42M-alGSN) | 46.528 ou 55.581, conflito no arquivo | 2,25% |
| Ciúme é medo de não bastar (DdNSIPdlNb2) | 21.778 | 3,26% |
| Imagem DcwqCf7O3QX | 221.974 | 0,21% |

Outros: Cacto (2.381 envios), Reação que parece justa (759 compartilhamentos em 13 dias), Disseram que é para sempre (342).

### Teses de carrossel e Reel já usadas

- Quieta na mesa, timidez na infância.
- Avó chamada de nervosa, três gerações.
- Não foi a semente, foi o solo.
- O borderline é um cacto.
- A crise tem 4 etapas.
- Me deixa em paz, por favor não vá.
- Ciúme é medo de não bastar.
- Quem mais teme o abandono abandona antes.
- Você é o lugar mais seguro que ele tem.
- Borderline adoece a família ou a família adoece o borderline?
- A criança que lia a casa.
- Banalizaram os diagnósticos.
- Vinte anos com o nome trocado.
- Mil dias engolindo o que doeu.
- O teste nunca acaba, visualizar e não responder.
- Duas mensagens: terminou e pediu pra voltar.
- Apagou a mensagem que mais precisava enviar (flopou, 01/10).
- A difícil da mesa, a única que marcou consulta (proposto 02/10).
- Borderline é perigoso; diagnóstico como acusação de maldade.
- Cobrar maturidade na crise piora.
- A reação que parece justa.
- Amar um borderline cansa.
- Bloqueio, sumiço e volta: borderline e narcisista.
- Hipersexualidade, os dois lados.
- A compulsão funciona, por isso repete.
- Quando ajudar piora (capa da boia, 22/10).
- Borderline não pega, o estigma pega na família (22/10).

Lote de estigmas de 22/10, roteiros prontos que podem não ter saído: mente, irmãos, dependência, contar o diagnóstico, fui machucado, toda raiva vira sintoma, adulto que não quer tratar, profissional que foge, filhos, se afastar sem ser vilão, chamar atenção, limite e ameaça. Arquivo: `roteiros/lote-estigmas-2026-10.md` no branch `claude/cool-fermat-at3p5v`.

### Vídeos feitos (out/2026)

- Ninguém sabe da semana: amigos há anos e nenhum sabe como foi a semana; borderline de alto funcionamento (nome informal, não é diagnóstico); uma pessoa, uma coisa pequena. Versão final narrada de 43 s com a voz clonada do Higgsfield, feita em 24/10 para sair como Reel teste. Branch `claude/nifty-hypatia-sj3sui`, pasta `videos/reel-ninguem-sabe-da-semana/renders/`. Ainda não publicado na data do registro.
- Irmãos: o filho que não dava trabalho. Parecer bem e estar bem são coisas diferentes. O MP4 de 20 s está corrompido na biblioteca e no branch de origem (`claude/cool-fermat-at3p5v`); precisa renderizar de novo.
- Identidade repetida: a identidade não some, se repete.
- Sensação de casa: nenhum lugar parece casa.
- Você não me ama: responder ao medo e manter o limite, sem listar provas.
- PCL-R: TPB sem TPA não chega perto do corte de psicopatia.
- Eu fico: limite sem abandono.
- Gasolina: explicar-se demais na briga alimenta a crise.
- Áudio depois da briga: mandar primeiro uma linha com o principal.
- Explica, não apaga; Emoção e escolha (Tomás de Aquino). Tese quase igual entre os dois.
- Raciocínio emocional: sentir prova que dói, não prova o que aconteceu.
- Borderline mente (noir): lembrar diferente não é mentir.
- Cérebro e neuroimagem: fora do feed.
- Anúncios do livro (duas leituras; mensagens às 02:47), consultas e pacotes, promo do Protocolo, tutorial do app.

Biblioteca com os MP4 finais de outubro: `biblioteca-videos/prontos/` no branch `claude/funny-davinci-239qh0` (LINKS.txt tem o link de cada arquivo).

Recursos já muito usados: pausa de 20 minutos (três vídeos e o dia 3 do Protocolo); mão e celular.

Reels de baixo alcance, para não reaproveitar sem mudar o ângulo: fica calma, mas ontem você conseguiu, supera, foi do nada, Rivotril, vasculhou o celular, manipulação como rótulo, gesso invisível.

---

## Padrão de efeitos — @drfabioschmidt

Este é o **único** padrão de efeitos de edição em uso. Ele foi extraído do vídeo
final aprovado "borderline x psicopata"
(Drive: `1p02HetQbymlbG4HTG4BI4FsHR8EGMN70`, versão corrigida:
`1aRD09eZDC-U7QVYuqpIhLzmN1fg_wIFs`).
Nenhum outro preset ou efeito deve ser usado sem pedido explícito.

### Formato
- Vertical 9:16, mesma resolução e fps do arquivo gravado.
- Duração definida pelo roteiro. Não cortar fala quando o pedido for "não mudar o tamanho".

### Cortes e zoom
- Cortes secos, sempre em cima dos cortes que já existem na gravação. Nunca deixar
  fragmento menor que ~1 s entre dois cortes ("retalho").
- Zoom punch leve (de 1,05× a 1,16×) aplicado a um trecho inteiro entre dois cortes,
  nas frases de impacto. O enquadramento fica um pouco acima do centro, para manter o rosto.

### B-roll
- Entra **por cima** da imagem, e a fala continua por baixo. O áudio do b-roll vai mudo.
- Cada inserção usa **uma única cena** do clipe, sem atravessar os cortes internos
  do b-roll gerado.
- Clima cinematográfico escuro e quente, com leve redução de saturação.
- Se o b-roll for mais lento que o vídeo (24 fps → 30 fps), recriar os quadros
  intermediários para o movimento não trepidar.

### Textos na tela
- **Gancho:** 2 ou 3 linhas em CAIXA ALTA, branco, negrito (Montserrat ExtraBold),
  com sombra leve, no terço superior. As linhas aparecem juntas.
  Exemplo: `FEZ ALGUÉM CHORAR. / FOI PESQUISAR / SE ERA PSICOPATA.`
- **Sobre b-roll:** palavra-chave grande em CAIXA ALTA no centro, com complemento
  pequeno logo abaixo. Exemplos: `TRAVA` + `por sentir demais`;
  `tentando` / `não` / `DESMONTAR`.
- Frase de impacto sobre o rosto vai no terço superior, nunca em cima da boca
  ou do microfone.
- Nada nos 20% de baixo nem na lateral direita (área dos botões do Instagram).

### Transições
- Flash branco curto (~0,1 s) na abertura e na saída do primeiro b-roll.
- Fade para preto curto no último ~0,1 s do vídeo.
- **Não usar** quadros pretos dentro do vídeo. No original, eles eram um erro e
  foram removidos na versão corrigida.

### Som
- Whoosh curto e baixo (0,22 s, pico em −27 dBFS) na entrada de cada b-roll.
- Clique seco e baixo (12 ms, pico em −26 dBFS) nos zooms.
- Sem graves ("boom") nem efeitos chamativos.
- Volume final normalizado em **−14 LUFS**, pico ≤ −1 dBFS.

### Checagem antes de entregar
1. Conferir quadro a quadro que não há quadros pretos ou brancos indesejados.
2. Conferir que nenhum trecho entre cortes tem menos de ~1 s.
3. Medir o volume (−14 LUFS).
4. Ler cada texto na tela: ortografia, posição e se não cobre o rosto.

---

## Conclusões do Borderline Sem Estigma

### Onde a conta está agora

- O documento agora se baseia em 8 posts. Todos são carrosséis.
- Todos os prints e insights foram enviados em 2026-10-19. Os posts têm idades muito diferentes, então os totais não são comparáveis de forma direta.
- Datas de publicação conhecidas:
  - "A genética entrega a semente": 2025-09-11.
  - Carrossel sobre convivência ("você é o lugar mais seguro que ele tem"): 29/set. Os dados acumulados registram 2025-09-29. O ano é incerto, porque o gráfico de insights vai de 29/set até cerca de 20/out.
  - "O borderline é um cacto": 2026-05-08.
  - "O bloqueio. O sumiço. A volta.": por volta de 2026-10-12, cerca de 1 semana antes dos prints. É o post mais recente da base.
  - Os outros 4 posts não têm data registrada.
- O relatório do post sobre hipersexualidade cita o perfil como @drfabioschmidt.
- 3 posts aparecem marcados como "Conteúdo de IA": bloqueio, mesa e hipersexualidade. Nos outros 5, a marcação não foi informada.
- Ainda não há dados gerais da conta. Faltam total de seguidores, alcance médio e a lista completa de posts.
- 8 posts dão uma primeira visão comparativa. Ainda é pouco para falar em padrão da conta. Todos são carrosséis, então não há comparação entre formatos.

### O que os números mostram

Base: 8 carrosséis. Dados vistos até 2026-10-19. "n/d" significa que o dado não aparece.

| Post | Publicado | Visualizações | Alcance ou visualizadores | Curtidas | Comentários | Salvamentos | Envios | Reposts | Visitas ao perfil | Novos seguidores |
|---|---|---|---|---|---|---|---|---|---|---|
| O bloqueio. O sumiço. A volta. | ~2026-10-12 | 45.933 | n/d | 1.216 | 43 | 959 | 441 | 92 | 263 | 132 |
| Lugar mais seguro (convivência) | 29/set, ano incerto | 108.933 | 69.483 visualizadores | 4.104 | 65 | 940 | 1.784 | 366 | 223 | 90 |
| Quieta na mesa | n/d | 437.430 | 289.910 visualizadores | 12,6 mil | 56 | 1,1 mil | 607 | 786 | 427 | 72 |
| Hipersexualidade | n/d | 119.115 | 61.124 alcance | 4.256 | 97 | 1.400 | 1.201 | 468 | 480 | 151 |
| A genética entrega a semente | 2025-09-11 | 113.574 | 65.041 alcance | 4.860 | 203 | 2.000 | 514* | n/d | 677 | 418 |
| Três gerações (avó) | n/d | 232.217 | 138.038 alcance | 8.368 | 359 | 2.300 | 4.100* | n/d | 934 | 524 |
| A compulsão funciona | n/d | 78.200 | n/d | 3.036 | 315 | n/d | 919* | n/d | n/d | n/d |
| O borderline é um cacto | 2026-05-08 | 134.599 | n/d | 5.608 | 314 | 2.000 | 2.381 | n/d | 994 | n/d |

*Nesses 3 posts, os dados trazem só "compartilhamentos". Não dá para saber se o número é de envios, de reposts ou da soma.

Observações sobre a qualidade dos dados:
- Bloqueio: 45,8 mil visualizações no print do feed e 45.933 nos insights. Curtidas: 1.216 no feed e cerca de 1.200 nos insights. A diferença é de arredondamento ou do momento do print.
- Quieta na mesa: os dados acumulados registram 786 "compartilhamentos". O relatório mostra que 786 são repostagens e que os envios são 607. A tabela usa a divisão do relatório.
- Cacto: 134 mil visualizações no print e 134.599 nos insights. 2,4 mil compartilhamentos nos insights e 2.381 envios no print. A diferença é de arredondamento.
- Vários salvamentos vêm arredondados pelo Instagram (1,1 mil, 2 mil). Comparações finas entre eles não são confiáveis.

Visualizações (8 posts, dados até 2026-10-19):
- Fato: o maior número é o de "Quieta na mesa" (437.430). O segundo é "Três gerações" (232.217).
- Fato: o menor é o de "O bloqueio" (45.933). Ele tinha cerca de 1 semana no ar, então a idade pesa nessa comparação.
- Fato: "O bloqueio" ficou em cerca de 2,6 vezes o "post típico" da conta no gráfico dos insights. O carrossel sobre convivência ficou acima da linha do post típico de 29/set até cerca de 20/out. O Instagram não mostra o que define esse post típico.
- Fato: em "Quieta na mesa", o gráfico mostra um salto inicial forte. Depois o crescimento fica lento e quase estável até 14/out.

Alcance e visualizadores (5 posts, dados até 2026-10-19):
- Alcance aparece em 3 posts: hipersexualidade (61.124), genética (65.041) e três gerações (138.038).
- Em 2 posts, o Instagram mostra "visualizadores": convivência (69.483) e mesa (289.910). O documento mantém os dois nomes separados até confirmar que medem a mesma coisa.
- Fato: visualizações por conta, nos 3 posts com alcance: hipersexualidade 1,95, genética 1,75, três gerações 1,68. Nos 2 posts com visualizadores: convivência 1,57, mesa 1,51.

Origem das visualizações (1 post, bloqueio, dados até 2026-10-19):
- 92,2% vieram do Feed. Não há esse dado para os outros posts.

Salvamentos (7 posts com dado, dados até 2026-10-19):
- Fato: os 3 posts com 2.000 salvamentos ou mais são genética (2.000), três gerações (2.300) e cacto (2.000). Os 3 tratam origem ou ambiente.
- Salvamentos por mil visualizações: bloqueio 20,9, genética 17,6, cacto 14,9, hipersexualidade 11,8, três gerações 9,9, convivência 8,6, mesa 2,5.
- Fato: "Quieta na mesa" teve o maior número de visualizações e a menor proporção de salvamentos entre os 7 posts.

Comentários (8 posts, dados até 2026-10-19):
- Fato: 4 posts passaram de 200 comentários: três gerações (359), compulsão (315), cacto (314) e genética (203).
- Fato: os outros 4 ficaram abaixo de 100: hipersexualidade (97), convivência (65), mesa (56) e bloqueio (43).
- Fato: em todos os 7 posts com dado de salvamentos, os comentários ficaram abaixo dos salvamentos. Em todos os 8 posts, os comentários ficaram abaixo dos compartilhamentos ou envios.
- O cacto pede comentário com a palavra-chave CACTO. Parte dos 314 comentários pode ser só a palavra-chave. Os dados não mostram quantos.

Envios (5 posts com envios confirmados, dados até 2026-10-19):
- Cacto 2.381, convivência 1.784, hipersexualidade 1.201, mesa 607, bloqueio 441.
- "Três gerações" teve 4.100 compartilhamentos, o maior número da base. O tipo não foi confirmado.

Efeito no perfil (dados até 2026-10-19):
- Visitas ao perfil (7 posts): a maior foi a do cacto (994). A menor foi a do carrossel sobre convivência (223).
- Novos seguidores (6 posts): três gerações 524, genética 418, hipersexualidade 151, bloqueio 132, convivência 90, mesa 72.
- Novos seguidores por mil visualizações (6 posts): genética 3,7, bloqueio 2,9, três gerações 2,3, hipersexualidade 1,3, convivência 0,8, mesa 0,16.
- Fato: "Quieta na mesa" teve o maior número de visualizações e o menor número de novos seguidores entre os 6 posts com dado.
- Toques no link da bio: 7 no carrossel sobre convivência. Não há esse dado para os outros posts.

Outras métricas:
- O cacto registra 10.998 "interações" nos insights. O Instagram não detalha como soma esse número. Ele não é igual à soma de curtidas, comentários, envios e salvamentos.

Métricas que não aparecem nos dados:
- Alcance em 3 posts (bloqueio, compulsão, cacto). Visualizações não são alcance.
- Retenção por slide em todos os posts.
- Divisão entre seguidores e não seguidores em todos os posts.
- Novos seguidores do cacto e da compulsão.
- Salvamentos da compulsão.

### Formatos

- Carrossel: 8 posts (dados até 2026-10-19). Não há outro formato para comparar.
- Número de slides conhecido em 4 posts: bloqueio 8, convivência 9, mesa 7 imagens, hipersexualidade 7. Nos outros 4, não foi informado.
- Estéticas registradas:
  - Bloqueio: estética de cartaz com tipografia grande.
  - Quieta na mesa: estilo ilustrado, no formato lado a lado de antes e depois. A mesma cena aparece na infância e na vida adulta (mesa, janela com chuva, espelho, cama).
  - Cacto: metáfora visual do cacto, do solo infértil, dos espinhos e da flor.
  - Os outros posts não têm a estética descrita.
- "Conteúdo de IA": marcado em 3 posts (bloqueio, mesa, hipersexualidade). Não informado nos outros 5.

Curtidas por slide, 2 posts (dados até 2026-10-19):
- Bloqueio: slide 1 com 625, último slide com 170, slides do meio entre 61 e 103.
- Convivência, a partir do primeiro slide visível: 2,6 mil, 462, 88, 164, um slide não visível, 106, 108, 140 e 321 no último.
- Fato: nos 2 posts, o primeiro slide concentrou mais curtidas. No bloqueio, o último veio em segundo. Na convivência, o último veio em terceiro, atrás do slide 2.

Curtida por slide não é retenção. Ela não mostra quantas pessoas viram cada slide. Ela só mostra onde as pessoas curtiram.

Hipótese: estética de cartaz com tipografia grande pode favorecer a leitura. Só 1 post tem essa estética descrita, então nada está comprovado.

### Temas, ganchos e aberturas

Temas (8 posts, dados até 2026-10-19):
- Origem e ambiente, 3 posts: genética (semente e solo), três gerações (avó) e cacto (solo infértil e espinhos). Os 2 posts com metáfora de planta (genética e cacto) usam a mesma imagem do solo.
- Comportamentos do borderline, 3 posts: bloqueio, sumiço e volta; compulsão; sexualidade.
- Quem convive com borderline, 1 post: "você é o lugar mais seguro que ele tem".
- Experiência de isolamento lida como timidez, 1 post: quieta na mesa.

Ganchos e aberturas registrados:
- Bloqueio, comparação entre transtornos: "O bloqueio. O sumiço. A volta." e "Borderline e narcisista fazem igual. Não pelo mesmo motivo."
- Convivência, promessa a quem convive: "se o BORDERLINE desaba na sua frente, VOCÊ É O LUGAR MAIS SEGURO QUE ELE TEM". Os dados acumulados escrevem "desaba". O relatório escreve "desabafa". O texto exato precisa ser conferido.
- Mesa, cena concreta: slide 1 "Eu era a única cadeira vazia da mesa." A legenda começa com "Manda pra quem te viu quieta na mesa e achou que era timidez…".
- Hipersexualidade, negação de estereótipo: "Borderline é hipersexual" riscado, seguido de "A outra ninguém sabe nomear". A legenda começa com "A mesma pessoa que passa meses sem conseguir ser tocada é a que aceita qualquer toque numa noite ruim…".
- Genética, metáfora: "A genética entrega a semente."
- Três gerações, cena concreta e familiar: "Sua avó chorava trancada no quarto. Chamaram de nervosa."
- Compulsão, afirmação contraintuitiva: "A compulsão do borderline funciona. Por isso você repete."
- Cacto, metáfora com promessa de mudança de olhar: "O BORDERLINE É UM CACTO. Quando entender por quê, nunca mais vai olhar pro transtorno do mesmo jeito." e "O mundo só vê o espinho."

Estrutura vista no bloqueio (slides 1 a 4 de 8):
- Slide 2: simulação de conversa com "Você foi bloqueado" e, dois dias depois, "oi. bom dia".
- Slide 3: o impulso como ponto em comum.
- Slide 4: a frieza e a falta de empatia como o que não é comum.
- Slides 5 a 8: conteúdo não visto.

Estrutura vista na hipersexualidade (7 slides):
- Slide 2: uma parte evita o sexo completamente, outra usa como anestesia.
- Slide 4: "as coisas no borderline tendem a ser 8 ou 80".
- Slide 5: maior probabilidade de sofrer assédio e abuso, com a frase "tem gente que se aproveita disso".
- Slides 3, 6 e 7: conteúdo não registrado.

Chamadas para ação (CTA) registradas:
- Cacto: o slide final pede comentar a palavra-chave CACTO, salvar e enviar a quem "só vê os espinhos". É um CTA triplo.
- Mesa: a legenda abre pedindo envio ("Manda pra quem…").
- Nos outros 6 posts, o CTA não foi registrado.

Fato: os 2 posts com pedido explícito de envio registrado (cacto e mesa) tiveram 2.381 e 607 envios. Isso não mostra efeito do CTA.

Hipótese: um gancho que compara borderline e narcisismo e traz uma situação reconhecível, como o bloqueio e a volta, pode ajudar a explicar os 441 envios do bloqueio. Os dados não confirmam isso.

### Teses já publicadas

Registro do que cada post afirma (8 posts, dados até 2026-10-19). O desempenho de um post não prova que a tese dele está certa.

O bloqueio. O sumiço. A volta. (~2026-10-12):
- Borderline e narcisismo podem levar ao mesmo comportamento visível: bloquear, sumir e voltar. A motivação é diferente.
- O ponto em comum é o impulso. O slide 3 cita estudos com escala de psicopatia em que pessoas com borderline pontuam alto na parte de impulsividade.
- O que não é comum é a frieza e a falta de empatia. Segundo o slide 4, pessoas com borderline pontuam baixo ou não pontuam nessa parte.
- Teses dos slides 5 a 8: não registradas, porque esses slides não foram vistos.
- As referências dos estudos citados no slide 3 não aparecem nos prints.

Lugar mais seguro (29/set, ano incerto):
- Se o borderline desaba ou desabafa na frente de alguém, essa pessoa é o lugar mais seguro que ele tem.
- Quem mais ama o borderline costuma ver a versão que ninguém mais vê.

Quieta na mesa (data não registrada):
- O post sugere que a quietude vista como timidez pode ter outro sentido, mostrando a mesma cena na infância e na vida adulta.
- O texto dos slides além do slide 1 não foi registrado.

Hipersexualidade (data não registrada):
- O estereótipo "borderline é hipersexual" mostra só um lado. Existe outro que ninguém sabe nomear.
- Uma parte das pessoas com borderline evita o sexo completamente. Outra usa o sexo como anestesia.
- As coisas no borderline tendem a ser "8 ou 80".
- Pessoas com borderline têm maior probabilidade de sofrer assédio e abuso. As referências não aparecem nos dados.

A genética entrega a semente (2025-09-11):
- A genética entrega a semente.
- Não foi a semente que veio com defeito. Foi o solo que tentou podar a raiz.

Três gerações (data não registrada):
- O sofrimento que foi chamado de "nervosa" na avó pode ser a mesma dor que aparece em três gerações.

A compulsão funciona (data não registrada):
- A compulsão do borderline funciona, e por isso a pessoa repete.
- O alívio existe, dura dez minutos e custa culpa.

O borderline é um cacto (2026-05-08):
- O borderline é comparado a um cacto. Os espinhos são uma defesa criada por um ambiente sem previsibilidade, segurança e validação.
- A metáfora do solo infértil, dos espinhos e da flor apresenta o borderline como autoproteção, não como defeito.
- "TPB não é caráter. Isso tem tratamento."
- O cacto pode florescer.

### Hipóteses em teste

Nenhuma está confirmada. Cada uma diz em quantos posts se apoia. Dados até 2026-10-19.

- Hipótese: o enquadramento de origem e ambiente (genética, gerações, solo) se associa a mais salvamentos. Base: os 3 posts com 2.000 salvamentos ou mais são desse tema, em 7 posts com dado. Pode ser coincidência ou efeito da idade dos posts.
- Hipótese: ganchos que comparam borderline com outro transtorno conhecido, como narcisismo, geram mais envios do que ganchos sobre borderline sozinho. Base: 1 post com comparação. Esse post teve o menor número de envios entre 5 posts com envios confirmados. Ele também era o mais novo. Os dados atuais não apoiam a hipótese, mas não a descartam.
- Hipótese: abrir com uma situação concreta e reconhecível ajuda o post a ser enviado. Base: 3 posts com cena concreta no gancho (bloqueio, mesa, três gerações). Os envios variam muito entre eles, e em 1 deles o tipo do compartilhamento não foi confirmado.
- Hipótese: conteúdo voltado a quem convive com borderline gera muitos envios. Base: 1 post (convivência, 1.784 envios).
- Hipótese: o CTA triplo do cacto (comentar CACTO, salvar, enviar) ajudou a somar comentários, salvamentos e envios. Base: 1 post com CTA triplo. Sem um post parecido sem CTA, não dá para separar o efeito.
- Hipótese: posts com muito alcance fora da base, como "Quieta na mesa", convertem pouco em seguidores. Base: 1 post com 72 novos seguidores para 289.910 visualizadores. A divisão entre seguidores e não seguidores não aparece nos dados.
- Hipótese: ganchos que negam um estereótipo ("é X" riscado) favorecem envios. Base: 1 post (hipersexualidade, 1.201 envios).
- Hipótese: o tema de sexualidade e abuso gera identificação pessoal. Base: 1 post e 1 comentário visível.
- Hipótese: estética de cartaz com tipografia grande favorece a leitura do carrossel. Base: 1 post.
- Hipótese: o primeiro slide recebe mais curtidas porque mais pessoas o veem, e não necessariamente porque é o melhor slide. Base: 2 posts com o mesmo padrão. Sem dados de retenção, não dá para separar as duas coisas.

### Perguntas em aberto e o que falta medir

Sobre a conta:
- Qual é o total de seguidores e o alcance médio? Sem isso, não dá para saber se os posts desta base são típicos ou exceções.
- Os 8 posts são uma amostra dos melhores ou a produção completa de um período? Isso muda a leitura de tudo acima.
- Qual é o ano do carrossel publicado em 29/set? A data registrada é 2025-09-29, mas o gráfico vai até cerca de 20/out.
- Quais são as datas de publicação dos 4 posts sem data?
- O que o Instagram considera o "post típico" usado nos gráficos? Vale anotar o valor de referência.

Sobre métricas:
- Qual foi o alcance do bloqueio, da compulsão e do cacto?
- "Visualizadores" e "alcance" são a mesma métrica nos insights da conta? Vale confirmar antes de juntar os 5 posts.
- Quanto do alcance de cada post veio de quem não segue a conta?
- Qual é a retenção por slide? Quantas pessoas chegaram ao último slide de cada post?
- Nos posts genética, três gerações e compulsão, os "compartilhamentos" são envios, reposts ou a soma?
- Quantos novos seguidores o cacto e a compulsão trouxeram? Quantos salvamentos a compulsão teve?
- Como comparar posts de idades diferentes? Vale anotar as métricas de cada post em um mesmo prazo, por exemplo 7 e 30 dias após a publicação.

Sobre conteúdo:
- O que dizem os slides 5 a 8 do bloqueio e os slides não registrados dos outros posts?
- O texto exato do carrossel sobre convivência é "desaba" ou "desabafa"?
- Quais estudos o bloqueio cita no slide 3? Qual é a base da afirmação sobre assédio e abuso no post de hipersexualidade? Vale registrar as referências para revisar e reutilizar com precisão.
- Os posts de origem e ambiente dizem "não foi a semente, foi o solo". Como o público de familiares recebe essa ideia? Vale observar se ela é lida como culpa da família, já que a conta também fala com quem convive.
- Como o público com borderline recebe comparações com narcisismo e psicopatia? Para uma conta com proposta sem estigma, vale observar nos comentários e nas mensagens se a comparação reduz ou reforça o estigma.
- No post de hipersexualidade, uma seguidora fala em sentir nojo de si "após a mania passar". Mania é um termo ligado ao transtorno bipolar. Vale observar se parte do público confunde os dois quadros. Comentários com sofrimento intenso pedem resposta cuidadosa e, quando houver sinal de risco, indicação de ajuda, como o CVV (188).
- A marcação "Conteúdo de IA" afeta a distribuição ou a confiança do público? Ela foi informada em só 3 posts. Falta saber se os outros 5 também têm a marcação.

Sobre comentários:
- O que dizem os comentários de cada post? Eles indicam identificação, discordância ou dúvidas?
- No cacto, quantos dos 314 comentários são só a palavra-chave CACTO?

Para testar as hipóteses, faltam:
- Posts com e sem CTA de palavra-chave, com temas parecidos.
- Mais posts com comparação entre transtornos, medidos no mesmo prazo que os outros.
- Mais posts de origem e ambiente e de outros temas, para ver se a diferença em salvamentos se mantém.
- Formatos além do carrossel, como Reels ou post único.
- Posts com estéticas diferentes e o mesmo tipo de tema.

### Registro de mudanças

- 2026-10-19 (segunda versão): Base ampliada de 1 para 8 posts. Entraram 7 carrosséis dos dados acumulados: convivência, quieta na mesa, hipersexualidade, genética, três gerações, compulsão e cacto. Os 3 pontos da novidade descrevem o mesmo carrossel do cacto e foram tratados como 1 post só, porque título, metáfora e métricas coincidem (134 mil e 134.599 visualizações, 2,4 mil e 2.381 envios). Mudanças em conclusões anteriores: (1) saiu a frase de que não havia histórico de posts e de que nada servia como comparação, porque agora há 8 posts; continua sem dados gerais da conta. (2) A hipótese de que comparar borderline com outro transtorno gera mais envios foi mantida, mas marcada como sem apoio nos dados atuais, porque o único post com comparação teve o menor número de envios entre 5 posts com envios confirmados; a idade de cerca de 1 semana desse post foi registrada como ressalva. (3) A hipótese de que explicar uma diferença gera mais salvamentos do que comentários foi retirada, porque salvamentos ficaram acima dos comentários em todos os 7 posts com dado, de temas variados; o padrão não é específico desse tipo de conteúdo. (4) O padrão de mais curtidas no primeiro slide passou a se apoiar em 2 posts. Divergências registradas: em "Quieta na mesa", os 786 "compartilhamentos" dos dados acumulados são repostagens, e os envios são 607; no carrossel sobre convivência, o texto aparece como "desaba" e "desabafa"; o ano de publicação desse carrossel (29/set) é incerto. Novas hipóteses: origem e ambiente com mais salvamentos, CTA triplo, conteúdo para quem convive, baixa conversão em seguidores com alcance amplo e gancho que nega estereótipo.
- 2026-10-19: Primeira versão do documento. Base: envio de 2026-10-19 com 12 prints e relatório de 1 carrossel ("O bloqueio. O sumiço. A volta."). Os 3 registros de post do envio foram unificados como o mesmo post, porque título, tema e métricas coincidem. As pequenas diferenças (45,8 mil e 45.933 visualizações, 1.216 e cerca de 1.200 curtidas) foram registradas como arredondamento ou diferença de momento do print. Nenhuma conclusão anterior foi alterada, porque não havia versão anterior.
---

## Métricas de 56 posts (insights-2026-10-24.csv)

| titulo | formato | data | visualizacoes | alcance | nao_seguidores_pct | compartilhamentos | salvamentos | comentarios | curtidas | seguidores | visitas_perfil | interacoes | tempo_medio_s | pulo_pct | duracao_s | atualizado |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| O BLOQUEIO. O SUMIÇO. A VOLTA. Borderline e narcisista fazem igual. Não pelo mesmo motivo. | Carrossel |  | 45933 | 41493 |  | 445 | 970 | 43 | 1200 | 135 | 263 |  |  |  |  | 2026-10-19 |
| se o BORDERLINE desaba na sua frente, VOCÊ É O LUGAR MAIS SEGURO QUE ELE TEM. / Quem mais ama o borderline costuma ver a versão que ninguém mais vê… | Carrossel | 2025-09-29 | 108000 | 71639 |  | 1790 | 950 | 65 | 4104 | 90 | 223 |  |  |  |  | 2026-10-19 |
| Manda pra quem te viu quieta na mesa e achou que era timidez… (slide 1: "Eu era a única cadeira vazia da mesa.") | Carrossel |  | 437000 |  |  | 786 | 1100 | 56 | 12600 | 72 | 427 |  |  |  |  | 2026-10-19 |
| A mesma pessoa que passa meses sem conseguir ser tocada é a que aceita qualquer toque numa noite ruim… (carrossel: Prazer. Aprovação. Conexão. Por pouco tempo.) | Carrossel |  | 119115 | 61124 |  | 1201 | 1400 | 97 | 4256 | 151 | 480 |  |  |  |  | 2026-10-19 |
| A genética entrega a semente. / Não foi a semente que veio com defeito. Foi o solo que tentou podar a raiz. | Carrossel | 2025-09-11 | 113574 | 70747 |  | 2243 | 2077 | 203 | 4860 | 418 | 677 |  |  |  |  | 2026-10-19 |
| Sua avó chorava trancada no quarto. Chamaram de nervosa. / Três gerações. A mesma dor. (BORDERLINE) | Carrossel |  | 232217 | 141469 |  | 4118 | 2347 | 359 | 8368 | 524 | 934 |  |  |  |  | 2026-10-19 |
| A compulsão do borderline funciona. Por isso você repete. / O alívio existe, dura dez minutos e custa culpa. | Carrossel |  | 78200 | 40749 |  | 919 | 982 | 315 | 3036 | 95 |  |  |  |  |  | 2026-10-19 |
| O BORDERLINE É UM CACTO. Quando entender por quê, nunca mais vai olhar pro transtorno do mesmo jeito. / O mundo só vê o espinho. | Carrossel | 2026-05-08 | 134599 | 75663 |  | 2381 | 2000 | 314 | 5608 | 284 | 994 | 10998 |  |  |  | 2026-10-19 |
| Dizem por aí que o borderline é apenas hipersexual | Reel | 2026-10-08 | 39017 | 27013 |  | 981 | 1023 | 60 | 2453 |  |  |  |  |  | 67 | 2026-10-19 |
| Por que quem tem borderline não consegue deixar uma injustiça passar? | Reel | 2026-10-09 | 34680 | 24957 |  | 727 | 618 | 61 | 1618 |  |  |  |  |  | 44 | 2026-10-19 |
| Quem tem transtorno da personalidade borderline costuma ouvir que reage com exagero | Reel | 2026-10-05 | 33400 | 28088 |  | 1037 | 683 | 40 | 1641 |  |  |  |  |  | 67 | 2026-10-19 |
| Como os traços de borderline mudam com a idade | Reel | 2026-10-11 | 28506 | 17281 |  | 330 | 422 | 78 | 870 |  |  |  |  |  | 25 | 2026-10-19 |
| Por que o borderline manda tanto áudio depois de uma briga? | Reel | 2026-10-16 | 11120 |  |  |  |  | 19 | 472 |  |  |  |  |  | 33 | 2026-10-19 |
| Você já se olhou no espelho e perguntou: eu sou assim? | Reel | 2026-10-13 | 1804 |  |  |  |  | 4 | 78 |  |  |  |  |  | 38 | 2026-10-19 |
| ESTABILIZADOR NÃO FUNCIONA PRA BORDERLINE? | Reel | 2026-10-12 | 17829 | 11508 |  | 139 | 226 | 71 | 882 |  |  |  |  |  | 50 | 2026-10-19 |
| Cobrar maturidade na crise piora o borderline | Reel | 2026-10-06 | 10621 | 8386 |  | 107 | 118 | 12 | 464 |  |  |  |  |  | 44 | 2026-10-19 |
| borderline UMA PIADA APAGOU MESES DE AMOR | Reel | 2026-10-03 | 21976 | 4704 |  | 50 | 81 | 13 | 420 |  |  |  |  |  | 35 | 2026-10-19 |
| BORDERLINE: TERMINA E 1 MINUTO DEPOIS IMPLORA PRA VOLTAR | Reel | 2026-10-01 | 15833 | 6238 |  | 73 | 71 | 20 | 540 |  |  |  |  |  | 39 | 2026-10-19 |
| FEZ ALGUÉM CHORAR. FOI PESQUISAR SE ERA PSICOPATA. | Reel | 2026-09-28 | 6734 | 5477 |  | 33 | 57 | 9 | 244 |  |  |  |  |  | 20 | 2026-10-19 |
| PARECE QUE EU PIORO SE TENTAM ME AJUDAR | Reel | 2026-09-24 | 4357 | 3847 |  | 19 | 41 |  |  |  |  |  |  |  | 41 | 2026-10-19 |
| BORDELINE O LUTO POR QUEM AINDA NÃO FOI | Reel | 2026-09-22 | 7939 | 7036 |  | 80 | 129 | 18 | 408 |  |  |  |  |  | 44 | 2026-10-19 |
| BORDERLINE PRECISA FICAR SOZINHO? | Reel | 2026-09-18 | 15205 | 13489 |  | 213 | 321 | 38 | 893 |  |  |  |  |  | 59 | 2026-10-19 |
| borderline 5 frases da infância que você ainda OBEDECE | Reel | 2026-09-16 | 4874 | 4655 |  | 70 | 78 | 7 | 371 |  |  |  |  |  | 54 | 2026-10-19 |
| Amar alguém com borderline é uma das experiências mais difíceis de se viver | Reel | 2026-09-15 | 28676 | 46851 |  | 4167 | 1135 | 42 | 2159 |  |  |  |  |  | 56 | 2026-10-19 |
| BORDERLINE E TPM A SEMANA QUE PARECE VOLTAR À ESTACA ZERO | Reel | 2026-09-11 | 6713 | 6288 |  | 129 | 103 | 24 | 422 |  |  |  |  |  | 41 | 2026-10-19 |
| A dor que o borderline não consegue esquecer | Reel | 2026-09-09 | 22305 | 23592 |  | 738 | 477 | 88 | 1525 |  |  |  |  |  | 33 | 2026-10-19 |
| EU SUMI DENTRO DO MEU LAUDO | Reel | 2026-09-07 | 4434 | 4157 |  | 37 | 32 | 7 | 183 |  |  |  |  |  | 39 | 2026-10-19 |
| Você fica calculando quais palavras dizer, pra no fim ela ouvir só o que ela quer | Reel | 2026-09-03 | 1233 |  |  |  |  | 1 | 39 |  |  |  |  |  | 35 | 2026-10-19 |
| O borderline mais grave que eu já atendi nunca faltou no trabalho | Reel | 2026-09-01 | 18209 | 17335 |  | 304 | 247 | 32 | 1114 |  |  |  |  |  | 33 | 2026-10-19 |
| Existe uma pessoa que consegue destruir o seu dia inteiro sem fazer nada | Reel | 2026-08-28 | 19568 | 27829 |  | 834 | 587 | 127 | 1159 |  |  |  |  |  | 31 | 2026-10-19 |
| Nunca diga essa frase DESSE JEITO pro borderline | Reel | 2026-08-16 | 4565 |  |  |  |  | 3 | 202 |  |  |  |  |  | 41 | 2026-10-19 |
| Na crise, ele não deixa de te ouvir porque não se importa | Reel | 2026-08-13 | 4677 |  |  |  |  | 6 | 232 |  |  |  |  |  | 44 | 2026-10-19 |
| O medo de perder faz a mente criar sinais de despedida | Reel | 2026-08-10 | 10855 |  |  |  |  | 19 | 540 |  |  |  |  |  | 40 | 2026-10-19 |
| Eu digo “some daqui” e a parte de mim que mais tem medo é que você vá | Reel | 2026-08-08 | 8089 |  |  |  |  | 9 | 391 |  |  |  |  |  | 41 | 2026-10-19 |
| O sumiço “do nada” tem explicação | Reel | 2026-08-06 | 18193 |  |  |  |  | 152 | 1009 |  |  |  |  |  | 26 | 2026-10-19 |
| Vejo todo mundo vivendo lá fora, atrás de um vidro | Reel | 2026-08-05 | 11829 |  |  |  |  | 24 | 492 |  |  |  |  |  | 52 | 2026-10-19 |
| Ele é uma pessoa com cada um. Sozinho, não é ninguém. | Reel | 2026-08-03 | 20792 |  |  |  |  | 6 | 847 |  |  |  |  |  | 34 | 2026-10-19 |
| CLIVAGEM. Salva se isso te descreve. | Reel | 2026-07-31 | 12894 |  |  |  |  | 11 | 380 |  |  |  |  |  | 25 | 2026-10-19 |
| A autolesão no Borderline não começa pelo desejo de sumir | Reel | 2026-07-28 | 6604 |  |  |  |  | 24 | 287 |  |  |  |  |  | 34 | 2026-10-19 |
| Sai tudo de uma vez. “Do nada.” | Reel | 2026-07-26 | 7012 |  |  |  |  | 7 | 317 |  |  |  |  |  | 45 | 2026-10-19 |
| Três semanas bem depois de anos de crise já é mudança | Reel | 2026-07-24 | 10098 |  |  |  |  | 9 | 545 |  |  |  |  |  | 42 | 2026-10-19 |
| Quem ama alguém com Borderline não precisa ser perfeito | Reel | 2026-07-23 | 8108 |  |  |  |  | 11 | 401 |  |  |  |  |  | 29 | 2026-10-19 |
| Ela some, te bloqueia em tudo, e volta dias depois como se nada tivesse acontecido | Reel | 2026-06-21 | 100916 | 64796 |  | 972 | 1327 | 86 | 3188 |  |  |  |  |  | 45 | 2026-10-19 |
| React Felca: Borderline abandona antes de ser abandonado | Reel | 2025-03-06 | 251864 |  |  |  |  | 426 | 16775 |  |  |  |  |  | 112.4 | 2026-10-19 |
| Relato de Border do Século Passado | Reel | 2025-02-22 | 389903 |  |  |  |  | 532 | 23593 |  |  |  |  |  | 49.5 | 2026-10-19 |
| Validação: lidando com crises border! | Reel | 2025-01-16 | 99601 |  |  |  |  | 82 | 3091 |  |  |  |  |  | 52.9 | 2026-10-19 |
| Hipersexualidade, maio | Carrossel | 2026-05-02 |  | 101481 |  | 2393 | 2406 |  |  | 232 |  |  |  |  |  | 2026-10-19 |
| Abandonar antes | Carrossel | 2026-09-28 |  | 82079 |  | 1822 | 1824 |  |  | 176 |  |  |  |  |  | 2026-10-19 |
| Família adoece | Carrossel | 2026-09-26 |  | 75323 |  | 1529 | 1354 |  |  | 237 |  |  |  |  |  | 2026-10-19 |
| Hipersexualidade, setembro | Carrossel | 2026-09-17 | 119115 | 61124 |  | 1201 | 1400 | 97 | 4256 | 151 | 480 |  |  |  |  | 2026-10-19 |
| Em segundos ela decide | Carrossel | 2026-06-09 |  | 38638 |  | 944 | 958 |  |  | 102 |  |  |  |  |  | 2026-10-19 |
| Áudios depois da briga | Reel | 2026-10-16 | 11120 | 5773 |  | 79 | 69 | 19 | 472 |  |  |  |  |  | 33 | 2026-10-19 |
| Carrossel de 23/09 (fora da lista) | Carrossel | 2026-09-23 |  | 298636 |  |  |  |  |  | 73 |  |  |  |  |  | 2026-10-19 |
| Imagem de 01/09 (fora da lista) | Post | 2026-09-01 |  | 222453 |  |  |  |  |  | 70 |  |  |  |  |  | 2026-10-19 |
| Parei de ir no almoço de domingo. Levou dez anos pra alguém perguntar por quê. | Carrossel |  | 36276 | 20864 |  | 104 | 168 | 13 | 717 | 9 | 73 |  |  |  |  | 2026-10-19 |
| Primeiro eu chegava atrasado. Depois saía antes da sobremesa. (carrossel, slides 2, 3, 5 e 6 de 9) | Carrossel |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 2026-10-20 |
| Dez anos depois, alguém perguntou. (slides 4/9, 7/9, 8/9, 9/9 de carrossel sobre almoço de domingo em família) | Carrossel |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 2026-10-20 |

---

## Histórico de gravações da memória

- 24/10 10:56: Memória: reação dele aos clipes da música e pedido de mais interface
- 24/10 10:54: Memória: correção de 24/10 sobre bolinhas cortadas no Reel Ninguém sabe da semana
- 24/10 10:41: Memória: Reel Ninguém sabe da semana, versão final narrada de 24/10
- 24/10 03:14: Memória: decisões de 24/10 sobre pronome, fundo, vídeo, rosto e título
- 24/10 03:12: Memória: anotações recuperadas de branches antigos
- 24/10 03:06: Memória editorial permanente: aprendizados de 48 sessões, dados da conta e padrão de efeitos
