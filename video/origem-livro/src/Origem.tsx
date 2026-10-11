import React from "react";
import {
  AbsoluteFill,
  Img,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Siren, Zap, Hourglass, RefreshCw, Hand } from "lucide-react";
import { C, SERIF, SANS, DISPLAY } from "./theme";
import { Doctor, Thrower } from "./Characters";

const S1 = 190;
const S2 = 200;
const S3 = 130;
const CARD = 110;
const CARDS = 5;
const S4 = CARD * CARDS;
const S5 = 190;
export const TOTAL = S1 + S2 + S3 + S4 + S5;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useSpring = (delay: number, config = { damping: 14, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

const Caption: React.FC<{ children: React.ReactNode; delay?: number; color?: string; top?: number; size?: number }> = ({
  children,
  delay = 0,
  color = C.ink,
  top = 250,
  size = 58,
}) => {
  const s = useSpring(delay, { damping: 18, mass: 0.7 });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 90,
        right: 90,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.18,
        color,
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Balão serrilhado
const bubblePath = (() => {
  const pts: string[] = [];
  const n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = i % 2 === 0 ? 1 : 0.9;
    pts.push(`${(50 + Math.cos(a) * 50 * r).toFixed(2)},${(50 + Math.sin(a) * 50 * r).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

export const Cena1Grito: React.FC = () => {
  const frame = useCurrentFrame();
  const doc = useSpring(30, { damping: 11, mass: 0.9 });
  const bubble = useSpring(55, { damping: 9, mass: 0.7 });
  const shout = frame > 55 ? 0.75 + Math.sin(frame / 2.2) * 0.25 : 0;
  const shake = frame > 55 ? Math.sin(frame * 1.7) * 6 : 0;
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", left: 170, top: 1020, width: 760, height: 760, borderRadius: 999, background: C.sky }} />
      <Caption>Tem profissional que ainda fala assim sobre quem tem borderline</Caption>
      <div
        style={{
          position: "absolute",
          left: 230,
          top: 980,
          width: 620,
          height: 940,
          transform: `translate(${shake}px, ${(1 - doc) * 500}px) scale(${0.85 + doc * 0.15})`,
          transformOrigin: "bottom center",
        }}
      >
        <Doctor mouth={shout} pointing={interpolate(frame, [60, 80], [0, 1], clamp)} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 470,
          width: 880,
          height: 520,
          transform: `scale(${bubble}) rotate(${-3 + Math.sin(frame / 6) * 1.2}deg)`,
          transformOrigin: "70% 100%",
        }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d={bubblePath} fill={C.ochre} transform="translate(1.2 2)" />
          <path d={bubblePath} fill="#FFFFFF" stroke={C.ink} strokeWidth={0.9} vectorEffect="non-scaling-stroke" />
        </svg>
        <svg viewBox="0 0 100 100" style={{ position: "absolute", left: "62%", top: "88%", width: 90, height: 120 }}>
          <path d="M0 0 L100 0 L70 100 Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={8} />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: "16% 14%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 60,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: C.ink,
          }}
        >
          PRA QUE PEDIR EMPATIA?? CEIS NUM PRESTAM NÃO, SEUS BORDERCOLLIE
        </div>
      </div>
    </AbsoluteFill>
  );
};

const THROW_EVERY = 34;
const FLIGHT = 22;

const Palavra: React.FC<{ start: number; index: number }> = ({ start, index }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) return null;
  const fx0 = 300, fy0 = 1180, fx1 = 640, fy1 = 1250;
  let x: number, y: number, rot: number;
  if (t <= FLIGHT) {
    const p = Easing.out(Easing.quad)(t / FLIGHT);
    x = fx0 + (fx1 - fx0) * p;
    y = fy0 + (fy1 - fy0) * p - Math.sin(p * Math.PI) * 220;
    rot = -20 + p * 380;
  } else {
    const q = Math.min((t - FLIGHT) / 26, 1);
    const pileY = 1560 - index * 46;
    x = fx1 - q * (120 + index * 18);
    y = fy1 + (pileY - fy1) * Easing.in(Easing.quad)(q) - Math.sin(q * Math.PI) * 120;
    rot = 360 + q * (index % 2 ? 160 : 200);
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 40,
        width: 300,
        height: 80,
        borderRadius: 14,
        background: [C.terracotta, C.petrol, C.ochre][index % 3],
        border: `5px solid ${C.ink}`,
        color: index % 3 === 2 ? C.ink : C.offwhite,
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: 44,
        letterSpacing: "0.02em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${rot % 360}deg)`,
        boxShadow: "0 10px 0 rgba(0,0,0,.18)",
      }}
    >
      ARGUMENTO
    </div>
  );
};

export const Cena2Argumentos: React.FC = () => {
  const frame = useCurrentFrame();
  const throws = [16, 16 + THROW_EVERY, 16 + THROW_EVERY * 2, 16 + THROW_EVERY * 3, 16 + THROW_EVERY * 4];
  const diploma = useSpring(4, { damping: 12, mass: 0.7 });
  const phase = (frame - 16) % THROW_EVERY;
  const throwT = frame < 10 ? 0 : interpolate(phase, [0, 6, 18, THROW_EVERY], [1, 0, 0, 1], clamp);
  const hit = throws.some((s) => frame - s >= FLIGHT && frame - s < FLIGHT + 6);
  const jolt = hit ? Math.sin(frame * 3) * 10 : 0;
  const thrown = throws.filter((s) => frame >= s).length;
  return (
    <AbsoluteFill style={{ background: C.sage }}>
      <Caption>A pessoa explica. Ele levanta o diploma.</Caption>
      <div style={{ position: "absolute", left: 20, top: 860, width: 420, height: 760 }}>
        <Thrower throwT={throwT} frustration={Math.min(thrown / 5, 1)} />
      </div>
      <div style={{ position: "absolute", left: 520, top: 860, width: 500, height: 760, transform: `translateX(${jolt}px)` }}>
        <Doctor diploma={diploma} smug={diploma} />
      </div>
      {throws.map((s, i) => (
        <Palavra key={s} start={s} index={i} />
      ))}
      {hit && (
        <svg style={{ position: "absolute", left: 560, top: 1170, width: 160, height: 160 }} viewBox="0 0 100 100">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={50 + Math.cos((a * Math.PI) / 180) * 18}
              y1={50 + Math.sin((a * Math.PI) / 180) * 18}
              x2={50 + Math.cos((a * Math.PI) / 180) * 44}
              y2={50 + Math.sin((a * Math.PI) / 180) * 44}
              stroke={C.ink}
              strokeWidth={6}
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const Cover: React.FC<{ width: number; rotate?: number }> = ({ width, rotate = 0 }) => (
  <div style={{ width, transform: `rotate(${rotate}deg)`, filter: "drop-shadow(0 40px 34px rgba(0,0,0,.28)) drop-shadow(0 3px 5px rgba(0,0,0,.15))" }}>
    <Img src={staticFile("capa.jpg")} style={{ width: "100%", display: "block", clipPath: "inset(0.6% 1.2% 0.6% 1.2% round 4px)" }} />
  </div>
);

export const Cena3Nome: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const swipe = useSpring(38, { damping: 16, mass: 0.9 });
  return (
    <AbsoluteFill style={{ background: C.petrol }}>
      <Caption color={C.offwhite}>Foi daí que veio o nome do livro</Caption>
      <div
        style={{
          position: "absolute",
          top: 520,
          left: (width - 600) / 2,
          transform: `translateX(${(1 - swipe) * 900}px) rotate(${(1 - swipe) * 12}deg)`,
        }}
      >
        <Cover width={600} rotate={-2 + Math.sin(frame / 30) * 0.6} />
      </div>
    </AbsoluteFill>
  );
};

type CardData = { icon?: React.FC<{ size?: number; color?: string; strokeWidth?: number }>; text: string; dark?: boolean; bg?: string; accent?: string };

const cards: CardData[] = [
  { icon: Siren, text: "O medo de ser abandonado dispara um alarme por dentro.", bg: C.sky, accent: C.petrol },
  { icon: Zap, text: "A reação chega antes de a reflexão estar disponível.", bg: "#F6E6C4", accent: "#9A6A14" },
  { icon: Hourglass, text: "Cobrar calma no pico é cobrar no único momento em que a pessoa não tem como pagar.", bg: C.blush, accent: C.terracotta },
  { icon: RefreshCw, text: "A responsabilidade se constrói depois: no treino, na regulação e na reparação.", bg: C.sage, accent: "#4E6B45" },
  { text: "Quem sofre não escolhe como gritar. Mas, com ajuda, pode aprender a escolher o que faz depois do grito.", dark: true },
];

const Card: React.FC<{ data: CardData; index: number; total: number }> = ({ data, index, total }) => {
  const Icon = data.icon;
  const fg = data.dark ? C.offwhite : C.ink;
  return (
    <div
      style={{
        width: 860,
        height: 980,
        borderRadius: 56,
        background: data.dark ? C.petrol : data.bg ?? C.paper,
        boxShadow: "0 40px 80px -30px rgba(0,0,0,.35), 0 2px 0 rgba(0,0,0,.04)",
        padding: "90px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {Icon ? (
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: 999,
              background: "rgba(255,255,255,.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={92} color={data.accent ?? C.terracotta} strokeWidth={1.8} />
          </div>
        ) : (
          <div style={{ width: 22, height: 22, borderRadius: 999, background: C.ochre }} />
        )}
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: data.dark ? "#A9C2C8" : "rgba(30,30,30,.55)" }}>
          {index + 1}/{total}
        </div>
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: data.dark ? 66 : 76,
          lineHeight: 1.12,
          letterSpacing: "-0.015em",
          color: fg,
        }}
      >
        {data.text}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: data.dark ? "#A9C2C8" : "rgba(30,30,30,.55)" }}>
        {data.dark ? "Trecho do livro" : "Quem sofre não escolhe como gritar"}
      </div>
    </div>
  );
};

export const Cena4Mecanismo: React.FC<{ lista?: CardData[]; cardDur?: number; durs?: number[] }> = ({ lista = cards, cardDur = CARD, durs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CARDS = lista.length;
  const dd = durs ?? lista.map(() => cardDur);
  const starts = dd.reduce<number[]>((a, d, i) => [...a, i === 0 ? 0 : a[i - 1] + dd[i - 1]], []);
  let active = 0;
  starts.forEach((st, i) => { if (frame >= st) active = i; });
  const local = frame - starts[active];
  const hintIn = interpolate(frame, [20, 34, 70, 84], [0, 1, 1, 0], clamp);
  const hintX = interpolate(frame, [34, 70], [120, -160], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", top: 250, left: 110, fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.petrol }}>
        O que o livro explica
      </div>
      {lista.map((c, i) => {
        const enter = i === 0 ? 1 : spring({ frame: frame - starts[i], fps, config: { damping: 17, mass: 0.9 } });
        const exit = i < CARDS - 1 ? spring({ frame: frame - starts[i + 1] + 8, fps, config: { damping: 17, mass: 0.9 } }) : 0;
        if (i > active + 1 || (i < active && exit >= 0.999)) return null;
        const behind = i > active;
        const x = behind ? 0 : (1 - enter) * 1000 - exit * 1150;
        const rot = behind ? 0 : (1 - enter) * 8 - exit * 10;
        const scale = behind ? 0.92 : 1;
        const y = behind ? 40 : 0;
        const opacity = behind ? 0.85 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 110,
              top: 340,
              zIndex: CARDS - Math.abs(i - active) + (i === active ? 10 : 0),
              transform: `translateX(${x}px) translateY(${y}px) rotate(${rot}deg) scale(${scale})`,
              opacity,
            }}
          >
            <Card data={c} index={i} total={CARDS} />
          </div>
        );
      })}
      {/* pontos de progresso */}
      <div style={{ position: "absolute", top: 1395, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        {lista.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === active ? 54 : 16,
              height: 16,
              borderRadius: 999,
              background: i === active ? C.terracotta : "#CFC8BD",
              transition: "none",
            }}
          />
        ))}
      </div>
      {/* dica de deslize no primeiro card */}
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 540 + hintX,
          opacity: hintIn,
          width: 110,
          height: 110,
          borderRadius: 999,
          background: "rgba(30,30,30,.82)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        <Hand size={58} color={C.offwhite} strokeWidth={1.8} />
      </div>
      <div style={{ opacity: local < 0 ? 0 : 1 }} />
    </AbsoluteFill>
  );
};

export const Cena5Fechamento: React.FC<{ story?: boolean }> = ({ story = false }) => {
  const frame = useCurrentFrame();
  const book = useSpring(6, { damping: 13, mass: 0.9 });
  const line = useSpring(30);
  const cta = useSpring(52, { damping: 10, mass: 0.6 });
  const pulse = 1 + Math.max(0, Math.sin((frame - 70) / 9)) * 0.03 * (frame > 70 ? 1 : 0);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, background: C.sky }} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${(1 - book) * 120}px) scale(${0.9 + book * 0.1})`, opacity: book }}>
          <Cover width={520} rotate={-2} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 90,
          right: 90,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.25,
          color: C.petrol,
          opacity: line,
          transform: `translateY(${(1 - line) * 30}px)`,
        }}
      >
        Para quem vive o borderline e para quem convive
      </div>
      <div style={{ position: "absolute", top: 1220, left: 0, right: 0, display: story ? "none" : "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${cta * pulse})`,
            background: C.petrol,
            color: C.offwhite,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            padding: "26px 60px",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span style={{ width: 16, height: 16, borderRadius: 999, background: C.ochre, display: "inline-block" }} />
          Saiba mais
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: story ? 1210 : 1360,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 28,
          color: C.grey,
          opacity: line,
        }}
      >
        Dr. Fabio Schmidt, médico com foco em TPB. CRM-SP 183549
      </div>
    </AbsoluteFill>
  );
};

export const Origem: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream }}>
    <Series>
      <Series.Sequence durationInFrames={S1}>
        <Cena1Grito />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S2}>
        <Cena2Argumentos />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S3}>
        <Cena3Nome />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S4}>
        <Cena4Mecanismo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S5}>
        <Cena5Fechamento />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// Versão curta para story: 28s, três cartões, sem botão desenhado (espaço livre para o sticker de link).
export const cardsStory: CardData[] = [cards[0], cards[2], cards[4]];
const ST = { s1: 150, s2: 180, s3: 100, card: 100, s5: 130 };
export const TOTAL_STORY = ST.s1 + ST.s2 + ST.s3 + ST.card * cardsStory.length + ST.s5;

export const OrigemStory: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream }}>
    <Series>
      <Series.Sequence durationInFrames={ST.s1}>
        <Cena1Grito />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ST.s2}>
        <Cena2Argumentos />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ST.s3}>
        <Cena3Nome />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ST.card * cardsStory.length}>
        <Cena4Mecanismo lista={cardsStory} cardDur={ST.card} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ST.s5}>
        <Cena5Fechamento story />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
