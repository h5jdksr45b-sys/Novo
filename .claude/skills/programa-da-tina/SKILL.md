---
name: programa-da-tina
description: Use quando o Dr. Fabio mandar um episódio novo do Programa da Tina (a tartaruga diva, A Última Sincera) gerado no Higgsfield e pedir a abertura, o encerramento, a vinheta ou os frames iniciais e finais iguais aos episódios anteriores.
---

# Programa da Tina: vinheta de abertura e encerramento

Aplica no episódio o mesmo pacote visual dos episódios anteriores:

1. **Abertura (0 a 1,83 s, por cima do episódio):** a imagem escurece e ganha um banho rosa por baixo. "Programa da" em script branco com brilho rosa entra aos 0,25 s. Aos 0,8 s vem um flash, e TINA bate em serifa com degradê amarelo, creme e rosa. Logo depois entra a pílula rosa A ÚLTIMA SINCERA, com estrelinhas piscando. Aos 1,55 s a imagem clareia e começa o episódio.
2. **Selo do canto, durante todo o episódio:** uma pílula escura com borda rosa, com "Programa da TINA".
3. **Encerramento (+2 s depois do fim):** a imagem escurece nos últimos 0,25 s, vem o flash, e o último quadro aparece desfocado, escuro e rosa. Por cima entram o título, a pílula e SIGA PARA O PRÓXIMO EPISÓDIO.
4. **Áudio:** o som do episódio, com um brilho suave nos dois flashes e silêncio no encerramento, para a música entrar.

## Como rodar

```bash
python3 -I .claude/skills/programa-da-tina/scripts/vinheta.py episodio.mp4 saida.mp4
```

O episódio pode ter qualquer tamanho e duração. Ele é redimensionado para 1080x1920 a 30 fps. Para conferir antes de entregar, rode com `STILLS=0.5,1.2,3.0` e veja os quadros salvos ao lado do arquivo de saída.

## Fontes

Estão em `fonts/`. Pacifico e Playfair Display vêm do Fontsource e Archivo vem do onetake, todas com licença OFL.

## Regras

- Não mude os textos do pacote sem pedido. Se o episódio tiver um título próprio, pergunte onde ele entra.
- Se o episódio vier com legenda queimada no topo, confira se o selo do canto não cobre a legenda.
