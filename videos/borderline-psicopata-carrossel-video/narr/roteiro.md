# Narração (26/10/2026)

Voz: clone "Fabio" do Higgsfield (elemento 7cfd6a01-db67-4d1b-89fc-481330e72e8d), modelo seed_audio, wav 48 kHz, velocidade padrão.
Tratamento: silêncio do começo e do fim cortado em -42 dB; pausas internas limitadas a 0,42 s (sox). Cada fala começa 0,35 s depois do início da cena.
A duração de cada cena foi ajustada à fala (ver `SC` em `index.html`). Os tempos das marcações na tela seguem as palavras (faster-whisper, `timings.json`).

| Cena | Fala | Job seed_audio | Duração tratada |
| --- | --- | --- | --- |
| 1 | Todo borderline tem seu lado psicopata. Você já deve ter ouvido isso. Entenda por que não. | 85b62b55-46e4-4c66-b1ac-038757ada84f | 4,7 s |
| 2 | Psicopatia, em palavras simples. A pessoa machuca e não sente culpa. Engana e usa os outros com frieza. E raramente pede ajuda. | 9995cbc9-dbb8-4455-a29f-8b262fe7f92f | 8,1 s |
| 3 | Quanto isso aparece na população? As estimativas apontam de uma a seis em cada cem pessoas. | 72e23793-9bda-428b-9ba0-f4289a435005 | 7,0 s |
| 4 | Já o borderline sente tudo muito forte. Tem pavor de ser deixado. Explode, e depois sofre com o que fez. | 90dcb511-e375-485a-a319-e21571cbe298 | 7,1 s |
| 5 | Repare no que vem depois de machucar alguém. Culpa: pouca ou nenhuma na psicopatia, muita no borderline. Pedir ajuda: raro num, frequente no outro. E o jeito de machucar: com cálculo, ou no impulso. | facfaaa7-c190-4ea5-b2c6-7fc17959cc3f | 13,0 s |
| 6 | Os dois podem aparecer juntos? Às vezes, sim. Uma pessoa pode ter os dois. Mas ter borderline não torna ninguém psicopata. Quem avalia é um profissional. | c7f176fe-70c8-45fd-8666-b378737c3922 | 9,5 s |
| 7 | Por trás da explosão, quase sempre tem dor. Dor explica. Não autoriza machucar. | 3e611e2c-aa4d-4d02-a537-a4bccaba334f | 4,9 s |
| 8 | Manda pra quem ainda acredita nisso. | b4963d4c-1f40-40e4-aede-688ad990ef75 | 2,0 s |

Os arquivos `c1.wav` a `c8.wav` (tratados) ficam nesta pasta no ambiente de render; não estão no repositório porque a rede da sessão bloqueia o CDN do Higgsfield.

Pendência: a transcrição automática da fala 3 leu "Enquanto isso aparece" no lugar de "Quanto isso aparece". Pode ser erro do transcritor. Conferir de ouvido; se a voz disse "Enquanto", gerar a fala 3 de novo.
