import React from "react";
import { random } from "remotion";
import { C } from "../lib/theme";
import { useJitter } from "../lib/stop";

type Props = { x: number; y: number; width?: number; height?: number; rotate?: number; seed: number };

/** Fita crepe com pontas serrilhadas. */
export const Tape: React.FC<Props> = ({ x, y, width = 190, height = 54, rotate = 0, seed }) => {
  const j = useJitter(`tp${seed}`, 0.5);
  const teeth = 7;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const t = (i / teeth) * 100;
    left.push(`${(random(`tl${seed}${i}`) * 5).toFixed(1)}% ${t}%`);
    right.push(`${(100 - random(`tr${seed}${i}`) * 5).toFixed(1)}% ${100 - t}%`);
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        background: C.tape,
        clipPath: `polygon(${[...left, ...right].join(",")})`,
        transform: `translate(${j.x}px, ${j.y}px) rotate(${rotate + j.r}deg)`,
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.12)",
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <filter id={`tf${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed={seed} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  1.2 0 0 0 -0.45" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#tf${seed})`} />
      </svg>
    </div>
  );
};
