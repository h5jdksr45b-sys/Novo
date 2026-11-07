import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../lib/theme";
import { PaperCutout } from "./PaperCutout";

/** Corte seco com uma folha de papel atravessando a tela em tres quadros. */
export const PaperWipe: React.FC<{ cuts: number[] }> = ({ cuts }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  for (const cut of cuts) {
    const k = frame - (cut - 1);
    if (k >= 0 && k < 3) {
      const pos = [0.62, 0.02, -0.66][k];
      const w = width * 1.25;
      const h = height * 1.3;
      return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <PaperCutout
            x={width * pos - (w - width) / 2}
            y={-(h - height) / 2}
            width={w}
            height={h}
            color={k === 1 ? C.creamDark : C.cream}
            seed={cut + k}
            rough={40}
            rotate={-7}
            lift={0.7}
            jitter={0}
          />
        </AbsoluteFill>
      );
    }
  }
  return null;
};
