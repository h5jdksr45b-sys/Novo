import React, { useEffect } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { DISPLAY, SANS, carregarFontes } from "./fontes";

// Capa do Reel. O texto fica dentro do recorte 3:4 do perfil (y de 240 a 1680).
export const CapaReelNoir: React.FC<{ corDestaque: string }> = ({
  corDestaque,
}) => {
  useEffect(() => {
    carregarFontes();
  }, []);
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Img
        src={staticFile("reel-noir/capa-base.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "contrast(1.08) saturate(0.9) brightness(0.95)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 22%, rgba(0,0,0,0.15) 48%, rgba(0,0,0,0) 60%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 40%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1080,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 8,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 26,
          }}
        >
          QUEM ESTÁ MENTINDO?
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 150,
            lineHeight: 1,
            letterSpacing: 2,
            color: "#f4f4f4",
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          MESMA BRIGA,
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 18,
            padding: "6px 24px 2px",
            background: corDestaque,
            fontFamily: DISPLAY,
            fontSize: 124,
            lineHeight: 1,
            letterSpacing: 2,
            color: "#f4f4f4",
            whiteSpace: "nowrap",
          }}
        >
          DUAS MEMÓRIAS
        </div>
      </div>
    </AbsoluteFill>
  );
};
