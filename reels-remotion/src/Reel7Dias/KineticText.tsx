import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "./theme";

export type Word = { readonly text: string; readonly color?: string };

// Uma frase por tela. Cada palavra entra deslizando de baixo, em sequência,
// e a frase inteira sai para a esquerda no fim da cena.
export const KineticText: React.FC<{
  readonly words: Word[];
  readonly durationInFrames: number;
  readonly fontSize?: number;
  readonly top?: number;
}> = ({ words, durationInFrames, fontSize = 112, top = 1020 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitStart = durationInFrames - 0.3 * fps;

  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 150,
        top,
        display: "flex",
        flexWrap: "wrap",
        columnGap: fontSize * 0.26,
        rowGap: fontSize * 0.08,
        fontFamily: FONTS.title,
        fontStyle: "italic",
        fontWeight: 900,
        fontSize,
        lineHeight: 1.04,
        letterSpacing: "-0.02em",
        color: COLORS.cream,
        opacity: interpolate(frame, [exitStart, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(
          frame,
          [exitStart, durationInFrames],
          ["0px 0px", "-140px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          },
        ),
      }}
    >
      {words.map((w, i) => {
        const start = 0.12 * fps + i * 0.09 * fps;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: fontSize * 0.12,
              marginBottom: -fontSize * 0.12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: w.color ?? COLORS.cream,
                translate: interpolate(
                  frame,
                  [start, start + 0.45 * fps],
                  ["0px 110%", "0px 0%"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              {w.text}
            </span>
          </span>
        );
      })}
    </div>
  );
};
