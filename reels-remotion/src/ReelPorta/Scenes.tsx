import React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Background } from "../Reel7Dias/Scenes";
import { COLORS, FONTS } from "../Reel7Dias/theme";
import { Door, DOOR, Silhouette } from "./Door";
import {
  ArticleIcon,
  BookIcon,
  ClipboardCheckIcon,
  ForumIcon,
  HeartBubbleIcon,
  SearchIcon,
  VideoIcon,
  WaveIcon,
} from "./Icons";
import { SceneText } from "./SceneText";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

const textSchema = {
  text: { type: "string", default: "", description: "Frase da cena" },
} as const satisfies InteractivitySchema;

type TextProps = { readonly text: string };

// Cena 1: busca por borderline e quatro resultados empilhados.
const BuscaInner: React.FC<TextProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const query = "borderline";
  const typed = Math.floor(
    interpolate(frame, [0.1 * fps, 1 * fps], [0, query.length], clamp),
  );
  const exit = [durationInFrames - 0.45 * fps, durationInFrames] as const;
  const results = [
    { Icon: BookIcon, a: 520, b: 380 },
    { Icon: ArticleIcon, a: 560, b: 300 },
    { Icon: VideoIcon, a: 480, b: 360 },
    { Icon: ForumIcon, a: 540, b: 260 },
  ];

  return (
    <>
      <Background />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 250,
          width: 840,
          height: 120,
          borderRadius: 60,
          border: `4px solid ${COLORS.cream}`,
          display: "flex",
          alignItems: "center",
          gap: 26,
          paddingLeft: 40,
          fontFamily: FONTS.sans,
          fontWeight: 500,
          fontSize: 50,
          color: COLORS.cream,
          opacity: interpolate(frame, [...exit], [1, 0], clamp),
        }}
      >
        <SearchIcon size={56} color={COLORS.cream} />
        <span>
          {query.slice(0, typed)}
          <span
            style={{
              color: COLORS.gold,
              opacity: Math.floor(frame / (0.25 * fps)) % 2 === 0 ? 1 : 0,
            }}
          >
            |
          </span>
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 410,
          width: 840,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          translate: interpolate(frame, [...exit], ["0px 0px", "-1100px 0px"], {
            ...clamp,
            easing: Easing.in(Easing.cubic),
          }),
        }}
      >
        {results.map(({ Icon, a, b }, i) => {
          const at = (0.55 + i * 0.16) * fps;
          return (
            <div
              key={i}
              style={{
                height: 130,
                borderRadius: 20,
                backgroundColor: "#121212",
                border: `2px solid ${COLORS.line}`,
                display: "flex",
                alignItems: "center",
                gap: 34,
                paddingLeft: 36,
                opacity: interpolate(
                  frame,
                  [at, at + 0.15 * fps],
                  [0, 1],
                  clamp,
                ),
                translate: interpolate(
                  frame,
                  [at, at + 0.45 * fps],
                  ["0px 120px", "0px 0px"],
                  { ...clamp, easing: outExpo },
                ),
              }}
            >
              <Icon size={60} color={COLORS.gold} />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <div
                  style={{
                    width: a,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#3a3a3a",
                  }}
                />
                <div
                  style={{
                    width: b,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#2a2a2a",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <SceneText text={text} gold={["borderline."]} />
    </>
  );
};

export const BuscaScene = Interactive.withSchema({
  Component: BuscaInner,
  componentName: "BuscaScene",
  schema: textSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});

// Cena 2: três cartões entram da direita e um contador soma 1, 2, 3.
const TresCartoesInner: React.FC<TextProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const cards = [
    { Icon: ClipboardCheckIcon, x: 96 },
    { Icon: WaveIcon, x: 396 },
    { Icon: HeartBubbleIcon, x: 696 },
  ];
  const arrivals = cards.map((_, i) => (0.15 + i * 0.4) * fps);
  const count = arrivals.filter((a) => frame >= a + 0.2 * fps).length;
  const shrink = [durationInFrames - 0.45 * fps, durationInFrames - 0.1 * fps];

  return (
    <>
      <Background />
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 250,
          fontFamily: FONTS.mono,
          fontWeight: 500,
          fontSize: 72,
          color: COLORS.gold,
          opacity: interpolate(frame, [...shrink], [1, 0], clamp),
        }}
      >
        {count}
        <span style={{ fontSize: 34, color: COLORS.creamDim }}>/3</span>
      </div>
      {cards.map(({ Icon, x }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: 450,
            width: 270,
            height: 330,
            borderRadius: 26,
            backgroundColor: "#121212",
            border: `3px solid ${COLORS.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(
              frame,
              [arrivals[i], arrivals[i] + 0.15 * fps],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [arrivals[i], arrivals[i] + 0.5 * fps, shrink[0], shrink[1]],
              ["900px 0px", "0px 0px", "0px 0px", `${405 - x}px 0px`],
              { ...clamp, easing: outExpo },
            ),
            scale: interpolate(frame, [...shrink], [1, 0], {
              ...clamp,
              easing: Easing.in(Easing.cubic),
              output: "perceptual-scale",
            }),
          }}
        >
          <Icon size={150} color={COLORS.gold} />
        </div>
      ))}
      <SceneText text={text} start={0.15} stagger={0.13} />
    </>
  );
};

export const TresCartoesScene = Interactive.withSchema({
  Component: TresCartoesInner,
  componentName: "TresCartoesScene",
  schema: textSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});

// Cena 3: a porta gira e bate. A tela treme e tudo para.
const PortaBateInner: React.FC<TextProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const impact = 0.75 * fps;
  const since = Math.max(0, frame - impact);
  const shakeAmp = interpolate(since, [0, 0.5 * fps], [26, 0], clamp);
  const shakeX = frame >= impact ? Math.sin(since * 2.9) * shakeAmp : 0;
  const shakeY = frame >= impact ? Math.cos(since * 3.7) * shakeAmp * 0.6 : 0;

  return (
    <>
      <Background />
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${shakeX}px ${shakeY}px`,
        }}
      >
        <Door
          angle={interpolate(frame, [0.1 * fps, impact], [62, 0], {
            ...clamp,
            easing: Easing.in(Easing.quad),
          })}
          glow={interpolate(frame, [impact, impact + 0.45 * fps], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          })}
          style={{
            opacity: interpolate(
              frame,
              [impact + 0.7 * fps, impact + 1.1 * fps],
              [1, 0.35],
              clamp,
            ),
          }}
        />
        <SceneText text={text} red={["porta"]} start={0.8} stagger={0.035} />
      </div>
    </>
  );
};

export const PortaBateScene = Interactive.withSchema({
  Component: PortaBateInner,
  componentName: "PortaBateScene",
  schema: textSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});

// Cena 4: a câmera anda para a direita. Porta à esquerda, silhueta à direita.
const OutroLadoInner: React.FC<TextProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = [durationInFrames - 0.5 * fps, durationInFrames] as const;
  const up = interpolate(frame, [...exit], [0, -1300], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });

  return (
    <>
      <Background />
      <Door
        angle={0}
        glow={1}
        style={{
          opacity: interpolate(frame, [0, 0.4 * fps], [0.35, 1], clamp),
          translate: `${interpolate(frame, [0, 0.7 * fps], [0, -250], {
            ...clamp,
            easing: Easing.inOut(Easing.cubic),
          })}px ${up}px`,
        }}
      />
      <Silhouette
        style={{
          left: 660,
          top: DOOR.top + DOOR.height - 296,
          translate: `${interpolate(frame, [0, 0.7 * fps], [520, 0], {
            ...clamp,
            easing: Easing.inOut(Easing.cubic),
          })}px ${up}px`,
          opacity: interpolate(frame, [0.2 * fps, 0.6 * fps], [0, 1], clamp),
        }}
      />
      <SceneText
        text={text}
        gold={["Protocolo", "7", "Dias"]}
        start={0.5}
        stagger={0.06}
        fontSize={88}
      />
    </>
  );
};

export const OutroLadoScene = Interactive.withSchema({
  Component: OutroLadoInner,
  componentName: "OutroLadoScene",
  schema: textSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});

// Cena 5: sete círculos, um por dia, e o COMEÇAR por último.
const SeteDiasInner: React.FC<TextProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const days = [1, 2, 3, 4, 5, 6, 7];
  const size = 96;
  const gap = 28;
  const rowLeft = (1080 - (7 * size + 6 * gap)) / 2;
  const cta = 1.75 * fps;

  return (
    <>
      <Background />
      <SceneText
        text={text}
        top={330}
        fontSize={96}
        stagger={0.07}
        exit={false}
      />
      {days.map((d, i) => {
        const at = (0.45 + i * 0.13) * fps;
        const x = rowLeft + i * (size + gap);
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: x,
              top: 640,
              width: size,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              opacity: interpolate(frame, [at, at + 0.12 * fps], [0, 1], clamp),
              translate: interpolate(
                frame,
                [at, at + 0.35 * fps],
                ["700px 0px", "0px 0px"],
                { ...clamp, easing: outExpo },
              ),
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                border: `5px solid ${COLORS.red}`,
                boxSizing: "border-box",
                backgroundColor: COLORS.red,
                scale: interpolate(
                  frame,
                  [at + 0.3 * fps, at + 0.45 * fps],
                  [1.12, 1],
                  { ...clamp, output: "perceptual-scale" },
                ),
                backgroundClip: "padding-box",
                opacity: 1,
                boxShadow: `inset 0 0 0 ${interpolate(
                  frame,
                  [at + 0.25 * fps, at + 0.4 * fps],
                  [size / 2, 0],
                  clamp,
                )}px ${COLORS.black}`,
              }}
            />
            <div
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 500,
                fontSize: 22,
                letterSpacing: "0.1em",
                color: COLORS.creamDim,
                whiteSpace: "nowrap",
              }}
            >
              DIA {d}
            </div>
          </div>
        );
      })}
      {/* Faixa vazia de 830 a 1130 px para a figurinha de link. */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 150,
          top: 1140,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          opacity: interpolate(frame, [cta, cta + 0.2 * fps], [0, 1], clamp),
          translate: interpolate(
            frame,
            [cta, cta + 0.5 * fps],
            ["0px 120px", "0px 0px"],
            { ...clamp, easing: outExpo },
          ),
        }}
      >
        <span
          style={{
            fontFamily: FONTS.title,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 80,
            color: COLORS.cream,
          }}
        >
          Responde
        </span>
        <span
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 110,
            letterSpacing: "0.04em",
            color: COLORS.gold,
          }}
        >
          COMEÇAR
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 1420,
          fontFamily: FONTS.mono,
          fontWeight: 500,
          fontSize: 24,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLORS.creamDim,
          opacity: interpolate(
            frame,
            [cta + 0.3 * fps, cta + 0.6 * fps],
            [0, 0.8],
            clamp,
          ),
        }}
      >
        Dr. Fabio Schmidt · CRM-SP 183549
      </div>
    </>
  );
};

export const SeteDiasScene = Interactive.withSchema({
  Component: SeteDiasInner,
  componentName: "SeteDiasScene",
  schema: textSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
