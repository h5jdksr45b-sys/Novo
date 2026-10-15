---
format: 1080x1920
duration: 41s
message: "Quando a pessoa diz você não me ama no meio da briga, provar com fatos piora; responda ao medo do momento e mantenha o seu limite."
arc: Mensagem na briga → Lista de provas → Briga dobra → Virada → Responder ao medo → Manter o limite → Chamada
audience: Parceiros e familiares de pessoas com TPB
mode: autonomous
music: none
structure: how-to
hook: recognizable scene (a message in the middle of a fight)
---

## Video direction

- **Goal: maximum attention, never chaotic.** Something meaningful moves at least every 1.5 s: a bubble arrives, a card slides, an icon pops or morphs, a counter rolls, a background drifts. Every motion carries content; no decorative noise.
- **Silent film.** No narration, music or SFX. Pace every reveal to reading time: about 0.35 s per word of new text, minimum 1.2 s on screen before it can leave.
- **Language.** All on-screen text in Brazilian Portuguese, copied exactly from each frame. No em dash, no en dash, no emoji, no quotation marks. Spoken lines appear as chat bubbles, never in quotes. Gender neutral: the other person is the contact Amor.
- **Palette (frame.md roles).** Ground white `bg` with a soft animated blue mesh gradient behind content (component `compositions/components/mesh-gradient-bg.html`, retinted to very light blues: #FFFFFF, #EEF2F8, #DCE4F0, low contrast so text stays AA). Ink #1C2230 for headlines. `text-muted` #4A5263. Brand blue `primary` #2B5C9E for the user's outgoing bubbles, icons, accent lines and highlights. Red `negative` #C6372B only for the escalation beat (frame 3) and the incoming bubble's heart-crack icon. Incoming bubbles light gray #E9ECF1 with ink text.
- **Type.** Inter only. Kinetic headlines weight 800, 76–110 px, tight leading, left-aligned at x 90. Bubble text 40–44 px weight 500.
- **Icons.** Lucide line icons from `assets/icons/*.svg` (inline the SVG markup; stroke = currentColor, stroke-width 2). Show icons inside 96–140 px rounded-square or circle chips with a light blue fill #EEF2F8 and blue stroke, popping in with a quick scale-in (0.6→1, no bounce past 1.04).
- **Phone.** When a frame uses the chat, show a clean phone screen (rounded rectangle, ~760 px wide, centered, thin #DCE4F0 border, white screen, top bar with contact name Amor and a small round avatar with the user-round icon). Reuse the bubble look, tails and typing dots from `compositions/components/chat-thread.html` and `compositions/message-thread-reveal.html` (adapt, do not copy their sample text).
- **Motion grammar.** Fast in, long settle: power3/expo out, 0.35–0.6 s entrances. Slides travel 80–160 px. Cards and notifications slide-settle into stacks (reference `compositions/components/notification-stack.html`). Counters roll (reference `compositions/components/number-wheel.html`). Icon changes morph (reference `compositions/components/icon-morph-beat.html`). One subtle continuous camera push (scale 1.00→1.04) per frame is allowed; no wobble, no floating screensaver motion.
- **Safe area.** All text, phone and icons inside x 90–990 and y 280–1480 of the 1080x1920 canvas. Background may be full bleed.
- **Negative list.** No stock photos, no faces, no emoji, no hearts as decoration (the heart icons appear only where named). No red outside frame 3 and the heart-crack icon. No slideshow dumps; no everything-floating screensaver. No wording changes.

## Frame 1 — A mensagem

- scene: A phone slides up into frame; mid-fight, a message from Amor pops in: Você não me ama.
- voiceover: ""
- duration: 5s
- transition_in: cut
- status: animated
- src: compositions/frames/01-mensagem.html
- type: hook
- persuasion: Recognizable scene
- beat: recognition
- blueprint: prompt-type-submit-generate (Adapt)
- focal: the incoming chat bubble
- roles: phone with chat = foreground subject · mesh gradient = background · typing dots and heart-crack chip = supporting

narrativeRole: Drops the viewer into the exact moment they know too well.
keyMessage: You have heard this line in a fight.

Adapt: keep the typing-then-arrive beat; the payload is one incoming message.
Scene 1 (0.0–0.8s): mesh gradient drifting; the phone slides up from below (about 160 px) and settles centered, top bar shows Amor.
Scene 2 (0.8–1.8s): typing dots appear in a gray incoming bubble and pulse.
Scene 3 (1.8–2.4s): the dots resolve into the incoming bubble: Você não me ama. It pops from its corner. A small red heart-crack icon chip pops beside the bubble.
Scene 4 (2.4–5.0s): above the phone, kinetic headline rises in at y ≈ 300, weight 800, about 64 px, ink: No meio da briga. Hold; slow push 1.00→1.03.

## Frame 2 — As provas

- scene: The user fires back a stack of proofs; each one slides into a growing stack with a check icon and a counter rolling up
- voiceover: ""
- duration: 7s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/02-provas.html
- type: pain_point
- persuasion: Escalation through repetition
- beat: tension
- blueprint: grid-card-assemble (Adapt)
- focal: the sliding stack of proof cards
- roles: proof cards = foreground subject · counter = supporting · mesh gradient = background

narrativeRole: Shows the instinctive defense: listing proofs.
keyMessage: The natural reaction is to prove love with facts.

Headline at top (x 90, y ≈ 300, 80 px, weight 800, ink): Você listou provas.
Proof cards (white rounded cards, 900 px wide, blue left accent bar, Lucide icon chip on the left, text 40 px weight 600 ink), sliding in from the right and settling into a vertical stack from y ≈ 520 downward, each new card pushing the previous ones down slightly (notification-stack behavior):
1. icon hospital: Eu fiquei com você no hospital.
2. icon plane: Eu cancelei a viagem.
3. icon car: Eu atravesso a cidade toda sexta.
Counter chip at the top right of the stack (blue, number-wheel rolling digits): 1, 2, 3, then rolls fast to 10 with the label provas.

Scene 1 (0.0–0.9s): headline rises in.
Scene 2 (0.9–4.6s): cards 1, 2, 3 slide in at 1.0s, 2.2s, 3.4s; counter rolls 1→2→3 with each card.
Scene 3 (4.6–5.6s): counter spins quickly from 3 to 10; three more ghost cards (no text, light gray) flick in behind the stack to suggest more proofs.
Scene 4 (5.6–7.0s): hold.

## Frame 3 — A briga dobra

- scene: The stack shakes off; a big number wheel rolls 1 to 2 with x, the screen tints red for one beat: E a briga dobrou.
- voiceover: ""
- duration: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/03-dobrou.html
- type: pain_point
- persuasion: Consequence reveal
- beat: frustration
- blueprint: kinetic-type-beats (Adapt)
- focal: the doubling number
- roles: number = foreground subject · headline = supporting · red-tinted field = background

narrativeRole: The proof backfires.
keyMessage: Proving made it worse.

Scene 1 (0.0–0.5s): white field with a very light red wash (#C6372B at 6 percent) sweeping in from the left.
Scene 2 (0.5–1.8s): a huge number wheel (about 360 px, weight 800, ink) rolls from 1 to 2 and a red x appears before it, reading 2x; a red volume-2 icon chip pops beside it.
Scene 3 (1.8–4.0s): headline slams up below at y ≈ 1080, 96 px weight 800 ink: E a briga dobrou. Hold.

## Frame 4 — A virada

- scene: Kinetic type turns the logic: the line is not an audit, it is a fear right now; a scale icon morphs into an alarm-clock-check icon
- voiceover: ""
- duration: 7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-virada.html
- type: product_intro
- persuasion: Reframe
- beat: clarity
- blueprint: kinetic-type-beats (Adapt)
- focal: the reframing statement
- roles: statements = foreground subject · morphing icon = supporting · mesh gradient = background

narrativeRole: Names what the sentence actually means.
keyMessage: It speaks about fear in the moment, not about the history of the relationship.

Lines, left-aligned x 90, weight 800 ink, each entering on its own beat with a rise:
L1 (about 76 px): A frase não pede um balanço da relação.
L2 (about 96 px, the word medo in blue): Ela fala de um medo.
L3 (about 96 px, blue): Agora.
Then a smaller line (52 px weight 600 text-muted): Provar com fatos responde a uma pergunta que ninguém fez.

Icon: a 140 px chip at upper right of the text block shows the scale icon (balance) while L1 is on screen, then morphs into the clock icon when L2 and L3 land (icon-morph-beat behavior).
Scene 1 (0.0–1.8s): L1 rises in; scale icon pops.
Scene 2 (1.8–3.2s): L1 dims to 40 percent; L2 rises in; icon morphs to clock.
Scene 3 (3.2–4.2s): L3 punches in with a quick scale 1.15→1.
Scene 4 (4.2–7.0s): the small line slides up at y ≈ 1250. Hold.

## Frame 5 — Responda ao medo

- scene: Back on the phone, the user types a new reply; the outgoing blue bubble lands; a label chip names the move
- voiceover: ""
- duration: 7s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/05-medo.html
- type: feature_showcase
- persuasion: Model the alternative
- beat: relief
- blueprint: prompt-type-submit-generate (Adapt)
- focal: the outgoing bubble
- roles: phone with chat = foreground subject · label chip with hand-heart icon = supporting · mesh gradient = background

narrativeRole: Shows what to say instead.
keyMessage: Answer the fear, not the accusation.

Label chip above the phone (blue pill, white text 40 px weight 700, hand-heart icon): Responda ao medo
Phone shows the previous incoming bubble Você não me ama. at the top (already there), then the user's composer types the reply letter by letter, the send icon taps, and the outgoing blue bubble lands (white text):
Eu estou aqui. Parece que você está com medo de me perder.
Scene 1 (0.0–0.8s): phone slides in; label chip pops.
Scene 2 (0.8–3.6s): reply types in the composer field.
Scene 3 (3.6–4.2s): send icon taps; bubble slides up into the thread and settles.
Scene 4 (4.2–7.0s): hold; slow push.

## Frame 6 — Mantenha o limite

- scene: A second outgoing bubble sets the limit; a shield icon chip and a safety line appear below the phone
- voiceover: ""
- duration: 7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-limite.html
- type: feature_showcase
- persuasion: Validation with boundaries
- beat: resolve
- blueprint: prompt-type-submit-generate (Adapt)
- focal: the limit bubble
- roles: phone with chat = foreground subject · label chip with shield icon = supporting · safety line = supporting · mesh gradient = background

narrativeRole: Validation does not erase limits or safety.
keyMessage: Care and limit together.

Label chip above the phone (blue pill, shield icon): E mantenha o limite
Phone continues the same thread (previous outgoing bubble visible above), then a second outgoing blue bubble lands:
Não vou continuar se tiver xingamento. Volto em 20 minutos para conversar.
A clock icon chip pops next to the bubble when it lands.
Below the phone at y ≈ 1400, 36 px weight 600 ink on a light card with the siren icon: Se houver ameaça ou violência, a segurança vem primeiro.
Scene 1 (0.0–0.8s): label chip swaps in (shield icon pops).
Scene 2 (0.8–2.6s): typing dots, then the bubble lands; clock chip pops.
Scene 3 (2.6–4.0s): safety card slides up.
Scene 4 (4.0–7.0s): hold.

## Frame 7 — Chamada

- scene: The phone shrinks away; the call to action builds with a send icon flying off; signature below
- voiceover: ""
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-chamada.html
- type: cta
- persuasion: Specific share prompt
- beat: resolve
- blueprint: kinetic-type-beats (Adapt)
- focal: the call to action
- roles: call to action = foreground subject · send icon = supporting · signature = supporting · mesh gradient = background

narrativeRole: Asks for the share to a specific person.
keyMessage: Send this to someone living this fight.

CTA, x 90, y ≈ 560, 96 px weight 800 ink, the word briga in blue: Manda para quem vive essa briga.
A blue send icon chip pops to the right of the last line and its arrow flicks out to the upper right once.
Signature at y ≈ 1270, two lines 34 px weight 600 text-muted: Dr. Fabio Schmidt / médico com foco em TPB, CRM-SP 183549
Disclaimer at y ≈ 1380, 30 px weight 400 text-light: Conteúdo educativo. Não substitui avaliação individual.
Scene 1 (0.0–1.0s): CTA rises in line by line.
Scene 2 (1.0–1.6s): send icon pops and flicks.
Scene 3 (1.6–2.2s): signature and disclaimer fade in.
Scene 4 (2.2–4.5s): hold still.
