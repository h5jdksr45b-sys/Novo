import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperCutout } from "../components/PaperCutout";
import { PaperFigure } from "../components/PaperFigure";
import { Tape } from "../components/Tape";
import { TitleStrips } from "../components/TitleStrips";
import { C, SAFE, TITLE_FONT } from "../lib/theme";
import { progress, stepped, useLayout } from "../lib/stop";

type Band = { label: string; n: number; bg: string; fg: string };
const BANDS: Band[] = [
  { label: "UBS", n: 5, bg: C.cream, fg: C.ink },
  { label: "GRUPO", n: 3, bg: C.kraftLight, fg: C.ink },
  { label: "CAPS", n: 1, bg: C.creamDark, fg: C.ink },
  { label: "CRISE", n: 1, bg: C.red, fg: C.cream },
];
// Ordem em que os dez bonecos caem (indice da camada).
const ORDER = [0, 0, 1, 0, 2, 0, 1, 3, 0, 1];
const FIRST_DROP = 30;
const INTERVAL = 13;
const FALL = 12;

export const Scene3Funil: React.FC = () => {
  const frame = useCurrentFrame();
  const { horiz } = useLayout();
  const L = horiz
    ? { cx: 1360, top: 200, bandH: 168, gap: 18, widths: [800, 680, 560, 440], inset: 50, fig: 98, label: 74, title: { x: SAFE, y: 300, size: 100, maxWidth: 780 } }
    : { cx: 540, top: 660, bandH: 236, gap: 22, widths: [840, 720, 600, 480], inset: 60, fig: 124, label: 90, title: { x: SAFE, y: 150, size: 112, maxWidth: 840 } };

  // Posicao de cada vaga, por camada.
  const slots = BANDS.map((b, i) => {
    const w = L.widths[i];
    const top = L.top + i * (L.bandH + L.gap);
    const foot = top + L.bandH - L.bandH * 0.13;
    const labelW = L.label * 0.5 * b.label.length + 40;
    const left = L.cx - w / 2 + L.inset + 40 + labelW + 30;
    const right = L.cx + w / 2 - L.inset - 30 - L.fig * 0.3;
    const spacing = Math.min(L.fig * 0.86, (right - left) / b.n);
    const used = spacing * b.n;
    const start = left + (right - left - used) / 2 + spacing / 2;
    return Array.from({ length: b.n }, (_, k) => ({ x: start + k * spacing, y: foot }));
  });
  const used = [0, 0, 0, 0];
  const drops = ORDER.map((band, k) => {
    const slot = slots[band][used[band]++];
    return { band, slot, at: FIRST_DROP + k * INTERVAL, k };
  });

  return (
    <AbsoluteFill>
      <TitleStrips
        x={L.title.x}
        y={L.title.y}
        maxWidth={L.title.maxWidth}
        seed={400}
        lines={[
          { text: "CADA UM NO NÍVEL", at: 4, size: L.title.size },
          { text: "DE CUIDADO QUE", at: 9, size: L.title.size },
          { text: "PRECISA AGORA.", at: 14, size: L.title.size, bg: C.ink, color: C.cream },
        ]}
      />
      {BANDS.map((b, i) => {
        const w = L.widths[i];
        const top = L.top + i * (L.bandH + L.gap);
        const enter = progress(frame, 2 + i * 4, 5);
        const dy = interpolate(Easing.out(Easing.quad)(enter), [0, 1], [-60, 0]);
        if (enter <= 0) return null;
        const ins = L.inset;
        return (
          <React.Fragment key={b.label}>
            <PaperCutout
              x={L.cx - w / 2}
              y={top + dy}
              width={w}
              height={L.bandH}
              seed={410 + i}
              color={b.bg}
              rough={9}
              rotate={i % 2 === 0 ? -0.6 : 0.7}
              path={`M 0 0 L ${w} 0 L ${w - ins} ${L.bandH} L ${ins} ${L.bandH} Z`}
            >
              <div
                style={{
                  position: "absolute",
                  left: ins + 40,
                  top: 0,
                  height: L.bandH,
                  display: "flex",
                  alignItems: "center",
                  fontFamily: TITLE_FONT,
                  fontSize: L.label,
                  color: b.fg,
                  letterSpacing: 3,
                }}
              >
                {b.label}
              </div>
            </PaperCutout>
            {i > 0 ? (
              <>
                <Tape x={L.cx - w / 2 + 6} y={top - L.gap - 22} width={92} height={46} rotate={-62} seed={430 + i} />
                <Tape x={L.cx + w / 2 - 98} y={top - L.gap - 22} width={92} height={46} rotate={62} seed={440 + i} />
              </>
            ) : null}
          </React.Fragment>
        );
      })}
      {drops.map((d) => {
        if (frame < d.at) return null;
        const t = progress(frame, d.at, FALL);
        const g = Easing.in(Easing.quad)(t);
        const x = interpolate(g, [0, 1], [L.cx, d.slot.x]);
        const y = interpolate(g, [0, 1], [L.top + L.bandH * 0.45, d.slot.y]);
        const landed = stepped(frame) - d.at >= FALL;
        const sinceLand = stepped(frame) - d.at - FALL;
        const wobble = landed ? (sinceLand < 3 ? 6 : sinceLand < 6 ? -3 : 0) : (d.k % 2 ? 14 : -14) * (1 - t);
        return (
          <PaperFigure
            key={d.k}
            x={x}
            y={y}
            height={L.fig}
            seed={460 + d.k}
            color={C.ink}
            outline={C.cream}
            rotate={wobble}
            lift={landed ? 0 : 0.5}
          />
        );
      })}
    </AbsoluteFill>
  );
};
