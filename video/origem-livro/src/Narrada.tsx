import React from "react";
import { AbsoluteFill, Audio, Sequence, Series, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, SANS } from "./theme";
import { Cena1Grito, Cena2Argumentos, Cena3Nome, Cena4Mecanismo, Cena5Fechamento, cardsStory } from "./Origem";

// Tempos em frames (30 fps), medidos nas falas reais.
const S1 = 190, S2 = 200, S3 = 130;
const CARD_DURS = [144, 241, 295];
const S4 = CARD_DURS.reduce((a, b) => a + b, 0);
const S5 = 252;
export const TOTAL_NARRADA = S1 + S2 + S3 + S4 + S5;

const f = (s: number) => Math.round(s * 30);

// Início de cada áudio (frame global) e duração em frames.
const AUDIO = [
  { file: "trecho1.wav", from: 12, dur: f(3.47) },
  { file: "trecho2.wav", from: S1 + 12, dur: f(5.4) },
  { file: "trecho3.wav", from: S1 + S2 + 10, dur: f(2.82) },
  { file: "trecho4.wav", from: S1 + S2 + S3 + 12, dur: f(11.88) },
  { file: "trecho5.wav", from: S1 + S2 + S3 + CARD_DURS[0] + CARD_DURS[1] + 12, dur: f(8.44) },
  { file: "trecho6.wav", from: S1 + S2 + S3 + S4 + 12, dur: f(6.5) },
];

const a = (i: number) => AUDIO[i].from;
const LEGENDAS = [
  { from: a(0) + f(0.2), to: a(0) + f(3.3), text: "Tem profissional que ainda fala assim sobre quem tem borderline." },
  { from: a(1) + f(0.2), to: a(1) + f(1.9), text: "A pessoa tenta explicar." },
  { from: a(1) + f(2.4), to: a(1) + f(4.4), text: "Ele levanta o diploma e não escuta." },
  { from: a(2) + f(0.45), to: a(2) + f(2.6), text: "Foi daí que veio o nome deste livro." },
  { from: a(3) + f(0.15), to: a(3) + f(3.4), text: "O medo de ser abandonado dispara um alarme por dentro." },
  { from: a(3) + f(4.8), to: a(3) + f(11.9), text: "Cobrar calma no pico é cobrar no único momento em que a pessoa não tem como pagar." },
  { from: a(4) + f(0.45), to: a(4) + f(2.6), text: "Quem sofre não escolhe como gritar." },
  { from: a(4) + f(3.1), to: a(4) + f(8.4), text: "Mas, com ajuda, pode aprender a escolher o que faz depois do grito." },
  { from: a(5) + f(0.45), to: a(5) + f(3.5), text: "Para quem vive o borderline e para quem convive." },
  { from: a(5) + f(4.4), to: a(5) + f(6.6), text: "O link está aqui embaixo." },
];

// Legenda inferior desativada a pedido. Reative incluindo <Legenda /> na composição.
const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const l = LEGENDAS.find((x) => frame >= x.from && frame < x.to);
  if (!l) return null;
  const o = interpolate(frame, [l.from, l.from + 5, l.to - 5, l.to], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1470, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          background: "rgba(20,20,20,.78)",
          color: C.offwhite,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.25,
          padding: "14px 28px",
          borderRadius: 18,
          textAlign: "center",
        }}
      >
        {l.text}
      </div>
    </div>
  );
};

export const OrigemNarrada: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream }}>
    <Series>
      <Series.Sequence durationInFrames={S1}>
        <Cena1Grito />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S2}>
        <Cena2Argumentos />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S3}>
        <Cena3Nome />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S4}>
        <Cena4Mecanismo lista={cardsStory} durs={CARD_DURS} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={S5}>
        <Cena5Fechamento story />
      </Series.Sequence>
    </Series>
    {AUDIO.map((x) => (
      <Sequence key={x.file} from={x.from} durationInFrames={x.dur + 6}>
        <Audio src={staticFile(`audio/${x.file}`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
