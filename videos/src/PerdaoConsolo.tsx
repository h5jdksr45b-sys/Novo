import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const BG = '#0b0b0b';
const WHITE = '#f4f1ea';
const RED = '#ff3b30';
const FONT = 'Helvetica, Arial, sans-serif';

const MSG_A = 'Desculpa por ontem. Eu sei que te machuquei.';
const MSG_B = 'Você acha que eu sou uma pessoa ruim?';

// frames (30 fps)
const T_A_START = 25;
const T_A_END = 105;
const T_A_ERASE_START = 135;
const T_A_ERASE_END = 165;
const T_B_START = 180;
const T_B_END = 245;
const T_SWITCH = 170;

const typed = (text: string, frame: number, start: number, end: number) => {
  const n = Math.round(
    interpolate(frame, [start, end], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return text.slice(0, n);
};

export const PerdaoConsolo: React.FC = () => {
  const frame = useCurrentFrame();

  const typedA = typed(MSG_A, frame, T_A_START, T_A_END);
  const erasedLen = Math.round(
    interpolate(frame, [T_A_ERASE_START, T_A_ERASE_END], [MSG_A.length, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const textA = frame < T_A_ERASE_START ? typedA : MSG_A.slice(0, erasedLen);
  const textB = typed(MSG_B, frame, T_B_START, T_B_END);
  const showB = frame >= T_B_START;
  const shown = showB ? textB : textA;
  const color = showB ? RED : WHITE;
  const cursorOn = Math.floor(frame / 12) % 2 === 0;

  const headline = frame < T_SWITCH ? 'Você pede perdão.' : 'Acaba pedindo consolo.';
  const headlineOpacity =
    frame < T_SWITCH
      ? interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'})
      : interpolate(frame, [T_SWITCH, T_SWITCH + 12], [0, 1], {extrapolateRight: 'clamp'});
  const headlineColor = frame < T_SWITCH ? WHITE : RED;

  const dotsOpacity = interpolate(frame, [255, 270], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dotPhase = (i: number) =>
    0.35 + 0.65 * Math.max(0, Math.sin((frame - i * 5) / 5));

  return (
    <AbsoluteFill style={{backgroundColor: BG, fontFamily: FONT}}>
      {/* headline, top safe area */}
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 90,
          right: 90,
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 1.1,
          color: headlineColor,
          opacity: headlineOpacity,
        }}
      >
        {headline}
      </div>

      {/* message box */}
      <div
        style={{
          position: 'absolute',
          top: 720,
          left: 90,
          right: 90,
          minHeight: 300,
          border: `3px solid ${showB ? RED : WHITE}`,
          borderRadius: 48,
          padding: '56px 64px',
          fontSize: 62,
          lineHeight: 1.3,
          color,
        }}
      >
        {shown}
        <span style={{opacity: cursorOn ? 1 : 0}}>|</span>
      </div>

      {/* typing dots from the other person */}
      <div
        style={{
          position: 'absolute',
          top: 1120,
          left: 90,
          display: 'flex',
          gap: 22,
          opacity: dotsOpacity,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: WHITE,
              opacity: dotPhase(i),
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
