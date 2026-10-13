import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KineticText } from "./KineticText";
import { COLORS, FONTS } from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

// Rótulo pequeno em fonte mono, como no site.
const Label: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      fontFamily: FONTS.mono,
      fontWeight: 500,
      fontSize: 30,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: COLORS.creamDim,
      ...style,
    }}
  >
    {children}
  </div>
);

// Fundo comum: grade de pontos que desliza devagar, sem chamar atenção.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLORS.line} 2px, transparent 2px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `${-frame * 0.6}px ${-frame * 0.3}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, transparent 30%, rgba(8,8,8,0.92) 78%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Esquema entra deslizando da direita e sai para a esquerda.
const SlideIn: React.FC<{
  readonly durationInFrames: number;
  readonly children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        translate: interpolate(
          frame,
          [0, 0.5 * fps, durationInFrames - 0.3 * fps, durationInFrames],
          ["260px 0px", "0px 0px", "0px 0px", "-260px 0px"],
          { ...clamp, easing: outExpo },
        ),
        opacity: interpolate(
          frame,
          [0, 0.3 * fps, durationInFrames - 0.3 * fps, durationInFrames],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// 0 a 2,5 s
export const CriseScene: React.FC<{ readonly durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <SlideIn durationInFrames={durationInFrames}>
        <svg
          width={1080}
          height={900}
          viewBox="0 0 1080 900"
          style={{ position: "absolute", top: 80 }}
        >
          {/* Linha estável que se quebra em zigue-zague no meio. */}
          <path
            d="M 60 520 L 380 520 L 420 430 L 470 610 L 520 400 L 570 640 L 620 450 L 660 520 L 1020 520"
            fill="none"
            stroke={COLORS.red}
            strokeWidth={6}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(
              frame,
              [0.1 * fps, 1.2 * fps],
              [1, 0],
              { ...clamp, easing: Easing.inOut(Easing.cubic) },
            )}
          />
          {/* Pessoa: cabeça e ombros. */}
          <g
            style={{
              scale: interpolate(frame, [0, 0.6 * fps], [0.6, 1], {
                ...clamp,
                easing: Easing.spring({ damping: 12 }),
                output: "perceptual-scale",
              }),
              transformOrigin: "540px 260px",
            }}
          >
            <circle
              cx={540}
              cy={260}
              r={150}
              fill={COLORS.black}
              stroke={COLORS.cream}
              strokeWidth={5}
            />
            <clipPath id="busto">
              <circle cx={540} cy={260} r={147} />
            </clipPath>
            <g clipPath="url(#busto)">
              <circle cx={540} cy={215} r={50} fill={COLORS.cream} />
              <ellipse
                cx={540}
                cy={395}
                rx={110}
                ry={105}
                fill={COLORS.cream}
              />
            </g>
          </g>
        </svg>
      </SlideIn>
      <KineticText
        durationInFrames={durationInFrames}
        words={[
          { text: "A" },
          { text: "filha" },
          { text: "entrou" },
          { text: "em" },
          { text: "crise." },
        ]}
      />
    </AbsoluteFill>
  );
};

const Pin: React.FC<{ readonly x: number; readonly color: string }> = ({
  x,
  color,
}) => (
  <g transform={`translate(${x} 0)`}>
    <path
      d="M 0 470 C -70 380 -95 340 -95 290 A 95 95 0 1 1 95 290 C 95 340 70 380 0 470 Z"
      fill={COLORS.black}
      stroke={color}
      strokeWidth={6}
    />
    <circle cx={0} cy={288} r={34} fill={color} />
  </g>
);

// 2,5 a 5 s
export const CidadeScene: React.FC<{ readonly durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Os dois pinos começam juntos e se afastam.
  const spread = interpolate(frame, [0.15 * fps, 1.3 * fps], [40, 330], {
    ...clamp,
    easing: outExpo,
  });
  return (
    <AbsoluteFill>
      <SlideIn durationInFrames={durationInFrames}>
        <svg
          width={1080}
          height={900}
          viewBox="0 0 1080 900"
          style={{ position: "absolute", top: 80 }}
        >
          <line
            x1={540 - spread}
            y1={470}
            x2={540 + spread}
            y2={470}
            stroke={COLORS.creamDim}
            strokeWidth={5}
            strokeDasharray="4 22"
            strokeLinecap="round"
          />
          <Pin x={540 - spread} color={COLORS.cream} />
          <Pin x={540 + spread} color={COLORS.red} />
        </svg>
        <Label
          style={{
            left: 540 - spread - 70,
            top: 640,
            opacity: interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], clamp),
          }}
        >
          Filha
        </Label>
        <Label
          style={{
            left: 540 + spread - 50,
            top: 640,
            color: COLORS.red,
            opacity: interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], clamp),
          }}
        >
          Mãe
        </Label>
      </SlideIn>
      <KineticText
        durationInFrames={durationInFrames}
        words={[
          { text: "A" },
          { text: "mãe" },
          { text: "estava" },
          { text: "em" },
          { text: "outra", color: COLORS.red },
          { text: "cidade.", color: COLORS.red },
        ]}
      />
    </AbsoluteFill>
  );
};

// 5 a 8 s
export const ProtocoloScene: React.FC<{
  readonly durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const days = [1, 2, 3, 4, 5, 6, 7];
  return (
    <AbsoluteFill>
      <SlideIn durationInFrames={durationInFrames}>
        {/* Tela de aula com botão de play. */}
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 250,
            width: 700,
            height: 400,
            borderRadius: 24,
            border: `5px solid ${COLORS.cream}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={150} height={150} viewBox="0 0 150 150">
            <circle
              cx={75}
              cy={75}
              r={70}
              fill="none"
              stroke={COLORS.gold}
              strokeWidth={5}
            />
            <path d="M 60 45 L 108 75 L 60 105 Z" fill={COLORS.gold} />
          </svg>
        </div>
        {/* Sete dias, um por vez. */}
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 700,
            width: 700,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {days.map((d) => (
            <div
              key={d}
              style={{
                width: 82,
                height: 82,
                borderRadius: 12,
                border: `4px solid ${COLORS.gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.mono,
                fontWeight: 500,
                fontSize: 34,
                color: COLORS.black,
                backgroundColor: COLORS.gold,
                opacity: interpolate(
                  frame,
                  [0.5 * fps + d * 0.17 * fps, 0.7 * fps + d * 0.17 * fps],
                  [0.15, 1],
                  clamp,
                ),
                translate: interpolate(
                  frame,
                  [0.5 * fps + d * 0.17 * fps, 0.8 * fps + d * 0.17 * fps],
                  ["0px 40px", "0px 0px"],
                  { ...clamp, easing: outExpo },
                ),
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </SlideIn>
      <KineticText
        durationInFrames={durationInFrames}
        words={[
          { text: "Ela" },
          { text: "tinha" },
          { text: "assistido" },
          { text: "ao" },
          { text: "Protocolo", color: COLORS.gold },
          { text: "7", color: COLORS.gold },
          { text: "Dias.", color: COLORS.gold },
        ]}
      />
    </AbsoluteFill>
  );
};

// Balão de mensagem genérico, sem texto.
const Bubble: React.FC<{
  readonly side: "left" | "right";
  readonly width: number;
  readonly delay: number;
}> = ({ side, width, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        alignSelf: side === "left" ? "flex-start" : "flex-end",
        width,
        height: 74,
        borderRadius: 37,
        borderBottomLeftRadius: side === "left" ? 8 : 37,
        borderBottomRightRadius: side === "right" ? 8 : 37,
        backgroundColor: side === "right" ? COLORS.cream : COLORS.creamDim,
        opacity: interpolate(
          frame,
          [delay * fps, (delay + 0.2) * fps],
          [0, side === "right" ? 0.9 : 0.45],
          clamp,
        ),
        translate: interpolate(
          frame,
          [delay * fps, (delay + 0.4) * fps],
          [side === "left" ? "-40px 30px" : "40px 30px", "0px 0px"],
          { ...clamp, easing: outExpo },
        ),
        flexShrink: 0,
      }}
    />
  );
};

// 8 a 11 s
export const MensagemScene: React.FC<{
  readonly durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <SlideIn durationInFrames={durationInFrames}>
        {/* Celular com a conversa subindo. */}
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 170,
            width: 500,
            height: 760,
            borderRadius: 64,
            border: `5px solid ${COLORS.cream}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 60,
              display: "flex",
              flexDirection: "column",
              gap: 26,
              translate: interpolate(
                frame,
                [1.4 * fps, 2.6 * fps],
                ["0px 0px", "0px -200px"],
                { ...clamp, easing: Easing.inOut(Easing.cubic) },
              ),
            }}
          >
            <Bubble side="left" width={300} delay={0.2} />
            <Bubble side="right" width={340} delay={0.55} />
            <Bubble side="right" width={220} delay={0.8} />
            <Bubble side="left" width={260} delay={1.15} />
            <Bubble side="right" width={360} delay={1.5} />
            <Bubble side="left" width={200} delay={1.85} />
            <Bubble side="right" width={300} delay={2.2} />
            <Bubble side="right" width={240} delay={2.45} />
          </div>
        </div>
      </SlideIn>
      <KineticText
        durationInFrames={durationInFrames}
        words={[
          { text: "E" },
          { text: "conduziu" },
          { text: "a" },
          { text: "crise" },
          { text: "por" },
          { text: "mensagem" },
          { text: "de" },
          { text: "texto." },
        ]}
      />
    </AbsoluteFill>
  );
};

// 11 a 14 s
export const ChamadaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 150,
          top: 560,
          fontFamily: FONTS.title,
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: 132,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: COLORS.gold,
          translate: interpolate(
            frame,
            [0, 0.5 * fps],
            ["220px 0px", "0px 0px"],
            { ...clamp, easing: outExpo },
          ),
          opacity: interpolate(frame, [0, 0.25 * fps], [0, 1], clamp),
        }}
      >
        Protocolo 7 Dias.
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 150,
          top: 920,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 30,
          fontFamily: FONTS.title,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 88,
          color: COLORS.cream,
          translate: interpolate(
            frame,
            [0.35 * fps, 0.85 * fps],
            ["220px 0px", "0px 0px"],
            { ...clamp, easing: outExpo },
          ),
          opacity: interpolate(frame, [0.35 * fps, 0.6 * fps], [0, 1], clamp),
        }}
      >
        Responde
        <span
          style={{
            fontFamily: FONTS.sans,
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: 80,
            letterSpacing: "0.06em",
            color: COLORS.cream,
            backgroundColor: COLORS.red,
            padding: "14px 34px",
            borderRadius: 8,
            scale: interpolate(
              frame,
              [0.9 * fps, 1.1 * fps, 1.3 * fps],
              [1, 1.08, 1],
              { ...clamp, output: "perceptual-scale" },
            ),
          }}
        >
          COMEÇAR
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 1210,
          fontFamily: FONTS.sans,
          fontWeight: 500,
          fontSize: 40,
          color: COLORS.cream,
          opacity: interpolate(frame, [0.8 * fps, 1.1 * fps], [0, 0.85], clamp),
        }}
      >
        Se houver risco, ligue 192.
      </div>
      <Label
        style={{
          left: 96,
          top: 1340,
          fontSize: 26,
          opacity: interpolate(frame, [1 * fps, 1.3 * fps], [0, 0.8], clamp),
        }}
      >
        Dr. Fabio Schmidt · CRM-SP 183549
      </Label>
    </AbsoluteFill>
  );
};
