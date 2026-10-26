---
name: tiktok-borderline
description: Use para conectar, publicar ou medir conteúdo no TikTok da marca Borderline Sem Estigma, do Dr. Fabio Schmidt. Cobre conferir a conta conectada, reconectar, subir vídeo ou carrossel de fotos como rascunho ou post, acompanhar o status e puxar métricas orgânicas. Também serve para adaptar um Reel já aprovado ao TikTok sem quebrar as regras editoriais.
---

# TikTok: Borderline Sem Estigma

Duas ferramentas, duas funções:
- Higgsfield: conexão da conta e publicação.
- Windsor.ai (`tiktok_organic`): métricas dos posts orgânicos.

Status em 26/10/2026: Higgsfield conectado (conta `tiktok`, ativa). Windsor `tiktok_organic` ainda não conectado.

## 1. Conferir a conta

1. Chame `mcp__Higgsfield__tiktok_accounts`.
   - `active`: use o `connector_id` retornado. Não grave o id de memória, ele pode mudar.
   - `error`: chame `tiktok_reconnect` com o `connector_id` e entregue o link ao Dr. Fabio.
   - Lista vazia: chame `tiktok_connect` e entregue o link. Ele vence em cerca de 10 minutos.
2. Depois que ele autorizar, chame `tiktok_accounts` de novo e só então diga que está conectado.
3. Nunca peça token, código ou URL de retorno no chat.

## 2. Antes de publicar

A peça passa pelo fluxo normal do `CLAUDE.md`: memória, correções, histórico de 180 dias, voz. O TikTok não muda as regras.

Ao adaptar um Reel:
- Mesma fala e mesma tese. Não reescreva a tese para o TikTok sem ele pedir.
- Título até 150 caracteres. Descrição até 4000. Sem travessão, sem emoji.
- Apresente o Dr. Fabio como médico, pós-graduado em psiquiatria ou médico com foco em TPB. Nunca como psiquiatra.
- A chamada segue a função da peça. COMEÇAR só quando houver ponte real com o Protocolo 7 Dias.
- Não peça relato de crise, autolesão ou violência nos comentários.
- Se a peça falar de risco, a orientação de segurança fica no vídeo ou na descrição, e vale mais que alcance.

## 3. Mídia

O TikTok só aceita mídia hospedada no Higgsfield.

1. Se o arquivo estiver no sandbox: `mcp__Higgsfield__media_upload`, depois `curl -X PUT` do arquivo para a URL recebida, depois `media_confirm`.
2. Se não estiver acessível: `media_upload_widget`, sozinho no turno, e espere o envio.
3. Se for um link público: `media_import_url`.

Confira os limites antes de subir. Arquivo recusado custa uma volta inteira, e parte das recusas só aparece depois do envio.
- Vídeo: MP4, WebM ou MOV, até 1 GB, 3 a 600 segundos, mínimo 360 px por lado, 23 a 60 FPS.
- Foto: JPEG ou WebP. PNG é recusado, converta antes (`ffmpeg -i in.png -q:v 2 out.jpg`). Até 20 MB, cabe em 1080x1920 ou 1920x1080, até 35 imagens.

Para conferir um vídeo: `ffprobe -v error -show_entries stream=width,height,r_frame_rate -show_entries format=duration -of compact video.mp4`.

## 4. Publicar

1. `mcp__Higgsfield__tiktok_prepare_publish` com `connector_id`, `media_type` e o modo.
   - Padrão: `UPLOAD_TO_DRAFT`. Use `DIRECT_POST` só quando ele disser para postar direto.
   - Música da biblioteca comercial só funciona em `DIRECT_POST`. Para sugerir faixas: `tiktok_music_trending`. A escolha final é dele, no formulário.
   - Privacidade, comentários, dueto, stitch, conteúdo comercial e marcação de IA: preencha só o que ele já disse. O resto ele escolhe no formulário.
2. Ele revisa e envia no formulário. Não chame `tiktok_publish` por conta própria.
3. Com o `publish_id`, acompanhe com `tiktok_publish_status`. O processamento pode levar alguns minutos.
4. Diga o que aconteceu: rascunho salvo, post no ar ou erro com o motivo. Não diga que está publicado antes do status confirmar.

## 5. Métricas

Pelo Windsor, conector `tiktok_organic`.

1. `mcp__Windsor_ai__get_connectors`. Se não houver conta `tiktok_organic`, chame `get_connector_connect_info` com `tiktok_organic` e entregue o link.
2. Com a conta conectada, use `get_fields` para ver os campos e `get_data` para puxar.
3. Leia como no `historico-borderline-180d`: alcance, visualizações, compartilhamentos e retenção são métricas distintas. Sem nota de viralidade, sem limiar, sem causa tirada de poucos posts.
4. Não compare número do TikTok com número do Instagram como se fossem a mesma métrica.

## Quando ele corrigir, rejeitar ou aprovar algo

Registre na hora em `memoria/correcoes.md`, no branch `main`, como manda o `CLAUDE.md`.
