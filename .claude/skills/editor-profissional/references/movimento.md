# Movimento

Todo movimento abaixo roda numa timeline só, seek-safe (contrato de `hyperframes-animation/rules-index.md`). Em Remotion, os mesmos valores com `interpolate` e `spring`.

## Curvas

- Entrada: `power3.out` (ou `cubic-bezier(.22,1,.36,1)`).
- Saída: `power2.in`, mais curta que a entrada.
- Mola só quando o objeto é físico (cartão, adesivo): overshoot de no máximo 6%.
- Nunca `linear` em texto. `linear` só em zoom contínuo e deriva de câmera.

## Entradas e saídas aprovadas

| Elemento | Entrada | Saída |
|---|---|---|
| Palavra da legenda | sobe 18 px + opacidade 0 a 1 em 0,12 s | some junto com o grupo em 0,08 s |
| Gancho em texto | já visível no quadro 0, sem fade (27/10). Pode ter um leve assentamento de 0,25 s de escala 1,04 para 1 | corte seco na troca de cena |
| Ênfase grande | escala 0,92 para 1 + opacidade em 0,22 s; complemento entra 0,08 s depois | opacidade em 0,12 s |
| Cartão ou esquema | desliza 60 px de baixo + opacidade em 0,3 s, itens internos em sequência de 0,06 s (total até 0,5 s) | desliza 30 px para cima em 0,18 s |
| Item de lista | marca de check desenha (`svg-path-draw`) em 0,25 s | fica até o cartão sair |
| Número | contagem com `counting-dynamic-scale` em 0,6 a 1,0 s | fica |
| Recorte de colagem | stop motion a 12 qps, peças chegando de fora do quadro, 0,5 a 1,2 s | corte seco |

Regras de `hyperframes-animation` que cabem no sistema: `stat-bars-and-fills`, `svg-path-draw`, `counting-dynamic-scale`, `coordinate-target-zoom`, `multi-phase-camera` (só a deriva leve), `depth-of-field-blur` (para destacar um cartão sobre o rosto), `sine-wave-loop` (respiração mínima de elemento parado).
Fora do sistema: `hacker-flip-3d`, `chromatic-glitch`, `3d-text-depth-layers`, `gradient-text-sweep`, `orbit-3d-entry`, `ai-tracking-box`, `avatar-cloud-network`. `kinetic-beat-slam` só em vídeo guiado por música, quando ele pedir.

## Zoom na gravação

- Zoom é movimento contínuo: de 1,00 para 1,06 a 1,08 ao longo do trecho de impacto, curva `sine.inOut` (01/11). Nunca troca de escala parada.
- Punch: salto de 1,00 para 1,12 no corte, só nas 2 ou 3 frases mais fortes do vídeo. Entra em corte + 0,02 s (27/10).
- Enquadramento um pouco acima do centro, rosto sempre inteiro.
- Ritmo: uma mudança visual a cada 1,5 a 2,5 s nos trechos de rosto. Referência, não meta (27/10).

## B-roll

- Entra por cima da fala, áudio do b-roll mudo, uma única cena do clipe.
- Começa 0,04 s antes do corte que cobre (27/10).
- Duração de 0,8 a 2,0 s. Movimento lento de câmera (escala 1,00 para 1,05) se for imagem parada.
- Clipe de 24 qps em vídeo de 30 qps: interpolar quadros para não trepidar.
- Nunca repetir o mesmo b-roll no vídeo (03/11).

## Transições

- Padrão: corte seco.
- Flash branco de 0,1 s só na entrada e na saída do primeiro b-roll.
- Desfoque de 0,15 s (`transitions/css-blur.md`) quando a troca é de assunto, no máximo duas vezes no vídeo.
- Empurrar (`css-push`) só entre cartões de uma mesma sequência.
- Fim: fade para preto nos últimos 0,1 s.
- Clipes de tela cheia consecutivos se sobrepõem 0,1 s, o posterior acima no DOM. Sem folga entre eles (27/10).
- Fora: `css-destruction`, `css-distortion`, `css-radial`, `css-3d`, `css-mechanical`.
