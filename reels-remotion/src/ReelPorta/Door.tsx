import React from "react";
import { COLORS } from "../Reel7Dias/theme";

export const DOOR = { width: 300, height: 560, top: 300 };

// Porta vista de frente, em traço creme. `angle` é a abertura da folha
// em graus (0 = fechada). `glow` de 0 a 1 desenha a linha vermelha na fresta.
export const Door: React.FC<{
  readonly angle: number;
  readonly glow: number;
  readonly style?: React.CSSProperties;
}> = ({ angle, glow, style }) => {
  const { width, height, top } = DOOR;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - width / 2,
        top,
        width,
        height,
        ...style,
      }}
    >
      {/* Batente: três lados. */}
      <div
        style={{
          position: "absolute",
          inset: -18,
          bottom: 0,
          border: `6px solid ${COLORS.cream}`,
          borderBottom: "none",
          borderRadius: "6px 6px 0 0",
          opacity: 0.55,
        }}
      />
      {/* Vão escuro atrás da folha. */}
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "#141414" }}
      />
      {/* Folha da porta, presa à esquerda. */}
      <div style={{ position: "absolute", inset: 0, perspective: 1100 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: COLORS.black,
            border: `6px solid ${COLORS.cream}`,
            borderRadius: 4,
            transformOrigin: "left center",
            rotate: `y ${-angle}deg`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 36,
              right: 36,
              top: 40,
              height: 200,
              border: `4px solid ${COLORS.cream}`,
              opacity: 0.45,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 36,
              right: 36,
              top: 280,
              height: 220,
              border: `4px solid ${COLORS.cream}`,
              opacity: 0.45,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 30,
              top: 262,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: COLORS.cream,
            }}
          />
        </div>
      </div>
      {/* Chão e a luz vermelha que corre pela fresta de baixo. */}
      <div
        style={{
          position: "absolute",
          left: -60,
          right: -60,
          top: height + 4,
          height: 4,
          backgroundColor: COLORS.cream,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: height + 2,
          height: 8,
          width: width * glow,
          backgroundColor: COLORS.red,
          borderRadius: 4,
          boxShadow: `0 0 24px 6px ${COLORS.red}`,
        }}
      />
    </div>
  );
};

// Cabeça e ombros em traço dourado.
export const Silhouette: React.FC<{ readonly style?: React.CSSProperties }> = ({
  style,
}) => (
  <svg
    width={260}
    height={300}
    viewBox="0 0 260 300"
    fill="none"
    stroke={COLORS.gold}
    strokeWidth={7}
    strokeLinecap="round"
    style={{ position: "absolute", ...style }}
  >
    <circle cx={130} cy={90} r={62} />
    <path d="M 20 296 C 20 210 70 176 130 176 C 190 176 240 210 240 296" />
  </svg>
);
