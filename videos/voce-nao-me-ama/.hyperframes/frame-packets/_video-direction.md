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


## Shared build notes
- Load GSAP from the local file assets/gsap.min.js (script src="assets/gsap.min.js"); the sandbox blocks CDNs.
- Icons: read the needed SVG from assets/icons/<name>.svg and inline its markup (stroke=currentColor).
- Registry references to read and adapt (do not mount them unchanged): compositions/components/chat-thread.html, compositions/message-thread-reveal.html, compositions/components/notification-stack.html, compositions/components/number-wheel.html, compositions/components/icon-morph-beat.html, compositions/components/mesh-gradient-bg.html.
- Every frame paints its own full-duration background clip: white plus the soft animated light-blue mesh gradient (adapt mesh-gradient-bg.html, retinted; deterministic, seek-safe).
