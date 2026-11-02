import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

// ============================================================
// TEMPOS (em segundos). Ajuste aqui para casar com a narração.
// ============================================================
export const TEMPOS = {
  duracao: 10.5,
  cena1: {
    // [Todo mundo olha para cá. O grito, a porta batendo.]
    circuloVermelho: 0.07,
    etiquetaGrito: 1.35,
    etiquetaBriga: 2.1,
  },
  cena2: {
    // [Só que isso já é a etapa quatro.]
    inicio: 3.2,
    carimbo4: 3.3,
    faixaEtapa4: 4.1,
  },
  cena3: {
    // [Antes dela, aconteceram três coisas.]
    inicio: 5.0,
    recuoDuracao: 0.7,
    linha: 5.75,
    circulo3: 6.15,
    circulo2: 6.55,
    fitaVazia: 6.95,
  },
  cena4: {
    // [E a primeira é tão pequena que passa batido.]
    inicio: 7.4,
    ponto1: 7.6,
    seta: 8.3,
    etiquetaAqui: 8.8,
    congela: 9.5, // a partir daqui só o ponto âmbar pulsa
  },
};

const FPS = 30;
export const DURACAO_FRAMES = Math.round(TEMPOS.duracao * FPS);

// ============================================================
// Paleta
// ============================================================
const KRAFT = "#2a2420";
const BEGE = "#d9cbb4";
const BEGE_FIBRA = "#f1e8d8";
const PRETO = "#111111";
const VERMELHO = "#b3261e";
const AMBAR = "#e0a030";

const { fontFamily: ANTON } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ============================================================
// Câmera: posição final do círculo 4 depois do recuo
// ============================================================
const ESCALA_FINAL = 0.37;
const CENTRO_MUNDO = { x: 540, y: 860 }; // centro do círculo vermelho
const CENTRO_4_FINAL = { x: 840, y: 860 }; // onde o 4 fica depois do recuo
const LINHA_Y = 860;

// ============================================================
// Utilidades de tempo e tremor
// ============================================================
const f = (s: number) => Math.round(s * FPS);
const POSE_CONGELADA = Math.floor(f(TEMPOS.cena4.congela) / 3);
const pose = (frame: number) => Math.min(Math.floor(frame / 3), POSE_CONGELADA);

const tremor = (frame: number, seed: string, amp = 1.3, ampRot = 0.35) => {
  const p = pose(frame);
  return {
    x: (random(`${seed}-x-${p}`) - 0.5) * 2 * amp,
    y: (random(`${seed}-y-${p}`) - 0.5) * 2 * amp,
    r: (random(`${seed}-r-${p}`) - 0.5) * 2 * ampRot,
  };
};

type Chave = { t: number; s: number; dy: number; dr: number; sombra: number };

// colar: aparece com tranco, sobe um pouco e assenta
const COLAR: Chave[] = [
  { t: 0, s: 1.07, dy: 26, dr: 1.6, sombra: 16 },
  { t: 2, s: 0.985, dy: -9, dr: -0.4, sombra: 9 },
  { t: 5, s: 1, dy: 0, dr: 0, sombra: 7 },
];
// carimbo: entra grande e bate com força
const CARIMBO: Chave[] = [
  { t: 0, s: 1.45, dy: -20, dr: -4, sombra: 34 },
  { t: 2, s: 0.93, dy: 6, dr: 0.6, sombra: 3 },
  { t: 4, s: 1.025, dy: -3, dr: 0, sombra: 8 },
  { t: 6, s: 1, dy: 0, dr: 0, sombra: 7 },
];

const entrada = (local: number, chaves: Chave[]) => {
  const ts = chaves.map((c) => c.t);
  const pick = (k: keyof Chave) =>
    interpolate(
      local,
      ts,
      chaves.map((c) => c[k]),
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  return { s: pick("s"), dy: pick("dy"), dr: pick("dr"), sombra: pick("sombra") };
};

// ============================================================
// Geração de bordas rasgadas
// ============================================================
const caminho = (pts: [number, number][]) =>
  "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z";

const circuloRasgado = (
  cx: number,
  cy: number,
  r: number,
  seed: string,
  amp: number,
) => {
  const n = 150;
  const f1 = random(seed + "a") * 6.28;
  const f2 = random(seed + "b") * 6.28;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rasgo = random(`${seed}-n-${i}`) < 0.06 ? -amp * 1.6 : 0;
    const rr =
      r +
      amp * 0.9 * Math.sin(3 * a + f1) +
      amp * 0.6 * Math.sin(7 * a + f2) +
      (random(`${seed}-j-${i}`) - 0.5) * amp * 1.2 +
      rasgo;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return caminho(pts);
};

const retanguloRasgado = (
  x0: number,
  y0: number,
  w: number,
  h: number,
  seed: string,
  amp: number,
) => {
  const passo = 9;
  const pts: [number, number][] = [];
  const lado = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    nx: number,
    ny: number,
    k: string,
  ) => {
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(2, Math.round(len / passo));
    const fase = random(seed + k) * 6.28;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const d =
        Math.sin(t * 9 + fase) * amp * 0.5 +
        (random(`${seed}-${k}-${i}`) - 0.5) * amp * 1.4;
      pts.push([ax + (bx - ax) * t + nx * d, ay + (by - ay) * t + ny * d]);
    }
  };
  lado(x0, y0, x0 + w, y0, 0, -1, "t");
  lado(x0 + w, y0, x0 + w, y0 + h, 1, 0, "r");
  lado(x0 + w, y0 + h, x0, y0 + h, 0, 1, "b");
  lado(x0, y0 + h, x0, y0, -1, 0, "l");
  return caminho(pts);
};

const idSeguro = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

// Filtro de textura de papel aplicado dentro de cada SVG
const FiltroPapel: React.FC<{ id: string; seed: number; forca?: number }> = ({
  id,
  seed,
  forca = 0.22,
}) => (
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.85"
      numOctaves={3}
      seed={seed}
      result="ruido"
    />
    <feColorMatrix
      in="ruido"
      type="matrix"
      values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${forca} 0`}
      result="sombraRuido"
    />
    <feComposite in="sombraRuido" in2="SourceGraphic" operator="in" result="grao" />
    <feMerge>
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="grao" />
    </feMerge>
  </filter>
);

// ============================================================
// Peças de papel
// ============================================================
type PapelProps = {
  w: number;
  h: number;
  cor: string;
  seed: string;
  forma: "circulo" | "retangulo";
  amp?: number;
  fibra?: string;
  children?: React.ReactNode;
};

const Papel: React.FC<PapelProps> = ({
  w,
  h,
  cor,
  seed,
  forma,
  amp = 4,
  fibra = BEGE_FIBRA,
  children,
}) => {
  const pad = 24;
  const id = idSeguro("p" + seed);
  const fora =
    forma === "circulo"
      ? circuloRasgado(w / 2 + pad, h / 2 + pad, w / 2 + amp * 1.3, seed + "f", amp * 1.4)
      : retanguloRasgado(pad - amp, pad - amp, w + amp * 2, h + amp * 2, seed + "f", amp * 1.5);
  const dentro =
    forma === "circulo"
      ? circuloRasgado(w / 2 + pad, h / 2 + pad, w / 2, seed, amp)
      : retanguloRasgado(pad, pad, w, h, seed, amp);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <svg
        width={w + pad * 2}
        height={h + pad * 2}
        style={{ position: "absolute", left: -pad, top: -pad, overflow: "visible" }}
      >
        <defs>
          <FiltroPapel id={id} seed={Math.floor(random(seed) * 999)} />
        </defs>
        <path d={fora} fill={fibra} opacity={0.85} />
        <path d={dentro} fill={cor} filter={`url(#${id})`} />
      </svg>
      {children}
    </div>
  );
};

// Fita adesiva semitransparente com pontas serrilhadas
const Fita: React.FC<{
  w: number;
  h: number;
  x: number;
  y: number;
  rot: number;
  seed: string;
  forte?: boolean;
}> = ({ w, h, x, y, rot, seed, forte }) => {
  const dentes = 6;
  const pts: [number, number][] = [];
  for (let i = 0; i <= dentes; i++) {
    const yy = (i / dentes) * h;
    pts.push([(i % 2 ? 5 : 0) + random(`${seed}-l${i}`) * 3, yy]);
  }
  for (let i = dentes; i >= 0; i--) {
    const yy = (i / dentes) * h;
    pts.push([w - (i % 2 ? 5 : 0) - random(`${seed}-r${i}`) * 3, yy]);
  }
  return (
    <svg
      width={w}
      height={h}
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        transform: `rotate(${rot}deg)`,
        overflow: "visible",
      }}
    >
      <path
        d={caminho(pts)}
        fill={forte ? "rgba(232,222,196,0.62)" : "rgba(232,222,196,0.48)"}
        stroke="rgba(255,250,235,0.25)"
        strokeWidth={1}
      />
      <line x1={8} y1={h * 0.3} x2={w - 8} y2={h * 0.28} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
      <line x1={10} y1={h * 0.72} x2={w - 12} y2={h * 0.75} stroke="rgba(0,0,0,0.07)" strokeWidth={3} />
    </svg>
  );
};

// Envoltório: posição, rotação, entrada e tremor
const Peca: React.FC<{
  x: number;
  y: number;
  rot: number;
  entra: number;
  seed: string;
  tipo?: "colar" | "carimbo";
  sombraBase?: number;
  children: React.ReactNode;
}> = ({ x, y, rot, entra, seed, tipo = "colar", sombraBase = 1, children }) => {
  const frame = useCurrentFrame();
  const inicio = f(entra);
  if (frame < inicio) return null;
  const local = frame - inicio;
  const e = entrada(local, tipo === "carimbo" ? CARIMBO : COLAR);
  const t = tremor(frame, seed);
  const sd = e.sombra * sombraBase;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translate(${t.x}px, ${t.y + e.dy}px) rotate(${rot + t.r + e.dr}deg) scale(${e.s})`,
        filter: `drop-shadow(${sd * 0.7}px ${sd}px 0 rgba(0,0,0,0.55))`,
      }}
    >
      {children}
    </div>
  );
};

// Etiqueta de texto recortada em papel
const Etiqueta: React.FC<{
  texto: string;
  w: number;
  h: number;
  tamanho: number;
  seed: string;
  cor?: string;
  corTexto?: string;
  fita?: boolean;
}> = ({ texto, w, h, tamanho, seed, cor = BEGE, corTexto = PRETO, fita = true }) => (
  <Papel w={w} h={h} cor={cor} seed={seed} forma="retangulo" amp={3.5}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: ANTON,
        fontSize: tamanho,
        lineHeight: 1,
        color: corTexto,
        letterSpacing: 2,
        textTransform: "uppercase",
        paddingTop: tamanho * 0.04,
      }}
    >
      {texto}
    </div>
    {fita ? (
      <Fita
        w={Math.min(150, w * 0.45)}
        h={46}
        x={w * (0.3 + random(seed + "fx") * 0.4)}
        y={-4}
        rot={(random(seed + "fr") - 0.5) * 16}
        seed={seed + "fita"}
      />
    ) : null}
  </Papel>
);

// Número 4 recortado em papel preto, com borda irregular
const Numero4: React.FC = () => {
  const w = 620;
  const h = 760;
  return (
    <svg width={w} height={h} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <filter id="rasgo4" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={9} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={9} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.035 0" result="gc" />
          <feComposite in="gc" in2="d" operator="in" result="gr" />
          <feMerge>
            <feMergeNode in="d" />
            <feMergeNode in="gr" />
          </feMerge>
        </filter>
      </defs>
      <text
        x={w / 2}
        y={h * 0.79}
        textAnchor="middle"
        fontFamily={ANTON}
        fontSize={660}
        fill={PRETO}
        filter="url(#rasgo4)"
      >
        4
      </text>
    </svg>
  );
};

// Círculo bege com contorno a caneta e número pequeno
const CirculoCaneta: React.FC<{ d: number; numero: string; seed: string }> = ({
  d,
  numero,
  seed,
}) => {
  const r = d / 2 - 13;
  const c = d / 2;
  const n = 70;
  const a0 = random(seed + "a0") * 6.28;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (i / n) * (Math.PI * 2 + 0.35);
    const rr = r * (1 + (random(`${seed}-w${i}`) - 0.5) * 0.025) + (i / n) * 3;
    pts.push(`${(c + Math.cos(a) * rr).toFixed(1)},${(c + Math.sin(a) * rr).toFixed(1)}`);
  }
  return (
    <Papel w={d} h={d} cor={BEGE} seed={seed} forma="circulo" amp={2.2}>
      <svg width={d} height={d} style={{ position: "absolute", left: 0, top: 0 }}>
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={PRETO}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: ANTON,
          fontSize: d * 0.3,
          color: PRETO,
          paddingTop: d * 0.02,
        }}
      >
        {numero}
      </div>
    </Papel>
  );
};

// Seta recortada à mão em papel vermelho
const Seta: React.FC<{ comprimento: number }> = ({ comprimento: L }) => {
  const pad = 24;
  const H = 110;
  const m = H / 2 + pad;
  const j = (k: string) => (random("seta" + k) - 0.5) * 6;
  const contorno = (ex: number, s: string): [number, number][] => [
    [pad + j(s + 1) - ex, m - 16 - ex + j(s + 2)],
    [pad + L - 84 + j(s + 3), m - 19 - ex],
    [pad + L - 92 + j(s + 4), m - 52 - ex * 1.4],
    [pad + L + ex * 1.6, m + j(s + 5) * 0.4],
    [pad + L - 90 + j(s + 6), m + 50 + ex * 1.4],
    [pad + L - 82 + j(s + 7), m + 17 + ex],
    [pad + j(s + 8) - ex, m + 15 + ex + j(s + 9)],
  ];
  return (
    <svg width={L + pad * 2} height={H + pad * 2} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <FiltroPapel id="papelSeta" seed={31} />
      </defs>
      <path d={caminho(contorno(3, "f"))} fill={BEGE_FIBRA} opacity={0.75} />
      <path d={caminho(contorno(0, "d"))} fill={VERMELHO} filter="url(#papelSeta)" />
    </svg>
  );
};

// ============================================================
// Fundo kraft
// ============================================================
const Fundo: React.FC<{ progresso: number }> = ({ progresso }) => {
  const frame = useCurrentFrame();
  const p = pose(frame);
  const W = 1500;
  const H = 2500;
  const escala = 1 - 0.14 * progresso;
  const dx = 70 * progresso;
  return (
    <AbsoluteFill style={{ backgroundColor: KRAFT, overflow: "hidden" }}>
      <svg
        width={W}
        height={H}
        style={{
          position: "absolute",
          left: (1080 - W) / 2,
          top: (1920 - H) / 2,
          transform: `translateX(${dx}px) scale(${escala})`,
        }}
      >
        <defs>
          <filter id="kraftManchas" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={7} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.10  0 0 0 0 0.075  0 0 0 0 0.055  0 0 0 -1.6 1.0"
            />
          </filter>
          <filter id="kraftFibras" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.45" numOctaves={2} seed={12} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.42  0 0 0 0 0.33  0 0 0 0 0.24  0 0 0 0.9 -0.42"
            />
          </filter>
        </defs>
        <rect width={W} height={H} fill={KRAFT} />
        <rect width={W} height={H} filter="url(#kraftManchas)" opacity={0.45} />
        <rect width={W} height={H} filter="url(#kraftFibras)" opacity={0.22} />
      </svg>
      {/* grão leve que troca a cada 3 frames, como stop motion */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={`grao${p}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={p} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 1.2 -0.55"
            />
          </filter>
        </defs>
        <rect width={1080} height={1920} filter={`url(#grao${p})`} opacity={0.06} />
      </svg>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="vinheta2" cx="50%" cy="45%" r="65%">
            <stop offset="55%" stopColor="#000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000" stopOpacity={0.5} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#vinheta2)" />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================
// Linha de fita preta
// ============================================================
const LINHA_X0 = 100;
const LINHA_X1 = 736;

const LinhaFita: React.FC = () => {
  const frame = useCurrentFrame();
  const inicio = f(TEMPOS.cena3.linha);
  if (frame < inicio) return null;
  const passos = 4; // revela em 4 trancos, de 2 em 2 frames
  const k = Math.min(passos, Math.floor((frame - inicio) / 2) + 1);
  const prog = k / passos;
  const w = LINHA_X1 - LINHA_X0;
  const t = tremor(frame, "linha", 0.8, 0.1);
  return (
    <div
      style={{
        position: "absolute",
        left: LINHA_X0,
        top: LINHA_Y - 9,
        width: w,
        height: 18,
        clipPath: `inset(-20px 0 -20px ${(1 - prog) * 100}%)`,
        transform: `translate(${t.x}px, ${t.y}px) rotate(${-0.4 + t.r}deg)`,
        filter: "drop-shadow(4px 6px 0 rgba(0,0,0,0.6))",
      }}
    >
      <svg width={w} height={18} style={{ overflow: "visible" }}>
        <path d={retanguloRasgado(0, 2, w, 13, "linhaPreta", 1.6)} fill={PRETO} />
        <line x1={4} y1={5} x2={w - 4} y2={4.5} stroke="rgba(255,255,255,0.13)" strokeWidth={2} />
      </svg>
    </div>
  );
};

// ============================================================
// Ponto âmbar (círculo 1)
// ============================================================
const PontoAmbar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = f(TEMPOS.cena4.ponto1);
  const local = frame - inicio;
  const pulso = 1 + 0.16 * Math.sin((local / fps) * ((Math.PI * 2) / 1.5));
  const halo = 0.5 + 0.5 * Math.sin((local / fps) * ((Math.PI * 2) / 1.5));
  return (
    <div style={{ position: "relative", width: 40, height: 40 }}>
      <div
        style={{
          position: "absolute",
          left: -14,
          top: -14,
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(224,160,48,${0.35 * halo}) 0%, rgba(224,160,48,0) 70%)`,
          transform: `scale(${pulso})`,
        }}
      />
      <div style={{ transform: `scale(${pulso})` }}>
        <Papel w={40} h={40} cor={AMBAR} seed="ponto1" forma="circulo" amp={1.2} />
      </div>
    </div>
  );
};

// ============================================================
// Composição
// ============================================================
export const ColagemEtapas: React.FC = () => {
  const frame = useCurrentFrame();
  const T = TEMPOS;

  // Câmera: recuo e deslize para a esquerda, em passos de 2 frames
  const fq = Math.floor(frame / 2) * 2;
  const recuo = interpolate(
    fq,
    [f(T.cena3.inicio), f(T.cena3.inicio + T.cena3.recuoDuracao)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const escala = interpolate(recuo, [0, 1], [1, ESCALA_FINAL]);
  const txFinal = CENTRO_4_FINAL.x - ESCALA_FINAL * CENTRO_MUNDO.x;
  const tyFinal = CENTRO_4_FINAL.y - ESCALA_FINAL * CENTRO_MUNDO.y;
  const tx = interpolate(recuo, [0, 1], [0, txFinal]);
  const ty = interpolate(recuo, [0, 1], [0, tyFinal]);

  // Tranco do carimbo
  const desdeCarimbo = frame - f(T.cena2.carimbo4);
  const tranco = [0, 14, -10, 6, -3, 0];
  const shake =
    desdeCarimbo >= 0 && desdeCarimbo < tranco.length ? tranco[desdeCarimbo] : 0;

  // Tremor geral do quadro
  const tq = tremor(frame, "quadro", 0.9, 0);

  // Seta: do rabo até perto do ponto 1
  const ponto = { x: 150, y: LINHA_Y };
  const rabo = { x: 430, y: 545 };
  const dx = ponto.x - rabo.x;
  const dy = ponto.y - rabo.y;
  const dist = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const compSeta = dist - 44;
  const meio = {
    x: rabo.x + (dx / dist) * (compSeta / 2),
    y: rabo.y + (dy / dist) * (compSeta / 2),
  };

  return (
    <AbsoluteFill style={{ backgroundColor: KRAFT }}>
      <Fundo progresso={recuo} />

      <AbsoluteFill style={{ transform: `translate(${tq.x}px, ${tq.y}px)` }}>
        {/* MUNDO: o que existe antes do recuo */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transformOrigin: "0 0",
            transform: `translate(${tx + shake * 0.6}px, ${ty + shake}px) scale(${escala})`,
          }}
        >
          {/* Cena 1: círculo vermelho */}
          <Peca x={540} y={860} rot={-2} entra={T.cena1.circuloVermelho} seed="circVerm">
            <Papel w={620} h={620} cor={VERMELHO} seed="circuloVermelho" forma="circulo" amp={6} />
          </Peca>
          <Peca x={540} y={745} rot={-3} entra={T.cena1.etiquetaGrito} seed="grito">
            <Etiqueta texto="GRITO" w={360} h={150} tamanho={118} seed="etqGrito" />
          </Peca>
          <Peca x={545} y={980} rot={2.5} entra={T.cena1.etiquetaBriga} seed="briga">
            <Etiqueta texto="BRIGA" w={370} h={150} tamanho={118} seed="etqBriga" />
          </Peca>

          {/* Cena 2: número 4 carimbado e faixa ETAPA 4 */}
          <Peca x={545} y={870} rot={-1.5} entra={T.cena2.carimbo4} seed="num4" tipo="carimbo">
            <Numero4 />
          </Peca>
          <Peca x={540} y={445} rot={-1.2} entra={T.cena2.faixaEtapa4} seed="faixa">
            <Etiqueta texto="ETAPA 4" w={560} h={140} tamanho={108} seed="faixaEtapa" />
          </Peca>
        </div>

        {/* TELA: o que entra depois do recuo, em escala final */}
        <LinhaFita />
        <Peca x={560} y={LINHA_Y} rot={2} entra={T.cena3.circulo3} seed="c3">
          <CirculoCaneta d={170} numero="3" seed="caneta3" />
        </Peca>
        <Peca x={330} y={LINHA_Y} rot={-2.5} entra={T.cena3.circulo2} seed="c2">
          <CirculoCaneta d={120} numero="2" seed="caneta2" />
        </Peca>
        <Peca x={ponto.x} y={ponto.y} rot={-9} entra={T.cena3.fitaVazia} seed="fita1" sombraBase={0.3}>
          <div style={{ position: "relative", width: 118, height: 46 }}>
            <Fita w={118} h={46} x={59} y={23} rot={0} seed="fitaVazia" forte />
          </div>
        </Peca>

        {/* Cena 4 */}
        <Peca x={ponto.x} y={ponto.y} rot={0} entra={T.cena4.ponto1} seed="p1" sombraBase={0.5}>
          <PontoAmbar />
        </Peca>
        <Peca x={meio.x} y={meio.y} rot={ang} entra={T.cena4.seta} seed="seta">
          <Seta comprimento={compSeta} />
        </Peca>
        <Peca x={rabo.x + 10} y={rabo.y - 50} rot={-4} entra={T.cena4.etiquetaAqui} seed="aqui">
          <Etiqueta texto="AQUI" w={290} h={140} tamanho={116} seed="etqAqui" />
        </Peca>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
