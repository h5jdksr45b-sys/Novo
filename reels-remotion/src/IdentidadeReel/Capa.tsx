import { useEffect } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadIdentidadeFonts, SANS, SERIF } from "./fonts";

// Capa do reel. O texto fica dentro do recorte 4:5 que aparece na grade
// do perfil (faixa de y 285 a 1635).
export const CapaIdentidade: React.FC = () => {
  useEffect(() => {
    loadIdentidadeFonts();
  }, []);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d" }}>
      <Img
        src={staticFile("identidade/capa_quadro.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.08) saturate(0.85)" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.85) 85%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 70,
          right: 70,
          textAlign: "center",
          color: "white",
          textShadow: "0 6px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 128, lineHeight: 1 }}>
          Você pega o jeito
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 104, letterSpacing: -4, lineHeight: 1.1, marginTop: 10 }}>
          de quem está{" "}
          <span style={{ backgroundColor: "#c83c1e", padding: "0 16px" }}>perto?</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
