import React from "react";
import { Composition } from "remotion";
import { FPS, Main, MainProps } from "./Main";
import { NARRATED, SILENT } from "./lib/timing";

const silent: MainProps = {};
const narrated: MainProps = { narrated: true, audioSrc: "narracao-14lufs.wav" };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="BorderlineNoCapsVertical" component={Main} durationInFrames={SILENT.total} fps={FPS} width={1080} height={1920} defaultProps={silent} />
    <Composition id="BorderlineNoCapsHorizontal" component={Main} durationInFrames={SILENT.total} fps={FPS} width={1920} height={1080} defaultProps={silent} />
    <Composition id="BorderlineNoCapsVerticalNarrado" component={Main} durationInFrames={NARRATED.total} fps={FPS} width={1080} height={1920} defaultProps={narrated} />
    <Composition id="BorderlineNoCapsHorizontalNarrado" component={Main} durationInFrames={NARRATED.total} fps={FPS} width={1920} height={1080} defaultProps={narrated} />
  </>
);
