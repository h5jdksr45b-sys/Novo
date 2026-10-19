import {AbsoluteFill} from 'remotion';
import {COLORS, SAFE_X, SAFE_Y, bodyFont, titleFont} from '../theme';

// Area segura: 8% de margem em todas as bordas.
export const Safe: React.FC<{readonly children: React.ReactNode; readonly justify?: React.CSSProperties['justifyContent']}> = ({
  children,
  justify = 'center',
}) => (
  <AbsoluteFill
    style={{
      padding: `${SAFE_Y}px ${SAFE_X}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: justify,
      textAlign: 'center',
    }}
  >
    {children}
  </AbsoluteFill>
);

export const title = (size: number): React.CSSProperties => ({
  fontFamily: titleFont,
  fontSize: size,
  lineHeight: 1.08,
  color: COLORS.white,
  letterSpacing: '-0.01em',
  textWrap: 'balance',
  textShadow: '0 4px 30px rgba(0,0,0,0.55)',
});

export const body = (size: number): React.CSSProperties => ({
  fontFamily: bodyFont,
  fontSize: size,
  lineHeight: 1.3,
  color: COLORS.white,
  fontWeight: 500,
  textShadow: '0 2px 20px rgba(0,0,0,0.6)',
});
