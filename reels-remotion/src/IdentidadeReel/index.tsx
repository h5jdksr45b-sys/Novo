import { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Anton, loadAnton } from "../load-font";
import { loadIdentidadeFonts, SANS, SERIF } from "./fonts";
import { WORDS } from "./words";

// Reel O cerne é a identidade. Fala bruta de 161s editada para 43s,
// alternando câmera e cenas gráficas no estilo das referências:
// recorte em P&B sobre cor chapada, tipografia serifada itálica com
// sem serifa pesada, retícula, grão e tela preta cinematográfica.

export const FPS = 30;
const FALA = 1300; // quadros do corte editado
const FIM = 50; // cartão final
export const DURACAO = FALA + FIM;

const VERMELHO = "#c83c1e";
const PAPEL = "#ece8e1";
const BEGE = "#e6dfd2";
const PRETO = "#0d0d0d";

const f = (s: number) => Math.round(s * FPS);
const dir = (p: string) => staticFile(`identidade/${p}`);

// Trechos do corte, em segundos. A = câmera, B = cena gráfica.
const CENAS = {
  gancho1: [0, 2.4],
  gancho2: [2.4, 5.9],
  cerne: [5.9, 8.967],
  existir: [8.967, 13.667],
  propria: [13.667, 16.567],
  cerne2: [16.567, 20.6],
  vazio: [20.6, 25.467],
  doutor: [25.467, 29.733],
  tempo: [29.733, 32.567],
  aprimora: [32.567, 37.733],
  melhorando: [37.733, 41.033],
  terapia: [41.033, 43.333],
} as const;

type Cena = keyof typeof CENAS;
const ini = (c: Cena) => f(CENAS[c][0]);
const dur = (c: Cena) => f(CENAS[c][1]) - f(CENAS[c][0]);

// Zoom por trecho de câmera: alterna para o corte seco parecer intencional.
const ZOOM: Partial<Record<Cena, number>> = {
  gancho1: 1.0,
  existir: 1.13,
  cerne2: 1.0,
  aprimora: 1.12,
  terapia: 1.0,
};

// Momentos em que a legenda pequena some: cenas gráficas e texto grande.
const SEM_LEGENDA: [number, number][] = [
  [0, 2.4],
  [2.4, 8.967],
  [10.4, 13.667],
  [13.667, 16.567],
  [19.3, 20.6],
  [20.6, 32.567],
  [32.9, 33.9],
  [35.45, 37.733],
  [37.733, 41.033],
  [43.333, 99],
];

const entrada = (frame: number, at: number, fps: number, damping = 14) =>
  spring({ frame: frame - at, fps, config: { damping, mass: 0.6 } });

// Palavra ou linha que entra com escala, desfoque e subida.
const Entra: React.FC<{
  at: number;
  ate?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  de?: number;
}> = ({ at, ate, style, children, de = 1.25 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = entrada(frame, at, fps);
  const saida =
    ate === undefined
      ? 1
      : interpolate(frame, [ate - 5, ate], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (frame < at) return null;
  return (
    <div
      style={{
        ...style,
        opacity: Math.min(1, p * 1.4) * saida,
        transform: `translateY(${(1 - p) * 40}px) scale(${de + (1 - de) * p})`,
        filter: `blur(${(1 - p) * 14}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Entrada de cena: desliza e desfoca nos primeiros quadros.
const Chega: React.FC<{ children: React.ReactNode; de?: "baixo" | "lado" }> = ({
  children,
  de = "baixo",
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 7], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const d = (1 - p) * 220;
  return (
    <AbsoluteFill
      style={{
        transform: de === "baixo" ? `translateY(${d}px)` : `translateX(${d}px)`,
        filter: `blur(${(1 - p) * 18}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Grao: React.FC<{ forca?: number }> = ({ forca = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: forca, pointerEvents: "none" }}>
      <svg width="1080" height="1920">
        <filter id={`g${frame % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 6} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#g${frame % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

const Vinheta: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)",
    }}
  />
);

const Grade: React.FC<{ cor?: string }> = ({ cor = "rgba(0,0,0,0.07)" }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${cor} 2px, transparent 2px), linear-gradient(90deg, ${cor} 2px, transparent 2px)`,
      backgroundSize: "120px 120px",
      backgroundPosition: "60px 40px",
    }}
  />
);

const Assinatura: React.FC<{ escuro?: boolean }> = ({ escuro }) => (
  <div
    style={{
      position: "absolute",
      top: 150,
      right: 60,
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 22,
      letterSpacing: 0.5,
      color: escuro ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.75)",
    }}
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
    @drfabioschmidt
  </div>
);

// Câmera: o corte editado inteiro, com zoom alternado por trecho.
const Camera: React.FC<{ filtro?: string; mudo?: boolean }> = ({ filtro, mudo }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let z = 1;
  for (const nome of Object.keys(CENAS) as Cena[]) {
    const [a, b] = CENAS[nome];
    if (t >= a && t < b) {
      const base = ZOOM[nome] ?? 1.05;
      const local = (frame - f(a)) / (f(b) - f(a));
      z = nome === "melhorando" ? 1 : base + 0.035 * local;
      if (nome === "gancho1") {
        z = interpolate(frame, [0, 8], [1.22, 1.04], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }) + 0.03 * local;
      }
    }
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: PRETO }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 22%", filter: filtro }}>
        <OffthreadVideo src={dir("base.mp4")} muted={mudo} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Câmera dentro de uma cena: volta ao tempo global do corte, sem som.
const CameraNaCena: React.FC<{ o: number; filtro?: string }> = ({ o, filtro }) => (
  <Sequence from={-o} layout="none">
    <Camera filtro={filtro} mudo />
  </Sequence>
);

// Recorte da pessoa (vídeo com transparência), alinhado ao corte.
const Recorte: React.FC<{
  arquivo: string;
  inicio: number;
  style?: React.CSSProperties;
  atraso?: number;
}> = ({ arquivo, inicio, style, atraso = 0 }) => (
  <Sequence from={inicio + atraso} layout="none">
    <AbsoluteFill style={style}>
      <OffthreadVideo src={dir(arquivo)} transparent muted />
    </AbsoluteFill>
  </Sequence>
);

// Legenda pequena abaixo do queixo, palavra atual acesa.
const paginas = (() => {
  const out: { palavras: [string, number][]; de: number; ate: number }[] = [];
  let atual: [string, number][] = [];
  WORDS.forEach((w, i) => {
    atual.push(w);
    const fimFrase = /[.,?]$/.test(w[0]);
    if (atual.length >= 3 || fimFrase || i === WORDS.length - 1) {
      out.push({ palavras: atual, de: atual[0][1], ate: 0 });
      atual = [];
    }
  });
  out.forEach((p, i) => {
    const prox = out[i + 1];
    const ultima = p.palavras[p.palavras.length - 1][1];
    p.ate = prox ? Math.min(prox.de, ultima + 0.9) : ultima + 0.6;
  });
  return out;
})();

const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 0.04;
  if (SEM_LEGENDA.some(([a, b]) => t >= a && t < b)) return null;
  const p = paginas.find((x) => t >= x.de && t < x.ate);
  if (!p) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 760,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 50,
        lineHeight: 1.15,
        color: "white",
        textShadow: "0 2px 14px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.6)",
      }}
    >
      {p.palavras.map(([w, s], i) => {
        const limpa = w.replace(/[.,]$/, "");
        const destaque = /terapia|cerne|identidade/i.test(limpa);
        return (
          <span
            key={i}
            style={{
              opacity: t >= s ? 1 : 0.45,
              color: t >= s && destaque ? "#ff6a4a" : undefined,
            }}
          >
            {limpa + " "}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Cenas ----------

const Gancho1: React.FC = () => {
  const linha: React.CSSProperties = { position: "absolute", left: 80, color: "white" };
  const serif: React.CSSProperties = { fontFamily: SERIF, fontStyle: "italic", fontSize: 96 };
  const sans: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 900,
    fontSize: 118,
    letterSpacing: -4,
  };
  const sombra = { textShadow: "0 6px 30px rgba(0,0,0,0.55)" };
  return (
    <AbsoluteFill style={sombra}>
      <Entra at={f(0.12)} style={{ ...linha, top: 1080, ...serif, fontSize: 64, opacity: 0.9 }}>
        pega
      </Entra>
      <Entra at={f(0.42)} style={{ ...linha, top: 1150 }}>
        <span style={serif}>o </span>
        <span style={sans}>gosto.</span>
      </Entra>
      <Entra at={f(1.0)} style={{ ...linha, top: 1290 }}>
        <span style={serif}>o </span>
        <span style={sans}>jeito.</span>
      </Entra>
      <Entra at={f(1.48)} style={{ ...linha, top: 1430 }}>
        <span style={serif}>o </span>
        <span style={{ ...sans, color: "#ff6a4a" }}>modo de falar.</span>
      </Entra>
    </AbsoluteFill>
  );
};

const Gancho2: React.FC = () => {
  const o = ini("gancho2");
  const L = (s: number) => f(s) - o;
  return (
    <Chega>
      <AbsoluteFill style={{ backgroundColor: PAPEL }}>
        <Grade />
        <Recorte
          arquivo="cut_hook.webm"
          inicio={-(o - 66)}
          style={{
            transform: "translateX(270px) scale(0.92)",
            transformOrigin: "50% 100%",
            filter: "grayscale(1) contrast(1.25) brightness(1.05)",
          }}
        />
        <div style={{ position: "absolute", left: 70, top: 470, width: 640, color: PRETO }}>
          <Entra at={L(2.5)} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52 }}>
            às vezes
          </Entra>
          <Entra
            at={L(3.0)}
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 150, lineHeight: 0.95, marginTop: 10 }}
          >
            muda de opinião
          </Entra>
          <Entra at={L(4.1)} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 54, marginTop: 34 }}>
            sobre coisas que
          </Entra>
          <Entra
            at={L(4.98)}
            de={1.6}
            style={{ fontFamily: Anton, fontSize: 250, color: VERMELHO, lineHeight: 1, marginTop: 8 }}
          >
            NUNCA
          </Entra>
          <Entra
            at={L(5.25)}
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 130, lineHeight: 0.9 }}
          >
            mudaria.
          </Entra>
        </div>
      </AbsoluteFill>
    </Chega>
  );
};

const Cerne: React.FC = () => {
  const frame = useCurrentFrame();
  const o = ini("cerne");
  const L = (s: number) => f(s) - o;
  const impacto = L(8.2);
  const tremor = frame >= impacto && frame < impacto + 8 ? Math.sin(frame * 3.1) * (impacto + 8 - frame) * 1.6 : 0;
  const barra = interpolate(frame, [impacto + 3, impacto + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO, color: "white", transform: `translate(${tremor}px, ${tremor * 0.6}px)` }}>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center" }}>
        <Entra at={L(6.0)} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 110 }}>
          o cerne do
        </Entra>
        <Entra at={L(6.55)} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, letterSpacing: -1.5, marginTop: 6 }}>
          transtorno borderline
        </Entra>
        <Entra at={L(7.9)} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, marginTop: 70, opacity: 0.8 }}>
          é a
        </Entra>
        <Entra at={impacto} de={1.8} style={{ fontFamily: Anton, fontSize: 205, lineHeight: 1, marginTop: 4 }}>
          IDENTIDADE
        </Entra>
        <div
          style={{
            margin: "18px auto 0",
            height: 14,
            width: 780 * barra,
            backgroundColor: VERMELHO,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Existir: React.FC = () => {
  const o = ini("existir");
  const L = (s: number) => f(s) - o;
  const sombra = { textShadow: "0 6px 30px rgba(0,0,0,0.6)" };
  return (
    <AbsoluteFill style={{ color: "white", ...sombra }}>
      <Entra
        at={L(10.42)}
        ate={L(11.7)}
        style={{ position: "absolute", top: 1180, left: 0, right: 0, textAlign: "center" }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 54 }}>só dá pra</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 200, lineHeight: 1 }}>existir</div>
      </Entra>
      <Entra
        at={L(11.72)}
        style={{ position: "absolute", top: 1220, left: 80, fontFamily: SANS, fontWeight: 900, fontSize: 104, letterSpacing: -3 }}
      >
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 80, letterSpacing: 0 }}>alguém </span>
        confirmando,
      </Entra>
      <Entra
        at={L(12.9)}
        style={{ position: "absolute", top: 1360, left: 80, fontFamily: SANS, fontWeight: 900, fontSize: 104, letterSpacing: -3 }}
      >
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 80, letterSpacing: 0 }}>alguém </span>
        <span style={{ backgroundColor: VERMELHO, padding: "0 14px" }}>completando.</span>
      </Entra>
    </AbsoluteFill>
  );
};

const Propria: React.FC = () => {
  const o = ini("propria");
  const L = (s: number) => f(s) - o;
  const pb = "grayscale(1) contrast(1.3) brightness(1.05)";
  const eco = (x: number, atraso: number, op: number) => (
    <Recorte
      arquivo="cut_propria.webm"
      inicio={-(o - 404)}
      atraso={atraso}
      style={{
        transform: `translateX(${x}px) scale(0.8)`,
        transformOrigin: "50% 100%",
        opacity: op,
        filter: `${pb} brightness(0.2)`,
      }}
    />
  );
  return (
    <Chega de="lado">
      <AbsoluteFill style={{ backgroundColor: VERMELHO }}>
        {eco(-330, 8, 0.35)}
        {eco(330, 16, 0.35)}
        <Recorte
          arquivo="cut_propria.webm"
          inicio={-(o - 404)}
          style={{ transform: "scale(0.9)", transformOrigin: "50% 100%", filter: pb }}
        />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(13,13,13,0.92) 82%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", color: "white" }}>
          <Entra at={L(13.9)} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: -1 }}>
            alguém sendo
          </Entra>
          <Entra
            at={L(15.5)}
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 150, lineHeight: 1 }}
          >
            a própria pessoa.
          </Entra>
        </div>
      </AbsoluteFill>
    </Chega>
  );
};

const Cerne2: React.FC = () => {
  const o = ini("cerne2");
  const L = (s: number) => f(s) - o;
  return (
    <AbsoluteFill style={{ color: "white", textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
      <Entra at={L(19.3)} style={{ position: "absolute", top: 1230, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56 }}>e no fim não vê</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 190, lineHeight: 1 }}>o cerne.</div>
      </Entra>
    </AbsoluteFill>
  );
};

// Círculo em retícula: pontos maiores perto da borda (vazio) ou cheios (outro).
const Reticula: React.FC<{ r: number; cheio: boolean; cor: string; p: number }> = ({ r, cheio, cor, p }) => {
  const passo = 22;
  const pontos: React.ReactNode[] = [];
  for (let y = -r; y <= r; y += passo) {
    for (let x = -r; x <= r; x += passo) {
      const d = Math.hypot(x, y) / r;
      if (d > 1) continue;
      const tam = cheio ? 9.5 * (1 - d * d * 0.55) : 9.5 * Math.max(0, (d - 0.62) / 0.38) ** 1.4;
      if (tam < 0.6) continue;
      pontos.push(<circle key={`${x}_${y}`} cx={x + r} cy={y + r} r={tam * p} fill={cor} />);
    }
  }
  return (
    <svg width={r * 2} height={r * 2} style={{ overflow: "visible" }}>
      {pontos}
    </svg>
  );
};

const Vazio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = ini("vazio");
  const L = (s: number) => f(s) - o;
  const pv = entrada(frame, L(22.8), fps, 18);
  const po = spring({ frame: frame - L(24.55), fps, config: { damping: 16, mass: 0.9 } });
  const giro = frame * 0.15;
  return (
    <Chega>
      <AbsoluteFill style={{ backgroundColor: BEGE, color: PRETO }}>
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center" }}>
          <Entra at={L(20.8)} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52 }}>
            acaba sempre
          </Entra>
          <Entra at={L(21.7)} style={{ fontFamily: SANS, fontWeight: 900, fontSize: 116, letterSpacing: -4 }}>
            preenchendo
          </Entra>
          <Entra at={L(22.8)} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 140, lineHeight: 0.9 }}>
            o vazio
          </Entra>
        </div>
        <div
          style={{
            position: "absolute",
            left: 540 - 300,
            top: 860,
            transform: `rotate(${giro}deg) scale(${0.7 + 0.3 * pv})`,
            opacity: pv,
          }}
        >
          <Reticula r={300} cheio={false} cor={PRETO} p={1} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 540 - 190 + (1 - po) * 700,
            top: 860 + 110,
            opacity: frame >= L(24.5) ? 1 : 0,
          }}
        >
          <Reticula r={190} cheio cor={VERMELHO} p={1} />
        </div>
        <Entra
          at={L(24.6)}
          style={{
            position: "absolute",
            top: 1540,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 130,
          }}
        >
          com o outro.
        </Entra>
        <Grao forca={0.18} />
      </AbsoluteFill>
    </Chega>
  );
};

// Diálogo digitado, como o card de cliente e editor da referência.
const Digita: React.FC<{ texto: string; de: number; ate: number }> = ({ texto, de, ate }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(
    interpolate(frame, [de, ate], [0, texto.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const cursor = frame >= de && Math.floor(frame / 8) % 2 === 0;
  if (frame < de) return null;
  return (
    <span>
      {texto.slice(0, n)}
      <span style={{ opacity: cursor ? 1 : 0, fontWeight: 300 }}>|</span>
    </span>
  );
};

const Doutor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = ini("doutor");
  const L = (s: number) => f(s) - o;
  const card = spring({ frame: frame - 4, fps, config: { damping: 15 } });
  const fala: React.CSSProperties = { fontFamily: SANS, fontWeight: 500, fontSize: 62, lineHeight: 1.2, letterSpacing: -1 };
  return (
    <Chega>
      <AbsoluteFill style={{ backgroundColor: PAPEL, color: PRETO }}>
        <Grade />
        <div style={{ position: "absolute", top: 330, left: 90, right: 90 }}>
          <div style={fala}>
            <b style={{ fontWeight: 900 }}>Você: </b>
            <Digita texto="bonito falar assim, né?" de={L(25.6)} ate={L(27.4)} />
          </div>
          <div style={{ ...fala, marginTop: 40 }}>
            {frame >= L(28.1) ? <b style={{ fontWeight: 900 }}>Você: </b> : null}
            <Digita texto="difícil é dar um exemplo concreto." de={L(28.15)} ate={L(29.45)} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 540 - 270,
            top: 820,
            width: 540,
            height: 860,
            borderRadius: 44,
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.28)",
            transform: `translateY(${(1 - card) * 500}px) rotate(${(1 - card) * 6 - 1.5}deg)`,
          }}
        >
          <div style={{ position: "absolute", width: 1080, height: 1920, left: -270, top: -140, transform: "scale(0.62)", transformOrigin: "50% 15%" }}>
            <CameraNaCena o={o} />
          </div>
        </div>
      </AbsoluteFill>
    </Chega>
  );
};

const Tempo: React.FC = () => {
  const frame = useCurrentFrame();
  const o = ini("tempo");
  const L = (s: number) => f(s) - o;
  const para = L(31.47);
  const anda = Math.min(frame, para);
  const ponteiro = -90 + anda * 12;
  const freezeFim = para + 16;
  const r = 380;
  const marcas = Array.from({ length: 60 }, (_, i) => i);
  return (
    <Chega de="lado">
      <AbsoluteFill style={{ backgroundColor: PRETO }}>
        <div style={{ position: "absolute", left: 540 - r, top: 560 - r + 160, width: r * 2, height: r * 2, borderRadius: "50%", overflow: "hidden", backgroundColor: VERMELHO }}>
          <div style={{ position: "absolute", width: 1080, height: 1920, left: r - 540, top: -10, filter: "grayscale(1) contrast(1.15)" }}>
            <Freeze frame={para} active={frame >= para && frame < freezeFim}>
              <CameraNaCena o={o} />
            </Freeze>
          </div>
        </div>
        <svg width="1080" height="1920" style={{ position: "absolute" }}>
          <g transform={`translate(540 ${720})`}>
            {marcas.map((i) => {
              const a = (i / 60) * Math.PI * 2;
              const grande = i % 5 === 0;
              const r1 = r + 30;
              const r2 = r + (grande ? 78 : 52);
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * r1}
                  y1={Math.sin(a) * r1}
                  x2={Math.cos(a) * r2}
                  y2={Math.sin(a) * r2}
                  stroke="white"
                  strokeWidth={grande ? 6 : 3}
                  opacity={grande ? 0.95 : 0.5}
                />
              );
            })}
            <line
              x1={0}
              y1={0}
              x2={Math.cos((ponteiro * Math.PI) / 180) * (r + 70)}
              y2={Math.sin((ponteiro * Math.PI) / 180) * (r + 70)}
              stroke={VERMELHO}
              strokeWidth={7}
              strokeLinecap="round"
            />
          </g>
        </svg>
        <div style={{ position: "absolute", top: 1320, left: 0, right: 0, textAlign: "center", color: "white" }}>
          <Entra at={L(30.0)} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52 }}>
            aquela coisa em que
          </Entra>
          <Entra at={L(31.2)} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 140, lineHeight: 1 }}>
            o tempo
          </Entra>
          <Entra at={para} de={1.7} style={{ fontFamily: Anton, fontSize: 230, color: VERMELHO, lineHeight: 1 }}>
            PARA
          </Entra>
        </div>
      </AbsoluteFill>
    </Chega>
  );
};

const Aprimora: React.FC = () => {
  const frame = useCurrentFrame();
  const o = ini("aprimora");
  const L = (s: number) => f(s) - o;
  const risco = interpolate(frame, [L(37.35), L(37.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ color: "white", textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
      <Entra
        at={L(32.95)}
        ate={L(33.9)}
        style={{ position: "absolute", top: 1240, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 170 }}
      >
        aprimora.
      </Entra>
      <Entra at={L(35.5)} de={1.5} style={{ position: "absolute", top: 1110, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 54, marginBottom: 26 }}>reforça pra você mesmo que</div>
        <div style={{ fontFamily: Anton, fontSize: 200, lineHeight: 1.05 }}>
          VOCÊ É <span style={{ backgroundColor: VERMELHO, padding: "0 18px" }}>BOM</span>
        </div>
      </Entra>
      <Entra at={L(36.3)} style={{ position: "absolute", top: 1480, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 50 }}>
        independente de quem diga{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          que não
          <span style={{ position: "absolute", left: -6, top: "52%", height: 8, width: `${risco * 108}%`, backgroundColor: VERMELHO, transform: "rotate(-4deg)" }} />
        </span>
      </Entra>
    </AbsoluteFill>
  );
};

const Melhorando: React.FC = () => {
  const frame = useCurrentFrame();
  const o = ini("melhorando");
  const L = (s: number) => f(s) - o;
  const bate = L(38.66);
  const letras = "IDENTIDADE".split("");
  const fala = "muitas outras coisas tendem a melhorar.".split(" ");
  const tempos = [39.3, 39.62, 39.86, 40.1, 40.5, 40.66];
  return (
    <AbsoluteFill>
      <CameraNaCena o={o} filtro="grayscale(1) brightness(0.42) contrast(1.1)" />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: Anton,
          fontSize: 228,
          lineHeight: 1,
          color: PAPEL,
          letterSpacing: 2,
        }}
      >
        {letras.map((l, i) => {
          const p = interpolate(frame, [bate + i * 1.2, bate + i * 1.2 + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(2)),
          });
          return (
            <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 120}px)` }}>
              {l}
            </span>
          );
        })}
      </div>
      <Recorte arquivo="cut_melhor.webm" inicio={-(o - 1126)} />
      <Entra at={L(37.85)} style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 60, color: "white", letterSpacing: -1, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
        melhorando a identidade,
      </Entra>
      <div style={{ position: "absolute", top: 1470, left: 90, right: 90, textAlign: "center", color: "white", fontFamily: SERIF, fontStyle: "italic", fontSize: 92, lineHeight: 1.05, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
        {fala.map((w, i) => (
          <span key={i} style={{ opacity: frame >= L(tempos[i]) ? 1 : 0 }}>
            {w}{" "}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO, color: "white", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 96, lineHeight: 1 }}>Borderline</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 92, letterSpacing: -3, lineHeight: 1 }}>SEM ESTIGMA</div>
        <div style={{ width: 120, height: 8, backgroundColor: VERMELHO, margin: "34px auto" }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, opacity: 0.9 }}>
          Envie para alguém
          <br />
          que se reconhece nisso.
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, opacity: 0.6, marginTop: 40 }}>@drfabioschmidt</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Som ----------

type Sfx = [string, number, number];
const SONS: Sfx[] = [
  ["pop", 0.42, 0.35],
  ["pop", 1.0, 0.35],
  ["pop", 1.48, 0.4],
  ["whoosh", 2.3, 0.55],
  ["swoosh", 3.0, 0.3],
  ["impact", 4.98, 0.5],
  ["whoosh", 5.82, 0.5],
  ["impact", 8.2, 0.85],
  ["swoosh", 8.95, 0.35],
  ["swoosh", 10.42, 0.4],
  ["pop", 11.72, 0.4],
  ["pop", 12.9, 0.45],
  ["whoosh", 13.58, 0.55],
  ["thud", 15.5, 0.6],
  ["swoosh", 16.55, 0.35],
  ["swoosh", 19.3, 0.4],
  ["whoosh", 20.52, 0.55],
  ["pop", 22.8, 0.45],
  ["whoosh", 24.5, 0.4],
  ["thud", 24.75, 0.55],
  ["whoosh", 25.4, 0.45],
  ["whoosh", 29.66, 0.5],
  ["stop", 31.47, 0.55],
  ["thud", 31.47, 0.6],
  ["swoosh", 32.55, 0.35],
  ["swoosh", 32.95, 0.35],
  ["thud", 35.5, 0.55],
  ["swoosh", 37.4, 0.35],
  ["riser", 36.88, 0.45],
  ["impact", 38.66, 0.75],
  ["swoosh", 41.0, 0.3],
  ["whoosh", 43.25, 0.4],
  ["shimmer", 43.4, 0.4],
];

// Teclas do diálogo digitado e tique do relógio.
const TECLAS: number[] = [];
for (let t = 25.6; t < 27.4; t += 0.085) TECLAS.push(t);
for (let t = 28.15; t < 29.45; t += 0.06) TECLAS.push(t);
const TIQUES: number[] = [];
for (let t = 29.9; t < 31.45; t += 0.25) TIQUES.push(t);

const Som: React.FC = () => (
  <>
    <Audio
      src={dir("sfx/music.wav")}
      volume={(fr) => interpolate(fr, [0, 20, FALA - 10, FALA + 10, DURACAO - 10, DURACAO], [0, 0.07, 0.07, 0.22, 0.22, 0], { extrapolateRight: "clamp" })}
    />
    {SONS.map(([nome, t, v], i) => (
      <Sequence key={`s${i}`} from={Math.max(0, f(t))} durationInFrames={f(2)} layout="none">
        <Audio src={dir(`sfx/${nome}.wav`)} volume={v} />
      </Sequence>
    ))}
    {TECLAS.map((t, i) => (
      <Sequence key={`k${i}`} from={f(t)} durationInFrames={6} layout="none">
        <Audio src={dir("sfx/key.wav")} volume={0.18 + (i % 3) * 0.04} playbackRate={0.9 + (i % 4) * 0.07} />
      </Sequence>
    ))}
    {TIQUES.map((t, i) => (
      <Sequence key={`t${i}`} from={f(t)} durationInFrames={6} layout="none">
        <Audio src={dir(i % 2 ? "sfx/tock.wav" : "sfx/tick.wav")} volume={0.3} />
      </Sequence>
    ))}
  </>
);

// ---------- Montagem ----------

const B: React.FC<{ c: Cena; children: React.ReactNode }> = ({ c, children }) => (
  <Sequence from={ini(c)} durationInFrames={dur(c)}>
    {children}
  </Sequence>
);

export const IdentidadeReel: React.FC = () => {
  useEffect(() => {
    loadAnton();
    loadIdentidadeFonts();
  }, []);
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      <Sequence durationInFrames={FALA}>
        <Camera />
        <Vinheta />
      </Sequence>
      <B c="gancho1">
        <Gancho1 />
      </B>
      <B c="gancho2">
        <Gancho2 />
      </B>
      <B c="cerne">
        <Cerne />
      </B>
      <B c="existir">
        <Existir />
      </B>
      <B c="propria">
        <Propria />
      </B>
      <B c="cerne2">
        <Cerne2 />
      </B>
      <B c="vazio">
        <Vazio />
      </B>
      <B c="doutor">
        <Doutor />
      </B>
      <B c="tempo">
        <Tempo />
      </B>
      <B c="aprimora">
        <Aprimora />
      </B>
      <B c="melhorando">
        <Melhorando />
      </B>
      <Sequence durationInFrames={FALA}>
        <Legenda />
      </Sequence>
      <Sequence from={FALA}>
        <Final />
      </Sequence>
      <Grao />
      <Sequence durationInFrames={FALA}>
        <AssinaturaAuto />
      </Sequence>
      <Som />
    </AbsoluteFill>
  );
};

// Assinatura escura nas cenas de fundo claro.
const AssinaturaAuto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const claro = (["gancho2", "vazio", "doutor"] as Cena[]).some((c) => t >= CENAS[c][0] && t < CENAS[c][1]);
  return <Assinatura escuro={claro} />;
};
