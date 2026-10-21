---
name: destravar-crescimento
description: Use quando o Dr. Fabio Schmidt (@drfabioschmidt, Borderline Sem Estigma) perguntar por que o alcance, o engajamento ou os seguidores não crescem, mandar um relatório ou prints de métricas para analisar, quiser saber onde o perfil está travado, ou pedir o que testar nas próximas semanas. Aplica o método de debugging a conteúdo: localizar onde trava, comparar com o que funcionou, testar uma hipótese por vez e só concluir com dado conferido.
---

# Destravar crescimento: Borderline Sem Estigma

Esta skill trata a falta de crescimento como um bug a investigar. Não chuta a causa, não dá nota de viralidade e não transforma poucos posts em regra.

Arquivos:
- `scripts/diagnostico.py`: compara períodos, mostra mês a mês e checa a consistência do histórico.
- `references/experimentos.md`: diagnóstico atual, hipóteses e experimentos em andamento. É o registro vivo da skill.
- Dados: `../historico-borderline-180d/references/posts-180d.psv`. A atualização está em `../historico-borderline-180d/references/leitura-dos-dados.md`.

Use junto com `systematic-debugging` (método) e `verification-before-completion` (conferir antes de afirmar).

## Regra de ferro

Nenhuma explicação sobre o crescimento antes de localizar onde ele trava, com dado conferido.

Uma frase como "o problema é o gancho" ou "o algoritmo mudou" sem essa etapa é chute.

## Fase 1. Ver os dados antes de explicar

1. Rode, a partir da pasta da skill: `python3 -I scripts/diagnostico.py --mensal` e `python3 -I scripts/diagnostico.py --janela 60`.
2. Se o histórico tiver mais de 2 dias de atraso, atualize pelo Windsor. Sem acesso, siga com o que há e diga o atraso em uma linha.
3. Defina o sintoma com uma métrica e um período. Ficar na mesma não é sintoma. Mediana de alcance dos Reels caiu de 4.211 em julho para 1.100 em agosto é sintoma.
4. Nunca misture alcance, views, compartilhamentos, salvamentos, retenção e seguidores. Cada um responde a uma pergunta diferente.
5. Se o pedido for sobre seguidores e não houver contagem de seguidores por data, diga que esse dado falta. Não substitua por outra métrica.

## Fase 2. Localizar onde trava

Pergunte em que ponto o problema aparece, na ordem:

1. **Formato.** O travamento é em Reels, carrosséis ou nos dois?
2. **Quando.** Em que mês começou? Mudou o volume de posts nesse mês?
3. **Distribuição.** A mediana caiu porque todos caíram, ou porque cresceu a parte que não sai do chão? Separe os posts que alcançam bem dos que morrem cedo e compare os dois grupos.
4. **Repostagens.** O histórico guarda só a cópia de mais views de cada conteúdo repostado. Compare pela coluna views/tent. do script, que conta cada tentativa. Sem isso, um mês com muitas repostagens parece melhor do que foi.
5. **Cadeia de produção.** Quando o pedido for "replicar o que funcionou", localize o passo em que o resultado se perde: ideia bruta, roteiro, gravação, edição, legenda, publicação. Para cada peça, compare o que entrou e o que saiu de cada passo. Uma cópia idêntica que funciona e uma adaptação que não funciona apontam para o passo da adaptação, não para o tema.
6. **Ponto de saída.** Em Reels, compare tempo médio assistido e saída em 3 segundos entre os grupos. A duração dos vídeos não foi coletada, então um vídeo curto tem tempo assistido baixo por definição. Confira a duração antes de concluir.

Pare quando conseguir dizer: trava em tal formato, desde tal mês, neste grupo de posts, neste ponto do vídeo.

## Fase 3. Comparar com o que funcionou

1. Pegue posts do mesmo formato e do mesmo período que alcançaram bem.
2. Liste todas as diferenças em relação aos que travaram: abertura, situação concreta ou não, legenda, duração, CTA, tema, se é repostagem.
3. Não descarte diferença pequena antes de olhar.
4. Desempenho de um post não prova que a tese dele está certa.

## Fase 4. Uma hipótese, um teste

1. Escreva a hipótese assim: acho que X causa Y porque Z. Marque como hipótese.
2. Monte um teste que mude **uma variável só**. Defina antes:
   - a métrica que decide (por exemplo, porcentagem de Reels abaixo de 1.500 de alcance);
   - a linha de base, com o número atual;
   - o prazo de leitura (7 dias depois de cada post);
   - quantos posts entram (o mínimo é 8 por lado);
   - o que conta como apoio e o que conta como refutação.
3. Registre em `references/experimentos.md` antes de começar.
4. Não mude duas coisas ao mesmo tempo. Se mudar, o resultado não separa o efeito.
5. Se três testes seguidos não moverem a métrica, pare e questione o diagnóstico da Fase 2.

## Fase 5. Conferir antes de concluir

Antes de dizer que algo funcionou:
- rode o script de novo com dados atualizados;
- compare com a linha de base registrada, não com a lembrança;
- diga o tamanho da amostra;
- escreva no registro: apoiada, refutada ou inconclusiva.

Inconclusiva é um resultado válido. Não arredonde para sucesso.

## Como entregar

1. **Onde trava**, em até 5 linhas, com números e período.
2. **O que ainda não dá para saber**, e qual dado resolveria.
3. **Uma hipótese principal** e o teste dela. No máximo duas hipóteses secundárias.
4. **Próximas peças** que executam o teste, criadas com `historico-borderline-180d` para não repetir tese.

Separe sempre fato do Instagram, cálculo, hipótese editorial e preferência.

## Ao ajudar a escrever ou adaptar

O relato do Dr. Fabio é que a lapidação estraga o vídeo. Até E1 terminar:
- preserve as palavras e a cena dele;
- corrija só imprecisão clínica, risco ou erro de fato, e diga o que mudou;
- não troque uma cena por um conceito;
- não encaixe uma ideia nova no esqueleto de um post antigo sem ele pedir.

## Limites

- Sem nota de viralidade, previsão de alcance ou limiar universal.
- Amostra abaixo de 30 posts descreve, não prova causa.
- Repostagens com minutos de diferença não são tentativas independentes. Veja as leituras A e B em `references/experimentos.md`.
- Prints e Windsor podem dar números diferentes para a mesma métrica. Registre a fonte de cada número.
- Alcance é a prioridade atual. Venda é secundária. Não acrescente oferta por reflexo.
- Quando um comentário ou dado indicar risco imediato, a orientação de segurança vem antes de qualquer análise.
