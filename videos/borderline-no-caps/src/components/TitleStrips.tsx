import React from "react";
import { useCurrentFrame } from "remotion";
import { C, TITLE_FONT } from "../lib/theme";
import { stepIndex } from "../lib/stop";
import { PaperCutout } from "./PaperCutout";

export type Strip = { text: string; at: number; bg?: string; color?: string; size?: number };

type Props = {
  lines: Strip[];
  x: number;
  y: number;
  maxWidth: number;
  gap?: number;
  seed: number;
  align?: "left" | "center";
};

const ROTS = [-1.6, 1.1, -0.6, 1.4];

/** Titulo em tiras de papel recortado que entram uma a uma. */
export const TitleStrips: React.FC<Props> = ({ lines, x, y, maxWidth, gap = 16, seed, align = "left" }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: maxWidth,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "center",
        gap,
      }}
    >
      {lines.map((l, i) => {
        const size = l.size ?? 110;
        if (frame < l.at) return <div key={i} style={{ height: size * 1.2 }} />;
        const s = stepIndex(frame - l.at);
        const pop = s === 0 ? 1.12 : s === 1 ? 0.97 : 1;
        const kick = s === 0 ? 3 : 0;
        return (
          <div key={i} style={{ transform: `scale(${pop})`, transformOrigin: "0% 50%" }}>
            <PaperCutout
              seed={seed + i * 13}
              color={l.bg ?? C.cream}
              rotate={ROTS[i % ROTS.length] + kick}
              rough={6}
              lift={s === 0 ? 0.6 : 0}
              padding={`${size * 0.1}px ${size * 0.2}px ${size * 0.06}px`}
            >
              <div
                style={{
                  fontFamily: TITLE_FONT,
                  fontSize: size,
                  lineHeight: 1.08,
                  color: l.color ?? C.ink,
                  letterSpacing: size * 0.01,
                  whiteSpace: "nowrap",
                  maxWidth: maxWidth - size * 0.4,
                }}
              >
                {l.text}
              </div>
            </PaperCutout>
          </div>
        );
      })}
    </div>
  );
};
