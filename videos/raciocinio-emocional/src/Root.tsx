import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import { GuiaAreaSegura } from "./comum";
import { Abertura, Cards, Fluxo, Nuance, Sintese } from "./cenas";
import { CENAS, COR, DURACAO_TOTAL, FONTE, FPS, H, W } from "./tema";

const PESOS = [400, 500, 600, 700, 800];

const useFontes = () => {
  const [handle] = useState(() => delayRender("fontes"));
  useEffect(() => {
    Promise.all(
      PESOS.map((peso) =>
        new FontFace(
          FONTE,
          `url('${staticFile(`fonts/inter-latin-${peso}-normal.woff2`)}') format('woff2')`,
          { weight: String(peso) },
        )
          .load()
          .then((f) =>
            (document.fonts as unknown as Set<FontFace>).add(f),
          ),
      ),
    ).then(() => continueRender(handle));
  }, [handle]);
};

const COMPONENTES = {
  abertura: Abertura,
  fluxo: Fluxo,
  cards: Cards,
  nuance: Nuance,
  sintese: Sintese,
};

type Props = { guias: boolean };

const Video: React.FC<Props> = ({ guias }) => {
  useFontes();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      {CENAS.map((c) => {
        const Comp = COMPONENTES[c.id];
        return (
          <Sequence
            key={c.id}
            from={c.inicio * FPS}
            durationInFrames={c.duracao * FPS}
            name={c.id}
          >
            <Comp />
          </Sequence>
        );
      })}
      {guias ? <GuiaAreaSegura /> : null}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="RaciocinioEmocional"
    component={Video}
    durationInFrames={DURACAO_TOTAL}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{ guias: false }}
  />
);
