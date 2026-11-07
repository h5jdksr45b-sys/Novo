import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperCutout } from "../components/PaperCutout";
import { PaperFigure } from "../components/PaperFigure";
import { Stamp, STAMP_IMPACT } from "../components/Stamp";
import { Tape } from "../components/Tape";
import { Typed } from "../components/Typed";
import { C, TITLE_FONT } from "../lib/theme";
import { FrozenCtx, progress, stepIndex, useLayout, useShake } from "../lib/stop";
import { useTiming } from "../lib/timing";

export const BOOK_W = 640;
export const BOOK_H = 900;

const Cover: React.FC = () => (
  <PaperCutout x={0} y={0} width={BOOK_W} height={BOOK_H} seed={501} color={C.cream} rough={9} lift={0.25}>
    <PaperCutout x={36} y={40} width={BOOK_W - 72} height={190} seed={502} color={C.ink} rough={5} jitter={0.3}>
      <div style={{ fontFamily: TITLE_FONT, fontSize: 112, color: C.cream, textAlign: "center", lineHeight: "190px", letterSpacing: 3 }}>
        BORDERLINE
      </div>
    </PaperCutout>
    <div style={{ position: "absolute", left: 0, top: 236, width: BOOK_W, textAlign: "center", fontFamily: TITLE_FONT, fontSize: 168, lineHeight: 1.05, color: C.ink, letterSpacing: 4 }}>
      NO CAPS
    </div>
    <div style={{ position: "absolute", left: 0, top: 440, width: BOOK_W, display: "flex", justifyContent: "center" }}>
      <Typed size={44}>Um modelo operacional</Typed>
    </div>
    <div style={{ position: "absolute", left: 60, top: 520, width: BOOK_W - 120, height: 4, background: C.ink, opacity: 0.85 }} />
    {[0, 1, 2, 3, 4].map((i) => (
      <PaperFigure key={i} x={150 + i * 85} y={808} height={150} seed={520 + i} color={i === 2 ? C.red : C.ink} outline={C.cream} />
    ))}
    <div style={{ position: "absolute", left: 0, top: 832, width: BOOK_W, display: "flex", justifyContent: "center" }}>
      <Typed size={32}>Dr. Fabio Schmidt</Typed>
    </div>
    <Tape x={-50} y={-6} rotate={-40} seed={31} width={180} />
    <Tape x={BOOK_W - 130} y={-6} rotate={40} seed={32} width={180} />
  </PaperCutout>
);

const Scene4Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { horiz } = useLayout();
  const L = horiz
    ? { bx: 300, by: 180, scale: 0.82, hx: 960, hy: 480, hsize: 86, stamp: { x: 150, y: 540 } }
    : { bx: 220, by: 350, scale: 1, hx: 0, hy: 1360, hsize: 96, stamp: { x: 150, y: 540 } };
  const { stampAt: STAMP_AT, handleAt: HANDLE_AT } = useTiming().sc4;
  const shake = useShake([0 + 14, STAMP_AT + STAMP_IMPACT]);
  const p = Easing.out(Easing.cubic)(progress(frame, 0, 14));
  const rot = interpolate(p, [0, 1], [14, -2]);
  const sc = interpolate(p, [0, 1], [1.4, 1]);
  const dy = interpolate(p, [0, 1], [-260, 0]);
  const hs = frame >= HANDLE_AT ? stepIndex(frame - HANDLE_AT) : -1;

  return (
    <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
      <div style={{ position: "absolute", left: L.bx, top: L.by, transform: `scale(${L.scale})`, transformOrigin: "0 0" }}>
        <div
          style={{
            position: "absolute",
            width: BOOK_W,
            height: BOOK_H,
            transform: `translateY(${dy}px) rotate(${rot}deg) scale(${sc})`,
            transformOrigin: "50% 50%",
          }}
        >
          <Cover />
          <Stamp text="ACOLHIMENTO" at={STAMP_AT} x={L.stamp.x} y={L.stamp.y} fontSize={62} rotate={-8} color={C.red} seed={77} />
        </div>
      </div>
      {hs >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: horiz ? L.hx : 0,
            top: L.hy,
            width: horiz ? undefined : "100%",
            display: "flex",
            justifyContent: horiz ? "flex-start" : "center",
            transform: `translateY(${hs === 0 ? 40 : hs === 1 ? -8 : 0}px)`,
          }}
        >
          <PaperCutout seed={540} color={C.ink} rough={6} rotate={-1.5} lift={hs === 0 ? 0.6 : 0} padding="14px 34px 8px">
            <div style={{ fontFamily: TITLE_FONT, fontSize: L.hsize, color: C.cream, letterSpacing: 2, lineHeight: 1.1, whiteSpace: "nowrap" }}>
              @drfabioschmidt
            </div>
          </PaperCutout>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Scene4Livro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <FrozenCtx.Provider value={frame >= useTiming().sc4.freezeAt}>
      <Scene4Inner />
    </FrozenCtx.Provider>
  );
};
