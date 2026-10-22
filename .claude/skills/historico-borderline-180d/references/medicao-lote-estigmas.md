# Medição do lote de Reels sobre estigmas

Lote de 15 Reels de 40 segundos: 8 para quem tem borderline (B) e 7 para a família (F). Narrações escritas em 2026-10-22.

O objetivo é medir cada Reel com a mesma idade, em 7 e em 30 dias após a publicação. Assim, Reels publicados em datas diferentes podem ser comparados entre si.

## Protocolo

1. Ao publicar, anote a data e o código do Reel na tabela.
2. No dia 7 e no dia 30 após a publicação, puxe os dados pelo Windsor (conector `instagram`, conta 17841401503370732). Os campos estão em `leitura-dos-dados.md`.
3. Registre cada métrica na sua coluna. Não some nem misture as métricas:
   - alcance: contas únicas
   - views: visualizações
   - envios: o campo `media_shares` do Windsor
   - salvamentos
   - tempo médio assistido, em ms (não é percentual)
   - saída nos 3 primeiros segundos
4. Se a coleta atrasar, registre a idade real do Reel no dia da coleta, por exemplo D9 em vez de D7. Não ajuste os números.
5. O Windsor só lê dados acumulados. Por isso o número de cada idade depende de alguém coletar no dia certo.

## Tabela

| Peça | Gancho | Publicado | Código | D7 alcance | D7 views | D7 envios | D7 salvos | D7 ret_ms | D7 skip3s | D30 alcance | D30 views | D30 envios | D30 salvos |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B1 Perigoso | estereótipo riscado | | | | | | | | | | | | |
| B2 Toda raiva vira sintoma | cena | | | | | | | | | | | | |
| B3 Profissional que foge | cena | | | | | | | | | | | | |
| B4 Borderline mente | estereótipo riscado | | | | | | | | | | | | |
| B5 Não serve para ter filhos | cena | | | | | | | | | | | | |
| B6 Não ama, só depende | frase riscada | | | | | | | | | | | | |
| B7 Contar o diagnóstico | cena | | | | | | | | | | | | |
| B8 Chamar atenção | frase riscada | | | | | | | | | | | | |
| F1 Limite e ameaça | frase ouvida | | | | | | | | | | | | |
| F2 Os irmãos | cena | | | | | | | | | | | | |
| F3 Fui machucado | frase ouvida | | | | | | | | | | | | |
| F4 Adulto que não quer tratamento | frase ouvida | | | | | | | | | | | | |
| F5 Quando ajudar piora | cena | | | | | | | | | | | | |
| F6 Os outros parentes | cena | | | | | | | | | | | | |
| F7 Me afastar sem ser vilão | cena | | | | | | | | | | | | |

## Referência do histórico

Esta referência serve para situar os números. Ela não é meta, não é limiar e não prevê o resultado.

**Fonte:** `posts-180d.psv`, coletado em 2026-10-13.

**Amostra:** 113 Reels que tinham entre 30 e 120 dias no ar na data da coleta. Os números são acumulados, então os Reels mais velhos tiveram mais tempo para somar.

| Métrica | 1º quartil | Mediana | 3º quartil |
|---|---|---|---|
| Alcance | 286 | 3.006 | 5.658 |
| Views | 352 | 4.179 | 7.867 |
| Compartilhamentos | 0 | 12 | 67 |
| Salvamentos | 1 | 17 | 75 |

**D7 do histórico:** não existe referência confiável. Só 2 Reels tinham entre 6 e 8 dias na coleta (DeKwE-Lsp8r, com alcance de 6.842, e DeKBrFhuJ9R, com alcance de 109).

**Aviso sobre a comparação:** a distribuição é muito espalhada. Um Reel do lote só deve ser comparado com outro Reel do lote, na mesma idade. A comparação com o histórico é apenas uma referência.

## O que esta medição não mostra

- Por que um Reel foi melhor que outro. O lote tem 15 peças e varia em tema, público e gancho ao mesmo tempo.
- A retenção em percentual, porque a duração não é coletada.
- A divisão entre seguidores e não seguidores, e a origem do tráfego.
