import React from "react";
import {
  Audio,
  Sequence,
  getStaticFiles,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { CenaNoTempo } from "./timeline";

// Desenho de som:
// - trilha (public/sfx/trilha.wav), já recortada e nivelada para ficar uns 15 dB abaixo da voz.
//   Recorte: começa em 12,97 s da faixa original, para a mudança de seção dela cair
//   no início do esquema. Sem trilha, usa a cama grave antiga (drone.wav), se existir.
// - impacto grave nos cortes marcados com flash, baixo.
const existe = (arquivo: string) =>
  getStaticFiles().some((f) => f.name === arquivo);

export const Sfx: React.FC<{
  cenas: CenaNoTempo[];
  duracaoMs: number;
  volume: number; // impactos
  volumeTrilha: number;
}> = ({ cenas, duracaoMs, volume, volumeTrilha }) => {
  const { fps } = useVideoConfig();
  const paraFrame = (ms: number) => Math.max(0, Math.round((ms / 1000) * fps));
  const totalFrames = paraFrame(duracaoMs);
  const temTrilha = existe("sfx/trilha.wav");
  const temDrone = !temTrilha && existe("sfx/drone.wav");
  const temImpacto = existe("sfx/impacto.wav");
  const fade = (f: number) =>
    Math.min(1, f / (fps * 0.4)) *
    Math.min(1, Math.max(0, (totalFrames - f) / (fps * 1.5)));

  return (
    <>
      {temTrilha ? (
        <Audio
          src={staticFile("sfx/trilha.wav")}
          volume={(f) => volumeTrilha * fade(f)}
        />
      ) : null}
      {temDrone ? (
        <Audio
          src={staticFile("sfx/drone.wav")}
          volume={(f) => volume * 0.55 * fade(f)}
          loop
        />
      ) : null}
      {cenas.map((c) => {
        if (!(temImpacto && c.tipo === "broll" && c.impacto)) return null;
        return (
          <Sequence
            key={c.id}
            from={paraFrame(c.inicioMs)}
            durationInFrames={fps * 2}
          >
            <Audio src={staticFile("sfx/impacto.wav")} volume={volume * 0.5} />
          </Sequence>
        );
      })}
    </>
  );
};
