import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GrainOverlay } from "./components/GrainOverlay";
import { KraftBackground } from "./components/KraftBackground";
import { PaperWipe } from "./components/PaperWipe";
import { NARRATED, SILENT, TimingCtx } from "./lib/timing";
import { Scene0Abertura } from "./scenes/Scene0Abertura";
import { Scene1Ficha } from "./scenes/Scene1Ficha";
import { Scene2Porta } from "./scenes/Scene2Porta";
import { Scene3Funil } from "./scenes/Scene3Funil";
import { Scene4Livro } from "./scenes/Scene4Livro";

export type MainProps = {
  /** Arquivo em public/ ou URL. */
  audioSrc?: string;
  /** Usa os tempos medidos da narracao em vez dos tempos da versao muda. */
  narrated?: boolean;
};

export const FPS = 30;

export const Main: React.FC<MainProps> = ({ audioSrc, narrated }) => {
  const t = narrated ? NARRATED : SILENT;
  return (
    <TimingCtx.Provider value={t}>
      <AbsoluteFill>
        <KraftBackground />
        {t.s1 > 0 ? (
          <Sequence from={0} durationInFrames={t.s1} name="0 Abertura formal">
            <Scene0Abertura />
          </Sequence>
        ) : null}
        <Sequence from={t.s1} durationInFrames={t.s2 - t.s1} name="1 Ficha">
          <Scene1Ficha />
        </Sequence>
        <Sequence from={t.s2} durationInFrames={t.s3 - t.s2} name="2 Porta giratoria">
          <Scene2Porta />
        </Sequence>
        <Sequence from={t.s3} durationInFrames={t.s4 - t.s3} name="3 Funil">
          <Scene3Funil />
        </Sequence>
        <Sequence from={t.s4} durationInFrames={t.total - t.s4} name="4 Livro">
          <Scene4Livro />
        </Sequence>
        <PaperWipe cuts={[t.s1, t.s2, t.s3, t.s4].filter((c) => c > 0)} />
        <GrainOverlay frozenAt={t.s4 + t.sc4.freezeAt} />
        {audioSrc ? (
          <Sequence from={t.audioFrom} name="Narracao">
            <Audio src={/^https?:\/\//.test(audioSrc) ? audioSrc : staticFile(audioSrc)} />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    </TimingCtx.Provider>
  );
};
