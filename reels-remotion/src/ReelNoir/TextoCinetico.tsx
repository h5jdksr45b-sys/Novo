import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIFA } from "./fontes";
import { normalizar, type Palavra } from "./timeline";

// Tipografia cinética no padrão das referências:
// - a fala é mostrada em blocos curtos (até ~26 caracteres) que se substituem; dentro do bloco
//   as palavras acumulam, cada uma entrando com fade de ~4 frames e um deslize curto de baixo;
// - anos (4 dígitos) entram em efeito máquina de escrever;
// - palavras de destaque ganham caixa de cor que cresce da esquerda;
// - palavras grandes sobem de corpo e ocupam a própria linha.

const ehAno = (p: string) => /^\d{4}[.,;:]?$/.test(p);
const limpa = (p: string) => normalizar(p);
const MAX_CHARS = 30;

type Marca = { grupo: number | null; grande: boolean };

const marcar = (
  palavras: Palavra[],
  destaques?: string[],
  grandes?: string[],
): Marca[] => {
  const marcas: Marca[] = palavras.map(() => ({ grupo: null, grande: false }));
  (destaques ?? []).forEach((d, gi) => {
    const partes = d.split(/\s+/).map(limpa);
    for (let i = 0; i + partes.length <= palavras.length; i++) {
      const ok = partes.every(
        (parte, k) => limpa(palavras[i + k].texto) === parte,
      );
      if (
        ok &&
        marcas.slice(i, i + partes.length).every((m) => m.grupo === null)
      ) {
        for (let k = 0; k < partes.length; k++) marcas[i + k].grupo = gi;
        break;
      }
    }
  });
  const fila = [...(grandes ?? [])];
  palavras.forEach((p, i) => {
    if (fila.length && fila[0].toLowerCase() === p.texto.toLowerCase()) {
      marcas[i].grande = true;
      fila.shift();
    }
  });
  return marcas;
};

// Divide em blocos curtos. Fecha o bloco quando estoura o tamanho (nunca com uma palavra só)
// ou numa pontuação depois de 14 caracteres. Palavra grande "pesa" mais para ganhar espaço.
const paginar = (palavras: Palavra[], marcas: Marca[]) => {
  const paginas: number[][] = [];
  let atual: number[] = [];
  let chars = 0;
  const fecha = () => {
    if (atual.length) {
      paginas.push(atual);
      atual = [];
      chars = 0;
    }
  };
  palavras.forEach((p, i) => {
    const custo = p.texto.length + 1 + (marcas[i].grande ? 8 : 0);
    if (chars + custo > MAX_CHARS && atual.length >= 2) fecha();
    atual.push(i);
    chars += custo;
    if (/[.!?:;,]$/.test(p.texto) && chars >= 14) fecha();
  });
  fecha();
  return paginas;
};

export const TextoCinetico: React.FC<{
  palavras: Palavra[]; // tempos absolutos
  inicioCenaMs: number;
  posicao: "alto" | "baixo";
  destaques?: string[];
  grandes?: string[];
  corDestaque: string;
  corpo?: number;
}> = ({
  palavras,
  inicioCenaMs,
  posicao,
  destaques,
  grandes,
  corDestaque,
  corpo = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = inicioCenaMs + (frame / fps) * 1000;
  const marcas = marcar(palavras, destaques, grandes);
  const paginas = paginar(palavras, marcas);
  const idx = paginas.findIndex((pg, k) => {
    const prox = paginas[k + 1];
    return (
      agoraMs >= palavras[pg[0]].inicioMs &&
      (!prox || agoraMs < palavras[prox[0]].inicioMs)
    );
  });
  if (idx < 0) return null;
  const pagina = paginas[idx];

  const estiloBase: React.CSSProperties = {
    position: "absolute",
    left: 100,
    right: 100,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "baseline",
    columnGap: 18,
    rowGap: 10,
    textAlign: "center",
    ...(posicao === "alto" ? { top: 340 } : { bottom: 540 }),
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={estiloBase}>
        {pagina.map((i) => {
          const p = palavras[i];
          if (agoraMs < p.inicioMs) return null;
          const decorrido = agoraMs - p.inicioMs;
          const entrada = interpolate(decorrido, [0, 140], [0, 1], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const { grupo, grande } = marcas[i];
          const emCaixa = grupo !== null;
          let texto = p.texto;
          if (ehAno(p.texto)) {
            const total = p.texto.length;
            const dur = Math.max(260, p.fimMs - p.inicioMs);
            texto = p.texto.slice(
              0,
              Math.min(total, 1 + Math.floor((decorrido / dur) * total)),
            );
          }
          return (
            <React.Fragment key={`${p.inicioMs}-${i}`}>
              {grande && i !== pagina[0] ? (
                <span style={{ flexBasis: "100%", height: 0 }} />
              ) : null}
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  whiteSpace: "pre",
                  fontFamily: SERIFA,
                  fontStyle: "italic",
                  fontWeight: grande ? 700 : 400,
                  fontSize: grande ? corpo * 1.75 : corpo,
                  lineHeight: 1.08,
                  color: emCaixa ? "#0a0a0a" : "#f4f4f4",
                  padding: emCaixa ? "2px 16px" : 0,
                  textShadow: emCaixa
                    ? "none"
                    : "0 0 22px rgba(255,255,255,0.28), 0 2px 10px rgba(0,0,0,0.65)",
                  opacity: entrada,
                  transform: `translateY(${(1 - entrada) * 14}px)`,
                }}
              >
                {emCaixa ? (
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: corDestaque,
                      transform: `scaleX(${entrada})`,
                      transformOrigin: "left center",
                      zIndex: -1,
                    }}
                  />
                ) : null}
                {texto}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Caixa pequena em sans com seta desenhada, para nome ou termo (padrão "Philip Zimbardo").
export const Rotulo: React.FC<{
  texto: string;
  x: number;
  y: number;
  corDestaque: string;
  atrasoFrames?: number;
  setaPara?: { x: number; y: number };
}> = ({ texto, x, y, corDestaque, atrasoFrames = 10, setaPara }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [atrasoFrames, atrasoFrames + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const seta = interpolate(
    frame,
    [atrasoFrames + 6, atrasoFrames + 22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {setaPara ? (
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d={`M ${x} ${y - 30} Q ${(x + setaPara.x) / 2 + 60} ${(y + setaPara.y) / 2} ${setaPara.x} ${setaPara.y}`}
            stroke={corDestaque}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - seta}
          />
        </svg>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) translateX(${(1 - t) * -24}px)`,
          opacity: t,
          background: corDestaque,
          color: "#0a0a0a",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: 1,
          padding: "8px 18px",
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

// Marca d'água discreta na lateral, como nas referências.
export const Marca: React.FC<{ texto: string }> = ({ texto }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 34,
        top: 1120,
        transform: "rotate(-90deg)",
        transformOrigin: "left top",
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 22,
        letterSpacing: 4,
        color: "rgba(255,255,255,0.55)",
        textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  </AbsoluteFill>
);
