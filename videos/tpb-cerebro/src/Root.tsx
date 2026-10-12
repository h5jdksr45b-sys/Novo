import React from 'react';
import { Composition } from 'remotion';
import { TPBCerebro } from './TPBCerebro';
import { FPS } from './theme';
import { Cover } from './Cover';

export const Root: React.FC = () => (
  <>
  <Composition id="Capa" component={Cover} durationInFrames={300} fps={FPS} width={1080} height={1920} />
  <Composition
    id="TPBCerebro"
    component={TPBCerebro}
    durationInFrames={600}
    fps={FPS}
    width={1080}
    height={1920}
  />
  </>
);
