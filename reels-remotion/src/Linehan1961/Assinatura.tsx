import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIFA } from "./fontes";
import { ASSINATURA } from "./roteiro";

export const Assinatura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = (atraso: number) =>
    interpolate(frame, [atraso, atraso + fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sobe = (atraso: number) => (1 - entra(atraso)) * 14;
  return (
    <AbsoluteFill style={{ background: "#050505", alignItems: "center", justifyContent: "center", color: "#f2f2f2" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: SERIFA,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 60,
            opacity: entra(2),
            transform: `translateY(${sobe(2)}px)`,
          }}
        >
          {ASSINATURA.nome}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 4,
            marginTop: 16,
            opacity: entra(8),
            transform: `translateY(${sobe(8)}px)`,
            color: "#bdbdbd",
          }}
        >
          {ASSINATURA.registro.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 30,
            marginTop: 10,
            opacity: entra(12),
            transform: `translateY(${sobe(12)}px)`,
            color: "#bdbdbd",
          }}
        >
          {ASSINATURA.titulo}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 24,
            marginTop: 60,
            opacity: entra(20) * 0.7,
            color: "#8a8a8a",
          }}
        >
          {ASSINATURA.rodape}
        </div>
      </div>
    </AbsoluteFill>
  );
};
