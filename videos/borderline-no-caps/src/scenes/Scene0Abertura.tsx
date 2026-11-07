import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperCutout } from "../components/PaperCutout";
import { PenArrow } from "../components/PenArrow";
import { Tape } from "../components/Tape";
import { Typed } from "../components/Typed";
import { C, TITLE_FONT } from "../lib/theme";
import { progress, stepIndex, useLayout } from "../lib/stop";
import { useTiming } from "../lib/timing";

/** Entra em degraus: some antes de `at`, primeira pose levemente maior. */
const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  if (frame < at) return <div style={{ ...style, visibility: "hidden" }}>{children}</div>;
  const s = stepIndex(frame - at);
  const k = s === 0 ? 1.06 : 1;
  return <div style={{ ...style, transform: `scale(${k}) rotate(${s === 0 ? 1.2 : 0}deg)`, transformOrigin: "0 50%" }}>{children}</div>;
};

/** Abertura formal: oficio de apresentacao do projeto. */
export const Scene0Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { horiz } = useLayout();
  const t = useTiming().sc0;
  const p = Easing.out(Easing.cubic)(progress(frame, 0, 14));
  const rot = interpolate(p, [0, 1], [10, -1.2]);
  const dy = interpolate(p, [0, 1], [-1400, 0]);

  const sheet = horiz ? { x: 170, y: 190, w: 1580, h: 720 } : { x: 150, y: 330, w: 780, h: 1240 };
  const pad = horiz ? 64 : 58;

  const underline = progress(frame, t.title + 10, 8);
  const title = (
    <>
    <Pop at={t.salutation}>
      <PaperCutout seed={611} color={C.ink} rough={5} jitter={0.3} padding="10px 26px 6px">
        <div style={{ fontFamily: TITLE_FONT, fontSize: horiz ? 46 : 50, color: C.cream, letterSpacing: 4, lineHeight: 1.15 }}>
          APRESENTAÇÃO DE PROJETO
        </div>
      </PaperCutout>
    </Pop>
    <Pop at={t.title}>
      <div style={{ fontFamily: TITLE_FONT, fontSize: horiz ? 132 : 150, lineHeight: 1.0, color: C.ink, marginTop: 22, letterSpacing: 2 }}>
        BORDERLINE
        <br />
        <span style={{ color: C.red }}>NO CAPS</span>
      </div>
      <div style={{ position: "relative", width: 600, height: 18, marginTop: 6 }}>
        <PenArrow d="M 0 9 C 160 3, 380 15, 590 6" progress={underline} color={C.red} width={8} seed={66} />
      </div>
    </Pop>
    </>
  );
  const subtitle = (
    <Pop at={t.subtitle}>
      <Typed size={horiz ? 36 : 38} style={{ whiteSpace: "normal", lineHeight: 1.35, maxWidth: horiz ? 700 : 660 }}>
        Um modelo operacional para organizar o cuidado de pessoas com transtorno de personalidade borderline na rede de saúde mental.
      </Typed>
    </Pop>
  );
  const signature = (
    <div>
      <Pop at={t.signature}>
        <div style={{ width: horiz ? 620 : 660, height: 4, background: C.ink, opacity: 0.85, marginBottom: 26 }} />
        <div style={{ fontFamily: TITLE_FONT, fontSize: horiz ? 66 : 72, color: C.ink, lineHeight: 1.05, letterSpacing: 1 }}>Dr. Fabio Schmidt</div>
      </Pop>
      <Pop at={t.role} style={{ marginTop: 14 }}>
        <Typed size={horiz ? 34 : 36}>Médico, pós-graduado em psiquiatria</Typed>
        <Typed size={horiz ? 34 : 36} style={{ marginTop: 8 }}>
          CRM-SP 183549
        </Typed>
      </Pop>
      <Pop at={t.details} style={{ marginTop: 8 }}>
        <Typed size={horiz ? 34 : 36}>Dez anos de trabalho em CAPS</Typed>
      </Pop>
    </div>
  );


  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: sheet.x,
          top: sheet.y,
          width: sheet.w,
          height: sheet.h,
          transform: `translateY(${dy}px) rotate(${rot}deg)`,
          transformOrigin: "50% 50%",
        }}
      >
        <PaperCutout x={0} y={0} width={sheet.w} height={sheet.h} seed={601} color={C.cream} rough={9} lift={0.2}>
          {horiz ? (
            <>
              <div style={{ position: "absolute", left: pad, top: pad, width: 760 }}>
                <div style={{ marginTop: 40 }}>{title}</div>
              </div>
              <div style={{ position: "absolute", left: 870, top: pad + 10, width: 650 }}>
                {subtitle}
                <div style={{ marginTop: 44 }}>{signature}</div>
              </div>
            </>
          ) : (
            <div style={{ position: "absolute", left: pad, top: pad, width: sheet.w - pad * 2 }}>
              <div style={{ marginTop: 20 }}>{title}</div>
              <div style={{ marginTop: 40 }}>{subtitle}</div>
              <div style={{ marginTop: 52 }}>{signature}</div>
            </div>
          )}
          <Tape x={-18} y={-16} rotate={-36} seed={61} />
          <Tape x={sheet.w - 172} y={-16} rotate={36} seed={62} />
        </PaperCutout>
      </div>
    </AbsoluteFill>
  );
};
