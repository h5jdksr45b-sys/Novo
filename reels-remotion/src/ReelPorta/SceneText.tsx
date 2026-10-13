import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../Reel7Dias/theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const normalize = (w: string) => w.toLowerCase().replace(/[.,;:!?]/g, "");

// Frase da cena. As palavras entram deslizando de baixo, uma a uma, a partir
// de `start` segundos. Palavras listadas em `red` ou `gold` mudam de cor.
// No fim da cena a frase sai para a esquerda.
export const SceneText: React.FC<{
  readonly text: string;
  readonly red?: string[];
  readonly gold?: string[];
  readonly start?: number;
  readonly stagger?: number;
  readonly top?: number;
  readonly fontSize?: number;
  readonly exit?: boolean;
}> = ({
  text,
  red = [],
  gold = [],
  start = 0.12,
  stagger = 0.08,
  top = 1090,
  fontSize = 100,
  exit = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exitStart = exit ? durationInFrames - 0.3 * fps : durationInFrames;
  const exitEnd = exit ? durationInFrames : durationInFrames + 1;
  const redSet = new Set(red.map(normalize));
  const goldSet = new Set(gold.map(normalize));

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
        rowGap: fontSize * 0.06,
        fontFamily: FONTS.title,
        fontStyle: "italic",
        fontWeight: 900,
        fontSize,
        lineHeight: 1.04,
        letterSpacing: "-0.02em",
        opacity: interpolate(frame, [exitStart, exitEnd], [1, 0], clamp),
        translate: interpolate(
          frame,
          [exitStart, exitEnd],
          ["0px 0px", "-140px 0px"],
          { ...clamp, easing: Easing.in(Easing.cubic) },
        ),
      }}
    >
      {text.split(" ").map((word, i) => {
        const at = (start + i * stagger) * fps;
        const key = normalize(word);
        const color = redSet.has(key)
          ? COLORS.red
          : goldSet.has(key)
            ? COLORS.gold
            : COLORS.cream;
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
                color,
                translate: interpolate(
                  frame,
                  [at, at + 0.45 * fps],
                  ["0px 110%", "0px 0%"],
                  { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
                ),
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};
