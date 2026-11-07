import React, { useId } from "react";
import { useCurrentFrame } from "remotion";
import { C, TITLE_FONT } from "../lib/theme";
import { cleanId, STEP, stepIndex, useJitter } from "../lib/stop";

type Props = {
  text: string;
  x: number;
  y: number;
  /** Quadro local em que o carimbo comeca a cair. */
  at: number;
  fontSize?: number;
  color?: string;
  rotate?: number;
  seed: number;
};

/** Medida aproximada do Anton em caixa alta; o textLength corrige o resto. */
export const stampSize = (text: string, fontSize: number) => {
  const pad = fontSize * 0.42;
  return { w: Math.max(fontSize * 1.05, fontSize * 0.5 * text.length) + pad * 2, h: fontSize * 1.42, pad };
};

/** Carimbo com tinta falhada que cai em tres poses e bate no papel. */
export const Stamp: React.FC<Props> = ({ text, x, y, at, fontSize = 90, color = C.red, rotate = 0, seed }) => {
  const frame = useCurrentFrame();
  const id = cleanId(useId());
  const j = useJitter(`st${seed}`, 0.6);
  if (frame < at) return null;
  const s = stepIndex(frame - at);
  const scale = [1.7, 1.28, 0.95][s] ?? 1;
  const opacity = [0.25, 0.55, 1][s] ?? 0.9;
  const extraRot = [9, 4, -1][s] ?? 0;
  const { w, h, pad } = stampSize(text, fontSize);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(${j.x}px, ${j.y}px) rotate(${rotate + extraRot + j.r}deg) scale(${scale})`,
        transformOrigin: "50% 50%",
        opacity,
        mixBlendMode: "multiply",
      }}
    >
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        <defs>
          <filter id={`i${id}`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="3" seed={seed} result="n" />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -6 0 0 0 4.4"
              result="m"
            />
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="1" seed={seed + 2} result="n2" />
            <feColorMatrix
              in="n2"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 0 0 0 3.3"
              result="m2"
            />
            <feComposite in="m" in2="m2" operator="in" result="mask" />
            <feComposite in="SourceGraphic" in2="mask" operator="in" result="ink" />
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed={seed + 5} result="d" />
            <feDisplacementMap in="ink" in2="d" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#i${id})`}>
          <rect x={5} y={5} width={w - 10} height={h - 10} rx={12} fill="none" stroke={color} strokeWidth={fontSize * 0.085} />
          <rect
            x={fontSize * 0.17}
            y={fontSize * 0.17}
            width={w - fontSize * 0.34}
            height={h - fontSize * 0.34}
            rx={6}
            fill="none"
            stroke={color}
            strokeWidth={fontSize * 0.03}
          />
          <text
            x={w / 2}
            y={h / 2 + fontSize * 0.36}
            textAnchor="middle"
            fontFamily={TITLE_FONT}
            fontSize={fontSize}
            letterSpacing={fontSize * 0.04}
            textLength={w - pad * 2}
            lengthAdjust="spacingAndGlyphs"
            fill={color}
          >
            {text}
          </text>
        </g>
      </svg>
    </div>
  );
};

export const STAMP_IMPACT = 2 * STEP;
