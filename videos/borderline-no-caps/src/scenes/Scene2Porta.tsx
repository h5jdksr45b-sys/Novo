import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperCutout } from "../components/PaperCutout";
import { PaperFigure } from "../components/PaperFigure";
import { PenArrow } from "../components/PenArrow";
import { Tape } from "../components/Tape";
import { TitleStrips } from "../components/TitleStrips";
import { Typed } from "../components/Typed";
import { C, SAFE } from "../lib/theme";
import { progress, stepIndex, stepped, useLayout } from "../lib/stop";

// Trajeto do boneco em unidades do raio da porta, a partir do centro.
// Entra pela esquerda, gira ate o lado do servico, volta e sai pela direita. Duas vezes.
type Key = { t: number; p: [number, number] };
const path = (svcY: number, streetY: number): Key[] => {
  const sL: [number, number] = [-0.72, streetY];
  const sR: [number, number] = [0.72, streetY];
  const inL: [number, number] = [-0.46, 0.46];
  const inR: [number, number] = [0.46, 0.46];
  const upL: [number, number] = [-0.46, -0.46];
  const upR: [number, number] = [0.46, -0.46];
  const svc: [number, number] = [0.68, svcY];
  return [
    { t: 4, p: sL },
    { t: 16, p: inL },
    { t: 28, p: upR },
    { t: 38, p: svc },
    { t: 48, p: svc },
    { t: 58, p: upL },
    { t: 68, p: inR },
    { t: 80, p: sR },
    { t: 94, p: sL },
    { t: 104, p: inL },
    { t: 114, p: upR },
    { t: 122, p: svc },
    { t: 130, p: svc },
    { t: 140, p: upL },
    { t: 150, p: inR },
    { t: 160, p: sR },
  ];
};

const sample = (keys: Key[], f: number): { p: [number, number]; moving: boolean } => {
  if (f <= keys[0].t) return { p: keys[0].p, moving: false };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f >= a.t && f < b.t) {
      const k = (f - a.t) / (b.t - a.t);
      const same = a.p[0] === b.p[0] && a.p[1] === b.p[1];
      return {
        p: [a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k],
        moving: !same,
      };
    }
  }
  return { p: keys[keys.length - 1].p, moving: false };
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const rad = (a: number) => (a * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0));
  const y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1));
  const y1 = cy + r * Math.sin(rad(a1));
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
};

const Door: React.FC<{ cx: number; cy: number; r: number; wallFrom: number; wallTo: number }> = ({ cx, cy, r, wallFrom, wallTo }) => {
  const frame = useCurrentFrame();
  const angle = 20 + stepIndex(frame) * 7.5;
  const wingLen = r - 18;
  return (
    <>
      {/* Parede do predio, dos dois lados do tambor */}
      <PaperCutout x={wallFrom} y={cy - 22} width={cx - r - 6 - wallFrom} height={44} seed={201} color={C.ink} rough={4} />
      <PaperCutout x={cx + r + 6} y={cy - 22} width={wallTo - (cx + r + 6)} height={44} seed={202} color={C.ink} rough={4} />
      {/* Piso do tambor */}
      <PaperCutout
        x={cx - r}
        y={cy - r}
        width={r * 2}
        height={r * 2}
        seed={203}
        color={C.cream}
        rough={8}
        lift={0.15}
        path={`M ${r} 0 A ${r} ${r} 0 1 1 ${r - 0.1} 0 Z`}
      />
      <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <filter id="doorRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <g filter="url(#doorRough)">
          {/* Paredes curvas do tambor: abertas em cima e embaixo */}
          <path d={arc(cx, cy, r, 135, 225)} stroke={C.ink} strokeWidth={30} fill="none" strokeLinecap="butt" />
          <path d={arc(cx, cy, r, -45, 45)} stroke={C.ink} strokeWidth={30} fill="none" strokeLinecap="butt" />
          <g transform={`rotate(${angle} ${cx} ${cy})`}>
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a} ${cx} ${cy})`}>
                <rect x={cx} y={cy - 12} width={wingLen} height={24} fill={C.cream} />
                <rect x={cx + 4} y={cy - 9} width={wingLen - 6} height={18} fill={C.kraftDark} />
              </g>
            ))}
            <circle cx={cx} cy={cy} r={26} fill={C.ink} />
            <circle cx={cx} cy={cy} r={9} fill={C.cream} />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Scene2Porta: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, horiz } = useLayout();
  const L = horiz
    ? { cx: 1420, cy: 540, r: 250, svcY: -1.16, streetY: 1.42, fig: 100, wallFrom: 1040, title: { x: SAFE, y: 250, size: 92, maxWidth: 820 } }
    : { cx: 540, cy: 1200, r: 300, svcY: -1.4, streetY: 1.5, fig: 128, wallFrom: SAFE, title: { x: SAFE, y: 150, size: 84, maxWidth: 840 } };
  const keys = path(L.svcY, L.streetY);
  const { p, moving } = sample(keys, stepped(frame));
  const fx = L.cx + p[0] * L.r;
  const fy = L.cy + p[1] * L.r;
  const arrowP = Easing.out(Easing.quad)(progress(frame, 18, 12));
  const ar = L.r + 46;

  return (
    <AbsoluteFill>
      <TitleStrips
        x={L.title.x}
        y={L.title.y}
        maxWidth={L.title.maxWidth}
        seed={300}
        lines={[
          { text: "NA MAIORIA DAS VEZES,", at: 4, size: L.title.size },
          { text: "O PROBLEMA É O FLUXO.", at: 10, size: L.title.size },
          { text: "NÃO A PACIENTE.", at: 92, size: L.title.size * 1.15, bg: C.red, color: C.cream },
        ]}
      />
      <Door cx={L.cx} cy={L.cy} r={L.r} wallFrom={L.wallFrom} wallTo={W - SAFE} />
      <PenArrow
        d={arc(L.cx, L.cy, ar, 110, 230)}
        head={{
          x: L.cx + ar * Math.cos((230 * Math.PI) / 180),
          y: L.cy + ar * Math.sin((230 * Math.PI) / 180),
          angle: 230 + 90,
        }}
        progress={arrowP}
        width={7}
        seed={11}
      />
      <PaperCutout x={L.cx - L.r * 1.15 - 90} y={L.cy - L.r * 1.3 - 30} seed={310} color={C.cream} rough={4} rotate={-3} padding="8px 16px">
        <Typed size={horiz ? 34 : 38}>SERVIÇO</Typed>
      </PaperCutout>
      <PaperCutout x={L.cx - L.r * 1.15 - 50} y={L.cy + L.r * 1.3 - 30} seed={311} color={C.cream} rough={4} rotate={2} padding="8px 16px">
        <Typed size={horiz ? 34 : 38}>RUA</Typed>
      </PaperCutout>
      <Tape x={L.cx + L.r - 90} y={L.cy - L.r * 0.75} rotate={50} width={130} height={44} seed={9} />
      <PaperFigure x={fx} y={fy} height={L.fig} seed={321} walking={moving} step={stepIndex(frame)} lift={moving ? 0.3 : 0} rotate={moving ? interpolate(stepIndex(frame) % 2, [0, 1], [-3, 3]) : 0} />
    </AbsoluteFill>
  );
};
