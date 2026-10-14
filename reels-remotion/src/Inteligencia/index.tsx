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
  lampada: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z",
  olho: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  etiqueta: "M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9zM7.5 7.5h.01",
  caneta: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
  xis: "M6 6l12 12M18 6L6 18",
  alarme: "M12 8v5l3 2M5 3L2 6M22 6l-3-3M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  salvar: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z",
};

// ---------- Peças ----------
const Kicker: React.FC<{ texto: string; atraso?: number }> = ({ texto, atraso = 0 }) => {
  const e = useMola(atraso);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: e }}>
      <div style={{ width: interpolate(e, [0, 1], [0, 60]), height: 5, background: AMBAR, borderRadius: 3 }} />
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

// ---------- Cenas ----------
const C1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [6, 34], [0, 1], clamp);
  return (
    <Cena dur={dur} narracao="A pessoa com borderline frequentemente é muito inteligente.">
      <Icone d={IC.lampada} tam={170} prog={ic} />
      <div style={{ height: 50 }} />
      <Kicker texto="BORDERLINE" atraso={4} />
      <div style={{ height: 18 }} />
      <Titulo atraso={8}>Inteligente</Titulo>
      <Titulo atraso={14} italico cor={AMBAR}>demais?</Titulo>
    </Cena>
  );
};

const Item: React.FC<{ icone: string; texto: string; atraso: number }> = ({ icone, texto, atraso }) => {
  const frame = useCurrentFrame();
  const e = useMola(atraso);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 34, marginBottom: 46, opacity: e, transform: `translateX(${interpolate(e, [0, 1], [-80, 0])}px)` }}>
      <div style={{ width: 120, height: 120, borderRadius: 30, background: "rgba(242,179,61,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icone d={icone} tam={74} prog={interpolate(frame, [atraso, atraso + 20], [0, 1], clamp)} />
      </div>
      <div style={{ fontFamily: SANS, fontSize: 56, color: CREME }}>{texto}</div>
    </div>
  );
};

const C2: React.FC<{ dur: number }> = ({ dur }) => (
  <Cena dur={dur} narracao="Ela consegue ver o problema e nomear o padrão. Descreve com precisão o que está destruindo a própria vida.">
    <Kicker texto="ELA CONSEGUE" />
    <div style={{ height: 60 }} />
    <Item icone={IC.olho} texto="Ver o problema" atraso={6} />
    <Item icone={IC.etiqueta} texto="Nomear o padrão" atraso={26} />
    <Item icone={IC.caneta} texto="Descrever com precisão" atraso={46} />
  </Cena>
);

const C3: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [4, 18], [0, 1], clamp);
  const tremor = Math.sin(frame * 1.7) * interpolate(frame, [4, 14, 30], [0, 6, 0], clamp);
  return (
    <Cena dur={dur} narracao="Não consegue parar.">
      <div style={{ transform: `translateX(${tremor}px)` }}>
        <Icone d={IC.xis} cor={VERM} tam={190} prog={ic} />
      </div>
      <div style={{ height: 40 }} />
      <Titulo atraso={6}>Mas não</Titulo>
      <Titulo atraso={12} italico cor={VERM}>consegue parar.</Titulo>
    </Cena>
  );
};

const Barra: React.FC<{ rotulo: string; valor: number; cor: string; atraso: number; legenda: string }> = ({ rotulo, valor, cor, atraso, legenda }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [atraso, atraso + 28], [0, valor], clamp);
  const e = useMola(atraso);
  return (
    <div style={{ marginBottom: 70, opacity: e }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div style={{ fontFamily: SERIF, fontSize: 64, color: CREME }}>{rotulo}</div>
        <div style={{ fontFamily: SANS, fontSize: 34, color: cor }}>{legenda}</div>
      </div>
      <div style={{ height: 34, borderRadius: 17, background: "rgba(245,241,232,0.10)", overflow: "hidden" }}>
        <div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 17, background: cor }} />
      </div>
    </div>
  );
};

const C4: React.FC<{ dur: number }> = ({ dur }) => (
  <Cena dur={dur} narracao="E esse é o dado mais cruel do diagnóstico: o intelecto funciona. Já a implementação dele, não.">
    <Kicker texto="O DADO MAIS CRUEL" />
    <div style={{ height: 70 }} />
    <Barra rotulo="Intelecto" valor={0.95} cor={AMBAR} atraso={10} legenda="funciona" />
    <Barra rotulo="Implementação" valor={0.18} cor={VERM} atraso={52} legenda="não acompanha" />
  </Cena>
);

const C5: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ang = interpolate(frame, [10, 50], [-80, 70], clamp) + Math.sin(frame * 0.9) * interpolate(frame, [50, 60], [0, 3], clamp);
  const ic = interpolate(frame, [0, 20], [0, 1], clamp);
  return (
    <Cena dur={dur} narracao="Se você tem uma mente em estado de urgência total desde a infância...">
      <Kicker texto="ESTADO DA MENTE" />
      <div style={{ height: 40 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={700} height={420} viewBox="0 0 700 420">
          <path d="M80 380 A270 270 0 0 1 620 380" fill="none" stroke="rgba(245,241,232,0.12)" strokeWidth={46} strokeLinecap="round" />
          <path d="M80 380 A270 270 0 0 1 620 380" fill="none" stroke={VERM} strokeWidth={46} strokeLinecap="round" pathLength={1} strokeDasharray="0.32 1" strokeDashoffset={-0.68} />
          <g transform={`rotate(${ang} 350 380)`}>
            <line x1={350} y1={380} x2={350} y2={150} stroke={CREME} strokeWidth={12} strokeLinecap="round" />
          </g>
          <circle cx={350} cy={380} r={22} fill={CREME} />
          <text x={70} y={415} fill={CINZA} fontFamily={SANS} fontSize={26}>calma</text>
          <text x={520} y={415} fill={VERM} fontFamily={SANS} fontSize={26}>urgência</text>
        </svg>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30, justifyContent: "center" }}>
        <Icone d={IC.alarme} cor={VERM} tam={70} prog={ic} />
        <Titulo atraso={30} tam={84} italico cor={CREME}>urgência total</Titulo>
      </div>
    </Cena>
  );
};

const C6: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const corte = interpolate(frame, [26, 40], [0, 1], clamp);
  const seta = interpolate(frame, [8, 24], [0, 1], clamp);
  const seta2 = interpolate(frame, [44, 60], [0, 1], clamp);
  const Caixa: React.FC<{ texto: string; cor: string; atraso: number; it?: boolean }> = ({ texto, cor, atraso, it }) => {
    const e = useMola(atraso);
    return (
      <div style={{ padding: "26px 44px", borderRadius: 26, border: `3px solid ${cor}`, fontFamily: it ? SERIF_IT : SERIF, fontSize: 64, color: cor, opacity: e, transform: `scale(${interpolate(e, [0, 1], [0.85, 1])})`, position: "relative" }}>
        {texto}
      </div>
    );
  };
  return (
    <Cena dur={dur} narracao="...a inteligência não vira freio. Vira uma tortura diária.">
      <Kicker texto="O QUE A INTELIGÊNCIA VIRA" />
      <div style={{ height: 60 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <Caixa texto="Inteligência" cor={CREME} atraso={0} />
        <svg width={40} height={90}><line x1={20} y1={0} x2={20} y2={90 * seta} stroke={CINZA} strokeWidth={5} /></svg>
        <div style={{ position: "relative" }}>
          <Caixa texto="freio" cor={CINZA} atraso={14} />
          <div style={{ position: "absolute", left: -20, right: -20, top: "50%", height: 8, background: VERM, borderRadius: 4, transform: `scaleX(${corte})`, transformOrigin: "left" }} />
        </div>
        <svg width={40} height={90}><line x1={20} y1={0} x2={20} y2={90 * seta2} stroke={CINZA} strokeWidth={5} /></svg>
        <Caixa texto="tortura diária" cor={AMBAR} atraso={52} it />
      </div>
    </Cena>
  );
};

const C7: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [4, 26], [0, 1], clamp);
  const pisca = frame > 40 && frame < 46 ? 0.2 : 1;
  return (
    <Cena dur={dur} narracao="Você sabe exatamente o que está acontecendo. E assiste.">
      <div style={{ opacity: pisca }}>
        <Icone d={IC.olho} tam={200} prog={ic} />
      </div>
      <div style={{ height: 40 }} />
      <Titulo atraso={8}>Você sabe.</Titulo>
      <Titulo atraso={20} italico cor={AMBAR}>E assiste.</Titulo>
    </Cena>
  );
};

const C8: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ic = interpolate(frame, [50, 70], [0, 1], clamp);
  const e = useMola(50);
  return (
    <Cena dur={dur}>
      <Kicker texto="ISSO TEM EXPLICAÇÃO CLÍNICA" />
      <div style={{ height: 30 }} />
      <Titulo atraso={6} tam={96}>Não é só</Titulo>
      <Titulo atraso={12} tam={96} italico cor={AMBAR}>falta de esforço.</Titulo>
      <div style={{ height: 90 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "30px 36px", borderRadius: 28, background: "rgba(242,179,61,0.12)", opacity: e, transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)` }}>
        <Icone d={IC.salvar} tam={80} prog={ic} />
        <div style={{ fontFamily: SANS, fontSize: 40, color: CREME, lineHeight: 1.25 }}>
          Salva pra quem se sente inteligente demais pra continuar errando tanto.
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontFamily: SANS_REG, fontSize: 30, color: CINZA, opacity: e }}>@drfabioschmidt</div>
    </Cena>
  );
};

const CENAS: [React.FC<{ dur: number }>, number][] = [
  [C1, 3.5], [C2, 5.5], [C3, 2.5], [C4, 5.5], [C5, 4.5], [C6, 4.5], [C7, 3.5], [C8, 5.5],
];
export const inteligenciaDuracao = (fps: number) => Math.round(CENAS.reduce((a, [, d]) => a + d, 0) * fps);

export const Inteligencia: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  useState(() => {
    carregarFontes();
    return true;
  });
  let ini = 0;
  const total = inteligenciaDuracao(fps);
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
