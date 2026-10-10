import React from 'react';
import {Composition} from 'remotion';
import {PerdaoConsolo} from './PerdaoConsolo';
import {Longe} from './Longe';
import {LongeV2, V2_DURATION} from './LongeV2';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="PerdaoConsolo"
        component={PerdaoConsolo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Longe"
        component={Longe}
        durationInFrames={1242}
        fps={25}
        width={1080}
        height={1920}
      />
      <Composition
        id="LongeV2"
        component={LongeV2}
        durationInFrames={V2_DURATION}
        fps={25}
        width={1080}
        height={1920}
      />
    </>
  );
};
