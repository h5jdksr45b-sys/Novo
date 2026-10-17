import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { CircleCheckBig, User, UserRound } from "lucide-react";
import { Cena, Entra, progresso } from "./comum";
import { COR, LARGURA_UTIL } from "./tema";

const titulo: React.CSSProperties = {
  fontSize: 80,
  fontWeight: 800,
  lineHeight: 1.12,
  letterSpacing: -1.5,
  textWrap: "balance",
};

// CENA 1: o chefe passa e não há contato.
export const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const icone = 150;
  const passagem = interpolate(frame, [26, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xChefe = (LARGURA_UTIL - icone) * (1 - passagem);
  const opacidadeChefe = interpolate(
    frame,
    [20, 34, 96, 110],
    [0, 1, 1, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Cena>
      <Entra em={4} duracao={22}>
        <div style={{ ...titulo, maxWidth: 860 }}>
          O chefe passou e não deu bom dia.
        </div>
      </Entra>
      <div
        style={{
          position: "relative",
          width: LARGURA_UTIL,
          height: icone * 2 + 90,
          marginTop: 110,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: xChefe,
            opacity: opacidadeChefe,
          }}
        >
          <User size={icone} color={COR.texto} strokeWidth={1.6} />
        </div>
        <div
          style={{
            position: "absolute",
            top: icone / 2 + 8,
            left: 0,
            right: 0,
            borderTop: `3px dashed ${COR.linha}`,
          }}
        />
        <Entra
          em={10}
          duracao={20}
          deslize={0}
          style={{
            position: "absolute",
            bottom: 0,
            left: (LARGURA_UTIL - icone) / 2,
          }}
        >
          <UserRound size={icone} color={COR.apagado} strokeWidth={1.6} />
        </Entra>
      </div>
    </Cena>
  );
};

const Caixa: React.FC<{ texto: string; destaque?: boolean }> = ({
  texto,
  destaque,
}) => (
  <div
    style={{
      width: 760,
      padding: "40px 32px",
      borderRadius: 28,
      background: destaque ? COR.destaque : COR.superficie,
      border: `3px solid ${destaque ? COR.destaque : COR.linha}`,
      color: destaque ? COR.fundo : COR.texto,
      fontSize: 64,
      fontWeight: 700,
      letterSpacing: -1,
    }}
  >
    {texto}
  </div>
);

const Seta: React.FC<{ em: number }> = ({ em }) => {
  const frame = useCurrentFrame();
  const p = progresso(frame, em, 20);
  const haste = "M 40 6 L 40 92";
  const ponta = "M 18 70 L 40 94 L 62 70";
  const h = evolvePath(p, haste);
  const pt = evolvePath(progresso(frame, em + 14, 10), ponta);
  return (
    <svg width={80} height={100} viewBox="0 0 80 100" style={{ margin: "14px 0" }}>
      <path
        d={haste}
        stroke={COR.apagado}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={h.strokeDasharray}
        strokeDashoffset={h.strokeDashoffset}
      />
      <path
        d={ponta}
        stroke={COR.apagado}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={pt.strokeDasharray}
        strokeDashoffset={pt.strokeDashoffset}
      />
    </svg>
  );
};

// CENA 2: o medo vira certeza em três passos.
export const Fluxo: React.FC = () => (
  <Cena>
    <Entra em={6}>
      <Caixa texto="Sinto medo" />
    </Entra>
    <Seta em={34} />
    <Entra em={56}>
      <Caixa texto="Então é verdade" />
    </Entra>
    <Seta em={84} />
    <Entra em={106} duracao={22} deslize={36}>
      <Caixa texto="Vou ser demitido" destaque />
    </Entra>
  </Cena>
);

const Card: React.FC<{ rotulo: string; valor: string; destaque?: boolean }> = ({
  rotulo,
  valor,
  destaque,
}) => (
  <div
    style={{
      width: 420,
      height: 340,
      borderRadius: 28,
      background: COR.superficie,
      border: `3px solid ${destaque ? COR.destaque : COR.linha}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 24,
    }}
  >
    <div style={{ fontSize: 62, fontWeight: 800, letterSpacing: -1 }}>
      {rotulo}
    </div>
    <div
      style={{
        fontSize: 46,
        fontWeight: 600,
        color: destaque ? COR.destaque : COR.apagado,
        lineHeight: 1.15,
      }}
    >
      {valor}
    </div>
  </div>
);

// CENA 3: o nome do mecanismo e a separação entre sentir e concluir.
export const Cards: React.FC = () => (
  <Cena>
    <Entra em={6}>
      <div style={titulo}>Raciocínio emocional</div>
    </Entra>
    <Entra em={22}>
      <div
        style={{
          fontSize: 46,
          fontWeight: 500,
          color: COR.apagado,
          marginTop: 22,
        }}
      >
        quando sentir vira prova
      </div>
    </Entra>
    <div style={{ display: "flex", gap: 30, marginTop: 110 }}>
      <Entra em={52}>
        <Card rotulo="Medo" valor="real" />
      </Entra>
      <Entra em={82}>
        <Card rotulo="Demissão" valor="não conferida" destaque />
      </Entra>
    </div>
  </Cena>
);

// CENA 4: a leitura pode acertar, e por isso vale conferir.
export const Nuance: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progresso(frame, 8, 48);
  return (
    <Cena>
      <div
        style={{ opacity: p, transform: `scale(${0.82 + 0.18 * p})` }}
      >
        <CircleCheckBig size={190} color={COR.destaque} strokeWidth={1.6} />
      </div>
      <Entra em={50}>
        <div
          style={{
            fontSize: 62,
            fontWeight: 500,
            color: COR.apagado,
            marginTop: 90,
            lineHeight: 1.2,
          }}
        >
          Às vezes a leitura acerta.
        </div>
      </Entra>
      <Entra em={84}>
        <div style={{ ...titulo, marginTop: 40, maxWidth: 840 }}>
          Por isso, confira antes de agir.
        </div>
      </Entra>
    </Cena>
  );
};

// CENA 5: síntese e assinatura.
export const Sintese: React.FC = () => (
  <Cena semSaida alinhar="space-between">
    <div style={{ flex: 1 }} />
    <div>
      <Entra em={6} duracao={22}>
        <div style={{ ...titulo, fontSize: 88, letterSpacing: -2 }}>
          Sentir prova que dói.
        </div>
      </Entra>
      <Entra em={40} duracao={22}>
        <div
          style={{
            ...titulo,
            fontSize: 88,
            letterSpacing: -2,
            color: COR.destaque,
            marginTop: 36,
          }}
        >
          Não prova o que aconteceu.
        </div>
      </Entra>
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
      <Entra em={80} deslize={0}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: COR.apagado,
            lineHeight: 1.5,
            paddingBottom: 12,
          }}
        >
          Dr. Fabio Schmidt · médico, pós-graduado em psiquiatria
          <br />
          Conteúdo educativo
        </div>
      </Entra>
    </div>
  </Cena>
);
