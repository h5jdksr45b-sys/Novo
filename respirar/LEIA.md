# Respire Agora

Página gratuita de respirações por situação, com os materiais pagos abaixo.

- `index.html`: a página pronta para o site. Suba na Hostinger em `public_html/respirar/` do curso.drfabioschmidt.net. O link fica curso.drfabioschmidt.net/respirar/
- `pagina.html`: a mesma página no formato de pré-visualização do Claude. Edite esta e gere a outra com `python3 -I montar.py pagina.html index.html`.

## Vídeos

Cada situação tem o campo `video` vazio dentro do `<script>`. Vazio, a situação mostra só a bolinha guiada. Para pôr um vídeo:
1. Suba o MP4 em `public_html/respirar/videos/`.
2. Preencha o campo, por exemplo `video:'videos/suspiro.mp4'`.

Situações e o vídeo que cada uma espera:
- apuracao: respiração lenta, 5 entra e 5 sai
- suspiro: suspiro duplo, 2 + 1 entra e 6 sai
- dormir: 4-7-8
- conversa: sopro lento, 3 entra e 6 sai
- crise: respiração pequena e lenta, 3 entra e 5 sai, sem segurar
- quadrada: 4-4-4-4
- maos: respiração com as mãos, 4 entra fechando e 6 sai abrindo
- junto: respirar junto, 4 entra e 6 sai

Link direto para uma situação: acrescente `#id` no fim. Exemplo: curso.drfabioschmidt.net/respirar/#dormir

Os botões da Hotmart levam `src=respirar`, para a venda aparecer com essa origem no relatório.

O aviso da eleição fica no parágrafo `aviso-eleicao`. Apague depois do segundo turno.

## Movimento, interface e som (versão de 25/10, à noite)

Feito com as receitas das skills externas `better-ui` e `ui-ux-pro-max`:
- Entrada em etapas na abertura (100 ms entre título, texto, aviso e bolinha) e nos cartões (60 ms entre eles, com a linha da respiração se desenhando).
- Toque com escala 0,96 em 150 ms em botões e cartões; sombra em anel no lugar de borda; hover só em mouse.
- Folha do exercício sobe de baixo no celular e aparece no centro no computador; fundo escurece com desfoque.
- Barra de fases proporcional aos segundos, halo atrás da bolinha, troca do nome da fase com fade, ícone play/pausa/de novo com cruzamento de 300 ms.
- Botão de som na folha (lembra a escolha no aparelho) e aviso curto no pé da tela.
- Tudo respeita a preferência de menos movimento do sistema: fica só o fade.

Sons: vêm da biblioteca da skill externa `media-use` (`.claude/skills/media-use/audio/assets/sfx/`): `click-soft` nos toques, `whoosh` ao abrir a folha, `pop` a cada troca de fase, `chime` no fim do exercício. Cortados e baixados (picos entre -14 e -20 dBFS), sem grave e sem impacto. Estão embutidos na própria página, em base64, dentro de `const SONS`. O som só toca depois do primeiro toque na página e só dentro do exercício; a bolinha da abertura é muda. Vibração curta (8 ms) a cada fase, em aparelhos que aceitam.
