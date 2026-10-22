import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIFA } from "./fontes";
import { tempoDaPalavra, type Palavra } from "./timeline";

// Momento de explicação: esquema animado da ideia central (aceitar E mudar).
// Cada fase dispara na palavra em que o Fabio a diz. Sem gravação, usa a estimativa.
type Fases = {
  dois: number; // "dois movimentos"
  aceitar: number;
  mudar: number;
  umLado: number; // "escolhia um lado"
  juntou: number;
  dialetica: number;
  nome: number; // "terapia comportamental dialética"
};

const fasesDe = (palavras: Palavra[], inicio: number, fim: number): Fases => {
  const t = (alvo: string, n = 0, padrao: number) => {
    const v = tempoDaPalavra(palavras, alvo, n);
    return v === null ? padrao : v;
  };
  const dur = fim - inicio;
  return {
    dois: t("dois", 0, inicio + dur * 0.18),
    aceitar: t("aceitar:", 0, inicio + dur * 0.3),
    mudar: t("mudar:", 0, inicio + dur * 0.48),
    umLado: t("lado.", 0, inicio + dur * 0.64),
    juntou: t("juntou", 0, inicio + dur * 0.72),
    dialetica: t("dialética", 0, inicio + dur * 0.8),
    nome: t("terapia", 0, inicio + dur * 0.92),
  };
};

export const Esquema: React.FC<{
  palavras: Palavra[];
  inicioCenaMs: number;
  fimCenaMs: number;
  corDestaque: string;
}> = ({ palavras, inicioCenaMs, fimCenaMs, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = inicioCenaMs + (frame / fps) * 1000;
  const f = fasesDe(palavras, inicioCenaMs, fimCenaMs);

  const desde = (ms: number) => Math.max(0, Math.round(((agoraMs - ms) / 1000) * fps));
  const mola = (ms: number, atrasoFrames = 0) =>
    agoraMs < ms ? 0 : spring({ frame: desde(ms) - atrasoFrames, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const suave = (ms: number, dur = 0.35) =>
    agoraMs < ms ? 0 : interpolate(desde(ms), [0, fps * dur], [0, 1], { extrapolateRight: "clamp" });

  const pDois = mola(f.dois);
  const pAceitar = mola(f.aceitar);
  const pMudar = mola(f.mudar);
  const pUmLado = suave(f.umLado);
  const pJuntou = mola(f.juntou);
  const pDial = suave(f.dialetica, 0.5);
  const pNome = suave(f.nome, 0.4);

  // Posição das duas palavras: começam afastadas, depois de "juntou" se aproximam do centro.
  const afastamento = interpolate(pJuntou, [0, 1], [265, 222]);
  const linhaLargura = interpolate(pDois, [0, 1], [0, 1]);

  const palavra = (texto: string, progresso: number, lado: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 760,
        transform: `translate(-50%, -50%) translateX(${lado * afastamento}px) translateY(${(1 - progresso) * 30}px) scale(${0.9 + progresso * 0.1})`,
        opacity: progresso,
        fontFamily: SERIFA,
        fontWeight: 900,
        fontSize: 82,
        letterSpacing: -1,
        color: "#f4f4f4",
        textShadow: "0 0 30px rgba(255,255,255,0.25)",
      }}
    >
      {texto}
    </div>
  );

  const explicacao = (texto: string, progresso: number, lado: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 860,
        width: 380,
        transform: `translate(-50%, 0) translateX(${lado * afastamento}px)`,
        opacity: progresso * interpolate(pJuntou, [0, 1], [1, 0.35]),
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: 30,
        lineHeight: 1.3,
        textAlign: "center",
        color: "#bdbdbd",
      }}
    >
      {texto}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#070707" }}>
      {/* linha entre os dois movimentos */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 760,
          width: 420 * linhaLargura,
          height: 3,
          transform: "translate(-50%, -50%)",
          background: "#5a5a5a",
          opacity: 1 - pJuntou * 0.7,
        }}
      />
      {palavra("Aceitar", pAceitar, -1)}
      {palavra("Mudar", pMudar, 1)}
      {explicacao("a sua dor é real e faz sentido", pAceitar, -1)}
      {explicacao("do jeito que está, você continua sofrendo", pMudar, 1)}

      {/* "ou" aparece, depois é riscado e vira "e" */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 760,
          transform: "translate(-50%, -50%)",
          fontFamily: SERIFA,
          fontStyle: "italic",
          fontSize: 64,
          color: "#9a9a9a",
          opacity: pUmLado * (1 - pJuntou),
        }}
      >
        ou
        <div
          style={{
            position: "absolute",
            left: -6,
            right: -6,
            top: "52%",
            height: 5,
            background: corDestaque,
            transform: `scaleX(${pJuntou > 0 ? 1 : 0}) rotate(-8deg)`,
            transformOrigin: "left center",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 760,
          transform: `translate(-50%, -50%) scale(${0.6 + pJuntou * 0.4})`,
          fontFamily: SERIFA,
          fontWeight: 900,
          fontSize: 100,
          color: corDestaque,
          opacity: pJuntou,
        }}
      >
        e
      </div>

      {/* tradução do termo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1040,
          textAlign: "center",
          opacity: pDial,
          transform: `translateY(${(1 - pDial) * 16}px)`,
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: corDestaque,
            color: "#0a0a0a",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 2,
            padding: "10px 22px",
          }}
        >
          DIALÉTICA
        </span>
        <div style={{ fontFamily: SERIFA, fontStyle: "italic", fontSize: 44, color: "#f2f2f2", marginTop: 18 }}>
          dois lados ao mesmo tempo
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1230,
          textAlign: "center",
          opacity: pNome,
          fontFamily: SANS,
          fontSize: 28,
          letterSpacing: 3,
          color: "#8a8a8a",
        }}
      >
        TERAPIA COMPORTAMENTAL DIALÉTICA
      </div>
    </AbsoluteFill>
  );
};
