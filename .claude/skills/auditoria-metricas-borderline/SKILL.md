---
name: auditoria-metricas-borderline
description: Use quando o Dr. Fabio Schmidt (@drfabioschmidt, Borderline Sem Estigma) pedir para ler, auditar ou comparar as métricas do Instagram. Por exemplo, o que aconteceu com o alcance dos Reels, por que um post foi bem ou mal, como um post se compara aos outros, como estão os temas ou os reenvios. Calcula a partir do histórico de 180 dias e descreve o que os dados mostram e o que não mostram, sem nota, limiar ou previsão.
---

# Auditoria de métricas: Borderline Sem Estigma

Adaptada da skill ig-audit, de Jake Schincariol (github.com/Jakeschincariol/instagram-agent-skill, licença MIT). A ideia de origem foi mantida: a melhor evidência de uma conta é a própria conta, comparada com a própria mediana. Foram retirados a nota de gancho, os vereditos de PARE e FAÇA MAIS e as conclusões de causa a partir de poucos posts.

Dados: `../historico-borderline-180d/references/posts-180d.psv`. Colunas, limites e atualização: `../historico-borderline-180d/references/leitura-dos-dados.md`.

## Antes de analisar

1. Veja a defasagem no topo da saída do script. Se passar de 2 dias e a pergunta envolver posts recentes, atualize pelo Windsor (passos no `leitura-dos-dados.md`) ou diga em uma linha que a análise para na data do arquivo.
2. Por padrão, o script deixa fora os 7 últimos dias do arquivo, porque esses posts ainda acumulam números. Use `--incluir-recentes` só quando a pergunta for sobre eles, e avise.

## Comandos

A partir da pasta desta skill:

| Pergunta | Comando |
|---|---|
| O que aconteceu com o alcance dos Reels | `python3 -I scripts/auditoria.py` |
| Quais posts ficaram acima e abaixo da mediana | `python3 -I scripts/auditoria.py --ranking 5` |
| Como os temas se comparam | `python3 -I scripts/auditoria.py --grupo eixo` |
| Chamada na legenda | `python3 -I scripts/auditoria.py --grupo cta` |
| Reenvios do mesmo conteúdo | `python3 -I scripts/auditoria.py --copias` |
| Um post específico | `python3 -I scripts/auditoria.py --post CODIGO` |

Filtros: `--fmt R|C|I` (padrão Reels), `--desde AAAA-MM-DD`, `--ate AAAA-MM-DD`.

A prioridade atual é o alcance orgânico dos Reels. Comece por eles e trate carrosséis à parte.

## O que cada medida diz

| Medida | Cálculo | O que mostra |
|---|---|---|
| Múltiplo de alcance | alcance do post / mediana de alcance do formato no período | se o post saiu do normal da própria conta |
| Compartilhamentos por alcance | compart / alcance | quantos de quem viu mandaram para alguém |
| Salvamentos por alcance | salvos / alcance | quantos de quem viu guardaram |
| Fica 3s | 1 - skip3s | fração das views que passou dos 3 primeiros segundos |
| Tempo assistido | ret_ms em segundos | tempo médio absoluto. Sem a duração do Reel, não é percentual e não compara vídeos de durações diferentes |

Alcance é a medida central, porque é a prioridade. Views, alcance, compartilhamentos, salvamentos e retenção são métricas diferentes. Mostre cada uma em sua coluna e nunca some ou funda.

## O que os dados não têm

Seguidores ganhos por post, alcance entre não seguidores, duração do Reel, horário, fonte do tráfego, texto dos slides e fala dos Reels. Sem esses dados, não dá para separar problema de gancho de problema de perfil, nem calcular retenção percentual. Diga isso quando a pergunta depender deles. Não estime.

## Como escrever a leitura

1. Rode o comando que responde à pergunta. Mostre os números que sustentam cada frase, com código do post, período e tamanho da amostra.
2. Descreva o que aconteceu. Exemplo: a mediana semanal de alcance dos Reels caiu de X para Y entre tal e tal semana, em N posts.
3. Separe sempre:
   - **Observação dos dados**: o que o script mostrou.
   - **Hipótese editorial**: o que pode explicar, marcado como hipótese, com o que a confirmaria ou derrubaria.
   - **Fato informado pelo Dr. Fabio** na conversa (por exemplo, mudança de rotina, de formato ou de equipe).
4. Nos extremos do ranking, abra a tese e as flags e confira o post pelo link antes de comparar conteúdo. A tese vem da legenda, não da fala.
5. Ao comparar grupos, diga o n. Abaixo de 30 posts, chame de amostra pequena. Tema, data, formato e gancho variam juntos, então diferença entre grupos não é causa.
6. Termine com o que vale testar, formulado como teste com critério de leitura, não como regra. Exemplo: publicar dois Reels sobre a mesma situação com aberturas diferentes e comparar o fica 3s e o alcance depois de 7 dias.

Não pode:
- Dar nota, prever alcance ou fixar limiar universal de compartilhamento, salvamento ou retenção.
- Usar benchmark de mercado como régua.
- Concluir causa a partir de poucos posts ou de uma correlação.
- Transformar desempenho passado em regra permanente ou veto de tema.
- Dizer que um tema funciona ou não funciona. O máximo é descrever o que aconteceu com os posts daquele tema no período.

## Cuidados

- Posts com flag `terceiro` mostram cena de outra pessoa, às vezes adolescente. Cite pelo código, sem descrever a cena além do necessário.
- Posts com flag `anomalia` têm dado inconsistente no Instagram. Deixe fora da conclusão e avise.
- Reenvios do mesmo conteúdo têm alcance muito diferente entre si. Os dados não dizem por quê.
- Para escrever a próxima peça a partir da leitura, use a skill `historico-borderline-180d`. Ela confere repetição de tese e voz.
