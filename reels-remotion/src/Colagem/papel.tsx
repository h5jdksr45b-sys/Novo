import React from "react";
import { random } from "remotion";

// Componentes de papel recortado do Frame 4.
// Paleta e acabamento seguem a referência colagem-etapas (fundo escuro
// manchado, vermelho com borda creme rasgada, etiquetas creme, fita
// translúcida, letra condensada preta).

export const COR = {
  fundo: "#2a2420",
  creme: "#ddd2bd",
  cremeEscuro: "#c8bca4",
  borda: "#e9e1cf",
  vermelho: "#a9241a",
  tinta: "#b8231b",
  preto: "#141110",
  fita: "rgba(200, 194, 178, 0.72)",
};

export const FONTE_ETIQUETA = "Anton";

const SOMBRA = "drop-shadow(0px 6px 5px rgba(0,0,0,0.55))";

// Contorno rasgado de um retângulo. Devolve os pontos do polígono.
export const rasgadoRetangulo = (
  w: number,
  h: number,
  seed: string,
  dente = 5,
  passo = 12,
): string => {
  const pts: string[] = [];
  const r = (i: number) => (random(`${seed}-${i}`) - 0.5) * 2 * dente;
  let i = 0;
  for (let x = 0; x < w; x += passo) pts.push(`${x},${Math.max(0, r(i++) + dente)}`);
  for (let y = 0; y < h; y += passo) pts.push(`${w - Math.max(0, r(i++) + dente)},${y}`);
  for (let x = w; x > 0; x -= passo) pts.push(`${x},${h - Math.max(0, r(i++) + dente)}`);
  for (let y = h; y > 0; y -= passo) pts.push(`${Math.max(0, r(i++) + dente)},${y}`);
  return pts.join(" ");
};

// Contorno rasgado de um círculo centrado em (r, r). O rasgo varia devagar
// ao longo da borda, com pequenos dentes por cima, como papel rasgado à mão.
export const rasgadoCirculo = (
  r: number,
  seed: string,
  dente = 7,
  n = 140,
): string => {
  const pts: string[] = [];
  const ctrl = 18;
  const lento = (i: number) => {
    const u = (i / n) * ctrl;
    const a = Math.floor(u);
    const t = u - a;
    const v0 = random(`${seed}-c${a % ctrl}`);
    const v1 = random(`${seed}-c${(a + 1) % ctrl}`);
    return v0 + (v1 - v0) * (t * t * (3 - 2 * t));
  };
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const fino = random(`${seed}-${i}`) > 0.82 ? random(`${seed}-q${i}`) * 0.6 : random(`${seed}-q${i}`) * 0.18;
    const rr = r - dente * (0.15 + lento(i) * 0.6 + fino);
    pts.push(`${(r + Math.cos(a) * rr).toFixed(1)},${(r + Math.sin(a) * rr).toFixed(1)}`);
  }
  return pts.join(" ");
};

// Granulado leve de papel, aplicado por cima de cada recorte.
const Fibra: React.FC<{ id: string }> = ({ id }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
    <feColorMatrix
      type="matrix"
      values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0.12 0"
    />
    <feComposite in2="SourceGraphic" operator="in" />
    <feBlend in="SourceGraphic" mode="multiply" />
  </filter>
);

export const Fita: React.FC<{
  w: number;
  h: number;
  seed: string;
  style?: React.CSSProperties;
}> = ({ w, h, seed, style }) => {
  const r = (i: number) => (random(`${seed}-f${i}`) - 0.5) * 6;
  const pts: string[] = [];
  const n = 6;
  for (let i = 0; i <= n; i++) pts.push(`${r(i) + 3},${(h / n) * i}`);
  for (let i = n; i >= 0; i--) pts.push(`${w - 3 + r(i + 20)},${(h / n) * i}`);
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <polygon points={pts.join(" ")} fill={COR.fita} />
      <line x1={4} y1={h * 0.3} x2={w - 4} y2={h * 0.3} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
    </svg>
  );
};

export const Etiqueta: React.FC<{
  w: number;
  h: number;
  seed: string;
  cor?: string;
  texto?: string;
  corTexto?: string;
  tamanho?: number;
  fita?: boolean;
  children?: React.ReactNode;
}> = ({ w, h, seed, cor = COR.creme, texto, corTexto = COR.preto, tamanho = 80, fita = true, children }) => {
  const idf = `fibra-${seed}`;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", filter: SOMBRA }}>
        <defs>
          <Fibra id={idf} />
        </defs>
        <polygon points={rasgadoRetangulo(w, h, seed)} fill={cor} filter={`url(#${idf})`} />
      </svg>
      {texto ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONTE_ETIQUETA,
            fontSize: tamanho,
            lineHeight: 1,
            color: corTexto,
            letterSpacing: 1,
            textTransform: "uppercase",
            paddingTop: tamanho * 0.04,
          }}
        >
          {texto}
        </div>
      ) : null}
      {children}
      {fita ? (
        <Fita
          w={Math.min(150, w * 0.35)}
          h={34}
          seed={`${seed}-fita`}
          style={{ left: w * 0.32, top: -18, transform: "rotate(-3deg)" }}
        />
      ) : null}
    </div>
  );
};

// Folha de papel que vai sendo amassada.
// nivel 0: folha lisa retangular. nivel 3: bolinha enrugada.
// Os valores aleatórios são fixos por ponto, então cada nível é a mesma
// folha mais amassada. As rugas são facetas claras e escuras com luz vindo
// do alto à esquerda, mais vincos desenhados por cima.
export const Amassado: React.FC<{ w: number; h: number; nivel: number; seed?: string }> = ({
  w,
  h,
  nivel,
  seed = "folha",
}) => {
  const t = Math.max(0, Math.min(1, nivel / 3));
  const N = 36;
  const expoente = 14 - (14 - 2.1) * Math.pow(t, 0.6);
  const fora: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + (random(`${seed}-a${i}`) - 0.5) * 0.12 * t;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const fx = Math.sign(c) * Math.pow(Math.abs(c), 2 / expoente);
    const fy = Math.sign(s) * Math.pow(Math.abs(s), 2 / expoente);
    const dente = 1 - random(`${seed}-r${i}`) * 0.2 * t;
    fora.push([w / 2 + fx * (w / 2) * dente, h / 2 + fy * (h / 2) * dente]);
  }
  const M = 11;
  const dentro: [number, number][] = [];
  for (let i = 0; i < M; i++) {
    const p = fora[Math.floor((i / M) * N)];
    const k = 0.35 + random(`${seed}-d${i}`) * 0.3;
    dentro.push([w / 2 + (p[0] - w / 2) * k, h / 2 + (p[1] - h / 2) * k]);
  }
  const centro: [number, number] = [w / 2 - w * 0.06, h / 2 - h * 0.05];
  const tris: [number, number][][] = [];
  for (let i = 0; i < N; i++) {
    const p1 = fora[i];
    const p2 = fora[(i + 1) % N];
    const j = Math.floor((i / N) * M) % M;
    const j2 = Math.floor(((i + 1) / N) * M) % M;
    tris.push([p1, p2, dentro[j2]]);
    if (j !== j2) tris.push([p1, dentro[j2], dentro[j]]);
  }
  for (let i = 0; i < M; i++) tris.push([dentro[i], dentro[(i + 1) % M], centro]);

  const contraste = Math.pow(t, 0.7);
  const raio = Math.min(w, h) / 2;
  const tom = (tri: [number, number][], k: number) => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3 - w / 2;
    const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3 - h / 2;
    const d = Math.hypot(cx, cy) || 1;
    const luz = (-(cx / d) * 0.7 - (cy / d) * 0.7) * Math.min(1, d / (raio * 0.5));
    const ruido = random(`${seed}-t${k}`) - 0.5;
    const v = 0.78 + (luz * 0.3 + ruido * 0.5 - 0.22) * contraste;
    const c = Math.max(0, Math.min(1, v));
    const mix = (a: number, b: number) => Math.round(a + (b - a) * c);
    return `rgb(${mix(118, 236)},${mix(106, 226)},${mix(88, 206)})`;
  };

  // Vincos que atravessam a folha. Aparecem já no primeiro tranco,
  // para o amassado ser óbvio.
  const vincos: string[] = [];
  const nv = Math.round(5 + 4 * t);
  for (let i = 0; i < nv; i++) {
    const a = fora[Math.floor(random(`${seed}-v1${i}`) * N)];
    const b = fora[Math.floor(random(`${seed}-v2${i}`) * N)];
    const m1x = a[0] + (b[0] - a[0]) * 0.35 + (random(`${seed}-vx${i}`) - 0.5) * w * 0.25;
    const m1y = a[1] + (b[1] - a[1]) * 0.35 + (random(`${seed}-vy${i}`) - 0.5) * h * 0.25;
    const m2x = a[0] + (b[0] - a[0]) * 0.7 + (random(`${seed}-wx${i}`) - 0.5) * w * 0.2;
    const m2y = a[1] + (b[1] - a[1]) * 0.7 + (random(`${seed}-wy${i}`) - 0.5) * h * 0.2;
    vincos.push(`M${a[0].toFixed(1)},${a[1].toFixed(1)} L${m1x.toFixed(1)},${m1y.toFixed(1)} L${m2x.toFixed(1)},${m2y.toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`);
  }
  const contorno = fora.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
  const idc = `clip-${seed}`;
  return (
    <svg
      width={w}
      height={h}
      style={{ overflow: "visible", filter: `drop-shadow(0px ${6 + 8 * t}px ${5 + 5 * t}px rgba(0,0,0,0.6))` }}
    >
      <defs>
        <clipPath id={idc}>
          <polygon points={contorno} />
        </clipPath>
      </defs>
      <polygon points={contorno} fill="rgb(222,212,192)" />
      {t > 0
        ? tris.map((tri, k) => (
            <polygon
              key={k}
              points={tri.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}
              fill={tom(tri, k)}
              stroke={`rgba(70,55,40,${0.3 * contraste})`}
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          ))
        : null}
      {t > 0 ? (
        <g clipPath={`url(#${idc})`}>
          {vincos.map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke={`rgba(60,45,32,${0.5 * (1 - t * 0.45)})`} strokeWidth={2.2} strokeLinejoin="round" />
              <path d={d} fill="none" stroke="rgba(255,250,238,0.5)" strokeWidth={1.4} transform="translate(-2,-2)" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      ) : null}
      <polygon points={contorno} fill="none" stroke={`rgba(60,48,36,${0.25 + 0.25 * t})`} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
};

// Linha pontilhada onde deveria estar escrito um nome.
export const LinhaPontilhada: React.FC<{ x: number; y: number; largura: number }> = ({ x, y, largura }) => (
  <svg width={largura} height={12} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <line
      x1={0}
      y1={6}
      x2={largura}
      y2={6}
      stroke="rgba(20,17,16,0.55)"
      strokeWidth={5}
      strokeDasharray="4 14"
      strokeLinecap="round"
    />
  </svg>
);

// Disco de papel creme com número, como os círculos 2 e 3 do frame 2.
export const CirculoNumero: React.FC<{ r: number; numero: string; seed: string }> = ({ r, numero, seed }) => (
  <div style={{ position: "relative", width: r * 2, height: r * 2 }}>
    <svg width={r * 2} height={r * 2} style={{ position: "absolute", overflow: "visible", filter: SOMBRA }}>
      <polygon points={rasgadoCirculo(r, seed, r * 0.07)} fill={COR.creme} />
      <circle cx={r} cy={r} r={r * 0.78} fill="none" stroke={COR.preto} strokeWidth={Math.max(3, r * 0.045)} />
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTE_ETIQUETA,
        fontSize: r * 0.66,
        color: COR.preto,
      }}
    >
      {numero}
    </div>
  </div>
);

// Disco de papel âmbar (o ponto da linha do frame 2).
export const DiscoAmbar: React.FC<{ r: number; seed?: string }> = ({ r, seed = "ambar" }) => (
  <svg width={r * 2} height={r * 2} style={{ overflow: "visible", filter: SOMBRA }}>
    <defs>
      <radialGradient id={`luz-${seed}`} cx="40%" cy="38%" r="70%">
        <stop offset="0%" stopColor="#f2b53c" />
        <stop offset="100%" stopColor="#d98f1c" />
      </radialGradient>
    </defs>
    <polygon points={rasgadoCirculo(r, seed, r * 0.025, 120)} fill={`url(#luz-${seed})`} />
  </svg>
);

// Número 4 pintado à mão, com borda irregular.
export const QuatroPintado: React.FC<{ altura: number }> = ({ altura }) => (
  <svg width={altura * 0.62} height={altura} style={{ overflow: "visible" }}>
    <defs>
      <filter id="pincel" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="8" />
        <feDisplacementMap in="SourceGraphic" scale={altura * 0.035} />
      </filter>
    </defs>
    <text
      x={altura * 0.31}
      y={altura * 0.93}
      textAnchor="middle"
      fontFamily={FONTE_ETIQUETA}
      fontSize={altura * 1.05}
      fill="#171413"
      filter="url(#pincel)"
    >
      4
    </text>
  </svg>
);

export const CirculoVermelho: React.FC<{ r: number; seed?: string; children?: React.ReactNode }> = ({
  r,
  seed = "circulo",
  children,
}) => (
  <div style={{ position: "relative", width: r * 2, height: r * 2 }}>
    <svg width={r * 2} height={r * 2} style={{ position: "absolute", overflow: "visible", filter: SOMBRA }}>
      <polygon points={rasgadoCirculo(r, `${seed}-borda`, 9)} fill={COR.borda} />
      <g transform={`translate(${r * 0.04},${r * 0.04}) scale(0.96)`}>
        <polygon points={rasgadoCirculo(r, `${seed}-miolo`, 10)} fill={COR.vermelho} />
      </g>
    </svg>
    {children}
  </div>
);

// Relógio de papel: disco creme rasgado, aro de tinta, marcas e ponteiros.
export const Relogio: React.FC<{ r: number; anguloHora: number; anguloMinuto: number; seed?: string }> = ({
  r,
  anguloHora,
  anguloMinuto,
  seed = "relogio",
}) => (
  <svg width={r * 2} height={r * 2} style={{ overflow: "visible", filter: SOMBRA }}>
    <polygon points={rasgadoCirculo(r, seed, 6)} fill={COR.creme} />
    <circle cx={r} cy={r} r={r * 0.8} fill="none" stroke={COR.preto} strokeWidth={r * 0.05} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r1 = r * (i % 3 === 0 ? 0.6 : 0.67);
      const r2 = r * 0.74;
      return (
        <line
          key={i}
          x1={r + Math.cos(a) * r1}
          y1={r + Math.sin(a) * r1}
          x2={r + Math.cos(a) * r2}
          y2={r + Math.sin(a) * r2}
          stroke={COR.preto}
          strokeWidth={i % 3 === 0 ? r * 0.05 : r * 0.03}
          strokeLinecap="round"
        />
      );
    })}
    <line
      x1={r}
      y1={r}
      x2={r}
      y2={r - r * 0.38}
      stroke={COR.preto}
      strokeWidth={r * 0.08}
      strokeLinecap="round"
      transform={`rotate(${anguloHora} ${r} ${r})`}
    />
    <line
      x1={r}
      y1={r}
      x2={r}
      y2={r - r * 0.58}
      stroke={COR.vermelho}
      strokeWidth={r * 0.05}
      strokeLinecap="round"
      transform={`rotate(${anguloMinuto} ${r} ${r})`}
    />
    <circle cx={r} cy={r} r={r * 0.07} fill={COR.preto} />
  </svg>
);

// Seta de papel recortado apontando para a direita (gire com rotate).
export const Seta: React.FC<{
  comprimento: number;
  haste?: number;
  pontaLargura?: number;
  pontaComprimento?: number;
  cor?: string;
  seed: string;
}> = ({ comprimento, haste = 40, pontaLargura = 110, pontaComprimento = 100, cor = COR.vermelho, seed }) => {
  const L = comprimento;
  const H = pontaLargura;
  const j = (i: number) => (random(`${seed}-${i}`) - 0.5) * 4;
  const pts = [
    [0 + j(1), H / 2 - haste / 2 + j(2)],
    [L - pontaComprimento + j(3), H / 2 - haste / 2 + j(4)],
    [L - pontaComprimento + j(5), 0 + j(6)],
    [L + j(7), H / 2 + j(8)],
    [L - pontaComprimento + j(9), H + j(10)],
    [L - pontaComprimento + j(11), H / 2 + haste / 2 + j(12)],
    [0 + j(13), H / 2 + haste / 2 + j(14)],
  ];
  return (
    <svg width={L} height={H} style={{ overflow: "visible", filter: "drop-shadow(-4px 5px 0px rgba(10,8,7,0.85))" }}>
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={cor} strokeLinejoin="round" />
    </svg>
  );
};

// Fundo kraft escuro manchado, igual ao da referência. É estático.
export const Fundo: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="manchas" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.0026" numOctaves="3" seed="11" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.27  0 0 0 0 0.23  0 0 0 0 0.2  0.55 0 0 0 -0.2" />
      </filter>
      <filter id="fibras" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.002 0.09" numOctaves="2" seed="4" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0.6 -0.22" />
      </filter>
      <filter id="grao" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.05 0" />
      </filter>
      <radialGradient id="vinheta" cx="50%" cy="45%" r="72%">
        <stop offset="45%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="#25201c" />
    <rect width={1080} height={1920} filter="url(#manchas)" />
    <rect width={1080} height={1920} filter="url(#fibras)" />
    <rect width={1080} height={1920} filter="url(#grao)" />
    <rect width={1080} height={1920} fill="url(#vinheta)" />
  </svg>
);
