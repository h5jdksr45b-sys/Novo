# TPB e neuroimagem: B-roll de 20 s

Uso: consultório, lives e guias clínicos. Fora do feed.
Formato: 1080x1920, 30 fps, 20 s. Vídeo sem áudio, com legenda queimada e tempos já ajustados à narração.

## Narração (46 palavras, ritmo calmo)

| Tempo | Fala | Na tela |
|---|---|---|
| 0:00 a 0:03 | A emoção dispara rápido e demora a baixar. | Gráfico esquemático: subida rápida, retorno lento |
| 0:03 a 0:06 | Na neuroimagem, o alarme reage mais. Amígdala e ínsula. | Cérebro sagital, amígdala e ínsula acendem em dourado |
| 0:06 a 0:10 | O freio do pré-frontal ativa menos. | Zoom na frente: CPFDL, COF e CCA em azul apagado |
| 0:10 a 0:13 | E a conexão entre os dois é mais fraca. | Pulso lento da amígdala ao pré-frontal, perdendo força |
| 0:13 a 0:16 | Em resumo, mais alarme e menos freio. | Tabela: região, achado médio, método |
| 0:16 a 0:20 | São médias de grupo. E podem mudar com tratamento. | Três ressalvas com ícones |

## Fontes citadas na tela

- Schulze e col., 2016: hiperativação da amígdala (metanálise fMRI).
- Ruocco e col., 2012: redução de volume do hipocampo e da amígdala (metanálise).
- Chanen e col., 2008: redução de substância cinzenta no COF em adolescentes no primeiro episódio.
- Goodman e col., 2014: redução da reatividade da amígdala após DBT.

## Como editar e renderizar

    npm install
    npm run studio      # pré-visualização no navegador
    npm run render      # gera out/tpb-cerebro.mp4

Para trocar a narração, edite NARRACAO em src/TPBCerebro.tsx.

## Capa

Arquivo: out/capa.png (1080x1920). Texto dentro do recorte 4:5 do grid.
Para regerar: npm run capa

## Descrição

Quando a emoção dispara e demora a baixar, muita gente ouve que é exagero.

Estudos de neuroimagem no transtorno de personalidade borderline mostram, em média, duas coisas.
Amígdala e ínsula, áreas ligadas ao alarme emocional, reagem mais.
Áreas do pré-frontal, ligadas ao freio, ativam menos. E o sinal entre alarme e freio chega mais fraco.

Isso não diagnostica ninguém. São médias de grupo, variam entre estudos e não provam causa. E podem mudar: um estudo encontrou a amígdala menos reativa depois de tratamento com DBT.

Fontes: Schulze e col., 2016. Ruocco e col., 2012. Chanen e col., 2008. Goodman e col., 2014.

Conteúdo educativo. Não substitui avaliação nem tratamento.
Dr. Fabio Schmidt, médico, CRM-SP 183549, pós-graduado em psiquiatria.

Envie para alguém próximo que quer entender por que a emoção demora a baixar.

#borderline #tpb #saudemental
