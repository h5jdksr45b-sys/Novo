import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Frame3, FRAME3_DURACAO } from "../Frame3";
import { Frame4, FRAME4_DURACAO } from "../Frame4";
import { Legenda } from "./Legenda";
import dados from "./legenda.json";

// Reel completo da série colagem etapas (52,7 s).
// Clone na mesa, frame 2 remapeado para a fala, frames 3 e 4 ao vivo,
// clone com a etiqueta e clone apontando. Áudio: narração na voz Fabio com
// efeitos baixos (videos/colagem-etapas/montar-reel.py gera mix.wav e
// legenda.json).

const B = dados.blocos as Record<string, number>;
export const REEL_ETAPAS_DURACAO = dados.total;

if (B["4"] - B["3"] !== FRAME3_DURACAO || B["5"] - B["4"] !== FRAME4_DURACAO) {
  throw new Error("Duração dos frames 3 e 4 não bate com legenda.json. Rode montar-reel.py de novo.");
}

const Video: React.FC<{ arquivo: string }> = ({ arquivo }) => (
  <OffthreadVideo src={staticFile(`etapas/${arquivo}`)} muted style={{ width: 1080, height: 1920 }} />
);

export const ReelEtapas: React.FC = () => {
  const f = useCurrentFrame();
  const fimPreto = interpolate(f, [dados.total - 3, dados.total - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={B["1"]} durationInFrames={B["2"] - B["1"]}>
        <Video arquivo="clone-a.mp4" />
      </Sequence>
      <Sequence from={B["2"]} durationInFrames={B["3"] - B["2"]}>
        <Video arquivo="frame2-remap.mp4" />
      </Sequence>
      <Sequence from={B["3"]} durationInFrames={FRAME3_DURACAO}>
        <Frame3 />
      </Sequence>
      <Sequence from={B["4"]} durationInFrames={FRAME4_DURACAO}>
        <Frame4 />
      </Sequence>
      <Sequence from={B["5"]} durationInFrames={B["6"] - B["5"]}>
        <Video arquivo="clone-e.mp4" />
      </Sequence>
      <Sequence from={B["6"]} durationInFrames={dados.total - B["6"]}>
        <Video arquivo="clone-f.mp4" />
      </Sequence>
      <Legenda />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fimPreto }} />
      <Audio src={staticFile("etapas/mix.wav")} />
    </AbsoluteFill>
  );
};
