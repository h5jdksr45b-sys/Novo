import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIFA } from "./fontes";
import { normalizar, type Palavra } from "./timeline";

// Tipografia cinética no padrão das referências:
// - cada palavra entra com fade de ~3 frames, leve subida e escala 0.98 -> 1;
// - as palavras acumulam até o corte;
// - anos (4 dígitos) entram em efeito máquina de escrever;
// - palavras de destaque ganham caixa de cor; palavras grandes sobem de corpo e quebram linha.

const ehAno = (p: string) => /^\d{4}[.,;:]?$/.test(p);

const limpa = (p: string) => normalizar(p);

// Marca grupos de destaque com mais de uma palavra ("17 anos") como uma caixa só.
const grupos = (palavras: Palavra[], destaques?: string[]) => {
  const marcas: (number | null)[] = palavras.map(() => null);
  if (!destaques) return marcas;
  destaques.forEach((d, gi) => {
    const partes = d.split(/\s+/).map(limpa);
    for (let i = 0; i + partes.length <= palavras.length; i++) {
      const ok = partes.every((parte, k) => limpa(palavras[i + k].texto) === parte);
      if (ok && marcas.slice(i, i + partes.length).every((m) => m === null)) {
        for (let k = 0; k < partes.length; k++) marcas[i + k] = gi;
        break;
      }
    }
  });
  return marcas;
};

export const TextoCinetico: React.FC<{
  palavras: Palavra[]; // tempos absolutos
  inicioCenaMs: number;
  posicao: "alto" | "baixo";
  destaques?: string[];
  grandes?: string[];
  corDestaque: string;
  corpo?: number;
}> = ({ palavras, inicioCenaMs, posicao, destaques, grandes, corDestaque, corpo = 58 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = inicioCenaMs + (frame / fps) * 1000;
  const marcas = grupos(palavras, destaques);
  const grandesRestantes = grandes ? [...grandes] : [];

  const estiloBase: React.CSSProperties = {
    position: "absolute",
    left: 110,
    right: 110,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "baseline",
    columnGap: 16,
    rowGap: 6,
    textAlign: "center",
    ...(posicao === "alto" ? { top: 330 } : { bottom: 520 }),
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={estiloBase}>
        {palavras.map((p, i) => {
          if (agoraMs < p.inicioMs) return null;
          const decorrido = agoraMs - p.inicioMs;
          const entrada = interpolate(decorrido, [0, 110], [0, 1], { extrapolateRight: "clamp" });
          const grupo = marcas[i];
          let grande = false;
          // Palavras grandes casam com pontuação ("ela." só casa com o "ela." final).
          if (grandesRestantes.length && grandesRestantes[0].toLowerCase() === p.texto.toLowerCase()) {
            grande = true;
            grandesRestantes.shift();
          }
          let texto = p.texto;
          if (ehAno(p.texto)) {
            const total = p.texto.length;
            const dur = Math.max(260, p.fimMs - p.inicioMs);
            const mostrar = Math.min(total, 1 + Math.floor((decorrido / dur) * total));
            texto = p.texto.slice(0, mostrar);
          }
          const abreGrupo = grupo !== null && (i === 0 || marcas[i - 1] !== grupo);
          const fechaGrupo = grupo !== null && (i === palavras.length - 1 || marcas[i + 1] !== grupo);
          const emCaixa = grupo !== null;
          return (
            <React.Fragment key={`${p.inicioMs}-${i}`}>
              {grande ? <span style={{ flexBasis: "100%", height: 0 }} /> : null}
              <span
                style={{
                  fontFamily: SERIFA,
                  fontStyle: "italic",
                  fontWeight: grande ? 700 : 400,
                  fontSize: grande ? corpo * 1.9 : emCaixa ? corpo * 1.05 : corpo,
                  lineHeight: 1.05,
                  color: emCaixa ? "#0a0a0a" : "#f4f4f4",
                  background: emCaixa ? corDestaque : "transparent",
                  padding: emCaixa ? "2px 14px" : 0,
                  marginLeft: emCaixa && !abreGrupo ? -16 : 0,
                  paddingLeft: emCaixa && !abreGrupo ? 10 : emCaixa ? 14 : 0,
                  paddingRight: emCaixa && !fechaGrupo ? 10 : emCaixa ? 14 : 0,
                  textShadow: emCaixa ? "none" : "0 0 22px rgba(255,255,255,0.28), 0 2px 10px rgba(0,0,0,0.6)",
                  opacity: entrada,
                  transform: `translateY(${(1 - entrada) * 8}px) scale(${0.985 + entrada * 0.015})`,
                  display: "inline-block",
                  whiteSpace: "pre",
                }}
              >
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
  const t = interpolate(frame, [atrasoFrames, atrasoFrames + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seta = interpolate(frame, [atrasoFrames + 6, atrasoFrames + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {setaPara ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
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
          transform: `translate(-50%, -50%) scale(${0.9 + t * 0.1})`,
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
