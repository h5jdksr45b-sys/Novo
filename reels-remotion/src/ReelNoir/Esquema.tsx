import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS, SERIFA } from "./fontes";
import { tempoDaPalavra, type Palavra } from "./timeline";

// Momento de explicação: a atenção estreita quando a gente fica fissurado na briga.
// Vários detalhes da mesma cena estão espalhados na tela. Quando o Fabio diz "estreitos",
// a abertura fecha em volta de um só, o que pareceu ameaça. O resto some ("quase nada do resto").
// Cada fase dispara na palavra em que é dita.
const DETALHES: { texto: string; x: number; y: number; ameaca?: boolean }[] = [
  { texto: "a hora", x: 250, y: 560 },
  { texto: "o lugar", x: 790, y: 600 },
  { texto: "o tom de voz", x: 300, y: 760 },
  { texto: "a palavra", x: 540, y: 900, ameaca: true },
  { texto: "o olhar", x: 820, y: 1040 },
  { texto: "o que veio antes", x: 300, y: 1140 },
  { texto: "o silêncio depois", x: 700, y: 1280 },
];

export const Esquema: React.FC<{
  palavras: Palavra[];
  inicioCenaMs: number;
  fimCenaMs: number;
  corDestaque: string;
}> = ({ palavras, inicioCenaMs, fimCenaMs, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = inicioCenaMs + (frame / fps) * 1000;
  const dur = fimCenaMs - inicioCenaMs;
  const t = (alvo: string, padrao: number) =>
    tempoDaPalavra(palavras, alvo) ?? inicioCenaMs + dur * padrao;
  const tEstreitos = t("estreitos", 0.3);
  const tAmeaca = t("ameaça", 0.55);
  const tResto = t("resto.", 0.7);
  const tQualquer = t("qualquer", 0.88);

  const desde = (ms: number) =>
    Math.max(0, Math.round(((agoraMs - ms) / 1000) * fps));
  const mola = (ms: number) =>
    agoraMs < ms
      ? 0
      : spring({
          frame: desde(ms),
          fps,
          config: { damping: 20, stiffness: 90, mass: 1 },
        });
  const suave = (ms: number, s = 0.4) =>
    agoraMs < ms
      ? 0
      : interpolate(desde(ms), [0, fps * s], [0, 1], {
          extrapolateRight: "clamp",
        });

  const entrada = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fecha = mola(tEstreitos); // abertura da atenção fechando
  const marcaAmeaca = suave(tAmeaca, 0.3);
  const someResto = suave(tResto, 0.5);
  const qualquer = suave(tQualquer, 0.4);

  const alvo = DETALHES.find((d) => d.ameaca)!;
  const raio = interpolate(fecha, [0, 1], [1400, 230]);

  return (
    <AbsoluteFill style={{ background: "#070707" }}>
      {/* a palavra de fundo é inserida pelo index por cima deste fundo e por baixo do texto, via ordem de camadas */}
      {DETALHES.map((d, i) => {
        const apareceu = interpolate(
          frame,
          [i * 4, i * 4 + fps * 0.45],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          },
        );
        const lado = d.x < 540 ? -1 : 1;
        const dist = Math.hypot(d.x - alvo.x, d.y - alvo.y);
        const foraDaAbertura = dist > raio;
        const opacidade = d.ameaca
          ? 1
          : foraDaAbertura
            ? 0.18 * (1 - someResto)
            : 1 - someResto * 0.6;
        return (
          <div
            key={d.texto}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              transform: `translate(-50%, -50%) translateX(${(1 - apareceu) * lado * 60}px) scale(${d.ameaca ? 1 + marcaAmeaca * 0.18 : 1})`,
              opacity: apareceu * opacidade,
              fontFamily: SERIFA,
              fontStyle: "italic",
              fontSize: d.ameaca ? 64 : 46,
              color: "#f2f2f2",
              whiteSpace: "nowrap",
              background:
                d.ameaca && marcaAmeaca > 0 ? corDestaque : "transparent",
              padding: d.ameaca ? "4px 18px" : 0,
              textShadow:
                d.ameaca && marcaAmeaca > 0
                  ? "none"
                  : "0 0 20px rgba(255,255,255,0.25)",
            }}
          >
            {d.texto}
          </div>
        );
      })}

      {/* abertura da atenção: tudo fora do círculo escurece */}
      <AbsoluteFill
        style={{
          opacity: entrada,
          background: `radial-gradient(circle ${raio}px at ${alvo.x}px ${alvo.y}px, rgba(0,0,0,0) ${Math.max(0, raio - 90)}px, rgba(0,0,0,0.88) ${raio}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1500,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 30,
          letterSpacing: 3,
          color: "#9a9a9a",
          opacity: qualquer,
        }}
      >
        ACONTECE COM QUALQUER PESSOA
      </div>
    </AbsoluteFill>
  );
};
