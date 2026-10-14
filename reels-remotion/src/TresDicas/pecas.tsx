import { Audio } from "@remotion/media";
import { createContext, useContext, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Fala, tempoDaPalavra } from "./roteiro";
import { COR, GROTESCA, SERIFADA, titulo } from "./estilo";

// Cada cena guarda o segundo em que começa. Assim os componentes trabalham
// com o tempo absoluto do roteiro, mesmo dentro de uma Sequence.
const CenaCtx = createContext(0);

export const useAgora = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = useContext(CenaCtx);
  return inicio + frame / fps;
};

export const Cena: React.FC<{
  readonly nome: string;
  readonly inicio: number;
  readonly fim: number;
  readonly children: React.ReactNode;
}> = ({ nome, inicio, fim, children }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={nome}
      from={Math.round(inicio * fps)}
      durationInFrames={Math.round((fim - inicio) * fps)}
      premountFor={fps}
    >
      <CenaCtx.Provider value={inicio}>{children}</CenaCtx.Provider>
    </Sequence>
  );
};

export const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);
const MOLA = Easing.spring({ damping: 12 });

// Interpola em segundos, sempre com limite nas pontas.
export const em = (
  t: number,
  de: number,
  ate: number,
  saida: [number, number],
  easing = SUAVE,
) =>
  interpolate(t, [de, ate], saida, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Fundo de papel creme, com grão que muda a cada dois quadros e uma dobra
// vertical discreta, como nas referências.
export const Papel: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const semente = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.papel }}>
      {children}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, transparent 49.6%, rgba(255,255,255,0.22) 49.9%, rgba(0,0,0,0.07) 50.2%, transparent 50.6%), radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(30,20,10,0.18) 100%)",
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.22 }}>
        <svg width="100%" height="100%">
          <filter id={`grao-${semente}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={3}
              seed={semente}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grao-${semente})`} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Palavras que aparecem no momento em que seriam ditas.
export const Palavras: React.FC<{
  readonly fala: Fala;
  readonly de?: number;
  readonly ate?: number;
  readonly destaque?: { readonly de: number; readonly cor: string };
}> = ({ fala, de = 0, ate, destaque }) => {
  const t = useAgora();
  const palavras = fala.texto.split(" ");
  const fimIdx = ate ?? palavras.length;
  return (
    <>
      {palavras.slice(de, fimIdx).map((p, j) => {
        const i = de + j;
        const ti = tempoDaPalavra(fala, i);
        return (
          <span key={i}>
            <span
              style={{
                display: "inline-block",
                opacity: em(t, ti - 0.02, ti + 0.12, [0, 1]),
                translate: `0px ${em(t, ti - 0.02, ti + 0.4, [26, 0])}px`,
                filter: `blur(${em(t, ti - 0.02, ti + 0.25, [6, 0])}px)`,
                color: destaque && i >= destaque.de ? destaque.cor : undefined,
              }}
            >
              {p}
            </span>
            {j < fimIdx - de - 1 ? " " : null}
          </span>
        );
      })}
    </>
  );
};

// Contorno irregular de papel rasgado, com bico opcional de balão.
const forma = (semente: string, ponta?: "esquerda" | "direita") => {
  const j = (k: string) => (random(`${semente}-${k}`) - 0.5) * 3;
  const pontos: [number, number][] = [
    [ponta === "esquerda" ? 7 : 2, 3],
    [32, 1],
    [66, 4],
    [ponta === "direita" ? 93 : 98, 2],
  ];
  if (ponta === "direita") {
    pontos.push([94, 30], [100, 52], [93, 72]);
  } else {
    pontos.push([100, 48]);
  }
  pontos.push([ponta === "direita" ? 94 : 97, 97], [62, 100], [28, 95]);
  pontos.push([ponta === "esquerda" ? 6 : 1, 98]);
  if (ponta === "esquerda") {
    pontos.push([7, 72], [0, 50], [6, 30]);
  } else {
    pontos.push([0, 52]);
  }
  return `polygon(${pontos
    .map(([x, y], i) => `${x + j(`x${i}`)}% ${y + j(`y${i}`)}%`)
    .join(", ")})`;
};

export const Etiqueta: React.FC<{
  readonly entra: number;
  readonly sai?: number;
  readonly topo: number;
  readonly giro?: number;
  readonly ponta?: "esquerda" | "direita";
  readonly fundo?: string;
  readonly tamanho?: number;
  readonly italico?: boolean;
  readonly semente: string;
  readonly children: React.ReactNode;
}> = ({
  entra,
  sai = 9999,
  topo,
  giro = -2,
  ponta,
  fundo = COR.etiqueta,
  tamanho = 64,
  italico = false,
  semente,
  children,
}) => {
  const t = useAgora();
  const clip = useMemo(() => forma(semente, ponta), [semente, ponta]);
  const saida = em(t, sai, sai + 0.3, [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top: topo,
        left: 70,
        right: 70,
        display: "flex",
        justifyContent: "center",
        opacity: em(t, entra, entra + 0.12, [0, 1]) * (1 - saida),
        translate: `0px ${-60 * saida}px`,
        scale: em(t, entra, entra + 0.5, [0.82, 1], MOLA),
        // Balanço leve depois da entrada, para a etiqueta não ficar parada.
        rotate: `${giro + em(t, entra, entra + 0.5, [-5, 0], MOLA) + Math.sin((t - entra) * 1.6) * 0.6}deg`,
        filter: "drop-shadow(0px 14px 22px rgba(40,25,10,0.22))",
      }}
    >
      <div
        style={{
          clipPath: clip,
          backgroundColor: fundo,
          padding: `44px ${ponta === "direita" ? 110 : 70}px 48px ${
            ponta === "esquerda" ? 110 : 70
          }px`,
          fontFamily: SERIFADA,
          fontStyle: italico ? "italic" : "normal",
          fontSize: tamanho,
          lineHeight: 1.18,
          color: COR.tinta,
          textAlign: "center",
          maxWidth: 940,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Faixa colorida de cada dica, ocupando o terço de cima da tela.
export const Faixa: React.FC<{
  readonly cor: string;
  readonly numero: string;
  readonly fala: Fala;
  readonly entra?: { readonly tipo: "encolher" | "direita"; readonly em: number };
  readonly sai?: { readonly tipo: "esquerda" | "cima"; readonly em: number };
}> = ({ cor, numero, fala, entra, sai }) => {
  const t = useAgora();
  const altura =
    entra?.tipo === "encolher" ? em(t, entra.em, entra.em + 0.7, [1920, 640]) : 640;
  const x =
    (entra?.tipo === "direita" ? em(t, entra.em, entra.em + 0.55, [1080, 0]) : 0) +
    (sai?.tipo === "esquerda" ? em(t, sai.em, sai.em + 0.55, [0, -1080]) : 0);
  const y = sai?.tipo === "cima" ? em(t, sai.em, sai.em + 0.55, [0, -700]) : 0;
  const numeroEntra = tempoDaPalavra(fala, 0);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: altura,
        backgroundColor: cor,
        translate: `${x}px ${y}px`,
        overflow: "hidden",
        boxShadow: "0px 18px 40px rgba(30,20,10,0.25)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 150,
          fontFamily: SERIFADA,
          fontStyle: "italic",
          fontSize: 210,
          lineHeight: 1,
          color: COR.creme,
          opacity: em(t, numeroEntra - 0.05, numeroEntra + 0.15, [0, 1]),
          scale: em(t, numeroEntra - 0.05, numeroEntra + 0.5, [1.4, 1], MOLA),
          transformOrigin: "left center",
        }}
      >
        {numero}
      </div>
      <div
        style={{
          ...titulo,
          position: "absolute",
          left: 80,
          right: 80,
          top: 385,
          fontSize: 86,
          color: COR.creme,
        }}
      >
        <Palavras fala={fala} de={1} />
      </div>
    </div>
  );
};

// Caixa de seleção que recebe o check e depois o vê quebrar.
export const CheckQuebrado: React.FC<{
  readonly topo: number;
  readonly caixa: number;
  readonly marca: number;
  readonly quebra: number;
  readonly sai: number;
}> = ({ topo, caixa, marca, quebra, sai }) => {
  const t = useAgora();
  const q = em(t, quebra, quebra + 0.6, [0, 1], Easing.in(Easing.quad));
  const tremor = t > quebra && t < quebra + 0.15 ? Math.sin(t * 140) * 6 : 0;
  const corCaixa = t >= quebra ? COR.vermelho : COR.tinta;
  return (
    <svg
      width={190}
      height={190}
      viewBox="0 0 160 160"
      style={{
        position: "absolute",
        top: topo,
        left: 445,
        overflow: "visible",
        opacity: em(t, caixa, caixa + 0.1, [0, 1]) * em(t, sai, sai + 0.3, [1, 0]),
        translate: `${tremor}px 0px`,
      }}
    >
      <rect
        x={14}
        y={14}
        width={132}
        height={132}
        rx={14}
        fill="none"
        stroke={corCaixa}
        strokeWidth={9}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={em(t, caixa, caixa + 0.45, [1, 0])}
      />
      <path
        d="M40 82 L68 110"
        fill="none"
        stroke={COR.tinta}
        strokeWidth={14}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={em(t, marca, marca + 0.15, [1, 0])}
        style={{
          translate: `${-30 * q}px ${70 * q}px`,
          rotate: `${-35 * q}deg`,
          transformOrigin: "54px 96px",
          opacity: 1 - q,
        }}
      />
      <path
        d="M68 110 L124 46"
        fill="none"
        stroke={COR.tinta}
        strokeWidth={14}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={em(t, marca + 0.12, marca + 0.32, [1, 0])}
        style={{
          translate: `${25 * q}px ${110 * q}px`,
          rotate: `${28 * q}deg`,
          transformOrigin: "96px 78px",
          opacity: 1 - q,
        }}
      />
    </svg>
  );
};

export const Grande: React.FC<{
  readonly topo: number;
  readonly tamanho: number;
  readonly cor?: string;
  readonly peso?: 800 | 900;
  readonly maiuscula?: boolean;
  readonly opacidade?: number;
  readonly children: React.ReactNode;
}> = ({ topo, tamanho, cor = COR.tinta, peso = 900, maiuscula = true, opacidade = 1, children }) => (
  <div
    style={{
      ...titulo,
      fontWeight: peso,
      textTransform: maiuscula ? "uppercase" : "none",
      letterSpacing: -0.5,
      lineHeight: maiuscula ? 0.98 : 1.08,
      position: "absolute",
      top: topo,
      left: 80,
      right: 80,
      textAlign: "center",
      fontSize: tamanho,
      color: cor,
      opacity: opacidade,
    }}
  >
    {children}
  </div>
);

export const Assinatura: React.FC<{ readonly entra: number }> = ({ entra }) => {
  const t = useAgora();
  return (
    <div
      style={{
        position: "absolute",
        top: 1640,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: GROTESCA,
        fontWeight: 800,
        fontSize: 32,
        color: COR.cinzaTexto,
        opacity: em(t, entra, entra + 0.5, [0, 1]),
      }}
    >
      Dr. Fabio Schmidt, médico, CRM-SP 183549
    </div>
  );
};

export type Som =
  | "pop"
  | "clique"
  | "whoosh"
  | "papel"
  | "risco"
  | "impacto"
  | "estalo"
  | "ding";

export const Sfx: React.FC<{
  readonly som: Som;
  readonly em: number;
  readonly volume?: number;
}> = ({ som, em: segundo, volume = 0.6 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={`sfx ${som}`}
      from={Math.max(0, Math.round(segundo * fps))}
      durationInFrames={Math.round(1.2 * fps)}
      layout="none"
    >
      <Audio src={staticFile(`sfx/${som}.wav`)} volume={volume} />
    </Sequence>
  );
};
