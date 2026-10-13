import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import {
  BuscaScene,
  OutroLadoScene,
  PortaBateScene,
  SeteDiasScene,
  TresCartoesScene,
} from "./Scenes";

// Do outro lado da porta, 14 s. Sem trilha embutida.
export const ReelPorta: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <BuscaScene
        name="Cena 1: busca"
        durationInFrames={2.5 * fps}
        premountFor={fps}
        text="Você já leu tudo sobre borderline."
      />
      <TresCartoesScene
        name="Cena 2: três cartões"
        from={2.5 * fps}
        durationInFrames={2.5 * fps}
        premountFor={fps}
        text="O diagnóstico. Os sintomas. O que ela sente."
      />
      <PortaBateScene
        name="Cena 3: porta bate"
        from={5 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
        text="Nada dizia o que fazer quando a porta bate."
      />
      <OutroLadoScene
        name="Cena 4: outro lado"
        from={8 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
        text="O Protocolo 7 Dias foi feito para quem fica do outro lado da porta."
      />
      <SeteDiasScene
        name="Cena 5: sete dias"
        from={11 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
        text="Um procedimento por dia."
      />
    </AbsoluteFill>
  );
};
