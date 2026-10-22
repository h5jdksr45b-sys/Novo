import React from "react";
import {
  Audio,
  Sequence,
  getStaticFiles,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { CenaNoTempo } from "./timeline";

// Desenho de som no padrão das referências:
// - cama grave contínua, baixa, por baixo da voz;
// - riser (sopro agudo) terminando exatamente no corte para B-roll ou esquema;
// - impacto grave nos cortes marcados com flash.
// Os arquivos em public/sfx foram extraídos dos trechos sem narração dos vídeos de referência
// (cama grave filtrada abaixo de 70 Hz, riser e impacto do encerramento). Troque por biblioteca licenciada se preferir.
const existe = (arquivo: string) =>
  getStaticFiles().some((f) => f.name === arquivo);

export const Sfx: React.FC<{
  cenas: CenaNoTempo[];
  duracaoMs: number;
  volume: number;
}> = ({ cenas, duracaoMs, volume }) => {
  const { fps } = useVideoConfig();
  const paraFrame = (ms: number) => Math.max(0, Math.round((ms / 1000) * fps));
  const temDrone = existe("sfx/drone.wav");
  const temRiser = existe("sfx/riser.wav");
  const temImpacto = existe("sfx/impacto.wav");
  const RISER_MS = 1450;

  return (
    <>
      {temDrone ? (
        <Audio
          src={staticFile("sfx/drone.wav")}
          volume={(f) => {
            const totalFrames = paraFrame(duracaoMs);
            const fadeIn = Math.min(1, f / (fps * 1.5));
            const fadeOut = Math.min(
              1,
              Math.max(0, (totalFrames - f) / (fps * 2)),
            );
            return volume * 0.55 * fadeIn * fadeOut;
          }}
          loop
        />
      ) : null}
      {cenas.map((c, i) => {
        if (i === 0 || (c.tipo !== "broll" && c.tipo !== "esquema"))
          return null;
        const anterior = cenas[i - 1];
        const cortaDeFala = anterior.tipo === "fala";
        const riser = temRiser && cortaDeFala;
        const impacto = temImpacto && c.tipo === "broll" && c.impacto;
        return (
          <React.Fragment key={c.id}>
            {riser ? (
              <Sequence
                from={paraFrame(c.inicioMs - RISER_MS)}
                durationInFrames={paraFrame(RISER_MS) + 2}
              >
                <Audio
                  src={staticFile("sfx/riser.wav")}
                  volume={volume * 0.7}
                />
              </Sequence>
            ) : null}
            {impacto ? (
              <Sequence from={paraFrame(c.inicioMs)} durationInFrames={fps * 2}>
                <Audio
                  src={staticFile("sfx/impacto.wav")}
                  volume={volume * 0.8}
                />
              </Sequence>
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};
