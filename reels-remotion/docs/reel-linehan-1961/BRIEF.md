# Reel "1961" · Marsha Linehan · Borderline Sem Estigma

Documento de trabalho: leitura das referências, decisões, roteiro, direção de imagem, som e como produzir.

## 1. O que as três referências fazem (medido nos arquivos enviados)

Vídeos 2 e 3 são da mesma casa (@hex_creatives): Elisha Otis e o elevador (73 s) e o experimento de Stanford (62 s). O vídeo 1 é um talking head caseiro (47 s), sem legenda e sem trilha; o áudio não pôde ser transcrito neste ambiente, então ele entrou só como referência de enquadramento.

**Imagem**
- Cortes secos, sem dissolve. Otis: 28 cortes em 70 s, plano médio de 1,3 a 3,9 s na narração, com um bloco de 0,5 a 1,2 s no clímax (58 a 64 s). Stanford: 26 cortes em 59 s, abertura segurada por 10 s num só plano, depois 0,8 a 2,4 s.
- Toda imagem estática tem Ken Burns: zoom de 2 a 5 por cento por plano, lento, sem parar. Às vezes deriva lateral mínima.
- Flash frame de 1 a 3 frames nos cortes de ênfase: um frame invertido ou estourado de ciano, depois volta. Aparece 5 ou 6 vezes por vídeo (a detecção de cena registra dois cortes a 0,1 s de distância).
- Stanford é P&B de contraste alto com grão forte e vinheta; Otis é sépia e azul-petróleo dessaturado. Os dois usam colagem: pessoa recortada sobre parede neutra, objeto isolado (prédio, elevador) sobre fundo claro.
- Material de arquivo em vídeo entra com desfoque e leve push-in, por 0,8 a 1,5 s cada.
- Assinatura fixa: ícone do Instagram com @ na lateral esquerda o tempo todo. Fecham com 3 s de tela preta com o @.

**Tipografia**
- Serifa itálica (família Playfair Display) para a narração, corpo pequeno a médio, centralizada no terço superior ou inferior, nunca sobre o rosto.
- Cada palavra entra com fade de 1 a 3 frames, subida de poucos pixels e escala quase imperceptível. As palavras acumulam na tela até o corte. Sem bounce, sem typewriter nas frases.
- Anos entram em máquina de escrever, um dígito por vez ("It's 1" > "It's 18" > "It's 1854.").
- Palavra de ênfase sobe de corpo e ganha a própria linha ("platform,").
- Caixa de destaque de uma cor só (azul-petróleo no Otis, amarelo ácido no Stanford) em palavras-chave e em rótulos de nome ("Philip Zimbardo" em caixa, sans, com seta desenhada à mão apontando para a pessoa).
- Texto branco tem brilho suave (glow) no Stanford.

**Som (análise do espectro e dos transientes)**
- Cama grave contínua entre 50 e 140 Hz com pulso lento a cada 3 s, sempre abaixo da voz. Não há melodia reconhecível.
- Riser (sopro agudo subindo) nos 0,8 a 1,2 s antes de cerca de metade dos cortes: 14 de 28 no Otis, 11 de 26 no Stanford, concentrados no clímax.
- Impacto grave logo depois de 3 ou 4 cortes-chave por vídeo, coincidindo com os flash frames.
- A voz é contínua e fica na frente. Cerca de 40 por cento dos cortes caem em um início de palavra (transiente de voz a menos de 150 ms do corte). Nenhum corte cai no meio de palavra.

**Vídeo 1 (talking head)**
- Uma câmera, luz de janela, lapela na mão. Alterna plano aberto (cadeira e corpo) e plano fechado (punch-in digital) a cada 5 ou 6 s, sempre num início de frase. Sem trilha, sem SFX, sem legenda. Serve de modelo para os blocos em que o Fabio aparece.

## 2. Decisões

- **Tecnologia: Remotion.** O repositório já tem o projeto `reels-remotion` com pipeline de legenda por Whisper. Tudo do reel está em `src/Linehan1961/`. Render com `npx remotion render ReelLinehan1961`.
- **Estrutura: três blocos com o Fabio em câmera, dois blocos de B-roll noir e um momento de esquema animado.** O take do Fabio é contínuo por baixo de tudo: o áudio nunca é cortado. O que muda é só o que cobre a imagem.
- **Cortes sem erro na voz:** o corte de cada cena acontece na primeira palavra da fala daquela cena. Com a transcrição (`fala.json`), o código acha o tempo real em que cada palavra foi dita e alinha os cortes nela. Sem transcrição, usa estimativa só para pré-visualizar.
- **Paleta:** preto, branco e cinza de contraste alto, grão de filme, vinheta. Uma cor de destaque só (padrão: o vermelho da marca, `#c83c1e`; troque em `corDestaque`).
- **Público principal:** quem tem o diagnóstico e trata o próprio caso como sentença, e quem vive com essa pessoa. **Função:** alcance. Sem oferta. CTA de envio a uma pessoa específica.

## 3. Tese e relação com o histórico

Tese: o tratamento com mais estudos para borderline nasceu de alguém que passou mais de dois anos internada aos 17; o que ela construiu junta dois movimentos que pareciam opostos, aceitar e mudar.

Histórico (arquivo de 180 dias, última publicação registrada em 12/10, 10 dias de defasagem): a biografia da Linehan não aparece em nenhuma tese; ela é citada só como fonte (Linehan 1993, carrossel de 04/10). Parentesco mais próximo: carrossel de 23/05 (RO), "diagnóstico e vergonha: a palavra nasceu quando a medicina condenava o que não entendia". Mecanismo diferente: aquele era sobre a origem da palavra; este é sobre a origem do tratamento e a ideia de aceitação e mudança ao mesmo tempo. Também há um Reel de teste no arquivo ("Em 1960...", 1 view, excluído da base), o que sugere que a abertura por data já foi cogitada.

## 4. Roteiro falado e direção de imagem (cena a cena)

Os tempos são estimados (pré-visualização). O tempo real vem da gravação.

| Cena | Tipo | Fala | Imagem |
|---|---|---|---|
| s01 | Fabio, plano aberto | Se você já pensou que a sua cabeça não tem conserto, guarda esse nome: Marsha Linehan. | Luz de janela, P&B. Legenda pequena abaixo do queixo. |
| s02 | B-roll 1 | Hartford, 1961. Uma menina de 17 anos é internada num hospital psiquiátrico. | Fachada/corredor anos 1960, zoom in. Flash frame + impacto no corte. "1961" em máquina de escrever. "17 anos" em caixa. |
| s03 | B-roll 1 | Ela se machucava, e ninguém sabia dizer por quê. | Janela com grade, contraluz, zoom out. "ninguém" grande. |
| s04 | B-roll 1 | Mais de dois anos lá dentro, na ala dos pacientes mais graves. Boa parte num quarto de isolamento. | Quarto vazio frontal, zoom in. "dois anos" em caixa, "isolamento." grande. |
| s05 | B-roll 1 | O diagnóstico no prontuário era esquizofrenia. | Folha datilografada, zoom out. Rótulo em caixa: esquizofrenia. |
| s06 | Fabio, plano fechado | Hoje o nome provável seria transtorno de personalidade borderline. Em 1961 esse nome nem existia no manual. | Punch-in. |
| s07 | Fabio, plano aberto | Lá dentro ela fez uma promessa: sair daquele inferno e voltar pra tirar os outros. | Volta ao aberto. |
| s08 | Esquema | Ela saiu. Virou psicóloga. E o tratamento que ela criou tem dois movimentos que parecem opostos. Aceitar: a sua dor é real e faz sentido. Mudar: do jeito que está, você continua sofrendo. Quase todo tratamento escolhia um lado. Ela juntou os dois. Dialética quer dizer isso: dois lados ao mesmo tempo. É a terapia comportamental dialética. | Fundo preto. "Aceitar" e "Mudar" entram nas palavras ditas, linha entre eles, "ou" aparece, é riscado e vira "e" em cor; caixa DIALÉTICA com a tradução. Riser no corte de entrada. |
| s09 | B-roll 2 | Em 1991 saiu o primeiro estudo controlado. Um ano de tratamento. | Universidade/arquivo, zoom in. Flash + impacto. "1991" em máquina de escrever. |
| s10 | B-roll 2 | Menos episódios de autolesão. Menos dias de internação. | Corredor vazio, zoom out. Os dois "Menos" grandes. |
| s11 | B-roll 2 | Em 2011, aos 68 anos, ela voltou ao mesmo hospital e contou em público: a paciente era ela. | Auditório, zoom in. Flash + impacto. "68 anos" em caixa, "ela." grande. Rótulo: Marsha Linehan. |
| s12 | Fabio, plano fechado | O tratamento com mais estudos para borderline não nasceu de quem olhava a dor de fora. Nasceu de quem passou mais de dois anos trancada com ela. | Punch-in. |
| s13 | Fabio, plano aberto | Se alguém que você ama acha que não tem conserto, manda esse vídeo pra essa pessoa. | Aberto. |
| s14 | Assinatura | | Dr. Fabio Schmidt, CRM-SP 183549, médico, pós-graduado em psiquiatria. Sem grão. |

Cerca de 190 palavras. No ritmo do Fabio deve ficar entre 65 e 80 s. Se precisar cortar, as frases dispensáveis são a segunda de s06 e a última de s08 ("É a terapia comportamental dialética": o nome já aparece na tela).

## 5. Onde entram os três momentos pedidos

- **Explicação com esquema animado:** s08. É o único trecho que precisa de desenho, porque "dialética" sem tradução não se entende em 3 segundos.
- **B-roll 1:** s02 a s05, a internação. Quatro planos, 12 a 16 s.
- **B-roll 2:** s09 a s11, o resultado. Três planos, 10 a 13 s.

## 6. Som

- `public/sfx/drone.wav` em loop, baixo, com fade de entrada e saída.
- Riser de 1,1 s terminando no corte sempre que sai de um plano do Fabio para B-roll ou esquema (s02, s08, s09).
- Impacto grave nos cortes marcados com flash (s02, s09, s11).
- Os três arquivos são sintéticos (`scripts/gerar-sfx.py`). Troque por biblioteca licenciada mantendo os nomes. A voz fica sempre na frente: `volumeSfx` padrão 0,5.

## 7. Como produzir

1. Gravar um take só, vertical, com o roteiro inteiro. Olhar para a câmera. Pausa curta entre cenas ajuda o corte, mas não é obrigatória.
2. Salvar como `public/linehan/fala.mp4`.
3. `node sub.mjs public/linehan/fala.mp4` gera `public/linehan/fala.json` (baixa o Whisper na primeira vez, modelo `medium`, português).
4. Substituir as sete imagens em `public/linehan/` (lista em `public/linehan/LEIA-ME.md`).
5. `npm run dev` para conferir no Studio; `npx remotion render ReelLinehan1961 out/reel.mp4` para exportar.
6. Se mudar o roteiro, mude só `src/Linehan1961/roteiro.ts` e regrave: o alinhamento refaz tudo.

## 8. Fontes e o que ainda falta

Fatos sobre a Marsha Linehan usados na fala: internação aos 17 anos, em 1961, no Institute of Living (Hartford, Connecticut); mais de dois anos de internação; quarto de isolamento na ala dos pacientes mais graves; diagnóstico de esquizofrenia; a promessa de sair e voltar para tirar os outros; diagnóstico provável de TPB pela própria avaliação posterior; revelação pública em 2011, aos 68 anos, no mesmo hospital. Origem: reportagem de Benedict Carey no New York Times (23/06/2011, "Expert on Mental Illness Reveals Her Own Fight") e o livro de memórias dela, "Building a Life Worth Living" (2020). Confirmei esses pontos por resumos e resenhas acessíveis daqui; o texto integral do NYT não abriu neste ambiente. Vale uma leitura do original antes de publicar.

Afirmações científicas (PubMed):
- Primeiro ensaio controlado da TCD, 1991: um ano de tratamento, mulheres com TPB e autolesão crônica, menos episódios de autolesão e menos dias de internação que o tratamento usual. Linehan MM et al., Arch Gen Psychiatry 1991;48(12):1060-4. https://doi.org/10.1001/archpsyc.1991.01810360024003
- "Tratamento com mais estudos": na revisão Cochrane de 2020 (75 ensaios), a TCD é objeto de um terço de todos os ensaios incluídos. Storebø OJ et al., Cochrane Database Syst Rev 2020;5:CD012955. https://doi.org/10.1002/14651858.CD012955.pub2

Cuidados: a fala menciona autolesão uma vez, sem método e sem imagem. A legenda deve trazer CVV 188 e SAMU 192. Não pedir relatos de crise nos comentários.

Limitação do histórico: arquivo com 10 dias de defasagem; tese conferida só pelas legendas do arquivo.
O que fortaleceria a peça: uma frase literal da Linehan sobre a promessa, com a página do livro, para usar como citação na tela.
