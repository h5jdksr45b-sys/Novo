import { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadIdentidadeFonts, SANS, SERIF } from "../IdentidadeReel/fonts";
import { ROTEIRO } from "./roteiro";

// Sequência de stories: três situações, uma respiração guiada para cada.
// A forma no centro respira junto com a pessoa. Os tempos vêm de
// roteiro.ts, gerado junto com o áudio guia para os dois baterem.

export const FPS = 30;
const VERMELHO = "#c83c1e";
const PAPEL = "#ece8e1";
const PRETO = "#0d0d0d";
const NOITE = "#0b0f1c";

type Tecnica = keyof typeof ROTEIRO;
type Fase = (typeof ROTEIRO)[Tecnica]["fases"][number];

export const duracao = (t: Tecnica) => Math.round(ROTEIRO[t].total * FPS);

const suave = Easing.inOut(Easing.sin);

// Onde a pessoa está na respiração: fase atual e quanto de ar (0 a 1).
const estado = (t: Tecnica, s: number) => {
  const fases = ROTEIRO[t].fases as readonly Fase[];
  const i = fases.findIndex((f) => s >= f.de && s < f.ate);
  if (i < 0) return null;
  const fz = fases[i];
  const p = (s - fz.de) / (fz.ate - fz.de);
  const e = suave(p);
  let ar = 0;
  if (t === "suspiro") {
    if (fz.tipo === "in") ar = 0.78 * e;
    else if (fz.tipo === "in2") ar = 0.78 + 0.22 * e;
    else if (fz.tipo === "out") ar = 1 - e;
  } else {
    if (fz.tipo === "in") ar = e;
    else if (fz.tipo === "hold") ar = 1;
    else if (fz.tipo === "out") ar = 1 - e;
  }
  return { fz, p, ar, resta: Math.ceil(fz.ate - s - 0.001) };
};

const useFontes = () => {
  useEffect(() => {
    loadIdentidadeFonts();
  }, []);
};

// Linha de texto que entra com subida e desfoque.
const Linha: React.FC<{
  at: number;
  ate?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, ate, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = Math.round(at * fps);
  const p = spring({ frame: frame - a, fps, config: { damping: 18, mass: 0.7 } });
  const sai =
    ate === undefined
      ? 1
      : interpolate(frame, [ate * fps - 8, ate * fps], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (frame < a) return null;
  return (
    <div
      style={{
        ...style,
        opacity: Math.min(1, p * 1.3) * sai,
        transform: `translateY(${(1 - p) * 30}px)`,
        filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Topo: React.FC<{ n: number; nome: string; cor: string }> = ({ n, nome, cor }) => (
  <div
    style={{
      position: "absolute",
      top: 270,
      left: 90,
      right: 90,
      display: "flex",
      justifyContent: "space-between",
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: cor,
      opacity: 0.6,
    }}
  >
    <span>Situação {n} de 3</span>
    <span>{nome}</span>
  </div>
);

// Abertura do story: a situação e o nome da técnica, depois some.
const Intro: React.FC<{
  linhas: string[];
  tecnica: string;
  como: string;
  cor: string;
  acento: string;
}> = ({ linhas, tecnica, como, cor, acento }) => {
  const fim = 5.6;
  return (
    <div style={{ position: "absolute", top: 520, left: 90, right: 90, color: cor }}>
      {linhas.map((l, i) => (
        <Linha
          key={i}
          at={0.3 + i * 1.1}
          ate={fim}
          style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, letterSpacing: -1.5, lineHeight: 1.12, marginBottom: 18 }}
        >
          {l}
        </Linha>
      ))}
      <Linha at={2.9} ate={fim} style={{ marginTop: 70, width: 110, height: 8, backgroundColor: acento }}>
        {null}
      </Linha>
      <Linha at={3.1} ate={fim} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 128, lineHeight: 1, marginTop: 34 }}>
        {tecnica}
      </Linha>
      <Linha at={3.8} ate={fim} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, lineHeight: 1.25, marginTop: 24, opacity: 0.85 }}>
        {como}
      </Linha>
    </div>
  );
};

const Saida: React.FC<{ t: Tecnica; texto: string; cor: string }> = ({ t, texto, cor }) => {
  const s = ROTEIRO[t].guiaFim + 0.4;
  return (
    <div style={{ position: "absolute", top: 760, left: 90, right: 90, color: cor, textAlign: "center" }}>
      <Linha at={s} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 96, lineHeight: 1.08 }}>
        {texto}
      </Linha>
      <Linha at={s + 1.4} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 36, marginTop: 50, opacity: 0.6 }}>
        Se ficar tonto, pare e respire normal.
      </Linha>
    </div>
  );
};

// Rótulo da fase e contagem regressiva, com transição entre fases.
const Guia: React.FC<{ t: Tecnica; cor: string; top: number }> = ({ t, cor, top }) => {
  const frame = useCurrentFrame();
  const e = estado(t, frame / FPS);
  if (!e || !e.fz.rotulo) return null;
  const entra = interpolate(e.p * (e.fz.ate - e.fz.de), [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", color: cor, opacity: entra }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: -1 }}>{e.fz.rotulo}</div>
    </div>
  );
};

const Contagem: React.FC<{ t: Tecnica; cor: string; top: number }> = ({ t, cor, top }) => {
  const frame = useCurrentFrame();
  const e = estado(t, frame / FPS);
  if (!e || e.fz.tipo === "pausa") return null;
  const fracao = e.p * (e.fz.ate - e.fz.de);
  const pulso = fracao % 1;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: SERIF,
        fontSize: 170,
        lineHeight: 1,
        color: cor,
        opacity: interpolate(pulso, [0, 0.15, 0.85, 1], [0.5, 1, 1, 0.75]),
      }}
    >
      {e.resta}
    </div>
  );
};

const Ciclos: React.FC<{ t: Tecnica; cor: string; top: number }> = ({ t, cor, top }) => {
  const frame = useCurrentFrame();
  const e = estado(t, frame / FPS);
  if (!e) return null;
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
      {Array.from({ length: ROTEIRO[t].ciclos }, (_, i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: cor,
            opacity: i < e.fz.ciclo ? 0.95 : 0.25,
          }}
        />
      ))}
    </div>
  );
};

// Aparece quando a intro sai e some antes da saída.
const useGuiaVisivel = (t: Tecnica) => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  return interpolate(s, [5.4, 6.0, ROTEIRO[t].guiaFim, ROTEIRO[t].guiaFim + 0.4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ---------- Situação 1: suspiro duplo ----------

export const StorySuspiro: React.FC = () => {
  useFontes();
  const frame = useCurrentFrame();
  const t: Tecnica = "suspiro";
  const e = estado(t, frame / FPS);
  const ar = e?.ar ?? 0;
  const vis = useGuiaVisivel(t);
  const R = 430;
  const r = 120 + (R - 120) * ar;
  const segunda = e?.fz.tipo === "in2";
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
      <Audio src={staticFile("respiracao/suspiro.wav")} />
      <Topo n={1} nome="suspiro duplo" cor={PRETO} />
      <Intro
        linhas={["A mensagem chegou.", "Você já está digitando a resposta."]}
        tecnica="suspiro duplo"
        como="Duas puxadas pelo nariz. Uma soltura longa pela boca."
        cor={PRETO}
        acento={VERMELHO}
      />
      <AbsoluteFill style={{ opacity: vis }}>
        <svg width="1080" height="1920" style={{ position: "absolute" }}>
          <circle cx={540} cy={1000} r={120 + (R - 120) * 0.78} fill="none" stroke={PRETO} strokeOpacity={0.25} strokeWidth={3} strokeDasharray="10 14" />
          <circle cx={540} cy={1000} r={R} fill="none" stroke={segunda ? VERMELHO : PRETO} strokeOpacity={segunda ? 0.9 : 0.3} strokeWidth={segunda ? 6 : 3} />
          <circle cx={540} cy={1000} r={r} fill={VERMELHO} />
        </svg>
        <Guia t={t} cor={PRETO} top={440} />
        <Contagem t={t} cor={PAPEL} top={915} />
        <Ciclos t={t} cor={PRETO} top={1520} />
      </AbsoluteFill>
      <Saida t={t} texto="Agora decida se a resposta precisa sair hoje." cor={PRETO} />
    </AbsoluteFill>
  );
};

// ---------- Situação 2: respiração quadrada ----------

export const StoryQuadrada: React.FC = () => {
  useFontes();
  const frame = useCurrentFrame();
  const t: Tecnica = "quadrada";
  const e = estado(t, frame / FPS);
  const vis = useGuiaVisivel(t);
  const L = 620;
  const x0 = 540 - L / 2;
  const y0 = 1000 - L / 2;
  // Lado ativo: sobe pela esquerda, cruza o topo, desce pela direita, volta por baixo.
  const lados = { in: 0, hold: 1, out: 2, hold2: 3 } as Record<string, number>;
  const lado = e ? (lados[e.fz.tipo] ?? 0) : 0;
  const p = e ? suave(e.p) : 0;
  const cantos: [number, number][] = [
    [x0, y0 + L],
    [x0, y0],
    [x0 + L, y0],
    [x0 + L, y0 + L],
  ];
  const a = cantos[lado];
  const b = cantos[(lado + 1) % 4];
  const px = a[0] + (b[0] - a[0]) * p;
  const py = a[1] + (b[1] - a[1]) * p;
  const nivel = e?.ar ?? 0;
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      <Audio src={staticFile("respiracao/quadrada.wav")} />
      <Topo n={2} nome="respiração quadrada" cor={PAPEL} />
      <Intro
        linhas={["A conversa difícil é daqui a pouco.", "Ou já começou."]}
        tecnica="respiração quadrada"
        como="Quatro tempos em cada lado. Dá para fazer de olhos abertos."
        cor={PAPEL}
        acento={VERMELHO}
      />
      <AbsoluteFill style={{ opacity: vis }}>
        <svg width="1080" height="1920" style={{ position: "absolute" }}>
          <rect x={x0} y={y0 + L * (1 - nivel)} width={L} height={L * nivel} fill={VERMELHO} opacity={0.9} />
          {cantos.map((c, i) => {
            const d = cantos[(i + 1) % 4];
            return (
              <line
                key={i}
                x1={c[0]}
                y1={c[1]}
                x2={d[0]}
                y2={d[1]}
                stroke={PAPEL}
                strokeWidth={i === lado ? 10 : 4}
                strokeOpacity={i === lado ? 1 : 0.3}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={px} cy={py} r={26} fill={PAPEL} />
          <circle cx={px} cy={py} r={44} fill={PAPEL} opacity={0.18} />
        </svg>
        <Guia t={t} cor={PAPEL} top={480} />
        <Contagem t={t} cor={PAPEL} top={915} />
        <Ciclos t={t} cor={PAPEL} top={1430} />
      </AbsoluteFill>
      <Saida t={t} texto="Volte para a conversa. Uma frase de cada vez." cor={PAPEL} />
    </AbsoluteFill>
  );
};

// ---------- Situação 3: soltar mais devagar do que puxa ----------

export const StoryLonga: React.FC = () => {
  useFontes();
  const frame = useCurrentFrame();
  const t: Tecnica = "longa";
  const e = estado(t, frame / FPS);
  const ar = e?.ar ?? 0;
  const vis = useGuiaVisivel(t);
  const r = 150 + 270 * ar;
  // Curva de uma respiração: sobe em 4, desce em 6.
  const W = 760;
  const x0 = 540 - W / 2;
  const base = 1500;
  const alto = 1360;
  const xTopo = x0 + W * 0.4;
  let px = x0;
  let py = base;
  if (e) {
    const q = suave(e.p);
    if (e.fz.tipo === "in") {
      px = x0 + (xTopo - x0) * e.p;
      py = base - (base - alto) * q;
    } else {
      px = xTopo + (x0 + W - xTopo) * e.p;
      py = alto + (base - alto) * q;
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: NOITE }}>
      <Audio src={staticFile("respiracao/longa.wav")} />
      <Topo n={3} nome="expiração longa" cor="#d9d2c5" />
      <Intro
        linhas={["Deitou.", "E a cabeça voltou para a briga."]}
        tecnica="soltar mais devagar"
        como="Quatro tempos para entrar. Seis para sair."
        cor="#e8e1d4"
        acento="#e0a072"
      />
      <AbsoluteFill style={{ opacity: vis }}>
        <div
          style={{
            position: "absolute",
            left: 540 - r * 1.8,
            top: 960 - r * 1.8,
            width: r * 3.6,
            height: r * 3.6,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(224,160,114,0.35) 0%, rgba(224,160,114,0) 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - r,
            top: 960 - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: "radial-gradient(circle at 45% 40%, #f3d9c1 0%, #e0a072 70%, #c47a4c 100%)",
          }}
        />
        <svg width="1080" height="1920" style={{ position: "absolute" }}>
          <path
            d={`M ${x0} ${base} C ${x0 + W * 0.2} ${base}, ${xTopo - W * 0.15} ${alto}, ${xTopo} ${alto} S ${x0 + W * 0.8} ${base}, ${x0 + W} ${base}`}
            fill="none"
            stroke="#e8e1d4"
            strokeOpacity={0.3}
            strokeWidth={4}
          />
          <circle cx={px} cy={py} r={16} fill="#f3d9c1" />
        </svg>
        <Guia t={t} cor="#e8e1d4" top={440} />
        <Contagem t={t} cor={NOITE} top={875} />
        <Ciclos t={t} cor="#e8e1d4" top={1570} />
      </AbsoluteFill>
      <Saida t={t} texto="Se a cabeça voltar para a briga, volte para a contagem." cor="#e8e1d4" />
    </AbsoluteFill>
  );
};

// ---------- Abertura e fechamento ----------

export const DUR_ABERTURA = 8 * FPS;
export const DUR_FECHAMENTO = 14 * FPS;

export const StoryAbertura: React.FC = () => {
  useFontes();
  const frame = useCurrentFrame();
  const ar = (1 - Math.cos((frame / FPS / 8) * Math.PI * 2)) / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL, color: PRETO }}>
      <Audio src={staticFile("respiracao/abertura.wav")} />
      <div
        style={{
          position: "absolute",
          left: 540 - 260,
          top: 960,
          width: 520,
          height: 520,
          borderRadius: "50%",
          backgroundColor: VERMELHO,
          transform: `scale(${0.55 + 0.45 * ar})`,
        }}
      />
      <div style={{ position: "absolute", top: 400, left: 90, right: 90 }}>
        <Linha at={0.3} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 74, letterSpacing: -2, lineHeight: 1.1 }}>
          Três momentos em que a emoção sobe rápido.
        </Linha>
        <Linha at={1.8} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 100, lineHeight: 1.02, marginTop: 40 }}>
          Uma respiração para cada um.
        </Linha>
        <Linha at={3.6} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, lineHeight: 1.3, marginTop: 44, opacity: 0.8 }}>
          A imagem respira com você. Siga o ritmo dela.
        </Linha>
      </div>
      <Linha at={4.6} style={{ position: "absolute", bottom: 360, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 32, opacity: 0.6 }}>
        Dr. Fabio Schmidt, CRM-SP 183549
      </Linha>
    </AbsoluteFill>
  );
};

export const StoryFechamento: React.FC = () => {
  useFontes();
  const l: React.CSSProperties = { fontFamily: SANS, fontWeight: 600, fontSize: 50, lineHeight: 1.25, marginBottom: 46 };
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO, color: PAPEL }}>
      <Audio src={staticFile("respiracao/fechamento.wav")} />
      <div style={{ position: "absolute", top: 360, left: 90, right: 90 }}>
        <Linha at={0.3} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 104, lineHeight: 1.02, marginBottom: 60 }}>
          Respirar baixa o corpo.
        </Linha>
        <Linha at={1.6} style={l}>
          Não resolve a briga. Não substitui tratamento. Ajuda você a decidir o próximo passo com mais calma.
        </Linha>
        <Linha at={4.2} style={{ ...l, opacity: 0.75, fontWeight: 500, fontSize: 42 }}>
          Se ficar tonto ou desconfortável, pare e volte a respirar normal.
        </Linha>
        <Linha
          at={6.2}
          style={{ ...l, fontSize: 44, borderLeft: `8px solid ${VERMELHO}`, paddingLeft: 30 }}
        >
          Se estiver pensando em se machucar, ligue 188. CVV, gratuito, 24 horas.
        </Linha>
        <Linha at={9.0} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 78, lineHeight: 1.08, marginTop: 30 }}>
          Envie para alguém que precisa ter isso à mão.
        </Linha>
      </div>
      <Linha at={10.0} style={{ position: "absolute", bottom: 360, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 32, opacity: 0.55 }}>
        Dr. Fabio Schmidt, CRM-SP 183549
      </Linha>
    </AbsoluteFill>
  );
};
