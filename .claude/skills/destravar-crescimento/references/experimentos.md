# Registro de diagnóstico e experimentos

Atualize a cada leitura. Mais recente primeiro dentro de cada seção.

## Diagnóstico atual (2026-10-21, segunda leitura)

Fonte: histórico Windsor coletado em 2026-10-13, 364 posts de 13/04 a 12/10/2026. Posts depois de 05/10 ficaram fora porque ainda acumulavam números. O histórico estava com 9 dias de atraso e a conta do Instagram não estava selecionada no Windsor. O período coberto é de 6 meses. Não há dado dos anos anteriores.

### Correção da primeira leitura

A primeira leitura dizia que os Reels travados subiram de cerca de 32% para 59% em agosto. Parte disso era erro de medida. De abril a julho, 44 Reels foram publicados mais de uma vez, e o histórico guarda só a cópia de mais views. Contando cada tentativa, o quadro é outro. O script agora mostra a coluna views/tent. para evitar esse erro.

### Fatos

1. **O basal está parado há 6 meses.** Mediana de views por tentativa de Reel: abril 1.456, maio 2.216, junho 1.777, julho 5.530, agosto 1.430, setembro 1.860. Julho é a exceção.
2. **Metade das pessoas sai nos 3 primeiros segundos, todo mês.** A saída em 3 segundos mediana ficou entre 0,49 e 0,55 em todos os meses. Ela não piorou. Ela é constante.
3. **Os picos não levantam o basal.** Em setembro houve 9 posts com 50 mil ou mais de alcance. A mediana dos Reels nas semanas seguintes ficou entre 107 e 4.443, como antes.
4. **O alcance grande vem de carrosséis.** 37 de 122 carrosséis passaram de 20 mil contas. Entre os Reels, 12 de 239. Das 25 publicações de maior alcance, 19 são carrosséis. Dois terços da produção são Reels.
5. **O mesmo vídeo teve resultados muito diferentes.** Exemplos de cópias publicadas com minutos de diferença: 7.511, 1.307 e 109 views; 13.714 e 1.255; 10.156 e 198. Um Reel isolado diz pouco sobre o conteúdo.
6. **Dividir o dia com outro Reel pesa um pouco.** De abril a julho, entre Reels com legenda completa, ficaram abaixo de 1.500 de alcance 11% dos que estavam sozinhos no dia e 29% dos que dividiam o dia. Em agosto e setembro, 40% e 49%.
7. **Nos Reels que travam, quase ninguém assiste.** Tempo médio assistido mediano: 4,8 segundos abaixo de 1.500 de alcance e 13 segundos acima. 37% dos travados têm legenda genérica, contra 4% dos outros.

### O que ainda não dá para saber

- O que foi diferente em julho. Nos dados, julho teve só um pouco menos de Reels (33 tentativas) e de dias com dois Reels. A saída em 3 segundos foi igual. A resposta depende do que mudou na gravação, na edição ou no tipo de vídeo, e isso não está no histórico.
- A duração dos Reels. Sem ela, 4,8 segundos assistidos podem ser um vídeo curto.
- Os seguidores por data, incluindo quem entra e quem sai.
- Quanto do alcance vem de quem não segue.

### Leitura

O perfil não caiu. Ele está parado num patamar. Cada Reel costuma ser mostrado para cerca de 1.500 a 2.200 pessoas, metade sai nos primeiros segundos, e a maioria para por aí. De vez em quando um post, quase sempre carrossel, sai desse patamar, mas o seguinte volta para ele. Esse é o ciclo. A causa ainda é hipótese.

## Hipóteses

| # | Hipótese | Base | Status |
|---|---|---|---|
| H1 | A abertura dos Reels não mostra uma situação reconhecível nos 2 primeiros segundos. Metade sai, e o Instagram não leva o vídeo além do primeiro grupo. | Fatos 2 e 7. Correlação, não causa. | A testar (E1) |
| H2 | Vários Reels no mesmo dia dividem a distribuição. | Fato 6. Efeito moderado. | A testar depois de E1 |
| H4 | Algo feito em julho, que não aparece nos dados, levantou o basal. | Fato 1. Só um mês. | Perguntar ao Dr. Fabio |
| H3 | Carrosséis com cena concreta e familiar puxam mais seguidores por visualização que carrosséis de metáfora. | 8 posts com print, ver conclusoes-v3.md. | Amostra pequena |

## Experimentos

### E1. Abertura com situação concreta nos 2 primeiros segundos

- **Hipótese:** H1.
- **Condição:** um Reel por dia no máximo, sem repostagem, para não misturar com H2.
- **Mudança única:** todo Reel abre com uma coisa que a pessoa fez, ouviu ou percebeu, dita nos 2 primeiros segundos e com texto grande na tela. Tema, duração, horário, legenda e frequência ficam como estão.
- **Métrica que decide:** porcentagem dos Reels com alcance abaixo de 1.500, lida 7 dias depois de cada post.
- **Métricas de apoio:** saída em 3 segundos mediana e tempo médio assistido mediano.
- **Linha de base:** em agosto e setembro, 54% a 59% abaixo de 1.500 de alcance. Saída em 3 segundos mediana de cerca de 50% em todos os meses. Mediana de 1.430 a 1.860 views por tentativa.
- **Amostra:** os próximos 12 Reels.
- **Apoio:** 35% ou menos dos 12 abaixo de 1.500, com saída em 3 segundos menor que a da linha de base.
- **Refutação:** 50% ou mais abaixo de 1.500.
- **Antes de começar:** registrar a duração de cada Reel do teste.
- **Status:** não iniciado.
- **Resultado:** (preencher)

### Medidas permanentes

- Toda segunda-feira: total de seguidores, anotado com a data.
- Em cada Reel novo: duração em segundos.
