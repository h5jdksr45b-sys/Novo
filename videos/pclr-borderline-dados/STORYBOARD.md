---
format: 1080x1920
duration: 38s
message: "No PCL-R, o TPB sem TPA pontua perto do grupo sem TPB nem TPA; o que leva a pontuação para perto do corte de psicopatia é a comorbidade com TPA."
arc: Pergunta → Escala e corte → Dados por grupo → Foco no TPB sem TPA → Comorbidade → Limites → Chamada
audience: Estudantes e profissionais de saúde mental e pessoas informadas que convivem com TPB
mode: autonomous
music: none
structure: concept-explainer
hook: rhetorical question
---

## Video direction

- **Silent film.** No narration, no music, no SFX. Every reveal is paced to on-screen reading time, not to a voiceover: one new piece of text at a time, each held long enough to read (about 0.4 s per word of new text, minimum 1.5 s).
- **Language.** All on-screen text is Brazilian Portuguese, copied exactly from each frame's narrative. Decimal comma (7,8 not 7.8). Never use an em dash, en dash, emoji or quotation marks in on-screen text.
- **Palette (from frame.md by role).** White ground `bg`. Ink `text` #1C2230 for headlines and numbers. `text-muted` #4A5263 for secondary lines. `text-light` #8A91A0 for axis ticks and footnotes. `primary` #2B5C9E is the ONLY fill accent: it marks the group TPB sem TPA. Other bars are neutral gray #C3C8D1. `negative` #C6372B is reserved for the PCL-R cut line at 30 and its label, nothing else. No gradients, no glows, no shadows, no textures, no AI-style backgrounds.
- **Type.** Inter only (frame.md display + body). Headlines weight 800, tight leading. Numbers weight 800 with tabular numerals.
- **Safe area.** Instagram covers the top and bottom of a Reel. Keep ALL text and the chart inside x 90–990 and y 280–1480 of the 1080x1920 canvas. Nothing important below y 1480.
- **Shared chart geometry (frame 2 only, but fixed so it reads as one instrument).** Plot area x 150–990, y 560 (value 40) to 1240 (value 0); linear scale 0–40, so value v sits at y = 1240 − v × 17. Four bars, 150 px wide, centered at x 255, 465, 675, 885, square bottoms on the baseline, 8 px top radius. Gridlines at 0, 10, 20, 30, 40 as 2 px #E7E9EE hairlines; baseline 3 px #C3C8D1; tick labels 30 px `text-light` right-aligned at x 130. Group labels on two lines under each bar at y ≈ 1262, 32 px. Value label above each bar, 46 px (52 px for the highlighted bar). Headline zone y 290–500 above the chart.
- **Motion grammar.** Long-tail settles (power3 out), no bounce, no overshoot. Bars grow from the baseline while their number counts up on the same ease. Lines draw left to right. Dimming is an opacity change to about 0.28. Text enters with a short rise (about 40 px) and fade; text leaves with a fade. Camera is locked: no push, no drift, no breathing. Held reads are still.
- **Rhythm.** Frame 1 is a quick type hook. Frame 2 is the long working shot, developing in clear stages. Frame 3 is a calm list. Frame 4 holds still on the call to action.
- **Negative list.** No slideshow behavior (everything dumped at once then frozen). No screensaver behavior (things floating independently). No icons, no stock imagery, no decorative shapes. No red anywhere except the cut line and its label. No wording changes.

## Frame 1 — Pergunta

- scene: A bold rhetorical question builds line by line on a white field
- voiceover: ""
- duration: 4.5s
- transition_in: cut
- status: outline
- src: compositions/frames/01-pergunta.html
- type: hook
- persuasion: Rhetorical question
- beat: curiosity
- blueprint: kinetic-type-beats (Adapt)
- focal: the question text
- roles: question = foreground subject · white field = background

narrativeRole: Opens the gap: how close is borderline to psychopathy, in numbers?
keyMessage: There is a measurable answer.

On-screen text, exactly, as four lines left-aligned at x 90, headline weight 800, about 96 px, top of block near y 420:
Quanto um homem / com borderline pontua / numa escala / de psicopatia?

Adapt: keep the kinetic-type build; no token swap, the statement builds line by line.
Scene 1 (0.0–0.5s): white field only.
Scene 2 (0.5–2.4s): the four lines rise in one after another, about 0.45 s apart, each settling on power3.
Scene 3 (2.4–4.5s): the question holds still for reading. The word psicopatia stays ink, not red.

## Frame 2 — Os dados

- scene: One bar chart instrument assembles and is then read in stages: scale and cut line, four bars counting up, focus on TPB sem TPA, focus on comorbidity, the over-30 split
- voiceover: ""
- duration: 22s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-dados.html
- type: feature_showcase
- persuasion: Progressive disclosure with concretization
- beat: comprehension
- blueprint: dataviz-countup (Adapt)
- focal: the four-bar chart
- roles: bars and value labels = foreground subject · cut line at 30 = supporting accent · gridlines and ticks = background · headline = supporting text above the chart

narrativeRole: Shows the measured scores and walks the viewer through what they mean, one reading at a time.
keyMessage: TPB alone scores near the comparison group and far from the cut; the comorbidity with TPA is what moves the score toward the cut.

Adapt: keep the count-up signature (bar growth and number count-up land together); drop the camera traversal, the stage stays locked and the reading changes through headlines and dimming. Use the shared chart geometry from Video direction.

Bars, left to right, with labels on two lines and values:
1. Sem TPB / nem TPA — 3,1 — gray
2. TPB / sem TPA — 7,8 — primary blue, label bold ink
3. TPA / (no second line) — 15,2 — gray
4. TPB / com TPA — 23,1 — gray

Headlines, one at a time in the headline zone (left-aligned x 90, weight 800, about 58 px, ink), each fading out before the next:
H1: PCL-R: escala de psicopatia, de 0 a 40.
H2: Média por grupo. Homens de 33 anos.
H3: TPB sem TPA fica a 4,7 pontos do grupo sem TPB nem TPA.
H4: O que leva a pontuação para perto do corte é o TPA junto.
H5: Acima de 30: nenhum do TPB sem TPA. Mais de 1 em 3 do TPB com TPA.

Scene 1 (0.0–0.6s): white field; gridlines and tick labels 0, 10, 20, 30, 40 fade in together, quiet.
Scene 2 (0.6–4.4s): H1 rises in. At 2.0s the red dashed cut line (6 px, dash 18 / gap 12) draws left to right across the plot at value 30 over about 1 s; at 2.8s its label Corte de psicopatia: 30 fades in, right-aligned to x 990, just above the line, 36 px weight 700 in `negative`. Hold.
Scene 3 (4.4–4.8s): H1 fades out.
Scene 4 (4.8–13.0s): H2 rises in at 4.8s. Bars grow one at a time, each over 1.2 s with its value counting up from 0,0 to its mean with one decimal and a comma, value label riding the bar top, group label fading in under the bar as it starts: bar 1 at 5.0s, bar 2 at 6.8s, bar 3 at 8.6s, bar 4 at 10.4s. Then hold all four, still.
Scene 5 (13.0–13.4s): H2 fades out.
Scene 6 (13.4–18.4s): H3 rises in. Bars 1, 3 and 4 with their labels dim to about 0.28; bar 2 stays full. A 4 px `text-muted` vertical rule appears just left of bar 2, spanning from the cut line down to the top of bar 2, and beside it, right-aligned, two lines 34 px: 22,2 pontos (weight 700 ink) / abaixo do corte (weight 500 `text-muted`). Place this label between the 30 and 20 gridlines so it overlaps neither tick labels nor bars. Hold.
Scene 7 (18.4–18.8s): H3 and the 22,2 annotation fade out.
Scene 8 (18.8–22.0s): H4 rises in at 18.8s; bar 4 and its labels return to full opacity, bar 2 stays full, bars 1 and 3 stay dim. At 20.4s H4 fades out and H5 rises in; hold still to the end.

Note: frame duration may need to extend so H5 gets at least 2.5 s of reading. If so, extend this frame to 23.5s and let Scene 8 run 18.8–23.5s with H5 entering at 20.6s.

## Frame 3 — Limites

- scene: A short stacked list of reading cautions appears one line at a time
- voiceover: ""
- duration: 6s
- transition_in: crossfade
- status: outline
- src: compositions/frames/03-limites.html
- type: benefit_highlight
- persuasion: Caveat for credibility
- beat: unease
- blueprint: compose
- focal: the three caution lines
- roles: caution lines = foreground subject · eyebrow = supporting · white field = background

narrativeRole: Grounds the numbers: what this study can and cannot say.
keyMessage: Small group, men only, and a group mean never diagnoses a person.

On-screen text, exactly, left-aligned at x 90:
Eyebrow, 44 px weight 700 in `primary` blue (red is reserved for the cut line): Leia com cuidado
Line 1, 54 px weight 700 ink: Amostra da comunidade, no Canadá. Só homens.
Line 2, same style: O grupo TPB sem TPA tem 12 pessoas.
Line 3, same style: Média de grupo não diagnostica ninguém.

Scene 1 (0.0–0.4s): white field.
Scene 2 (0.4–1.2s): eyebrow rises in near y 380, with a 60 x 4 px `primary` accent line above it.
Scene 3 (1.2–4.0s): line 1 near y 480, line 2 near y 680, line 3 near y 880 rise in one after another, about 0.9 s apart.
Scene 4 (4.0–6.0s): hold still.

## Frame 4 — Chamada

- scene: The call to action holds above the source line and the signature
- voiceover: ""
- duration: 5.5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-chamada.html
- type: cta
- persuasion: Specific share prompt
- beat: resolve
- blueprint: kinetic-type-beats (Adapt)
- focal: the call to action
- roles: call to action = foreground subject · source and signature = supporting · white field = background

narrativeRole: Closes with a concrete share prompt and the attribution.
keyMessage: Send this to someone who studies TPB with you.

On-screen text, exactly, left-aligned at x 90:
CTA, about 92 px weight 800 ink, near y 520: Manda para quem estuda TPB com você.
Source, 30 px weight 500 `text-muted`, near y 1040: Fonte: Robitaille et al., 2017. Borderline Personality Disorder and Emotion Dysregulation, 4:25.
Signature, two lines 34 px weight 600 `text-muted`, near y 1250: Dr. Fabio Schmidt / médico com foco em TPB, CRM-SP 183549
Disclaimer, 30 px weight 400 `text-light`, near y 1380: Conteúdo educativo. Não substitui avaliação individual.

Adapt: a single statement, no swap.
Scene 1 (0.0–0.8s): CTA rises in.
Scene 2 (0.8–1.6s): source, signature and disclaimer fade in together.
Scene 3 (1.6–5.5s): hold still to the end.
