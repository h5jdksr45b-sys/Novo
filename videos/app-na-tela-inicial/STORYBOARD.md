---
format: 1080x1920
duration: 30s
message: "Em três toques, o link vira um ícone na tela do celular"
arc: Hook → iPhone passo 1 → passo 2 → passo 3 → Android → Resultado
audience: pacientes do Dr. Fabio Schmidt que recebem um link no WhatsApp
mode: autonomous
music: none
captions: skipped (sem narração; todo o texto está na tela)
---

## Video direction

- **Palette (frame.md, blue-professional):** canvas cream `bg`; cobalt `primary` is the ONLY accent and marks the one thing to tap in every step (highlight ring, step number, tap dot); `text` for headlines, `text-muted` for helper lines; cards use `card-bg` + `border`, no shadows.
- **Type:** display face for step headlines and the big step numbers; body face for helper lines. Portrait 9:16: short lines, very large type, max ~18 characters per line on headlines. All text in Brazilian Portuguese, no em dash, no emoji.
- **Recurring layout (how-to grammar):** top ~30% = step label (cobalt pill "iPhone" or "Android" + big step number) and the instruction headline; middle ~50% = a phone (rounded device outline, cobalt-tinted border) showing the screen; the element to tap gets a cobalt ring that pulses ONCE, then a tap dot presses it (press-release-spring). Bottom ~17% kept clear (signature only on the last frame, above the band).
- **Motion grammar:** power3 long-tail settles, smooth over bouncy. Reveal order inside every step frame: headline first, then phone, then the cobalt ring on the target, then the tap. Never everything at t=0. Holds are still; no breathing, no drift.
- **Rhythm:** frames 2 to 4 share the same layout so the viewer learns the pattern; frame 5 (Android) compresses three mini-steps into one stacked strip for variety; frame 6 is the held payoff.
- **Negative list:** no emoji, no em dash, no purple-blue AI gradients, no bokeh, no real cursor arrow (a round tap dot only), no browser chrome beyond what is in the real screenshots, no front-load-then-freeze, no screensaver floating.

## Frame 1 — Link vira app

- scene: a link pill with socorro.base44.app folds into a rounded app icon labeled Botão de Apoio
- duration: 4s
- poster: 3.4s
- transition_in: cut
- status: outline
- voiceover: ""
- src: compositions/frames/01-link-vira-app.html
- type: hook
- beat: hook
- blueprint: compose
- focal: the link pill that becomes an app icon
- roles: link pill = foreground subject · app icon = foreground subject (after morph) · faint cobalt hairline grid = background (dim ~30%) · headline = supporting
- asset_candidates: []

Silent frame, reveals paced to the beat.
Scene 1 (0.0–1.2s): headline "Usa sempre o mesmo link?" lands upper third, per-word staggered reveal. Centered.
Scene 2 (1.2–2.4s): a wide cream card-pill with the text socorro.base44.app rises into the vertical center (~y 0.45). Centered, ~70% width.
Scene 3 (2.4–3.2s): the pill morphs into a square rounded app icon (card morph-anchor: uniform scale + radius change), cobalt fill, white shield glyph drawn in SVG, label "Botão de Apoio" beneath. Second line appears under the headline: "Deixe ele na tela do celular, como um app."
Scene 4 (3.2–4.0s): held read, still.

## Frame 2 — iPhone passo 1

- scene: real iPhone screenshot of the page; cobalt ring on the share button top right; tap
- duration: 5s
- poster: 4s
- transition_in: crossfade
- status: outline
- voiceover: ""
- src: compositions/frames/02-iphone-compartilhar.html
- type: step
- beat: comprehension
- blueprint: compose
- focal: the share button inside the real screenshot
- roles: phone with public/iphone-pagina.png = foreground subject · cobalt ring + tap dot = supporting · step label + headline = supporting
- asset_candidates: [public/iphone-pagina.png]

Scene 1 (0.0–1.0s): cobalt pill "iPhone" + big "1" top-left of the text block; headline "Abra o link e toque em compartilhar" reveals per word. Upper ~28%.
Scene 2 (1.0–2.2s): phone device frame rises in from below holding public/iphone-pagina.png (object-fit cover, top-aligned so the address bar and share icon are visible), ~62% of canvas height, centered.
Scene 3 (2.2–3.6s): zoom-to-target toward the top of the phone (address bar area, share icon at the right end of the bar, about 92% across and 8.5% down the screenshot); cobalt ring draws around the share icon (SVG self-draw).
Scene 4 (3.6–4.2s): tap dot presses the icon (press-release-spring), ring flashes once.
Scene 5 (4.2–5.0s): hold still. Helper line under headline in text-muted: "No Safari, o botão fica embaixo."

## Frame 3 — iPhone passo 2

- scene: real iPhone share menu; cobalt ring on Adicionar à Tela de Início; tap
- duration: 5s
- poster: 4s
- transition_in: crossfade
- status: outline
- voiceover: ""
- src: compositions/frames/03-iphone-adicionar-tela.html
- type: step
- beat: comprehension
- blueprint: compose
- focal: the row "Adicionar à Tela de Início" in the real screenshot
- roles: phone with public/iphone-menu.png = foreground subject · cobalt ring + tap dot = supporting · step label + headline = supporting
- asset_candidates: [public/iphone-menu.png]

Same layout as Frame 2 so the pattern is learned.
Scene 1 (0.0–1.0s): pill "iPhone" + big "2"; headline "Toque em Adicionar à Tela de Início" per-word reveal.
Scene 2 (1.0–2.0s): phone with public/iphone-menu.png appears (scale-swap from the previous phone position), full screenshot fit inside the screen.
Scene 3 (2.0–3.4s): depth-of-field dims everything in the screenshot except the row "Adicionar à Tela de Início" (row sits at about 53% down the screenshot, spanning 5% to 95% across); cobalt rounded-rect ring draws around that row.
Scene 4 (3.4–4.0s): tap dot presses the row.
Scene 5 (4.0–5.0s): hold still. Helper line: "Se não aparecer, role o menu para baixo."

## Frame 4 — iPhone passo 3

- scene: recreated confirmation sheet with the name field Botão de Apoio and the Adicionar button top right; tap
- duration: 4.5s
- poster: 3.8s
- transition_in: crossfade
- status: outline
- voiceover: ""
- src: compositions/frames/04-iphone-confirmar.html
- type: step
- beat: comprehension
- blueprint: compose
- focal: the Adicionar button on the recreated sheet
- roles: phone with a simple recreated iOS sheet (title "Adicionar à Tela de Início", left "Cancelar", right "Adicionar" in system blue, a row with the cobalt app icon and the editable name "Botão de Apoio") = foreground subject · cobalt ring + tap dot = supporting · headline = supporting
- asset_candidates: []

Scene 1 (0.0–0.9s): pill "iPhone" + big "3"; headline "Confira o nome e toque em Adicionar".
Scene 2 (0.9–2.0s): phone shows the recreated sheet sliding up from the bottom of the phone screen (simple light UI, neutral greys, no real brand marks).
Scene 3 (2.0–3.2s): cobalt ring draws around "Adicionar" at the top right of the sheet; tap dot presses it.
Scene 4 (3.2–4.5s): hold still. Helper line: "Você pode mudar o nome antes."

## Frame 5 — No Android

- scene: three stacked mini step cards for Android Chrome: three dots menu, Adicionar à tela inicial, Adicionar
- duration: 7s
- poster: 6.2s
- transition_in: crossfade
- status: outline
- voiceover: ""
- src: compositions/frames/05-android.html
- type: step
- beat: comprehension
- blueprint: compose
- focal: the vertical strip of three step cards
- roles: three step cards = foreground subject (each card: cobalt number, a tiny recreated UI fragment, short label) · pill "Android" + headline = supporting · faint hairline grid = background
- asset_candidates: []

Different framing for variety: full-width stacked strip.
Scene 1 (0.0–1.0s): pill "Android" + headline "No Android, pelo Chrome". Upper ~22%.
Scene 2 (1.0–2.6s): card 1 slides in: number "1", fragment = a mini address bar with three vertical dots drawn as three cobalt circles at its right end, a tap dot presses the dots; label "Toque nos três pontinhos".
Scene 3 (2.6–4.2s): card 2: number "2", fragment = a mini menu list with the row "Adicionar à tela inicial" highlighted by the cobalt ring; label "Adicionar à tela inicial".
Scene 4 (4.2–5.6s): card 3: number "3", fragment = a small dialog with "Cancelar" and "Adicionar" buttons, tap on "Adicionar"; label "Confirme em Adicionar".
Scene 5 (5.6–7.0s): helper line appears under the strip in text-muted: "Se aparecer Instalar app, pode tocar também." Then hold still. All content above the bottom 17% band.

## Frame 6 — Pronto

- scene: a phone home screen grid; the cobalt Botão de Apoio icon pops into an empty slot; payoff text and signature
- duration: 5.5s
- poster: 4.8s
- transition_in: crossfade
- status: outline
- voiceover: ""
- src: compositions/frames/06-pronto.html
- type: payoff
- beat: resolution
- blueprint: compose
- focal: the new app icon on the home screen
- roles: phone home screen with neutral grey placeholder icons (rounded squares, no logos) = background-ish foreground · cobalt Botão de Apoio icon = foreground subject · headline + signature = supporting
- asset_candidates: []

Scene 1 (0.0–1.0s): phone with a 4-column grid of soft grey placeholder icons, one slot empty. Centered, ~55% height, sitting slightly lower than center.
Scene 2 (1.0–2.0s): the cobalt shield icon spring-pops into the empty slot with label "Botão de Apoio"; one cobalt ring pulse.
Scene 3 (2.0–3.2s): headline above the phone: "Pronto." then second line "Abre com um toque, como um app."
Scene 4 (3.2–4.2s): signature fades in above the bottom band, small, text-muted: "Dr. Fabio Schmidt · Médico · CRM-SP 183549".
Scene 5 (4.2–5.5s): held final read, still.
