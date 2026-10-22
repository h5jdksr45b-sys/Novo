import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Imagem estática com zoom contínuo e muito lento (2 a 5% por plano).
// Nunca para. Sem easing visível: a câmera está sempre em movimento.
export const KenBurns: React.FC<{
  src: string;
  movimento: "aproxima" | "afasta";
  duracaoFrames: number;
  pretoEBranco?: boolean;
  deslocamento?: number; // px de deriva lateral
}> = ({ src, movimento, duracaoFrames, pretoEBranco = true, deslocamento = 14 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progresso = interpolate(frame, [0, Math.max(duracaoFrames, fps)], [0, 1], {
    extrapolateRight: "clamp",
  });
  const escala = movimento === "aproxima" ? 1.04 + progresso * 0.05 : 1.1 - progresso * 0.05;
  const x = (movimento === "aproxima" ? -1 : 1) * progresso * deslocamento;
  const filtro = pretoEBranco ? "grayscale(1) contrast(1.22) brightness(0.88)" : "contrast(1.1) brightness(0.9)";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#050505" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${escala}) translateX(${x}px)`,
          transformOrigin: "50% 45%",
          filter: filtro,
        }}
      />
    </AbsoluteFill>
  );
};
