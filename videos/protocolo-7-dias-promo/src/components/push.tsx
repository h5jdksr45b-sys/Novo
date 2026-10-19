import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {AbsoluteFill} from 'remotion';

// Transição de empurrão vertical com desfoque de movimento: a cena nova sobe por baixo, a antiga recua.
const Push: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({children, presentationDirection, presentationProgress: p}) => {
  const entering = presentationDirection === 'entering';
  const style: React.CSSProperties = entering
    ? {transform: `translateY(${(1 - p) * 38}%) scale(${1.08 - 0.08 * p})`, filter: `blur(${(1 - p) * 18}px)`}
    : {transform: `translateY(${-p * 18}%) scale(${1 - 0.08 * p})`, filter: `blur(${p * 14}px) brightness(${1 - p * 0.6})`};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const push = (): TransitionPresentation<Record<string, never>> => ({component: Push, props: {}});
