import {Easing, interpolate, useCurrentFrame} from 'remotion';

type Props = {
  readonly delay?: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
};

// Texto entra com fade e subida de 20px.
export const FadeUp: React.FC<Props> = ({delay = 0, children, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{...style, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>{children}</div>;
};
