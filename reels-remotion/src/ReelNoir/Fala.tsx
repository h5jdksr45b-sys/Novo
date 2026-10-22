import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIFA } from "./fontes";
import { tempoDaPalavra, type CenaNoTempo } from "./timeline";
import type { CenaFala } from "./roteiro";

// Camada do Fabio em câmera. Um único take, contínuo, por baixo de tudo:
// o áudio nunca é cortado. O que muda entre cenas é só o enquadramento (punch-in).
export const VideoFala: React.FC<{
  src: string | null;
  pretoEBranco: boolean;
  cenas: CenaNoTempo[];
}> = ({ src, pretoEBranco, cenas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = (frame / fps) * 1000;
  const atual = cenas.find((c) => agoraMs >= c.inicioMs && agoraMs < c.fimMs);
  const plano = atual && atual.tipo === "fala" ? atual.plano : "aberto";
  // Micro-aproximação contínua dentro de cada plano, para a imagem nunca ficar parada.
  const dentro = atual
    ? (agoraMs - atual.inicioMs) / Math.max(1, atual.fimMs - atual.inicioMs)
    : 0;
  const escala = (plano === "fechado" ? 1.16 : 1.0) + dentro * 0.025;
  const filtro = pretoEBranco
    ? "grayscale(1) contrast(1.18) brightness(0.92)"
    : "none";

  if (!src) {
    return (
      <SlateFala
        plano={plano}
        fala={atual && atual.tipo === "fala" ? atual : null}
      />
    );
  }
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <OffthreadVideo
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${escala})`,
          transformOrigin: "50% 38%",
          filter: filtro,
        }}
      />
    </AbsoluteFill>
  );
};

// Sem gravação ainda: placa de demonstração no lugar do Fabio.
const SlateFala: React.FC<{
  plano: "aberto" | "fechado";
  fala: CenaFala | null;
}> = ({ plano, fala }) => {
  const frame = useCurrentFrame();
  const respira = 1 + Math.sin(frame / 18) * 0.01;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 80% 55% at 50% 42%, #2a2a2a 0%, #0c0c0c 70%)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: plano === "fechado" ? 520 : 420,
          height: plano === "fechado" ? 640 : 520,
          borderRadius: "50% 50% 44% 44%",
          background: "linear-gradient(180deg, #3a3a3a, #161616)",
          transform: `translateY(-120px) scale(${respira})`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 26,
          letterSpacing: 5,
          color: "#8a8a8a",
        }}
      >
        FABIO EM CÂMERA · PLANO {plano.toUpperCase()}
      </div>
      {fala ? (
        <div
          style={{
            position: "absolute",
            top: 1500,
            left: 120,
            right: 120,
            textAlign: "center",
            fontFamily: SERIFA,
            fontStyle: "italic",
            fontSize: 28,
            color: "#6f6f6f",
          }}
        >
          demo: substitua pelo take gravado
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const caminhoVideo = (nome: string | null) =>
  nome ? staticFile(nome) : null;

// Texto grande só no momento de ênfase: entra quando a palavra-gatilho é dita e fica até o fim do plano.
export const Enfase: React.FC<{
  cena: CenaNoTempo & CenaFala;
  corDestaque: string;
}> = ({ cena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!cena.enfase) return null;
  const agoraMs = (frame / fps) * 1000;
  const gatilhoMs =
    tempoDaPalavra(cena.palavras, cena.enfase.gatilho) ?? cena.inicioMs;
  if (agoraMs < gatilhoMs || agoraMs >= cena.fimMs) return null;
  const p = interpolate(agoraMs - gatilhoMs, [0, 260], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const posicao = cena.enfase.posicao ?? "alto";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          ...(posicao === "alto" ? { top: 300 } : { bottom: 560 }),
          textAlign: "center",
          fontFamily: SERIFA,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1.05,
          color: "#f4f4f4",
          textShadow:
            "0 0 26px rgba(255,255,255,0.25), 0 4px 18px rgba(0,0,0,0.8)",
          opacity: p,
          letterSpacing: `${(1 - p) * 6}px`,
          transform: `translateY(${(1 - p) * 28}px) scale(${0.96 + p * 0.04})`,
        }}
      >
        {cena.enfase.texto.split(" ").map((palavra, k, todas) => {
          const ultima = k === todas.length - 1;
          return (
            <span
              key={k}
              style={{
                color: ultima ? "transparent" : "#f4f4f4",
                WebkitTextStroke: ultima ? "2px #f4f4f4" : "0",
                textShadow: ultima ? "none" : undefined,
              }}
            >
              {palavra}
              {ultima ? "" : " "}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
