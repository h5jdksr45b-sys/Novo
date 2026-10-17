import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COR, FONTE, SEGURA } from "./tema";

const suave = Easing.bezier(0.22, 1, 0.36, 1);

// 0 a 1 entre o frame de início e o fim, com saída suave.
export const progresso = (frame: number, inicio: number, duracao: number) =>
  interpolate(frame, [inicio, inicio + duracao], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: suave,
  });

// Entrada simples: fade com deslize curto para cima.
export const Entra: React.FC<{
  em: number;
  duracao?: number;
  deslize?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ em, duracao = 18, deslize = 24, style, children }) => {
  const frame = useCurrentFrame();
  const p = progresso(frame, em, duracao);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * deslize}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Cena dentro da área segura, com fade de entrada e saída.
export const Cena: React.FC<{
  semSaida?: boolean;
  alinhar?: React.CSSProperties["justifyContent"];
  children: React.ReactNode;
}> = ({ semSaida, alinhar = "center", children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const entrada = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const saida = semSaida
    ? 1
    : interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
      });
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entrada, saida),
        paddingLeft: SEGURA.esquerda,
        paddingRight: SEGURA.direita,
        paddingTop: SEGURA.topo,
        paddingBottom: SEGURA.base,
        display: "flex",
        flexDirection: "column",
        justifyContent: alinhar,
        alignItems: "center",
        fontFamily: FONTE,
        color: COR.texto,
        textAlign: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Contorno da área segura, só para conferência.
export const GuiaAreaSegura: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: SEGURA.esquerda,
        right: SEGURA.direita,
        top: SEGURA.topo,
        bottom: SEGURA.base,
        border: "3px dashed #FF3B3B",
      }}
    />
  </AbsoluteFill>
);
