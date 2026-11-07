import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GrainOverlay } from "./components/GrainOverlay";
import { KraftBackground } from "./components/KraftBackground";
import { PaperWipe } from "./components/PaperWipe";
import { Scene1Ficha } from "./scenes/Scene1Ficha";
import { Scene2Porta } from "./scenes/Scene2Porta";
import { Scene3Funil } from "./scenes/Scene3Funil";
import { FREEZE_AT, Scene4Livro } from "./scenes/Scene4Livro";

export type MainProps = { audioSrc?: string };

export const FPS = 30;
export const DURATION = 25 * FPS;
const S1 = 0;
const S2 = 6 * FPS;
const S3 = 12 * FPS;
const S4 = 20 * FPS;

export const Main: React.FC<MainProps> = ({ audioSrc }) => (
  <AbsoluteFill>
    <KraftBackground />
    <Sequence from={S1} durationInFrames={S2 - S1} name="1 Ficha">
      <Scene1Ficha />
    </Sequence>
    <Sequence from={S2} durationInFrames={S3 - S2} name="2 Porta giratoria">
      <Scene2Porta />
    </Sequence>
    <Sequence from={S3} durationInFrames={S4 - S3} name="3 Funil">
      <Scene3Funil />
    </Sequence>
    <Sequence from={S4} durationInFrames={DURATION - S4} name="4 Livro">
      <Scene4Livro />
    </Sequence>
    <PaperWipe cuts={[S2, S3, S4]} />
    <GrainOverlay frozenAt={S4 + FREEZE_AT} />
    {audioSrc ? <Audio src={/^https?:\/\//.test(audioSrc) ? audioSrc : staticFile(audioSrc)} /> : null}
  </AbsoluteFill>
);
