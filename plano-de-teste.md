# Plano de teste

Regras para todos os testes:
- Uma variável por vez. O resto igual: rosto, duração parecida, mesmo dia da semana e faixa de horário, mesma semana ou semanas vizinhas, sem anúncio.
- Mínimo de dois pares (quatro posts) antes de tirar qualquer leitura. Um par é anedota.
- Leitura em 7 dias, pelo Windsor (views, alcance, envios, salvos, tempo médio, pulo) e pelo app (fontes das views, não seguidores, seguidores). Registrar em `memoria/insights.md` e no `memoria/placar-vereditos.md`, com o veredito dado antes de postar.
- Comparar com a mediana dos Reels das duas semanas em volta, não com os gigantes. A pergunta de cada teste é "a variável mudou a métrica dela", não "virou gigante".
- Nada de repost idêntico como teste: já está medido (8x menos).

| # | Variável testada | Como montar o par | Métrica que decide | Métricas que não decidem |
|---|---|---|---|---|
| T1 | Segundo da negação da acusação | Mesmo roteiro, versão A diz a acusação e a desfaz até 6 s; versão B abre pela cena e só desfaz aos 15 s. Gravar as duas no mesmo dia, publicar em semanas diferentes, mesmo dia da semana. Usar o roteiro 1. | Pulo nos 3 s e tempo médio (retenção); envios por mil | Views (dependem de distribuição) |
| T2 | Ação pedida no CTA | Mesma peça, versão A fecha com "salva pra..."; versão B fecha com "manda pra [pessoa nomeada]". Usar o roteiro 2. | Salvos por mil em A; envios por mil e fonte Stories em B | Curtidas |
| T3 | Estrutura visível sem som | Mesmo roteiro de lista, versão A com título fixo e número sobreposto no b-roll; versão B sem número e sem título fixo. | Tempo médio e curva de curtidas (segundo pico na entrada do item 2) | Envios |
| T4 | Capa | Mesmo vídeo publicado uma vez só, mas com dois testes em semanas diferentes de peças parecidas: capa com a acusação explícita (NÃO É INGRATIDÃO) contra capa neutra com cena (bolo e vela). Como não dá para publicar o mesmo vídeo duas vezes, parear dois roteiros do mesmo molde e alternar a capa. | Views vindas do Feed e do Perfil (onde a capa aparece); alcance | Pulo (a capa não aparece na aba Reels) |
| T5 | Tese nova contra continuação | Par: um Reel com tese nunca dita na conta (roteiros 1 a 3) e, na mesma semana, uma parte 2 de um vencedor. Já existem dois pontos (parte 2 do 5 coisas: 8,5x menos; repost do sumiço: 8x menos). O teste é confirmar com mais um par. | Views, alcance e percentual de não seguidores | Tempo médio (a parte 2 prendeu igual) |
| T6 | Duração | Mesmo roteiro em 30 s (só acusação, negação, novo nome, CTA) e em 45 s (com o "o que fazer"). | Tempo médio em segundos e em fração da duração; salvos por mil (a versão longa deveria salvar mais) | Pulo (igual nos dois) |
| T7 | Dado com fonte | Mesmo roteiro, versão A com um dado de estudo dito e citado na legenda (como a frequência cardíaca); versão B só com a cena e o mecanismo. Só com fonte conferida no PubMed. | Salvos por mil e curtidas; comentários de "fonte?" | Views |
| T8 | Segundo destinatário | Versão A fala só para quem convive; versão B inclui uma frase que a pessoa com borderline possa mostrar ("não era mentira"). | Envios por mil e fonte Stories; comentários de quem se reconhece | Tempo médio |
| T9 | Horário | Mesmo tipo de peça às 12h e às 21h30 de Brasília, dias úteis. Os vencedores saíram nos dois horários; a memória não tem dado. | Views na primeira hora e em 24 h; alcance em 7 dias | Envios por mil |
| T10 | Música de fundo | Mesma gravação com fundo baixo contínuo (piso perto de -30 dBFS, como o 5 coisas) e sem fundo (piso perto de -50, como o mini-manual). | Tempo médio; pulo | Envios |

Ordem sugerida: T5 (confirma o achado principal com um par a mais e custa pouco), T1, T2, T8. Os outros depois.

O que registrar antes de postar cada peça do teste: a variável, a versão, o veredito (feed ou teste), o motor mirado e a métrica que decide. Depois de 7 dias: o número e se bateu. Tudo em `memoria/placar-vereditos.md`.

Leitura dos resultados: diferença menor que 30% na métrica que decide, com dois pares, é ruído. Não mudar regra por isso. Diferença acima de 2x nos dois pares vira observação com confiança média em `memoria/reels-certeiros.md`, nunca regra.
