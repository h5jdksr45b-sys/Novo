import React from "react";
import { Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const useIn = (start: number, dur = 14) => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
};

export const Reveal: React.FC<{ at: number; dy?: number; dx?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, dy = 24, dx = 0, style, children }) => {
  const p = useIn(at);
  return (
    <div style={{ opacity: p, transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px)`, ...style }}>{children}</div>
  );
};

export type Sfx = "click" | "pop" | "tick";
export const SfxAt: React.FC<{ at: number; kind?: Sfx; volume?: number }> = ({ at, kind = "click", volume = 0.6 }) => (
  <Sequence from={at} durationInFrames={10} layout="none">
    <Audio src={staticFile(`${kind}.wav`)} volume={volume} />
  </Sequence>
);
