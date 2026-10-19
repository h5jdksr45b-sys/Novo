import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../theme';

// Varredura: uma faixa vermelha corre da direita para a esquerda revelando a cena nova.
const Sweep: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({children, presentationDirection, presentationProgress: p}) => {
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill style={{transform: `translateX(${-p * 30}%) skewX(${p * 4}deg)`, filter: `blur(${p * 12}px)`}}>{children}</AbsoluteFill>;
  }
  const edge = (1 - p) * 100; // borda da revelação em %
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 0 0 ${edge}%)`, transform: `translateX(${(1 - p) * 12}%)`}}>{children}</AbsoluteFill>
      <div style={{position: 'absolute', top: 0, bottom: 0, left: `calc(${edge}% - 70px)`, width: 140, backgroundColor: COLORS.red, transform: 'skewX(-8deg)', opacity: p < 0.98 ? 1 : 0}} />
    </AbsoluteFill>
  );
};

export const sweep = (): TransitionPresentation<Record<string, never>> => ({component: Sweep, props: {}});
