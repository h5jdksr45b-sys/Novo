# Checagem antes de entregar

## Automática

```
python3 .claude/skills/editor-profissional/scripts/checar.py video.mp4
```

Confere: duração do áudio igual à do vídeo, -14 LUFS e pico até -1 dBTP, volume dos últimos 3 s, quadros pretos no meio, primeiro quadro escuro e tamanho para o chat. Qualquer FALHA volta para a edição.

## Olhando

1. Primeiro quadro em tamanho real: rosto, texto, nada cortado na borda (24/10).
2. Quadros exatos ao redor de cada emenda, b-roll e cartão. Folha de contato a 1 qps não pega erro de um quadro (27/10).
3. Cada texto: ortografia, posição, se não cobre boca ou microfone, se não entra na faixa de 20% de baixo nem nos 12% da direita.
4. Legenda: até 3 palavras, sem palavra curta solta, a mesma entrada e o mesmo lugar do começo ao fim.
5. Ênfases: são a fala daquele instante e parecem maiores que a legenda.
6. Nenhum item da lista de brega do `SKILL.md`.
7. Nenhum b-roll repetido. Nenhum texto inventado pela IA dentro de imagem gerada.
8. Auditoria de texto de `memoria/aprendizados.md` seção 0 em tudo que aparece escrito.

## Entrega

- Vídeo no chat. Acima de cerca de 30 MB, reencodar (CRF 23 a 26) antes.
- Junto: capa e legenda do post.
- Veredito sincero, uma vez: feed, teste ou refazer, comparando com os gigantes.
- Registrar em `memoria/correcoes.md` o que ele disser.
