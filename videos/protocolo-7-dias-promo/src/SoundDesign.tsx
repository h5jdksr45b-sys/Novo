import {Audio} from '@remotion/media';
import {Sequence, staticFile} from 'remotion';

// Desenho de som sintetizado (public/sfx), discreto para ficar por baixo de uma futura narração.
const CORTES = [180, 360, 480, 1110, 1230, 1380, 1515]; // inicio de cada cena
const DIAS = [0, 1, 2, 3, 4, 5, 6].map((i) => 480 + i * 90 + 4);

export const SoundDesign: React.FC = () => (
  <>
    <Sequence name="Drone" from={0} durationInFrames={1620}>
      <Audio src={staticFile('sfx/drone.wav')} volume={0.55} />
    </Sequence>
    {CORTES.map((f) => (
      <Sequence key={`s${f}`} name={`Sopro ${f}`} from={f - 14} durationInFrames={30}>
        <Audio src={staticFile('sfx/sopro.wav')} volume={0.35} />
      </Sequence>
    ))}
    {DIAS.map((f, i) => (
      <Sequence key={`t${f}`} name={`Tique dia ${i + 1}`} from={f} durationInFrames={10}>
        <Audio src={staticFile('sfx/tique.wav')} volume={0.45} />
      </Sequence>
    ))}
    <Sequence name="Impacto 7" from={364} durationInFrames={48}>
      <Audio src={staticFile('sfx/impacto.wav')} volume={0.7} />
    </Sequence>
    <Sequence name="Impacto COMEÇAR" from={1521} durationInFrames={48}>
      <Audio src={staticFile('sfx/impacto.wav')} volume={0.6} />
    </Sequence>
  </>
);
