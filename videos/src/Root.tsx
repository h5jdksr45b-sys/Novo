import React from 'react';
import {Composition} from 'remotion';
import {PerdaoConsolo} from './PerdaoConsolo';

export const Root: React.FC = () => {
  return (
    <Composition
      id="PerdaoConsolo"
      component={PerdaoConsolo}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
