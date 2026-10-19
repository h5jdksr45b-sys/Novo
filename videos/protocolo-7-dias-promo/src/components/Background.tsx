import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

type Props = {
  readonly src: string;
  readonly overlay: number; // 0.45 a 0.60
  readonly zoom?: [number, number];
  readonly panY?: [number, number]; // deslocamento vertical em px
  readonly panX?: [number, number]; // paralaxe horizontal em px
  readonly origin?: string;
};

// Fundo com overlay preto, push-in de câmera e leve deriva vertical.
export const Background: React.FC<Props> = ({src, overlay, zoom = [1, 1.1], panY = [0, 0], panX = [-30, 30], origin = '50% 50%'}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const scale = zoom[0] + (zoom[1] - zoom[0]) * p;
  const y = panY[0] + (panY[1] - panY[0]) * p;
  const x = panX[0] + (panX[1] - panX[0]) * p;
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.base, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: origin}} />
      <AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${overlay})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 50%, rgba(0,0,0,0.5) 100%)'}} />
    </AbsoluteFill>
  );
};
