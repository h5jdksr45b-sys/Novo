import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Brain, Clock, FastForward, Footprints, Hand, Unlink, Zap, type LucideIcon } from "lucide-react";
import { C, FONT, SAFE, fontCss } from "./theme";
import { Reveal, SfxAt, useIn } from "./anim";

const FPS = 30;
export const SCENES = [
  { id: "abertura", from: 0, dur: 4 * FPS },
  { id: "fluxo", from: 4 * FPS, dur: 7 * FPS },
  { id: "tabela", from: 11 * FPS, dur: 7 * FPS },
  { id: "cards", from: 18 * FPS, dur: 6 * FPS },
  { id: "sintese", from: 24 * FPS, dur: 6 * FPS },
];
export const TOTAL = 30 * FPS;

const Stage: React.FC<{ dur: number; last?: boolean; children: React.ReactNode }> = ({ dur, last, children }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = last ? 1 : interpolate(f, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill
      style={{
        padding: `${SAFE.top}px ${SAFE.x}px ${SAFE.bottom}px`,
        opacity: Math.min(fadeIn, fadeOut),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Reveal at={at} dy={12} style={{ fontSize: 30, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.muted, marginBottom: 48 }}>
    {children}
  </Reveal>
);

const Source: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Reveal at={at} dy={8} style={{ marginTop: 56, fontSize: 28, color: C.muted, borderTop: `1px solid ${C.line}`, paddingTop: 24 }}>
    {children}
  </Reveal>
);

/* 1. Abertura */
const Abertura = () => (
  <>
    <Reveal at={4} style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.12, color: C.text }}>
      Você não escolheu sentir.
    </Reveal>
    <Reveal at={40} style={{ marginTop: 36, fontSize: 92, fontWeight: 700, lineHeight: 1.08, color: C.accent }}>
      Mas fez algo com isso.
    </Reveal>
    <AccentBar at={52} />
    <SfxAt at={4} kind="click" />
    <SfxAt at={40} kind="pop" />
  </>
);

const AccentBar: React.FC<{ at: number }> = ({ at }) => {
  const p = useIn(at, 18);
  return <div style={{ marginTop: 44, height: 6, width: 220 * p, background: C.accent, borderRadius: 3 }} />;
};

/* 2. Fluxo */
const STEPS: { icon: LucideIcon; label: string; at: number }[] = [
  { icon: Zap, label: "Emoção surge", at: 6 },
  { icon: Brain, label: "Razão percebe", at: 34 },
  { icon: Hand, label: "Vontade consente ou não", at: 62 },
  { icon: Footprints, label: "Ato", at: 90 },
];
const ROW = 150;
const GAP = 78;

const Arrow: React.FC<{ at: number }> = ({ at }) => {
  const p = useIn(at, 14);
  const len = GAP - 16;
  return (
    <svg width={110} height={GAP} style={{ display: "block" }}>
      <line x1={55} y1={8} x2={55} y2={8 + len * p} stroke={C.muted} strokeWidth={4} strokeLinecap="round" />
      <path d={`M43 ${GAP - 22} L55 ${GAP - 8} L67 ${GAP - 22}`} fill="none" stroke={C.muted} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.95 ? 1 : 0} />
    </svg>
  );
};

const Chip: React.FC<{ at: number; tone: "muted" | "accent"; children: React.ReactNode }> = ({ at, tone, children }) => {
  const p = useIn(at, 12);
  const accent = tone === "accent";
  return (
    <span
      style={{
        display: "inline-block",
        opacity: p,
        transform: `scale(${0.9 + 0.1 * p})`,
        transformOrigin: "left center",
        padding: "10px 22px",
        borderRadius: 999,
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: 1,
        color: accent ? C.bg : C.muted,
        background: accent ? C.accent : "transparent",
        border: accent ? "none" : `2px dashed ${C.muted}`,
      }}
    >
      {children}
    </span>
  );
};

const Step: React.FC<{ icon: LucideIcon; label: string; at: number; highlight?: boolean; chip?: React.ReactNode }> = ({ icon: Icon, label, at, highlight, chip }) => {
  const p = useIn(at, 14);
  return (
    <div style={{ display: "flex", alignItems: "center", height: ROW, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 30,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: highlight ? C.accentSoft : C.surface,
          border: `2px solid ${highlight ? C.accent : C.line}`,
        }}
      >
        <Icon size={54} color={highlight ? C.accent : C.text} strokeWidth={1.8} />
      </div>
      <div style={{ marginLeft: 36 }}>
        <div style={{ fontSize: 50, fontWeight: 600, color: C.text, lineHeight: 1.1 }}>{label}</div>
        {chip ? <div style={{ marginTop: 14 }}>{chip}</div> : null}
      </div>
    </div>
  );
};

const Fluxo = () => {
  const box = useIn(124, 18);
  const top = 2 * (ROW + GAP) - 22;
  const h = 2 * ROW + GAP + 44;
  return (
    <div style={{ position: "relative", paddingLeft: 30 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top,
          height: h,
          borderRadius: 34,
          border: `3px solid ${C.accent}`,
          opacity: box,
          clipPath: `inset(0 ${(1 - box) * 100}% 0 0 round 34px)`,
        }}
      />
      <div style={{ position: "absolute", right: 24, top: top - 26, opacity: box }}>
        <Chip at={130} tone="accent">com controle</Chip>
      </div>
      {STEPS.map((s, i) => (
        <React.Fragment key={s.label}>
          <Step
            {...s}
            highlight={i >= 2}
            chip={i === 0 ? <Chip at={22} tone="muted">sem controle</Chip> : undefined}
          />
          {i < STEPS.length - 1 ? <Arrow at={s.at + 14} /> : null}
        </React.Fragment>
      ))}
      {STEPS.map((s) => (
        <SfxAt key={s.at} at={s.at} kind="click" />
      ))}
      {STEPS.slice(0, 3).map((s) => (
        <SfxAt key={`t${s.at}`} at={s.at + 14} kind="tick" volume={0.4} />
      ))}
      <SfxAt at={22} kind="tick" volume={0.5} />
      <SfxAt at={124} kind="pop" />
    </div>
  );
};

/* 3. Tabela */
const TableRow: React.FC<{ at: number; term: string; desc: string; verdict: string; good: boolean }> = ({ at, term, desc, verdict, good }) => {
  const p = useIn(at, 16);
  const v = useIn(at + 20, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        borderBottom: `2px solid ${C.line}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
      }}
    >
      <div style={{ flex: 1.25, padding: "44px 24px 44px 0" }}>
        <div style={{ fontSize: 54, fontWeight: 700, color: C.text }}>{term}</div>
        <div style={{ marginTop: 12, fontSize: 36, color: C.muted, lineHeight: 1.25 }}>{desc}</div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 28, borderLeft: `2px solid ${C.line}` }}>
        <div
          style={{
            opacity: v,
            transform: `scale(${0.92 + 0.08 * v})`,
            transformOrigin: "left center",
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.15,
            color: good ? C.accent : C.text,
          }}
        >
          {verdict}
        </div>
      </div>
    </div>
  );
};

const Tabela = () => {
  const head = useIn(4, 14);
  return (
    <>
      <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: C.muted, letterSpacing: 2, textTransform: "uppercase", borderBottom: `2px solid ${C.muted}`, paddingBottom: 18, opacity: head }}>
        <div style={{ flex: 1.25 }}>Emoção</div>
        <div style={{ flex: 1, paddingLeft: 30 }}>Culpa</div>
      </div>
      <TableRow at={18} term="Antecedente" desc="veio antes da escolha" verdict="diminui a culpa" good />
      <TableRow at={86} term="Consequente" desc="foi alimentada" verdict="não diminui" good={false} />
      <Source at={150}>Tomás de Aquino. Suma Teológica I-II, q.77, a.6</Source>
      <SfxAt at={18} kind="click" />
      <SfxAt at={38} kind="pop" />
      <SfxAt at={86} kind="click" />
      <SfxAt at={106} kind="pop" />
      <SfxAt at={150} kind="tick" volume={0.4} />
    </>
  );
};

/* 4. Dois cards */
const Card: React.FC<{ at: number; icon: LucideIcon; title: string; desc: string }> = ({ at, icon: Icon, title, desc }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        flex: 1,
        background: C.surface,
        border: `2px solid ${C.line}`,
        borderRadius: 36,
        padding: "48px 34px",
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ width: 96, height: 96, borderRadius: 26, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={50} color={C.accent} strokeWidth={1.8} />
      </div>
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>{title}</div>
      <div style={{ marginTop: 18, fontSize: 38, color: C.muted, lineHeight: 1.25 }}>{desc}</div>
    </div>
  );
};

const Cards = () => (
  <>
    <div style={{ display: "flex", gap: 28 }}>
      <Card at={10} icon={FastForward} title="Impetuosidade" desc="agiu antes de pensar" />
      <Card at={44} icon={Unlink} title="Fraqueza" desc="pensou, mas não sustentou" />
    </div>
    <Source at={96}>Tomás de Aquino. Suma Teológica II-II, q.156, a.1</Source>
    <SfxAt at={10} kind="click" />
    <SfxAt at={44} kind="click" />
    <SfxAt at={96} kind="tick" volume={0.4} />
  </>
);

/* 5. Síntese */
const ClockMark: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = useIn(at, 14);
  const rot = interpolate(f, [at, at + 60], [-90, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", width: 120, height: 120, opacity: p, transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: "left center" }}>
      <Clock size={120} color={C.accent} strokeWidth={1.4} style={{ transform: `rotate(${rot}deg)` }} />
    </div>
  );
};

const Sintese = () => (
  <>
    <ClockMark at={4} />
    <Reveal at={12} style={{ marginTop: 56, fontSize: 64, fontWeight: 600, lineHeight: 1.15, color: C.text }}>
      Você não responde pelo impulso que surgiu.
    </Reveal>
    <Reveal at={48} style={{ marginTop: 40, fontSize: 80, fontWeight: 700, lineHeight: 1.08, color: C.accent }}>
      Responde pelo que faz com ele.
    </Reveal>
    <Reveal at={96} dy={8} style={{ marginTop: 96, fontSize: 28, lineHeight: 1.4, color: C.muted }}>
      <div style={{ color: C.text, fontWeight: 600 }}>Dr. Fabio Schmidt</div>
      médico, pós-graduado em psiquiatria. Conteúdo educativo.
    </Reveal>
    <SfxAt at={4} kind="tick" volume={0.5} />
    <SfxAt at={12} kind="click" />
    <SfxAt at={48} kind="pop" />
  </>
);

const BODY: Record<string, React.FC> = { abertura: Abertura, fluxo: Fluxo, tabela: Tabela, cards: Cards, sintese: Sintese };

export const Esquema = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, color: C.text }}>
    <style>{fontCss}</style>
    {SCENES.map((s, i) => {
      const Body = BODY[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <Stage dur={s.dur} last={i === SCENES.length - 1}>
            <Body />
          </Stage>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
