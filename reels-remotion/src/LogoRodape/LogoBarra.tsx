import { useEffect } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Anton, loadAnton } from "../load-font";
import { BRANCO, CINZA, DURACAO_LOGO, HANDLE, VERMELHO, entrada, fadeFinal } from "./shared";

// Opção A: barra vermelha corta o quadro, o @ é revelado da esquerda para a
// direita e uma linha fina com o nome da marca aparece por baixo.
// Fundo transparente: renderizar em WebM com alpha ou ProRes 4444.

export const LogoBarra: React.FC<{ margemInferior?: number }> = ({
  margemInferior = 330,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  useEffect(() => {
    loadAnton();
  }, []);

  const barraAltura = entrada(frame, 0, 14);
  const revela = interpolate(frame, [8, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.2, 1),
  });
  const marcaOp = entrada(frame, 26, 40);
  const marcaY = entrada(frame, 26, 40, 14, 0);

  return (
    <AbsoluteFill style={{ opacity: fadeFinal(frame, durationInFrames || DURACAO_LOGO) }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: margemInferior,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 10,
              height: 84,
              background: VERMELHO,
              transformOrigin: "bottom",
              transform: `scaleY(${barraAltura})`,
            }}
          />
          <div
            style={{
              fontFamily: Anton,
              fontSize: 76,
              letterSpacing: 2,
              color: BRANCO,
              clipPath: `inset(0 ${100 - revela}% 0 0)`,
              textShadow: "0 3px 14px rgba(0,0,0,0.55)",
            }}
          >
            {HANDLE}
          </div>
        </div>
        <div
          style={{
            fontFamily: Anton,
            fontSize: 28,
            letterSpacing: 9,
            color: CINZA,
            opacity: marcaOp,
            transform: `translateY(${marcaY}px)`,
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          BORDERLINE SEM ESTIGMA
        </div>
      </div>
    </AbsoluteFill>
  );
};
