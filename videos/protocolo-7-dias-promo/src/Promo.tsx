import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Cena1Crise, Cena2Plano, Cena3SeteDias, Cena5Sinais, Cena6Mensagem, Cena7Voce, Cena8Comecar} from './scenes/Cenas';
import {SeteDias} from './scenes/SeteDias';
import {SoundDesign} from './SoundDesign';
import {COLORS, FADE} from './theme';

// Cada cena (exceto a ultima) dura FADE frames a mais para compensar a sobreposicao do fade,
// assim os inicios caem em 0, 6, 12, 16, 37, 41, 46 e 50.5 s.
export const Promo: React.FC = () => {
  const {fps} = useVideoConfig();
  const t = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: FADE})} />;
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.base}}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="1 A crise" durationInFrames={190} premountFor={fps}>
          <Cena1Crise />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="2 Falta um plano" durationInFrames={190} premountFor={fps}>
          <Cena2Plano />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="3 Sete dias" durationInFrames={130} premountFor={fps}>
          <Cena3SeteDias />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="4 Os sete dias" durationInFrames={640} premountFor={fps}>
          <SeteDias />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="5 Sinais" durationInFrames={130} premountFor={fps}>
          <Cena5Sinais />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="6 Por mensagem" durationInFrames={160} premountFor={fps}>
          <Cena6Mensagem />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="7 O que voce faz" durationInFrames={145} premountFor={fps}>
          <Cena7Voce />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="8 Comecar" durationInFrames={105} premountFor={fps}>
          <Cena8Comecar />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SoundDesign />
    </AbsoluteFill>
  );
};
