import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// Flash de 3 frames no corte: frame 0 invertido, depois decai. Marca a batida.
export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 2) return null;
  const opacidade = [1, 0.55, 0.2][frame];
  return (
    <AbsoluteFill
      style={{
        background: "#fff",
        mixBlendMode: frame === 0 ? "difference" : "screen",
        opacity: opacidade,
        pointerEvents: "none",
      }}
    />
  );
};
