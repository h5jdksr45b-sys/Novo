---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Quando a pessoa diz você não me ama no meio da briga, provar com fatos piora; responda ao medo do momento e mantenha o seu limite."
destination: instagram-reels
aspect: 1080x1920
language: pt-BR
audience: "Parceiros e familiares de pessoas com TPB"
length: 41s
angle: how-to
---

## Intent

Reel de alcance para o perfil Borderline Sem Estigma (Dr. Fabio Schmidt). Ideia 3 do lote: quando ela diz que você não ama, não tente provar. Pedido do Dr. Fabio: o mais dinâmico possível, com ícones, fundos, templates e elementos que deslizam, para prender atenção. Sem narração e sem música (o áudio é escolhido no Instagram).

## Assets

- assets/icons/*.svg — ícones Lucide (licença ISC em assets/icons/LICENSE-lucide).
- compositions/components/chat-thread.html — conversa de celular estilo mensagem (registry).
- compositions/message-thread-reveal.html — conversa completa em celular (registry, referência).
- compositions/components/notification-stack.html — pilha de notificações deslizando (registry).
- compositions/components/number-wheel.html — contador de dígitos rolando (registry).
- compositions/components/icon-morph-beat.html — ícone que se transforma (registry).
- compositions/components/mesh-gradient-bg.html — fundo de gradiente animado, seguro para render (registry).
- assets/gsap.min.js — GSAP local (o sandbox bloqueia o CDN).

## Notes

- Texto em português do Brasil, sem travessão, sem emoji, sem aspas nos textos da tela. Falas aparecem como balões de conversa, não entre aspas.
- Gênero neutro: o contato da conversa se chama Amor. Não usar ela ou ele.
- Mostrar a dor de quem diz a frase e preservar quem ouve: validar não apaga limite. Linha de segurança obrigatória: Se houver ameaça ou violência, a segurança vem primeiro.
- Título profissional: médico com foco em TPB, CRM-SP 183549. Nunca psiquiatra.
- Faixa segura do Instagram: conteúdo em x 90 a 990 e y 280 a 1480.
- Sem fotos de banco de imagem e sem rostos.
