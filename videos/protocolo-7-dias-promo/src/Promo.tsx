import {TransitionSeries, springTiming} from '@remotion/transitions';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Grain} from './components/Grain';
import {push} from './components/push';
import {sweep} from './components/sweep';
import {Cena1Crise, Cena2Plano, Cena3SeteDias, Cena5Sinais, Cena6Mensagem, Cena7Voce, Cena8Comecar} from './scenes/Cenas';
import {SeteDias} from './scenes/SeteDias';
import {SoundDesign} from './SoundDesign';
import {COLORS} from './theme';

export const T = 14; // duração da transição de empurrão
// Cada cena (exceto a última) leva T frames a mais para compensar a sobreposição.
// Inícios: 0, 3.5, 7, 10, 24, 26.5, 29.5 e 32 s. Total 35.5 s.
export const Promo: React.FC = () => {
  const {fps} = useVideoConfig();
  const timing = springTiming({config: {damping: 200}, durationInFrames: T});
  const t = <TransitionSeries.Transition presentation={push()} timing={timing} />;
  const v = <TransitionSeries.Transition presentation={sweep()} timing={timing} />;
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.base}}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="1 A crise" durationInFrames={119} premountFor={fps}>
          <Cena1Crise />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="2 Falta um plano" durationInFrames={119} premountFor={fps}>
          <Cena2Plano />
        </TransitionSeries.Sequence>
        {v}
        <TransitionSeries.Sequence name="3 Sete dias" durationInFrames={104} premountFor={fps}>
          <Cena3SeteDias />
        </TransitionSeries.Sequence>
        {v}
        <TransitionSeries.Sequence name="4 Os sete dias" durationInFrames={434} premountFor={fps}>
          <SeteDias />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="5 Sinais" durationInFrames={89} premountFor={fps}>
          <Cena5Sinais />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="6 Por mensagem" durationInFrames={104} premountFor={fps}>
          <Cena6Mensagem />
        </TransitionSeries.Sequence>
        {t}
        <TransitionSeries.Sequence name="7 O que voce faz" durationInFrames={89} premountFor={fps}>
          <Cena7Voce />
        </TransitionSeries.Sequence>
        {v}
        <TransitionSeries.Sequence name="8 Comecar" durationInFrames={105} premountFor={fps}>
          <Cena8Comecar />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Grain />
      <SoundDesign />
    </AbsoluteFill>
  );
};
