import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import {
  Background,
  ChamadaScene,
  CidadeScene,
  CriseScene,
  MensagemScene,
  ProtocoloScene,
} from "./Scenes";

// Reel de 14 s, uma frase por tela. Sem trilha embutida: se usar música,
// coloque no Instagram, baixa e constante.
export const Reel7Dias: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />
      <Sequence name="Crise" durationInFrames={2.5 * fps} premountFor={fps}>
        <CriseScene durationInFrames={2.5 * fps} />
      </Sequence>
      <Sequence
        name="Outra cidade"
        from={2.5 * fps}
        durationInFrames={2.5 * fps}
        premountFor={fps}
      >
        <CidadeScene durationInFrames={2.5 * fps} />
      </Sequence>
      <Sequence
        name="Protocolo"
        from={5 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <ProtocoloScene durationInFrames={3 * fps} />
      </Sequence>
      <Sequence
        name="Mensagem"
        from={8 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <MensagemScene durationInFrames={3 * fps} />
      </Sequence>
      <Sequence
        name="Chamada"
        from={11 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <ChamadaScene />
      </Sequence>
    </AbsoluteFill>
  );
};
