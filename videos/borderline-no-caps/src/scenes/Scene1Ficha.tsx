import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperCutout } from "../components/PaperCutout";
import { PenArrow } from "../components/PenArrow";
import { Stamp, STAMP_IMPACT } from "../components/Stamp";
import { Tape } from "../components/Tape";
import { TitleStrips } from "../components/TitleStrips";
import { Typed } from "../components/Typed";
import { C, SAFE, TITLE_FONT } from "../lib/theme";
import { progress, useLayout, useShake } from "../lib/stop";
import { useTiming } from "../lib/timing";

const STAMP_DEFS = [
  { text: "ACOLHIMENTO", at: 40, x: 50, y: 575, fontSize: 70, color: C.red, rotate: -7 },
  { text: "PS", at: 72, x: 535, y: 548, fontSize: 116, color: C.ink, rotate: 9 },
  { text: "RETORNO", at: 104, x: 70, y: 790, fontSize: 84, color: C.red, rotate: 5 },
  { text: "PS", at: 136, x: 505, y: 795, fontSize: 116, color: C.ink, rotate: -11 },
];

const FICHA_W = 780;
const FICHA_H = 1020;
const BOX = 96;
const BOX_X = (i: number) => 52 + i * 140;
const BOX_Y = 405;

const useStamps = () => {
  const t = useTiming();
  return STAMP_DEFS.map((s, i) => ({ ...s, at: t.sc1.stamps[i] }));
};

const Ficha: React.FC = () => {
  const frame = useCurrentFrame();
  const STAMPS = useStamps();
  const t = useTiming();
  return (
    <PaperCutout x={0} y={0} width={FICHA_W} height={FICHA_H} seed={11} color={C.cream} rough={9} lift={0.2}>
      <PaperCutout x={40} y={44} width={700} height={118} seed={12} color={C.ink} rough={5} jitter={0.4}>
        <div style={{ fontFamily: TITLE_FONT, fontSize: 84, color: C.cream, letterSpacing: 6, textAlign: "center", lineHeight: "118px" }}>
          PRONTUÁRIO
        </div>
      </PaperCutout>
      <div style={{ position: "absolute", left: 52, top: 196 }}>
        <Typed size={40}>UNIDADE: CAPS</Typed>
        <Typed size={40} style={{ marginTop: 22 }}>
          PACIENTE: ______________
        </Typed>
        <Typed size={40} style={{ marginTop: 22 }}>
          VISITAS NO MÊS:
        </Typed>
      </div>
      {[1, 2, 3, 4, 5].map((n, i) => (
        <div
          key={n}
          style={{
            position: "absolute",
            left: BOX_X(i),
            top: BOX_Y,
            width: BOX,
            height: BOX,
            border: `4px solid ${C.ink}`,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typed size={56}>{n}</Typed>
        </div>
      ))}
      {/* Um X de caneta vermelha em cada visita, junto com o carimbo */}
      {STAMPS.map((s, i) => {
        const p = progress(frame, s.at + STAMP_IMPACT + 3, 6);
        const x0 = BOX_X(i) + 14;
        const y0 = BOX_Y + 14;
        const b = BOX - 28;
        return (
          <React.Fragment key={i}>
            <PenArrow d={`M ${x0} ${y0} L ${x0 + b} ${y0 + b}`} progress={p * 2} color={C.red} width={8} seed={20 + i} />
            <PenArrow d={`M ${x0 + b} ${y0} L ${x0} ${y0 + b}`} progress={p * 2 - 1} color={C.red} width={8} seed={30 + i} />
          </React.Fragment>
        );
      })}
      {/* A quinta: circulo de caneta */}
      <PenArrow
        d={`M ${BOX_X(4) + 48} ${BOX_Y - 22} C ${BOX_X(4) + 140} ${BOX_Y - 24}, ${BOX_X(4) + 132} ${BOX_Y + 124}, ${BOX_X(4) + 46} ${BOX_Y + 122} C ${BOX_X(4) - 34} ${BOX_Y + 120}, ${BOX_X(4) - 40} ${BOX_Y - 16}, ${BOX_X(4) + 60} ${BOX_Y - 30}`}
        progress={progress(frame, t.sc1.circle, 10)}
        color={C.red}
        width={9}
        seed={41}
      />
      {STAMPS.map((s, i) => (
        <Stamp key={i} {...s} seed={50 + i * 7} />
      ))}
      <Tape x={-46} y={-14} rotate={-38} seed={1} />
      <Tape x={FICHA_W - 146} y={-14} rotate={38} seed={2} />
    </PaperCutout>
  );
};

export const Scene1Ficha: React.FC = () => {
  const frame = useCurrentFrame();
  const { horiz } = useLayout();
  const STAMPS = useStamps();
  const shake = useShake(STAMPS.map((s) => s.at + STAMP_IMPACT));
  const p = Easing.out(Easing.cubic)(progress(frame, 0, 20));
  const rot = interpolate(p, [0, 1], [-30, -3]);
  const dy = interpolate(p, [0, 1], [-1700, 0]);
  const dx = interpolate(p, [0, 1], [-300, 0]);

  const place = horiz ? { x: 1110, y: 180, scale: 0.72 } : { x: 150, y: 690, scale: 1 };
  const title = horiz
    ? { x: SAFE, y: 270, size: 122, maxWidth: 900 }
    : { x: SAFE, y: 150, size: 122, maxWidth: 840 };

  return (
    <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
      <TitleStrips
        x={title.x}
        y={title.y}
        maxWidth={title.maxWidth}
        seed={100}
        lines={[
          { text: "ELA VOLTOU", at: 10, size: title.size },
          { text: "PELA QUINTA VEZ", at: 16, size: title.size, bg: C.red, color: C.cream },
          { text: "ESTE MÊS.", at: 22, size: title.size },
        ]}
      />
      <div style={{ position: "absolute", left: place.x, top: place.y, transform: `scale(${place.scale})`, transformOrigin: "0 0" }}>
        <div
          style={{
            position: "absolute",
            width: FICHA_W,
            height: FICHA_H,
            transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          <Ficha />
        </div>
      </div>
    </AbsoluteFill>
  );
};
