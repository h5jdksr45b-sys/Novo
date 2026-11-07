import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS, Main, MainProps } from "./Main";

const defaults: MainProps = {};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BorderlineNoCapsVertical"
      component={Main}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaults}
    />
    <Composition
      id="BorderlineNoCapsHorizontal"
      component={Main}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={defaults}
    />
  </>
);
