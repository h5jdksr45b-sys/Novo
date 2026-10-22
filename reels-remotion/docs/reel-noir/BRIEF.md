# Reel "Borderline mente" · Borderline Sem Estigma

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

**Três exemplos extras (motion graphics tipográfico: @mrbpmgfx, uma peça de 3D com relógios, @miraclestudios_)**
- Palavra gigante atrás da imagem, cortada pelo quadro, deslizando devagar ("SKILLS", "implementing" repetido atrás do astronauta).
- Palavra de ênfase vazada, só com contorno, ao lado de palavra cheia ("WITHOUT" em contorno, "BALANCE" cheia).
- Etiquetas minúsculas em caixa alta nos cantos e linha fina de moldura, como cartaz editorial ("DISCOVER", "ARCH / VHS").
- Glitch de uma fração de segundo (fatias deslocadas, separação RGB) na batida da trilha.
- Objetos recortados flutuando e texto que sai do quadro em tamanho enorme.
Aplicado no reel: palavra de fundo em cada plano de B-roll e no esquema, última palavra da ênfase vazada, etiquetas nos cantos com moldura nos planos sem o Fabio, glitch de 4 frames junto do flash. Os objetos 3D e as cores ficaram de fora para manter o noir.

## 2. Decisões

- **Tecnologia: Remotion.** O repositório já tem o projeto `reels-remotion` com pipeline de legenda. Tudo do reel está em `src/ReelNoir/`. Render com `npx remotion render ReelNoir`.
- **Fala: o take do Fabio (47 s), contínuo por baixo de tudo.** O áudio nunca é cortado. O que muda é o que cobre a imagem: B-roll, esquema, assinatura. Nos planos do Fabio, o próprio take já tem as trocas de enquadramento dele.
- **Cortes sem erro na voz:** cada cena começa na primeira palavra da fala daquela cena. O tempo das palavras vem de `public/reel-noir/fala.json`. Hoje ele foi gerado pelas pausas do áudio (`scripts/alinhar-por-pausas.py`): as fronteiras de frase caíram nas pausas detectadas. Um `node sub.mjs` com o Whisper deixa o tempo de cada palavra mais fino, no mesmo formato.
- **Paleta:** preto, branco e cinza de contraste alto, grão de filme, vinheta. Uma cor de destaque só (padrão `#c83c1e`; troque em `corDestaque`).
- **Público principal:** quem tem borderline e ouviu que mente depois de uma briga, e quem convive. **Função:** alcance. CTA: enviar para a pessoa com quem a discussão se repete.

## 3. Tese

Depois da briga, quanto mais presa a pessoa fica na ameaça, mais a atenção estreita: ela grava em detalhe o que pareceu ameaça e quase nada do resto. Cada um guarda um pedaço verdadeiro da mesma cena. Lembrar diferente não é mentir. Vale para qualquer pessoa.

## 4. Fala e direção de imagem (cena a cena)

A fala é a transcrição literal do take. Os tempos vêm do alinhamento com o áudio.

| Cena | Tipo | Fala | Imagem |
|---|---|---|---|
| s01 | Fabio | Borderline mente. Quantas vezes que você ouviu isso num dia depois da briga? | Texto grande "Borderline mente." entra na primeira palavra. Legenda pequena abaixo do queixo. |
| s02 | Fabio | Você lembra exatamente o que viu, mas o outro jura que não foi assim. | |
| s03 | Fabio | Ter chamado de mentiroso por algo que você viveu com tanta certeza dói demais. | |
| s04 | Esquema | Só que quanto mais fissurado a gente fica nisso, mais estreitos ficam a nossa atenção e o nosso foco. A gente grava com detalhe o que pareceu ameaça e quase nada do resto. Isso acontece com qualquer pessoa. | Sete detalhes da mesma cena espalhados (a hora, o lugar, o tom de voz, a palavra, o olhar...). Em "estreitos" a abertura fecha em volta de um só. Em "ameaça" ele ganha a caixa de cor. Em "resto" os outros somem. Em "qualquer" entra a linha "acontece com qualquer pessoa". Riser no corte de entrada. |
| s05 | B-roll 1 | É como um cachorro bravo latindo e correndo na sua direção. | Dentes do cachorro, zoom in. Flash + impacto. "bravo" grande. |
| s06 | B-roll 1 | Você lembra de detalhes do dente, mas não da cor da coleira que ele estava usando. | Coleira fora de foco, zoom out. "dente" em caixa, "coleira" grande. |
| s07 | B-roll 2 | Você guardou a palavra, o outro guardou o tom de voz. | Palavra circulada no papel, zoom in. "palavra" e "tom de voz" em caixa. |
| s08 | B-roll 2 | Os dois podem estar contando pedaços verdadeiros de uma mesma cena. | Duas poltronas de frente, zoom out. Flash + impacto. "verdadeiros" grande. |
| s09 | Fabio | Lembrar uma coisa diferente não faz disso uma mentira. | Texto grande "Lembrar diferente não é mentir." entra em "não". |
| s10 | Fabio | Da próxima vez, antes de disputar quem que lembra certo, pergunte: o que mais te marcou? | Texto grande "O que mais te marcou?" entra em "pergunte". |
| s11 | Fabio | Manda pra aquela pessoa que você acaba sempre caindo na mesma discussão. | |
| s12 | Assinatura | | Dr. Fabio Schmidt, CRM-SP 183549, médico, pós-graduado em psiquiatria. |

## 5. Onde entram os três momentos pedidos

- **Explicação com esquema animado:** s04, a atenção que estreita. É a ideia central e a parte que mais precisa de desenho.
- **B-roll 1:** s05 e s06, o cachorro (dentes e coleira).
- **B-roll 2:** s07 e s08, a palavra guardada e a cena que os dois viveram.

## 6. Som

- `public/sfx/drone.wav` em loop, baixo, com fade de entrada e saída.
- Riser de 1,1 s terminando no corte sempre que sai de um plano do Fabio para esquema ou B-roll (s04, s05).
- Impacto grave nos cortes marcados com flash (s05, s08).
- Os três arquivos são sintéticos (`scripts/gerar-sfx.py`). Troque por biblioteca licenciada mantendo os nomes. A voz fica sempre na frente: `volumeSfx` padrão 0,5.

## 7. Como produzir

1. Imagens: baixe as quatro geradas no Higgsfield (links abaixo) e salve em `public/reel-noir/` com os nomes de `public/reel-noir/LEIA-ME.md`.
2. `npm run dev` para conferir no Studio; `npx remotion render ReelNoir out/reel.mp4` para exportar.
3. Se regravar a fala: troque `fala.mp4`, atualize `fala.txt` e `roteiro.ts` com as palavras novas, rode `python3 scripts/alinhar-por-pausas.py public/reel-noir/fala.mp4 public/reel-noir/fala.txt public/reel-noir/fala.json` (ou `node sub.mjs public/reel-noir/fala.mp4`) e renderize.

Links das imagens geradas (Higgsfield, 22/10):
- 01-cachorro-dentes: ver galeria do Higgsfield (job f9705e91)
- 02-coleira: job a3d821ae
- 03-palavra: job b6ba117a
- 04-duas-poltronas: job cb775e44

## 8. Cuidados e limitações

- O conteúdo não afirma que borderline não mente nem que mente; diz que lembrar diferente não é mentir e que o estreitamento da atenção sob ameaça acontece com qualquer pessoa. Sem neurobiologia, sem infância.
- O alinhamento por pausas é aproximado dentro de cada frase. Os cortes entre cenas caem em pausas reais. Para palavra a palavra exato, rodar o Whisper (`node sub.mjs`).
- Histórico: arquivo com 10 dias de defasagem. Tese próxima no arquivo: 09/10 (IM) "reação que parece justa por dentro; explicar não autoriza". Mecanismo diferente: aquele era sobre justificar a reação; este é sobre memória e atenção depois da briga.
