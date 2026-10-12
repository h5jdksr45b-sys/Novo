import React from 'react';
import { Composition } from 'remotion';
import { TPBCerebro } from './TPBCerebro';
import { FPS } from './theme';

export const Root: React.FC = () => (
  <Composition
    id="TPBCerebro"
    component={TPBCerebro}
    durationInFrames={600}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
