import { useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const AMBAR = "#F2B33D";
const CREME = "#F5F1E8";
const CINZA = "#8E897F";
const VERM = "#E2563B";
const VERDE = "#7FB77E";
const FUNDO = "#121110";
const SERIF = "DMSerif";
const SERIF_IT = "DMSerifItalic";
const SANS = "InterBlack";
const SANS_REG = "InterReg";

const carregarFontes = () => {
  const h = delayRender("fontes");
  const fontes: [string, string][] = [
    [SERIF, "fonts/dmserif.woff2"],
    [SERIF_IT, "fonts/dmserif-italic.woff2"],
    [SANS, "fonts/inter-800.woff2"],
    [SANS_REG, "fonts/inter-400.woff2"],
  ];
  Promise.all(
    fontes.map(([n, a]) => {
      const f = new FontFace(n, `url('${staticFile(a)}') format('woff2')`);
      return f.load().then(() => document.fonts.add(f));
    }),
  ).then(() => continueRender(h));
};

const useMola = (atraso = 0, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping, stiffness: 150 } });
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Ícones (traço) ----------
const Icone: React.FC<{ d: string; cor?: string; tam?: number; prog?: number }> = ({ d, cor = AMBAR, tam = 120, prog = 1 }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} />
  </svg>
);
const IC = {
  balao: "M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1zM8 9h8M8 12h5",
  xis: "M6 6l12 12M18 6L6 18",
  olho: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  ancora: "M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 7v14M5 13H3a9 9 0 0 0 18 0h-2M9 10h6",
  relogio: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  telefone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  check: "M5 12l5 5L20 7",
  salvar: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z",
};

// ---------- Peças ----------
const Kicker: React.FC<{ texto: string; atraso?: number; cor?: string }> = ({ texto, atraso = 0, cor = AMBAR }) => {
  const e = useMola(atraso);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: e }}>
      <div style={{ width: interpolate(e, [0, 1], [0, 60]), height: 5, background: cor, borderRadius: 3 }} />
      <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 7, color: CINZA }}>{texto}</div>
    </div>
  );
};

const Titulo: React.FC<{ children: React.ReactNode; atraso?: number; tam?: number; italico?: boolean; cor?: string }> = ({
  children, atraso = 0, tam = 120, italico, cor = CREME,
}) => {
  const e = useMola(atraso, 18);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 12 }}>
      <div
        style={{
          fontFamily: italico ? SERIF_IT : SERIF,
          fontSize: tam,
          lineHeight: 1.02,
          color: cor,
          transform: `translateY(${interpolate(e, [0, 1], [105, 0])}%)`,
          filter: `blur(${interpolate(e, [0, 1], [10, 0])}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Narracao: React.FC<{ texto: string }> = ({ texto }) => {
  const e = useMola(4);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 230 }}>
      <div style={{ fontFamily: SANS_REG, fontSize: 38, color: CREME, opacity: 0.75 * e, textAlign: "center", maxWidth: 860, lineHeight: 1.35 }}>
        {texto}
      </div>
    </AbsoluteFill>
  );
};

const Cena: React.FC<{ children: React.ReactNode; dur: number; narracao?: string }> = ({ children, dur, narracao }) => {
  const frame = useCurrentFrame();
  const sai = interpolate(frame, [dur - 8, dur], [1, 0], clamp);
  const sobe = interpolate(frame, [dur - 8, dur], [0, -40], clamp);
  return (
    <AbsoluteFill style={{ opacity: sai, transform: `translateY(${sobe}px)` }}>
      <AbsoluteFill style={{ padding: "0 90px 260px", flexDirection: "column", justifyContent: "center" }}>{children}</AbsoluteFill>
      {narracao ? <Narracao texto={narracao} /> : null}
    </AbsoluteFill>
  );
};

// Balão de mensagem que chega
const Mensagem: React.FC<{ atraso: number; larg: number; dx: number }> = ({ atraso, larg, dx }) => {
  const e = useMola(atraso, 14);
  return (
    <div
      style={{
        width: larg,
        height: 42,
        borderRadius: 21,
        background: "rgba(245,241,232,0.16)",
        marginBottom: 14,
        marginLeft: dx,
        opacity: e,
        transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px) scale(${interpolate(e, [0, 1], [0.8, 1])})`,
      }}
    />
  );
};

// ---------- Cenas ----------
const C1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [4, 28], [0, 1], clamp);
  const vib = Math.sin(frame * 2.2) * interpolate(frame, [30, 40, 70], [0, 5, 0], clamp);
  return (
    <Cena dur={dur} narracao="Ela está em crise e manda dez mensagens seguidas. O que você responde?">
      <div style={{ display: "flex", alignItems: "flex-end", gap: 50 }}>
        <div style={{ transform: `translateX(${vib}px)` }}>
          <Icone d={IC.balao} tam={170} prog={ic} />
        </div>
        <div style={{ paddingBottom: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Mensagem key={i} atraso={22 + i * 7} larg={[300, 220, 340, 180, 260][i]} dx={[0, 30, 10, 50, 20][i]} />
          ))}
        </div>
      </div>
      <div style={{ height: 50 }} />
      <Kicker texto="BORDERLINE" atraso={4} />
      <div style={{ height: 18 }} />
      <Titulo atraso={8} tam={108}>Ela está em crise.</Titulo>
      <Titulo atraso={16} tam={108} italico cor={AMBAR}>O que você responde?</Titulo>
    </Cena>
  );
};

const Riscado: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => {
  const frame = useCurrentFrame();
  const e = useMola(atraso);
  const corte = interpolate(frame, [atraso + 16, atraso + 30], [0, 1], clamp);
  return (
    <div style={{ position: "relative", display: "inline-block", marginBottom: 34, opacity: e, transform: `translateX(${interpolate(e, [0, 1], [-60, 0])}px)` }}>
      <div style={{ fontFamily: SERIF, fontSize: 84, color: CREME, padding: "6px 0" }}>{texto}</div>
      <div style={{ position: "absolute", left: -16, right: -16, top: "52%", height: 10, background: VERM, borderRadius: 5, transform: `scaleX(${corte}) rotate(-2deg)`, transformOrigin: "left" }} />
    </div>
  );
};

const C2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [2, 16], [0, 1], clamp);
  return (
    <Cena dur={dur} narracao="Calma e você está exagerando pioram. Pra ela, soam como: o que eu sinto está errado.">
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Icone d={IC.xis} cor={VERM} tam={70} prog={ic} />
        <Kicker texto="O QUE PIORA" cor={VERM} />
      </div>
      <div style={{ height: 60 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Riscado texto="Calma." atraso={10} />
        <Riscado texto="Você está exagerando." atraso={40} />
      </div>
      <div style={{ height: 40 }} />
      <Titulo atraso={76} tam={60} italico cor={CINZA}>Ela ouve: o que eu sinto está errado.</Titulo>
    </Cena>
  );
};

const Passo: React.FC<{ n: number; rotulo: string; icone: string; frase: string; sub?: string; dur: number; narracao: string }> = ({
  n, rotulo, icone, frase, sub, dur, narracao,
}) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [6, 30], [0, 1], clamp);
  const eNum = useMola(0, 12);
  const eCard = useMola(26);
  const pulso = 1 + Math.sin(frame * 0.25) * 0.015;
  return (
    <Cena dur={dur} narracao={narracao}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: AMBAR, color: FUNDO, fontFamily: SANS, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${eNum})` }}>
          {n}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 44, letterSpacing: 8, color: CREME, opacity: eNum }}>{rotulo}</div>
      </div>
      <div style={{ height: 70 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 220, height: 220, borderRadius: 60, background: "rgba(242,179,61,0.12)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pulso})` }}>
          <Icone d={icone} tam={130} prog={ic} />
        </div>
      </div>
      <div style={{ height: 70 }} />
      <div style={{ padding: "36px 44px", borderRadius: 30, border: `3px solid ${AMBAR}`, opacity: eCard, transform: `translateY(${interpolate(eCard, [0, 1], [40, 0])}px)` }}>
        <div style={{ fontFamily: SANS_REG, fontSize: 28, color: CINZA, letterSpacing: 4, marginBottom: 14 }}>VOCÊ RESPONDE</div>
        <div style={{ fontFamily: SERIF, fontSize: 72, color: CREME, lineHeight: 1.1 }}>{frase}</div>
        {sub ? <div style={{ fontFamily: SERIF_IT, fontSize: 48, color: AMBAR, marginTop: 14 }}>{sub}</div> : null}
      </div>
    </Cena>
  );
};

const C3: React.FC<{ dur: number }> = ({ dur }) => (
  <Passo n={1} rotulo="NOMEIA" icone={IC.olho} frase="Eu vejo que está difícil." dur={dur}
    narracao="Primeiro, nomeia o que você vê. Eu vejo que está difícil." />
);
const C4: React.FC<{ dur: number }> = ({ dur }) => (
  <Passo n={2} rotulo="FICA" icone={IC.ancora} frase="Eu estou aqui. Não vou embora." dur={dur}
    narracao="Segundo, fica. Eu estou aqui. Não vou embora." />
);
const C5: React.FC<{ dur: number }> = ({ dur }) => (
  <Passo n={3} rotulo="COMBINA" icone={IC.relogio} frase="Às 20h eu te ligo." sub="E liga." dur={dur}
    narracao="Terceiro, combina um horário. Às 20h eu te ligo. E liga." />
);

const C6: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [4, 26], [0, 1], clamp);
  const Num: React.FC<{ n: string; rot: string; atraso: number }> = ({ n, rot, atraso }) => {
    const e = useMola(atraso);
    return (
      <div style={{ display: "flex", alignItems: "baseline", gap: 26, opacity: e, transform: `translateX(${interpolate(e, [0, 1], [-50, 0])}px)` }}>
        <div style={{ fontFamily: SERIF, fontSize: 150, color: VERM, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: SANS, fontSize: 44, color: CREME, letterSpacing: 4 }}>{rot}</div>
      </div>
    );
  };
  return (
    <Cena dur={dur} narracao="Se houver risco, segurança vem antes de qualquer frase. 192, SAMU. 188, CVV.">
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Icone d={IC.telefone} cor={VERM} tam={70} prog={ic} />
        <Kicker texto="SE HOUVER RISCO" cor={VERM} />
      </div>
      <div style={{ height: 50 }} />
      <Titulo atraso={6} tam={76}>Segurança vem antes</Titulo>
      <Titulo atraso={12} tam={76} italico cor={CINZA}>de qualquer frase.</Titulo>
      <div style={{ height: 50 }} />
      <Num n="192" rot="SAMU" atraso={30} />
      <div style={{ height: 20 }} />
      <Num n="188" rot="CVV, 24 horas" atraso={48} />
    </Cena>
  );
};

const Linha: React.FC<{ n: number; texto: string; atraso: number }> = ({ n, texto, atraso }) => {
  const frame = useCurrentFrame();
  const e = useMola(atraso);
  const ck = interpolate(frame, [atraso + 10, atraso + 26], [0, 1], clamp);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 36, opacity: e, transform: `translateX(${interpolate(e, [0, 1], [-60, 0])}px)` }}>
      <div style={{ width: 90, height: 90, borderRadius: 24, background: "rgba(127,183,126,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icone d={IC.check} cor={VERDE} tam={56} prog={ck} />
      </div>
      <div style={{ fontFamily: SANS_REG, fontSize: 30, color: CINZA, width: 40 }}>{n}</div>
      <div style={{ fontFamily: SERIF, fontSize: 70, color: CREME }}>{texto}</div>
    </div>
  );
};

const C7: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [74, 94], [0, 1], clamp);
  const e = useMola(74);
  return (
    <Cena dur={dur} narracao="Nomeia, fica, combina. Salva pra usar na próxima.">
      <Kicker texto="PRA LEMBRAR NA PRÓXIMA" />
      <div style={{ height: 50 }} />
      <Linha n={1} texto="Nomeia." atraso={6} />
      <Linha n={2} texto="Fica." atraso={28} />
      <Linha n={3} texto="Combina." atraso={50} />
      <div style={{ height: 40 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "30px 36px", borderRadius: 28, background: "rgba(242,179,61,0.12)", opacity: e, transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)` }}>
        <Icone d={IC.salvar} tam={80} prog={ic} />
        <div style={{ fontFamily: SANS, fontSize: 40, color: CREME, lineHeight: 1.25 }}>Salva pra usar na próxima. E manda pra quem convive.</div>
      </div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: SANS_REG, fontSize: 30, color: CINZA, opacity: e }}>@drfabioschmidt</div>
    </Cena>
  );
};

const CENAS: [React.FC<{ dur: number }>, number][] = [
  [C1, 4.5], [C2, 5.5], [C3, 4.5], [C4, 4.5], [C5, 5], [C6, 5], [C7, 6],
];
export const acalmarDuracao = (fps: number) => Math.round(CENAS.reduce((a, [, d]) => a + d, 0) * fps);

export const Acalmar: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  useState(() => {
    carregarFontes();
    return true;
  });
  let ini = 0;
  const total = acalmarDuracao(fps);
  return (
    <AbsoluteFill style={{ backgroundColor: FUNDO }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 30% 20%, rgba(242,179,61,0.10), rgba(0,0,0,0) 55%), radial-gradient(circle at 80% 90%, rgba(226,86,59,0.08), rgba(0,0,0,0) 50%)" }} />
      {CENAS.map(([Comp, d], i) => {
        const from = Math.round(ini * fps);
        const dur = Math.round(d * fps);
        ini += d;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Comp dur={dur} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", top: 0, left: 0, height: 8, width: `${(frame / total) * 100}%`, background: AMBAR }} />
    </AbsoluteFill>
  );
};
