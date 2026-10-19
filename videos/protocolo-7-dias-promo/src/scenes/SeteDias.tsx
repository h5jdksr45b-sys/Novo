import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Icon} from '../components/Icon';
import {IconName} from '../components/icons';
import {Kinetic} from '../components/Kinetic';
import {COLORS, SAFE_X, SAFE_Y, W, bodyFont} from '../theme';

export const DAY = 60; // 2s por dia
const OUT = 8; // saída em carrossel

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

const FundoDoDia: React.FC<{readonly src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, DAY, DAY + 8], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Background src={src} overlay={0.55} zoom={[1.14, 1.02]} />
    </AbsoluteFill>
  );
};

const ConteudoDoDia: React.FC<{readonly dia: Dia}> = ({dia}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // entra da direita com mola, sai para a esquerda com desfoque
  const inn = spring({frame, fps, config: {damping: 16, stiffness: 190, mass: 0.7}});
  const out = dia.n === 7 ? 0 : interpolate(frame, [DAY - OUT, DAY], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const x = (1 - inn) * 420 - out * 520;
  const blur = (1 - inn) * 14 + out * 16;
  const pop = spring({frame: frame - 2, fps, config: {damping: 10, stiffness: 180, mass: 0.7}});
  return (
    <AbsoluteFill
      style={{
        padding: `${SAFE_Y}px ${SAFE_X}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${x}px) skewX(${(1 - inn) * -10 + out * 12}deg)`,
        filter: `blur(${blur}px)`,
        opacity: 1 - out,
      }}
    >
      <div style={{fontFamily: bodyFont, fontWeight: 600, fontSize: 46, letterSpacing: '0.18em', color: COLORS.red, marginBottom: 56}}>
        DIA {dia.n}
      </div>
      <div style={{transform: `scale(${0.6 + 0.4 * pop}) rotate(${(1 - pop) * 10}deg)`}}>
        <Icon name={dia.icon} size={240} delay={2} />
      </div>
      <Kinetic text={dia.nome} size={80} delay={8} stagger={2} exit={false} style={{marginTop: 64, maxWidth: 880}} />
    </AbsoluteFill>
  );
};

const Progresso: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gap = 14;
  const total = W - SAFE_X * 2;
  const seg = (total - gap * 6) / 7;
  return (
    <div style={{position: 'absolute', left: SAFE_X, right: SAFE_X, bottom: SAFE_Y, height: 10, display: 'flex', gap}}>
      {DIAS.map((d, i) => {
        const fill = spring({frame: frame - i * DAY - 2, fps, config: {damping: 22, stiffness: 140}});
        const active = frame >= i * DAY && frame < (i + 1) * DAY;
        return (
          <div key={d.n} style={{width: seg, height: active ? 10 : 6, marginTop: active ? 0 : 2, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden'}}>
            <div style={{width: seg * fill, height: '100%', backgroundColor: COLORS.red}} />
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
      <Background src="fundos/03-textura.png" overlay={0.45} zoom={[1.0, 1.16]} panY={[40, -40]} />
      {DIAS.filter((d) => d.fundo).map((d) => (
        <Sequence key={`f${d.n}`} name={`Fundo dia ${d.n}`} from={(d.n - 1) * DAY - 4} durationInFrames={DAY + 8} premountFor={fps}>
          <FundoDoDia src={d.fundo as string} />
        </Sequence>
      ))}
      {DIAS.map((d) => (
        <Sequence key={d.n} name={`Dia ${d.n}`} from={(d.n - 1) * DAY} durationInFrames={d.n === 7 ? DAY + 14 : DAY} premountFor={fps}>
          <ConteudoDoDia dia={d} />
        </Sequence>
      ))}
      <Progresso />
    </AbsoluteFill>
  );
};
