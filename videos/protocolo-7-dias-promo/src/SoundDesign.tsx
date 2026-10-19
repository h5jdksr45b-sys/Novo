import {Audio} from '@remotion/media';
import {Sequence, staticFile} from 'remotion';

// Desenho de som sintetizado (public/sfx), sincronizado aos cortes e às entradas.
const CORTES = [105, 210, 300, 720, 795, 885, 960]; // início de cada cena
const DIAS = [0, 1, 2, 3, 4, 5, 6].map((i) => 300 + i * 60);

export const SoundDesign: React.FC = () => (
  <>
    <Sequence name="Drone" from={0} durationInFrames={1065}>
      <Audio src={staticFile('sfx/drone.wav')} volume={0.55} />
    </Sequence>
    {CORTES.map((f) => (
      <Sequence key={`s${f}`} name={`Sopro ${f}`} from={f - 16} durationInFrames={30}>
        <Audio src={staticFile('sfx/sopro.wav')} volume={0.45} />
      </Sequence>
    ))}
    {DIAS.slice(1).map((f) => (
      <Sequence key={`w${f}`} name={`Sopro dia ${f}`} from={f - 12} durationInFrames={24}>
        <Audio src={staticFile('sfx/sopro.wav')} volume={0.22} />
      </Sequence>
    ))}
    {DIAS.map((f, i) => (
      <Sequence key={`t${f}`} name={`Tique dia ${i + 1}`} from={f + 3} durationInFrames={10}>
        <Audio src={staticFile('sfx/tique.wav')} volume={0.5} />
      </Sequence>
    ))}
    <Sequence name="Impacto 7" from={216} durationInFrames={48}>
      <Audio src={staticFile('sfx/impacto.wav')} volume={0.8} />
    </Sequence>
    <Sequence name="Impacto COMEÇAR" from={974} durationInFrames={48}>
      <Audio src={staticFile('sfx/impacto.wav')} volume={0.65} />
    </Sequence>
  </>
);
