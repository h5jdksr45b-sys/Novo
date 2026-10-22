import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const DESLIZE_FRAMES = 9;

// Para cada um dos 4 primeiros frames: faixas horizontais [topo%, altura%, deslocamento px].
const FATIAS_GLITCH: [number, number, number][][] = [
  [
    [8, 9, 46],
    [41, 6, -38],
    [70, 12, 28],
  ],
  [
    [18, 5, -52],
    [52, 10, 34],
    [84, 7, -22],
  ],
  [
    [30, 7, 24],
    [61, 4, -30],
  ],
  [[47, 5, 14]],
];

// Imagem estática com zoom contínuo e muito lento (2 a 5% por plano).
// Nunca para. Sem easing visível: a câmera está sempre em movimento.
export const KenBurns: React.FC<{
  src: string;
  movimento: "aproxima" | "afasta";
  duracaoFrames: number;
  pretoEBranco?: boolean;
  deslocamento?: number; // px de deriva lateral
  escurecer?: "alto" | "baixo"; // lado em que o texto vai ficar: recebe um degradê escuro
  deslizeEntrada?: boolean; // entra empurrando o plano anterior, da direita para a esquerda
  glitch?: boolean; // 4 frames de fatias deslocadas no corte (junto do flash)
}> = ({
  src,
  movimento,
  duracaoFrames,
  pretoEBranco = true,
  deslocamento = 36,
  escurecer,
  deslizeEntrada = false,
  glitch = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progresso = interpolate(
    frame,
    [0, Math.max(duracaoFrames, fps)],
    [0, 1],
    {
      extrapolateRight: "clamp",
    },
  );
  const escala =
    movimento === "aproxima" ? 1.04 + progresso * 0.05 : 1.1 - progresso * 0.05;
  const x = (movimento === "aproxima" ? -1 : 1) * progresso * deslocamento;
  const empurrao = deslizeEntrada
    ? interpolate(frame, [0, DESLIZE_FRAMES], [1080, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;
  const fatias = glitch && frame < 4 ? FATIAS_GLITCH[frame] : null;
  const filtro = pretoEBranco
    ? "grayscale(1) contrast(1.2) brightness(0.94)"
    : "contrast(1.1) brightness(0.92)";
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#050505",
        transform: `translateX(${empurrao}px)`,
      }}
    >
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
      {fatias
        ? fatias.map(([topo, altura, dx], k) => (
            <Img
              key={k}
              src={staticFile(src)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${escala}) translateX(${x + dx}px)`,
                transformOrigin: "50% 45%",
                filter: filtro,
                clipPath: `inset(${topo}% 0 ${100 - topo - altura}% 0)`,
              }}
            />
          ))
        : null}
      {escurecer ? (
        <AbsoluteFill
          style={{
            background:
              escurecer === "alto"
                ? "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 55%)"
                : "linear-gradient(0deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.35) 32%, rgba(0,0,0,0) 58%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
