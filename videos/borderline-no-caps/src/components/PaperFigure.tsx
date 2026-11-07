import React, { useId } from "react";
import { C } from "../lib/theme";
import { cleanId, useJitter } from "../lib/stop";

type Props = {
  /** Posicao dos pes (centro inferior). */
  x: number;
  y: number;
  height?: number;
  color?: string;
  outline?: string;
  seed: number;
  /** Alterna as pernas para parecer passo. */
  walking?: boolean;
  step?: number;
  rotate?: number;
  lift?: number;
};

const STAND =
  "M30 2 a12 12 0 1 1 -0.1 0 Z M12 32 Q30 25 48 32 L55 76 L46 77 L45 118 L33 118 L32 82 L28 82 L27 118 L15 118 L14 77 L5 76 Z";
const WALK_A =
  "M30 2 a12 12 0 1 1 -0.1 0 Z M12 32 Q30 25 48 32 L56 72 L47 74 L46 82 L52 118 L40 118 L32 86 L28 86 L20 118 L8 118 L14 82 L13 74 L4 72 Z";
const WALK_B =
  "M30 2 a12 12 0 1 1 -0.1 0 Z M12 32 Q30 25 48 32 L53 76 L45 77 L43 118 L32 118 L31 82 L29 82 L28 118 L17 118 L15 77 L7 76 Z";

/** Boneco recortado sem rosto, com contorno de papel claro. */
export const PaperFigure: React.FC<Props> = ({
  x,
  y,
  height = 130,
  color = C.ink,
  outline = C.cream,
  seed,
  walking = false,
  step = 0,
  rotate = 0,
  lift = 0,
}) => {
  const id = cleanId(useId());
  const j = useJitter(`fg${seed}`, 0.8);
  const w = height / 2;
  const d = walking ? (step % 2 === 0 ? WALK_A : WALK_B) : STAND;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - height,
        width: w,
        height,
        transform: `translate(${j.x}px, ${j.y}px) rotate(${rotate + j.r}deg)`,
        transformOrigin: "50% 100%",
        filter: `drop-shadow(0px ${3 + lift * 18}px ${3 + lift * 14}px rgba(40,25,10,0.4))`,
      }}
    >
      <svg viewBox="-6 -6 72 132" width={w * 1.2} height={height * 1.1} style={{ position: "absolute", left: -w * 0.1, top: -height * 0.05, overflow: "visible" }}>
        <filter id={`f${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <g filter={`url(#f${id})`}>
          <path d={d} fill={outline} stroke={outline} strokeWidth={7} strokeLinejoin="round" />
          <path d={d} fill={color} />
        </g>
      </svg>
    </div>
  );
};
