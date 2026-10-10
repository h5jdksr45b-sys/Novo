import React from 'react';
import {Composition} from 'remotion';
import {PerdaoConsolo} from './PerdaoConsolo';
import {Longe} from './Longe';
import {LongeV2, V2_DURATION} from './LongeV2';
import {Video2, V2_FRAMES} from './Video2';
import {CursoTPB, CURSO_FRAMES} from './CursoTPB';
import {DilemaTPB, DILEMA_FRAMES} from './DilemaTPB';
import {EscalonadoTPB, ESCALONADO_FRAMES} from './EscalonadoTPB';

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
      <Composition
        id="Video2"
        component={Video2}
        durationInFrames={V2_FRAMES}
        fps={24}
        width={1080}
        height={1920}
      />
      <Composition
        id="CursoTPB"
        component={CursoTPB}
        durationInFrames={CURSO_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="DilemaTPB" component={DilemaTPB} durationInFrames={DILEMA_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EscalonadoTPB" component={EscalonadoTPB} durationInFrames={ESCALONADO_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};
