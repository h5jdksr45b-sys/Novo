import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./fontes";
import type { Palavra } from "./timeline";

// Legenda pequena, em sans, abaixo do queixo. Só nos planos em que o Fabio aparece.
// Nos planos de B-roll a tipografia grande já é a legenda.
export const Legenda: React.FC<{
  palavras: Palavra[]; // tempos absolutos, todas as palavras do vídeo
  ativaDeMs: number;
  ativaAteMs: number;
  topo?: number;
}> = ({ palavras, ativaDeMs, ativaAteMs, topo = 1240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = (frame / fps) * 1000;

  const paginas = useMemo(() => {
    const captions: Caption[] = palavras.map((p) => ({
      text: ` ${p.texto}`,
      startMs: p.inicioMs,
      endMs: p.fimMs,
      timestampMs: null,
      confidence: null,
    }));
    return createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 1100 }).pages;
  }, [palavras]);

  if (agoraMs < ativaDeMs || agoraMs >= ativaAteMs) return null;
  const pagina = paginas.find((pg) => agoraMs >= pg.startMs && agoraMs < pg.startMs + pg.durationMs);
  if (!pagina) return null;
  const entrada = interpolate(agoraMs - pagina.startMs, [0, 80], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: topo,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.25,
          color: "#f2f2f2",
          textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.7)",
          opacity: entrada,
          transform: `translateY(${(1 - entrada) * 4}px)`,
        }}
      >
        {pagina.tokens.map((t, i) => {
          const dita = agoraMs >= t.fromMs;
          return (
            <span key={`${t.fromMs}-${i}`} style={{ opacity: dita ? 1 : 0.45, whiteSpace: "pre" }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
