import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import legendas from "../../public/espelho/legendas.json";
import cortes from "../../public/espelho/cortes.json";

// Paleta e tipografia
const AMBAR = "#F2B33D";
const CREME = "#F5F1E8";
const CINZA = "#9A958C";
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
    fontes.map(([nome, arq]) => {
      const f = new FontFace(nome, `url('${staticFile(arq)}') format('woff2')`);
      return f.load().then(() => document.fonts.add(f));
    }),
  ).then(() => continueRender(h));
};

const ms = (s: number) => s * 1000;

// Momentos (segundos, na linha do tempo editada)
const TITULOS = [
  { de: 0.15, ate: 3.4, kicker: "VOCÊ JÁ SE PERGUNTOU", titulo: "Quem é essa pessoa?" },
  { de: 7.05, ate: 9.2, kicker: "O NOME DISSO", titulo: "Despersonalização", sub: "um tipo de dissociação" },
  { de: 19.41, ate: 23.97, kicker: "QUANDO ACONTECE", titulo: "Emoção além do limite" },
  { de: 27.8, ate: 29.34, kicker: "EU SEI QUE ASSUSTA", titulo: "Calma." },
  { de: 34.75, ate: 38.59, kicker: "QUANDO PROCURAR AJUDA", titulo: "Se acontece sempre" },
];
const GRAFICOS = {
  estudo: { de: 9.2, ate: 13.28 },
  grafico: { de: 13.28, ate: 19.41 },
  volume: { de: 23.97, ate: 27.8 },
  tabela: { de: 29.34, ate: 34.75 },
};
const CTA = { de: 38.59, ate: 41.25 };
const SOCOS = [5.03, 7.05, 29.05, 38.59];

const DESTAQUES = [
  "espelho", "louco", "despersonalização", "dissociação", "borderline", "estresse",
  "estranhamento", "emoção", "volume", "você", "calma", "realidade", "sempre", "nome",
];
const norm = (t: string) => t.trim().toLowerCase().replace(/[.,?:]/g, "");
const ehDestaque = (t: string) => DESTAQUES.includes(norm(t));

type Palavra = { text: string; startMs: number; endMs: number };

const paginar = (ps: Palavra[]) => {
  const pages: Palavra[][] = [];
  let atual: Palavra[] = [];
  ps.forEach((p) => {
    atual.push(p);
    const fim = /[.,?:]$/.test(p.text.trim());
    if (atual.length === 3 || fim || ehDestaque(p.text)) {
      pages.push(atual);
      atual = [];
    }
  });
  if (atual.length) pages.push(atual);
  return pages;
};

const useTempo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

// ---------- Vídeo de fundo ----------
const emGrafico = (t: number) =>
  Object.values(GRAFICOS).reduce((acc, g) => {
    const entra = interpolate(t, [g.de, g.de + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const sai = interpolate(t, [g.ate - 0.25, g.ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return Math.max(acc, Math.min(entra, sai));
  }, 0);

const Fundo: React.FC = () => {
  const { t, fps } = useTempo();
  const soco = SOCOS.reduce((acc, s) => {
    const d = t - s;
    if (d < 0 || d > 0.9) return acc;
    return Math.max(acc, interpolate(d, [0, 0.12, 0.9], [0, 0.09, 0.05]));
  }, 0);
  const g = emGrafico(t);
  let acc = 0;
  return (
    <AbsoluteFill>
      {(cortes.keep as [number, number][]).map(([a, b], i) => {
        const from = Math.round(acc * fps);
        const dur = Math.round((b - a) * fps);
        acc += b - a;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Segmento inicio={a} base={i % 2 === 0 ? 1 : 1.08} extra={soco} dur={dur} desfoque={g} />
          </Sequence>
        );
      })}
      {/* gradientes para leitura */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ backgroundColor: `rgba(8,8,8,${0.62 * g})` }} />
    </AbsoluteFill>
  );
};

const Segmento: React.FC<{ inicio: number; base: number; extra: number; dur: number; desfoque: number }> = ({
  inicio, base, extra, dur, desfoque,
}) => {
  const { frame, fps } = useTempo();
  const deriva = interpolate(frame, [0, dur], [0, 0.025]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile("espelho/bruto.mp4")}
        trimBefore={Math.round(inicio * fps)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${base + deriva + extra + desfoque * 0.06})`,
          transformOrigin: "50% 35%",
          filter: desfoque > 0 ? `blur(${18 * desfoque}px)` : undefined,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Legendas cinéticas ----------
const PalavraK: React.FC<{ p: Palavra; inicioMs: number }> = ({ p, inicioMs }) => {
  const { frame, fps } = useTempo();
  const tMs = (frame / fps) * 1000 + inicioMs;
  const e = spring({ frame: frame - ((p.startMs - inicioMs) / 1000) * fps, fps, config: { damping: 16, stiffness: 200 } });
  const ativa = tMs >= p.startMs && tMs < p.endMs + 120;
  const d = ehDestaque(p.text);
  const texto = p.text.trim();
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", padding: "0 10px 8px" }}>
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${interpolate(e, [0, 1], [110, 0])}%) scale(${ativa && !d ? 1.04 : 1})`,
          filter: `blur(${interpolate(e, [0, 1], [8, 0])}px)`,
          fontFamily: d ? SERIF_IT : SANS,
          fontSize: d ? 104 : 74,
          textTransform: d ? "none" : "uppercase",
          letterSpacing: d ? 0 : -1,
          color: d ? AMBAR : ativa ? "#FFFFFF" : "rgba(255,255,255,0.88)",
        }}
      >
        {d ? texto.replace(/[,:]$/, "") : texto}
      </span>
    </span>
  );
};

const Legendas: React.FC = () => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => paginar(legendas as Palavra[]), []);
  return (
    <>
      {pages.map((pg, i) => {
        const de = pg[0].startMs;
        const ate = pages[i + 1] ? pages[i + 1][0].startMs : pg[pg.length - 1].endMs + 400;
        const dur = Math.max(1, Math.round(((ate - de) / 1000) * fps));
        return (
          <Sequence key={i} from={Math.round((de / 1000) * fps)} durationInFrames={dur} layout="none">
            <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 330 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "baseline",
                  maxWidth: 960,
                  lineHeight: 1.05,
                  textShadow: "0 6px 26px rgba(0,0,0,0.65)",
                }}
              >
                {pg.map((p, j) => (
                  <PalavraK key={j} p={p} inicioMs={de} />
                ))}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

// ---------- Títulos editoriais ----------
const Titulo: React.FC<{ kicker: string; titulo: string; sub?: string; durF: number }> = ({ kicker, titulo, sub, durF }) => {
  const { frame, fps } = useTempo();
  const e = spring({ frame, fps, config: { damping: 18, stiffness: 150 } });
  const e2 = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 150 } });
  const sai = interpolate(frame, [durF - 6, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "flex-start", paddingTop: 190, paddingLeft: 80, opacity: sai }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: e, transform: `translateX(${interpolate(e, [0, 1], [-60, 0])}px)` }}>
        <div style={{ width: interpolate(e, [0, 1], [0, 56]), height: 5, background: AMBAR, borderRadius: 3 }} />
        <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 6, color: CREME }}>{kicker}</div>
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: titulo.length > 16 ? 92 : 112,
          color: "white",
          lineHeight: 1,
          marginTop: 14,
          maxWidth: 920,
          opacity: e2,
          transform: `translateY(${interpolate(e2, [0, 1], [40, 0])}px)`,
          textShadow: "0 6px 30px rgba(0,0,0,0.6)",
        }}
      >
        {titulo}
      </div>
      {sub ? (
        <div style={{ fontFamily: SERIF_IT, fontSize: 46, color: AMBAR, marginTop: 10, opacity: e2 }}>{sub}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Moldura dos gráficos ----------
const Cartao: React.FC<{ kicker: string; titulo: string; fonte?: string; children: React.ReactNode; durF: number }> = ({
  kicker, titulo, fonte, children, durF,
}) => {
  const { frame, fps } = useTempo();
  const e = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const sai = interpolate(frame, [durF - 7, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 210, opacity: sai }}>
      <div
        style={{
          width: 920,
          padding: "46px 52px 40px",
          borderRadius: 34,
          background: "rgba(18,17,15,0.82)",
          border: "1px solid rgba(245,241,232,0.14)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          transform: `translateY(${interpolate(e, [0, 1], [80, 0])}px) scale(${interpolate(e, [0, 1], [0.94, 1])})`,
          opacity: e,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 5, background: AMBAR, borderRadius: 3 }} />
          <div style={{ fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: CINZA }}>{kicker}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 66, color: CREME, lineHeight: 1.05, marginTop: 12, marginBottom: 34 }}>{titulo}</div>
        {children}
        {fonte ? <div style={{ fontFamily: SANS_REG, fontSize: 22, color: CINZA, marginTop: 30 }}>{fonte}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const GEstudo: React.FC<{ durF: number }> = ({ durF }) => {
  const { frame, fps } = useTempo();
  const preenchidos = Math.floor(interpolate(frame, [8, fps * 2.6], [0, 48], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Cartao kicker="O ESTUDO" titulo="48 horas, de hora em hora" fonte="Stiglmayr e colaboradores, Acta Psychiatr Scand, 2008" durF={durF}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 46,
              borderRadius: 12,
              background: i < preenchidos ? AMBAR : "rgba(245,241,232,0.10)",
              transform: `scale(${i === preenchidos - 1 ? 1.15 : 1})`,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontFamily: SANS_REG, fontSize: 28, color: CREME }}>
        <span>pacientes com borderline</span>
        <span style={{ fontFamily: SANS, color: AMBAR }}>{preenchidos} h</span>
      </div>
    </Cartao>
  );
};

const GGrafico: React.FC<{ durF: number }> = ({ durF }) => {
  const { frame, fps } = useTempo();
  const p1 = interpolate(frame, [10, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2 = interpolate(frame, [fps * 2.6, fps * 4.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const L = 900;
  return (
    <Cartao kicker="O QUE ELES VIRAM" titulo="Mais estresse, mais estranhamento" fonte="Esquema ilustrativo do achado. Stiglmayr e colaboradores, 2008" durF={durF}>
      <svg width={816} height={430} viewBox="0 0 816 430">
        <line x1={70} y1={380} x2={800} y2={380} stroke="rgba(245,241,232,0.35)" strokeWidth={3} />
        <line x1={70} y1={380} x2={70} y2={20} stroke="rgba(245,241,232,0.35)" strokeWidth={3} />
        <path d="M70 360 C 300 330, 520 230, 790 60" fill="none" stroke={AMBAR} strokeWidth={10} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p1)} />
        <path d="M70 365 C 300 352, 520 320, 790 250" fill="none" stroke={CINZA} strokeWidth={8} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p2)} />
        <text x={430} y={420} fill={CREME} fontFamily={SANS_REG} fontSize={26}>estresse</text>
        <text x={18} y={260} fill={CREME} fontFamily={SANS_REG} fontSize={26} transform="rotate(-90 30 250)">estranhamento</text>
        <text x={560} y={50} fill={AMBAR} fontFamily={SANS} fontSize={30} opacity={p1}>borderline</text>
        <text x={500} y={240} fill={CINZA} fontFamily={SANS} fontSize={26} opacity={p2}>depressão ou pânico</text>
      </svg>
    </Cartao>
  );
};

const GVolume: React.FC<{ durF: number }> = ({ durF }) => {
  const { frame, fps } = useTempo();
  const itens = ["sons", "cores", "sensação de ser você"];
  return (
    <Cartao kicker="O QUE ACONTECE" titulo="A mente abaixa o volume" durF={durF}>
      {itens.map((nome, i) => {
        const v = interpolate(frame, [fps * (0.5 + i * 0.7), fps * (1.3 + i * 0.7)], [0.92, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={nome} style={{ marginBottom: 30 }}>
            <div style={{ fontFamily: i === 2 ? SERIF_IT : SANS_REG, fontSize: i === 2 ? 44 : 32, color: i === 2 ? AMBAR : CREME, marginBottom: 12 }}>{nome}</div>
            <div style={{ height: 22, borderRadius: 11, background: "rgba(245,241,232,0.12)", overflow: "hidden" }}>
              <div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 11, background: i === 2 ? AMBAR : CREME }} />
            </div>
          </div>
        );
      })}
    </Cartao>
  );
};

const GTabela: React.FC<{ durF: number }> = ({ durF }) => {
  const { frame, fps } = useTempo();
  const linhas: [string, string, string][] = [
    ["Estranha o que sente", "sim", "geralmente não"],
    ["Crítica do sintoma", "preservada", "costuma faltar"],
  ];
  return (
    <Cartao kicker="POR QUE NÃO É LOUCURA" titulo="Estranhar é sinal de que você está aqui" durF={durF}>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1.1fr 1.1fr", columnGap: 24, rowGap: 0, fontSize: 30 }}>
        <div />
        <div style={{ fontFamily: SERIF_IT, fontSize: 34, color: AMBAR, paddingBottom: 14, lineHeight: 1.05 }}>Desperso&shy;nalização</div>
        <div style={{ fontFamily: SERIF_IT, fontSize: 34, color: CINZA, paddingBottom: 14, lineHeight: 1.05 }}>Perda da realidade</div>
        {linhas.map((l, i) => {
          const e = spring({ frame: frame - fps * (0.4 + i * 0.55), fps, config: { damping: 18 } });
          return [0, 1, 2].map((c) => (
            <div
              key={`${i}-${c}`}
              style={{
                fontFamily: c === 0 ? SANS_REG : SANS,
                color: c === 1 ? CREME : c === 2 ? CINZA : "rgba(245,241,232,0.8)",
                padding: "20px 0",
                borderTop: "1px solid rgba(245,241,232,0.15)",
                opacity: e,
                transform: `translateX(${interpolate(e, [0, 1], [30, 0])}px)`,
              }}
            >
              {l[c]}
            </div>
          ));
        })}
      </div>
    </Cartao>
  );
};

const CTAFinal: React.FC<{ durF: number }> = ({ durF }) => {
  const { frame, fps } = useTempo();
  const e = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
      <div style={{ textAlign: "center", opacity: e, transform: `translateY(${interpolate(e, [0, 1], [50, 0])}px)` }}>
        <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 6, color: CREME }}>MANDA PRA QUEM</div>
        <div style={{ fontFamily: SERIF_IT, fontSize: 96, color: AMBAR, lineHeight: 1.05, marginTop: 8 }}>já sentiu isso</div>
        <div style={{ fontFamily: SANS_REG, fontSize: 30, color: CREME, marginTop: 18, opacity: interpolate(frame, [fps * 0.8, fps * 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          @drfabioschmidt
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 8, width: `${interpolate(frame, [0, durF], [0, 100])}%`, background: AMBAR }} />
    </AbsoluteFill>
  );
};

const emSeq = (de: number, ate: number, fps: number) => ({
  from: Math.round(de * fps),
  durationInFrames: Math.max(1, Math.round((ate - de) * fps)),
});

export const EspelhoPro: React.FC = () => {
  const { fps } = useVideoConfig();
  const [ok] = useState(() => {
    carregarFontes();
    return true;
  });
  useEffect(() => {}, [ok]);
  const g = GRAFICOS;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Fundo />
      {TITULOS.map((t, i) => {
        const s = emSeq(t.de, t.ate, fps);
        return (
          <Sequence key={i} {...s} layout="none">
            <Titulo kicker={t.kicker} titulo={t.titulo} sub={t.sub} durF={s.durationInFrames} />
          </Sequence>
        );
      })}
      <Sequence {...emSeq(g.estudo.de, g.estudo.ate, fps)} layout="none">
        <GEstudo durF={emSeq(g.estudo.de, g.estudo.ate, fps).durationInFrames} />
      </Sequence>
      <Sequence {...emSeq(g.grafico.de, g.grafico.ate, fps)} layout="none">
        <GGrafico durF={emSeq(g.grafico.de, g.grafico.ate, fps).durationInFrames} />
      </Sequence>
      <Sequence {...emSeq(g.volume.de, g.volume.ate, fps)} layout="none">
        <GVolume durF={emSeq(g.volume.de, g.volume.ate, fps).durationInFrames} />
      </Sequence>
      <Sequence {...emSeq(g.tabela.de, g.tabela.ate, fps)} layout="none">
        <GTabela durF={emSeq(g.tabela.de, g.tabela.ate, fps).durationInFrames} />
      </Sequence>
      <Sequence {...emSeq(CTA.de, CTA.ate, fps)} layout="none">
        <CTAFinal durF={emSeq(CTA.de, CTA.ate, fps).durationInFrames} />
      </Sequence>
      <Legendas />
    </AbsoluteFill>
  );
};

export const espelhoProDuracao = (fps: number) => Math.round((cortes.totalCut as number) * fps);
void ms;
