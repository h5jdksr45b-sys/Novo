import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS } from "./fontes";
import { PALAVRAS_CHAVE } from "./roteiro";
import type { Palavra } from "./timeline";

// Legenda pequena, em sans, abaixo do queixo. Só nos planos em que o Fabio aparece.
// Blocos de no máximo 3 palavras que nunca cruzam o fim de uma frase.
// O bloco fica na tela até o próximo começar: nada de piscar entre palavras.
const MAX_PALAVRAS = 3;

type Bloco = { palavras: Palavra[]; inicioMs: number; fimMs: number };

const montarBlocos = (palavras: Palavra[]): Bloco[] => {
  const blocos: Palavra[][] = [];
  let atual: Palavra[] = [];
  const fecha = () => {
    if (atual.length) blocos.push(atual);
    atual = [];
  };
  palavras.forEach((p) => {
    if (atual.length >= MAX_PALAVRAS) fecha();
    atual.push(p);
    if (/[.!?]$/.test(p.texto)) fecha();
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

const CHAVES = new Set(PALAVRAS_CHAVE.map((p) => p.toLowerCase()));

export const Legenda: React.FC<{
  palavras: Palavra[]; // tempos absolutos, todas as palavras do vídeo
  ativaDeMs: number;
  ativaAteMs: number;
  topo?: number;
  corDestaque?: string;
}> = ({
  palavras,
  ativaDeMs,
  ativaAteMs,
  topo = 1250,
  corDestaque = "#c83c1e",
}) => {
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
          fontSize: 48,
          lineHeight: 1.25,
          color: "#f4f4f4",
          textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 26px rgba(0,0,0,0.75)",
          opacity: entrada,
          transform: `translateY(${(1 - entrada) * 4}px)`,
        }}
      >
        {bloco.palavras.map((p, i) => {
          const dita = agoraMs >= p.inicioMs;
          const atual = dita && agoraMs < p.fimMs + 80;
          const chave = CHAVES.has(p.texto.toLowerCase());
          const pop = atual
            ? 1 + 0.06 * Math.max(0, 1 - (agoraMs - p.inicioMs) / 220)
            : 1;
          return (
            <span
              key={`${p.inicioMs}-${i}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: dita ? 1 : 0.42,
                color: chave && dita ? corDestaque : "#f4f4f4",
                fontWeight: chave ? 800 : 500,
                fontSize: chave ? 60 : 48,
                transform: `scale(${pop})`,
                transformOrigin: "center bottom",
              }}
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
