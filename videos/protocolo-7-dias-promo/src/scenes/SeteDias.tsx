import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {FadeUp} from '../components/FadeUp';
import {Icon} from '../components/Icon';
import {IconName} from '../components/icons';
import {Safe, title} from '../components/Layout';
import {COLORS, FADE, SAFE_X, SAFE_Y, W, bodyFont} from '../theme';

export const DAY = 90; // 3s por dia

type Dia = {n: number; icon: IconName; nome: string; fundo?: string};

const DIAS: Dia[] = [
  {n: 1, icon: 'dia1-frase-fixa', nome: 'Frase fixa de presença'},
  {n: 2, icon: 'dia2-limite-sem-briga', nome: 'Limite sem briga'},
  {n: 3, icon: 'dia3-pausa-20min', nome: 'Pausa combinada de 20 minutos'},
  {n: 4, icon: 'dia4-roteiro-pos-crise', nome: 'Roteiro de pós-crise', fundo: 'fundos/02-cozinha.png'},
  {n: 5, icon: 'dia5-sair-dos-detalhes', nome: 'Sair dos detalhes no auge'},
  {n: 6, icon: 'dia6-previsibilidade', nome: 'Regra de previsibilidade', fundo: 'fundos/04-persiana.png'},
  {n: 7, icon: 'dia7-autocuidado', nome: 'Autocuidado de quem cuida'},
];

const fadeInOut = (frame: number, dur: number) =>
  interpolate(frame, [0, FADE, dur - FADE, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const FundoDoDia: React.FC<{readonly src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fadeInOut(frame, DAY + FADE)}}>
      <Background src={src} overlay={0.55} />
    </AbsoluteFill>
  );
};

const ConteudoDoDia: React.FC<{readonly dia: Dia}> = ({dia}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [DAY - FADE, DAY], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: dia.n === 7 ? 1 : out}}>
      <Safe>
        <FadeUp
          delay={0}
          style={{fontFamily: bodyFont, fontWeight: 600, fontSize: 44, letterSpacing: '0.16em', color: COLORS.red, marginBottom: 60}}
        >
          DIA {dia.n}
        </FadeUp>
        <Icon name={dia.icon} size={240} delay={4} />
        <FadeUp delay={14} style={{...title(78), marginTop: 70, maxWidth: 860}}>
          {dia.nome}
        </FadeUp>
      </Safe>
    </AbsoluteFill>
  );
};

const Progresso: React.FC = () => {
  const frame = useCurrentFrame();
  const gap = 14;
  const total = W - SAFE_X * 2;
  const seg = (total - gap * 6) / 7;
  return (
    <div style={{position: 'absolute', left: SAFE_X, right: SAFE_X, bottom: SAFE_Y, height: 8, display: 'flex', gap}}>
      {DIAS.map((d, i) => {
        const fill = interpolate(frame, [i * DAY + 4, i * DAY + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div key={d.n} style={{width: seg, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden'}}>
            <div style={{width: seg * fill, height: 8, backgroundColor: COLORS.red}} />
          </div>
        );
      })}
    </div>
  );
};

export const SeteDias: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background src="fundos/03-textura.png" overlay={0.45} />
      {DIAS.filter((d) => d.fundo).map((d) => (
        <Sequence key={`f${d.n}`} name={`Fundo dia ${d.n}`} from={(d.n - 1) * DAY - FADE / 2} durationInFrames={DAY + FADE} premountFor={fps}>
          <FundoDoDia src={d.fundo as string} />
        </Sequence>
      ))}
      {DIAS.map((d) => (
        <Sequence key={d.n} name={`Dia ${d.n}`} from={(d.n - 1) * DAY} durationInFrames={d.n === 7 ? DAY + FADE : DAY} premountFor={fps}>
          <ConteudoDoDia dia={d} />
        </Sequence>
      ))}
      <Progresso />
    </AbsoluteFill>
  );
};
