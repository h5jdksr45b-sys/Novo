import {evolvePath} from '@remotion/paths';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {ICONS, IconName} from './icons';

type Props = {
  readonly name: IconName;
  readonly size: number;
  readonly delay?: number;
};

const DRAW = 15; // #base desenha em 15 frames
const GAP = 6; // #destaque entra 6 frames depois

export const Icon: React.FC<Props> = ({name, size, delay = 0}) => {
  const frame = useCurrentFrame() - delay;
  const icon = ICONS[name];
  const draw = interpolate(frame, [0, DRAW], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const hStart = DRAW + GAP;
  const h = interpolate(frame, [hStart, hStart + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const grow = interpolate(frame, [hStart, hStart + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const d = icon.destaque;

  return (
    <svg viewBox="0 0 96 96" width={size} height={size} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{overflow: 'visible'}}>
      <g stroke={COLORS.white} strokeWidth={4}>
        {icon.base.map((p) => {
          const {strokeDasharray, strokeDashoffset} = evolvePath(draw, p);
          return <path key={p} d={p} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} opacity={draw > 0 ? 1 : 0} />;
        })}
      </g>
      {d.kind === 'grow-rect' ? (
        // dia7: o retangulo vermelho cresce na largura, de 0 ate o valor final
        <rect x={d.x} y={d.y} width={d.w * grow} height={d.h} rx={d.rx} fill={COLORS.red} />
      ) : (
        <g
          opacity={h}
          style={{transform: `scale(${0.9 + 0.1 * h})`, transformOrigin: '48px 48px'}}
        >
          {d.kind === 'stroke' &&
            d.paths.map((p) => <path key={p} d={p} stroke={COLORS.red} strokeWidth={d.width} />)}
          {d.kind === 'dots' &&
            d.dots.map(([cx, cy, r]) => <circle key={cx} cx={cx} cy={cy} r={r} fill={COLORS.red} />)}
          {d.kind === 'ring' && <circle cx={d.cx} cy={d.cy} r={d.r} stroke={COLORS.red} strokeWidth={4} />}
        </g>
      )}
    </svg>
  );
};
