import React, { useId } from "react";
import { C } from "../lib/theme";
import { cleanId } from "../lib/stop";

type Props = {
  d: string;
  /** Ponta da seta: ponto final e angulo em graus. */
  head?: { x: number; y: number; angle: number };
  progress: number;
  color?: string;
  width?: number;
  seed?: number;
};

/** Traco de caneta desenhado em degraus. Coordenadas no espaco da cena. */
export const PenArrow: React.FC<Props> = ({ d, head, progress, color = C.ink, width = 7, seed = 3 }) => {
  const id = cleanId(useId());
  if (progress <= 0) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
      <filter id={`p${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <g filter={`url(#p${id})`} stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.92}>
        <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} />
        {head && progress >= 1 ? (
          <path
            d={`M ${-width * 4} ${-width * 2.6} L 0 0 L ${-width * 4} ${width * 2.6}`}
            transform={`translate(${head.x} ${head.y}) rotate(${head.angle})`}
          />
        ) : null}
      </g>
    </svg>
  );
};
