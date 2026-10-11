import React from "react";
import { AbsoluteFill, Series, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Anchor, ShieldCheck, VolumeX, Volume2, DoorOpen, Siren, Timer, Undo2, Plus } from "lucide-react";
import { C, SERIF, SANS } from "./theme";
import { Cover } from "./Origem";

const D = [190, 180, 210, 230, 130, 170];
export const TOTAL_T2 = D.reduce((a, b) => a + b, 0);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useSp = (delay: number, damping = 15, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass } });
};

// Cada tela entra deslizando da direita e sai para a esquerda, como uma interface de deslize.
const Tela: React.FC<{ dur: number; index: number; bg?: string; children: React.ReactNode }> = ({ dur, index, bg = C.cream, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = index === 0 ? 1 : spring({ frame, fps, config: { damping: 18, mass: 0.9 } });
  const exit = index === D.length - 1 ? 0 : spring({ frame: frame - (dur - 14), fps, config: { damping: 18, mass: 0.9 } });
  return (
    <AbsoluteFill style={{ background: bg, transform: `translateX(${(1 - enter) * 1080 - exit * 1080}px)` }}>
      {children}
      <div style={{ position: "absolute", top: 1430, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        {D.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 50 : 14,
              height: 14,
              borderRadius: 999,
              background: i === index ? C.terracotta : bg === C.black ? "#4A4744" : "#CFC8BD",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Titulo: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({ children, delay = 10, color = C.ink }) => {
  const s = useSp(delay, 18, 0.7);
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 90,
        right: 90,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 54,
        lineHeight: 1.2,
        color,
        opacity: s,
        transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Balao: React.FC<{ delay: number; lado: "eu" | "outro"; children: React.ReactNode; tom?: "neutro" | "alerta" | "seguro"; size?: number }> = ({
  delay,
  lado,
  children,
  tom = "neutro",
  size = 50,
}) => {
  const s = useSp(delay, 13, 0.6);
  const eu = lado === "eu";
  const bg = eu ? (tom === "seguro" ? C.ink : C.ink) : C.paper;
  const fg = eu ? C.offwhite : C.ink;
  const border = tom === "alerta" ? `5px solid ${C.terracotta}` : tom === "seguro" ? `5px solid #6E8B6A` : "none";
  return (
    <div style={{ display: "flex", justifyContent: eu ? "flex-end" : "flex-start", marginBottom: 30 }}>
      <div
        style={{
          maxWidth: 760,
          background: bg,
          color: fg,
          border,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: size,
          lineHeight: 1.28,
          padding: "30px 40px",
          borderRadius: eu ? "44px 44px 12px 44px" : "44px 44px 44px 12px",
          boxShadow: "0 18px 40px -20px rgba(0,0,0,.35)",
          opacity: s,
          transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,
          transformOrigin: eu ? "100% 100%" : "0% 100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Digitando: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  return (
    <div style={{ display: "flex", marginBottom: 30 }}>
      <div style={{ background: C.paper, borderRadius: "44px 44px 44px 12px", padding: "34px 40px", display: "flex", gap: 14 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: C.grey,
              transform: `translateY(${Math.sin((frame - from) / 3 + i) * 6}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const IconeCirculo: React.FC<{ Icon: React.FC<any>; delay: number; size?: number; cor?: string; fundo?: string }> = ({
  Icon,
  delay,
  size = 150,
  cor = C.terracotta,
  fundo = `${C.terracotta}1F`,
}) => {
  const s = useSp(delay, 10, 0.6);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: fundo,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${s})`,
      }}
    >
      <Icon size={size * 0.52} color={cor} strokeWidth={1.8} />
    </div>
  );
};

// 1. A ameaça que piora
const T1: React.FC = () => {
  const frame = useCurrentFrame();
  const alarme = useSp(120, 9, 0.6);
  const pulso = frame > 120 ? 1 + Math.sin(frame / 3) * 0.06 : 1;
  return (
    <>
      <Titulo>No meio da briga, alguém diz:</Titulo>
      <div style={{ position: "absolute", top: 420, left: 70, right: 70 }}>
        <Balao delay={22} lado="eu" tom="alerta">
          Se você continuar gritando, eu vou embora.
        </Balao>
        <Digitando from={55} to={100} />
        <Balao delay={100} lado="outro" size={64}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, transform: `scale(${frame > 100 ? 1 + Math.abs(Math.sin(frame / 4)) * 0.12 : 1})`, transformOrigin: "left center" }}>
            <Volume2 size={84} color={C.terracotta} strokeWidth={2} />
            <Volume2 size={84} color={C.terracotta} strokeWidth={2} />
            <Volume2 size={84} color={C.terracotta} strokeWidth={2} />
          </div>
        </Balao>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 90,
          right: 90,
          display: "flex",
          alignItems: "center",
          gap: 36,
          opacity: alarme,
        }}
      >
        <div style={{ transform: `scale(${pulso})` }}>
          <IconeCirculo Icon={Siren} delay={120} />
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: C.ink }}>
          O vínculo parece em risco. O pânico sobe, e o grito também.
        </div>
      </div>
    </>
  );
};

// 2. Os dois extremos
const Extremo: React.FC<{ Icon: React.FC<any>; titulo: string; efeito: string; delay: number }> = ({ Icon, titulo, efeito, delay }) => {
  const s = useSp(delay, 15, 0.8);
  return (
    <div
      style={{
        flex: 1,
        background: C.paper,
        borderRadius: 44,
        padding: "56px 44px",
        boxShadow: "0 30px 60px -30px rgba(0,0,0,.3)",
        opacity: s,
        transform: `translateY(${(1 - s) * 80}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 36,
        height: 640,
      }}
    >
      <IconeCirculo Icon={Icon} delay={delay + 6} size={130} />
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 54, lineHeight: 1.08, color: C.ink }}>{titulo}</div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, lineHeight: 1.25, color: C.grey }}>{efeito}</div>
    </div>
  );
};

const T2: React.FC = () => (
  <>
    <Titulo>Quem convive costuma oscilar entre dois extremos</Titulo>
    <div style={{ position: "absolute", top: 520, left: 70, right: 70, display: "flex", gap: 36 }}>
      <Extremo Icon={VolumeX} titulo="Engolir tudo" efeito="Quem cuida vai sumindo." delay={30} />
      <Extremo Icon={DoorOpen} titulo="Explodir e ameaçar ir embora" efeito="O medo de perda dispara." delay={55} />
    </div>
  </>
);

// 3. A fórmula
const T3: React.FC = () => {
  const a = useSp(20, 12, 0.7);
  const plus = useSp(60, 10, 0.6);
  const b = useSp(80, 12, 0.7);
  const legenda = useSp(130, 16, 0.7);
  const linha: React.CSSProperties = { fontFamily: SERIF, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.02 };
  return (
    <>
      <Titulo>Limite sem abandono cabe numa frase</Titulo>
      <div style={{ position: "absolute", top: 450, left: 90, right: 90 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34, opacity: a, transform: `translateX(${(1 - a) * -60}px)` }}>
          <IconeCirculo Icon={Anchor} delay={24} size={130} />
          <div style={{ ...linha, fontSize: 120 }}>Eu fico</div>
        </div>
        <div style={{ margin: "26px 0 26px 30px", transform: `scale(${plus})`, transformOrigin: "left center" }}>
          <Plus size={70} color={C.terracotta} strokeWidth={2.4} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 34, opacity: b, transform: `translateX(${(1 - b) * 60}px)` }}>
          <IconeCirculo Icon={ShieldCheck} delay={84} size={130} />
          <div style={{ ...linha, fontSize: 76 }}>é assim que eu consigo ficar</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 90,
          right: 90,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.3,
          color: C.ink,
          opacity: legenda,
          transform: `translateY(${(1 - legenda) * 24}px)`,
        }}
      >
        A primeira parte atende ao medo de perda. A segunda preserva quem cuida.
      </div>
    </>
  );
};

// 4. Na prática
const T4: React.FC = () => {
  const frame = useCurrentFrame();
  const passos = useSp(120, 15, 0.8);
  return (
    <>
      <Titulo>Na prática, a mesma briga</Titulo>
      <div style={{ position: "absolute", top: 400, left: 70, right: 70 }}>
        <Balao delay={22} lado="eu" tom="seguro" size={48}>
          Eu fico. Mas não consigo continuar essa conversa com gritos. Vou ao quarto e volto em vinte minutos.
        </Balao>
      </div>
      <div
        style={{
          position: "absolute",
          top: 930,
          left: 90,
          right: 90,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity: passos,
        }}
      >
        {[
          { Icon: DoorOpen, t: "Uma pausa", d: 124 },
          { Icon: Timer, t: "20 minutos", d: 136 },
          { Icon: Undo2, t: "A volta", d: 148 },
        ].map(({ Icon, t, d }) => (
          <div key={t + d} style={{ width: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <IconeCirculo Icon={Icon} delay={d} size={140} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink, textAlign: "center" }}>{t}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1230,
          left: 90,
          right: 90,
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.15,
          color: C.ink,
          opacity: interpolate(frame, [165, 185], [0, 1], clamp),
        }}
      >
        Contorno seguro, sem ameaçar abandono.
      </div>
    </>
  );
};

// 5. Trecho do livro e segurança
const T5: React.FC = () => {
  const s = useSp(12, 16, 0.8);
  const nota = useSp(60, 16, 0.8);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 90,
          right: 90,
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          color: C.offwhite,
          opacity: s,
          transform: `translateY(${(1 - s) * 30}px)`,
        }}
      >
        Uma fórmula simples de dizer e difícil de fazer.
      </div>
      <div style={{ position: "absolute", top: 700, left: 90, fontFamily: SANS, fontWeight: 500, fontSize: 32, color: "#9C968E", opacity: s }}>
        Trecho do livro
      </div>
      <div
        style={{
          position: "absolute",
          top: 900,
          left: 90,
          right: 90,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 38,
          lineHeight: 1.3,
          color: C.offwhite,
          opacity: nota * 0.85,
          borderLeft: `6px solid ${C.terracotta}`,
          paddingLeft: 28,
        }}
      >
        Se houver agressão ou ameaça, a segurança vem antes de qualquer conversa.
      </div>
    </>
  );
};

// 6. Fechamento
const T6: React.FC = () => {
  const frame = useCurrentFrame();
  const book = useSp(4, 13, 0.9);
  const linha = useSp(26);
  const cta = useSp(46, 10, 0.6);
  const pulse = frame > 70 ? 1 + Math.max(0, Math.sin((frame - 70) / 9)) * 0.03 : 1;
  return (
    <>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${(1 - book) * 120}px) scale(${0.9 + book * 0.1})`, opacity: book }}>
          <Cover width={500} rotate={-2} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1030,
          left: 90,
          right: 90,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.25,
          color: C.ink,
          opacity: linha,
        }}
      >
        Para quem vive o borderline e para quem convive
      </div>
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${cta * pulse})`,
            background: C.ink,
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
          <span style={{ width: 16, height: 16, borderRadius: 999, background: C.terracotta, display: "inline-block" }} />
          Saiba mais
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1320,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 28,
          color: C.grey,
          opacity: linha,
        }}
      >
        Dr. Fabio Schmidt, médico com foco em TPB. CRM-SP 183549
      </div>
    </>
  );
};

const telas: { C: React.FC; bg?: string }[] = [{ C: T1 }, { C: T2 }, { C: T3 }, { C: T4 }, { C: T5, bg: C.black }, { C: T6 }];

export const Trecho2: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream, overflow: "hidden" }}>
    <Series>
      {telas.map(({ C: Comp, bg }, i) => (
        <Series.Sequence key={i} durationInFrames={D[i]}>
          <Tela dur={D[i]} index={i} bg={bg}>
            <Comp />
          </Tela>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

