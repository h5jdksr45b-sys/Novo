import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIFA } from "./fontes";

// Palavra gigante atrás da imagem, cortada pelo quadro, deslizando devagar (padrão "SKILLS" / "implementing").
export const PalavraFundo: React.FC<{
  texto: string;
  duracaoFrames: number;
  vazada?: boolean;
  y?: number;
}> = ({ texto, duracaoFrames, vazada = false, y = 980 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = interpolate(frame, [0, Math.max(duracaoFrames, fps)], [80, -220], {
    extrapolateRight: "clamp",
  });
  const entrada = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: y,
          transform: `translate(${x + (1 - entrada) * 120}px, -50%)`,
          fontFamily: SERIFA,
          fontWeight: 900,
          fontSize: 440,
          lineHeight: 1,
          letterSpacing: -12,
          whiteSpace: "nowrap",
          color: vazada ? "transparent" : "rgba(255,255,255,0.07)",
          WebkitTextStroke: vazada ? "2px rgba(255,255,255,0.22)" : "0",
          opacity: entrada,
          mixBlendMode: "screen",
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

// Etiquetas minúsculas nos cantos e linha fina de moldura (padrão cartaz editorial).
export const Moldura: React.FC<{
  esquerda: string;
  direita: string;
  rodape: string;
  comLinha?: boolean;
}> = ({ esquerda, direita, rodape, comLinha = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });
  const etiqueta: React.CSSProperties = {
    position: "absolute",
    fontFamily: SANS,
    fontWeight: 500,
    fontSize: 19,
    letterSpacing: 3,
    color: "rgba(255,255,255,0.5)",
    textShadow: "0 1px 4px rgba(0,0,0,0.7)",
    opacity: t,
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {comLinha ? (
        <div
          style={{
            position: "absolute",
            inset: 44,
            border: "1px solid rgba(255,255,255,0.16)",
            transform: `scaleY(${t})`,
            transformOrigin: "top",
          }}
        />
      ) : null}
      <div style={{ ...etiqueta, left: 64, top: 64 }}>{esquerda}</div>
      <div style={{ ...etiqueta, right: 64, top: 64, textAlign: "right" }}>
        {direita}
      </div>
      <div style={{ ...etiqueta, right: 64, bottom: 64, textAlign: "right" }}>
        {rodape}
      </div>
    </AbsoluteFill>
  );
};
