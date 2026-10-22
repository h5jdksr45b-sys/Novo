import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS } from "./fontes";
import type { Palavra } from "./timeline";

// Legenda pequena, em sans, abaixo do queixo. Só nos planos em que o Fabio aparece.
// Blocos de até ~22 caracteres que nunca cruzam o fim de uma frase e preferem quebrar na vírgula.
// O bloco fica na tela até o próximo começar: nada de piscar entre palavras.
const MAX_CHARS = 22;

type Bloco = { palavras: Palavra[]; inicioMs: number; fimMs: number };

const montarBlocos = (palavras: Palavra[]): Bloco[] => {
  const blocos: Palavra[][] = [];
  let atual: Palavra[] = [];
  let chars = 0;
  const fecha = () => {
    if (atual.length) blocos.push(atual);
    atual = [];
    chars = 0;
  };
  palavras.forEach((p) => {
    if (chars + p.texto.length + 1 > MAX_CHARS && atual.length) fecha();
    atual.push(p);
    chars += p.texto.length + 1;
    if (/[.!?]$/.test(p.texto)) fecha();
    else if (/[,;:]$/.test(p.texto) && chars >= 12) fecha();
  });
  fecha();
  return blocos.map((b, i) => {
    const prox = blocos[i + 1];
    const ultimaFim = b[b.length - 1].fimMs;
    const fim = prox
      ? Math.min(prox[0].inicioMs, ultimaFim + 1200)
      : ultimaFim + 600;
    return {
      palavras: b,
      inicioMs: b[0].inicioMs,
      fimMs: Math.max(fim, ultimaFim),
    };
  });
};

export const Legenda: React.FC<{
  palavras: Palavra[]; // tempos absolutos, todas as palavras do vídeo
  ativaDeMs: number;
  ativaAteMs: number;
  topo?: number;
}> = ({ palavras, ativaDeMs, ativaAteMs, topo = 1250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = (frame / fps) * 1000;
  const blocos = useMemo(() => montarBlocos(palavras), [palavras]);

  if (agoraMs < ativaDeMs || agoraMs >= ativaAteMs) return null;
  const bloco = blocos.find((b) => agoraMs >= b.inicioMs && agoraMs < b.fimMs);
  if (!bloco) return null;
  const entrada = interpolate(agoraMs - bloco.inicioMs, [0, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: topo,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.25,
          color: "#f4f4f4",
          textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 26px rgba(0,0,0,0.75)",
          opacity: entrada,
          transform: `translateY(${(1 - entrada) * 4}px)`,
        }}
      >
        {bloco.palavras.map((p, i) => {
          const dita = agoraMs >= p.inicioMs;
          return (
            <span
              key={`${p.inicioMs}-${i}`}
              style={{ opacity: dita ? 1 : 0.42, whiteSpace: "pre" }}
            >
              {p.texto}
              {i < bloco.palavras.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
