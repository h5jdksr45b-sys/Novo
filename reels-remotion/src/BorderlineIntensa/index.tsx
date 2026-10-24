import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { Inter, loadFontesClipe, Montserrat, Playfair } from "../load-font";
import tempos from "./tempos.json";

// Clipe de 30 s para o corte de 28 s da música "Borderline, a intensa"
// (do verso "Sofrer calada pra quê" até o fim). Cada verso vira um gráfico
// de interface: toggle de som, busca por perto, barra de progresso, player,
// contador de rodadas, notificações e medidor que transborda. A letra entra
// em grupos de até três palavras, com destaques em vermelho alternando
// Montserrat e Playfair. Nada nos 20% de baixo nem na lateral direita.

const AUDIO = staticFile("musica/borderline-a-intensa-corte.wav");

const RED = "#CC0000";
const BG = "#0D0D0D";
const CARD = "#161616";
const CARD2 = "#1E1E1E";
const BORDER = "rgba(255,255,255,0.09)";
const MUTED = "#8A8A8A";
const WHITE = "#FFFFFF";

const beats: number[] = tempos.beats;
const FIM_MUSICA = 27.75; // a música corta aqui; depois vem o cartão final

type Palavra = { w: string; serif?: boolean; red?: boolean };
type Grupo = { t: number; palavras: Palavra[] };
type Linha = { t0: number; t1: number; grupos: Grupo[] };

// Grupos de até três palavras. Os tempos internos são proporcionais ao
// tamanho do verso; os limites de cada verso vêm da letra sincronizada.
const LINHAS: Linha[] = [
  {
    t0: 0.38,
    t1: 2.375,
    grupos: [
      { t: 0.38, palavras: [{ w: "SOFRER" }] },
      { t: 1.0, palavras: [{ w: "calada", serif: true, red: true }] },
      { t: 1.7, palavras: [{ w: "PRA QUÊ," }] },
    ],
  },
  {
    t0: 2.375,
    t1: 4.529,
    grupos: [
      { t: 2.375, palavras: [{ w: "SE TEM" }] },
      { t: 3.0, palavras: [{ w: "AJUDA", red: true }] },
      { t: 3.75, palavras: [{ w: "à vista", serif: true }] },
    ],
  },
  {
    t0: 4.529,
    t1: 5.886,
    grupos: [
      { t: 4.529, palavras: [{ w: "NINGUÉM" }] },
      { t: 5.1, palavras: [{ w: "ACREDITAVA," }] },
    ],
  },
  {
    t0: 5.886,
    t1: 7.402,
    grupos: [
      { t: 5.886, palavras: [{ w: "HOJE EU SOU" }] },
      { t: 6.6, palavras: [{ w: "a otimista", serif: true, red: true }] },
    ],
  },
  {
    t0: 7.402,
    t1: 11.63,
    grupos: [
      { t: 7.402, palavras: [{ w: "BORDERLINE,", red: true }] },
      { t: 9.2, palavras: [{ w: "a intensa", serif: true }] },
    ],
  },
  {
    t0: 11.63,
    t1: 18.971,
    grupos: [
      { t: 11.63, palavras: [{ w: "SENTINDO" }] },
      { t: 12.6, palavras: [{ w: "MAIS UMA" }] },
      { t: 13.5, palavras: [{ w: "rodada", serif: true, red: true }] },
    ],
  },
  {
    t0: 18.971,
    t1: 22.402,
    grupos: [
      { t: 18.971, palavras: [{ w: "SENTINDO" }] },
      { t: 19.9, palavras: [{ w: "MAIS UMA" }] },
      { t: 20.8, palavras: [{ w: "rodada", serif: true, red: true }] },
    ],
  },
  {
    t0: 22.402,
    t1: 26.072,
    grupos: [
      { t: 22.402, palavras: [{ w: "ME CHAMARAM" }] },
      { t: 24.0, palavras: [{ w: "DE EXAGERO,", red: true }] },
    ],
  },
  {
    t0: 26.072,
    t1: FIM_MUSICA,
    grupos: [
      { t: 26.072, palavras: [{ w: "HOJE EU SEI" }] },
      { t: 26.7, palavras: [{ w: "O QUE ME" }] },
      { t: 27.2, palavras: [{ w: "excede", serif: true, red: true }] },
    ],
  },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

// Pulso que nasce em cada batida e decai em ~0,3 s. Serve para brilho e escala.
const pulsoBatida = (t: number) => {
  let melhor = 0;
  for (const b of beats) {
    if (b <= t && t - b < 0.35) {
      melhor = Math.max(melhor, 1 - (t - b) / 0.35);
    }
  }
  return melhor * melhor;
};

// ---------- Letra ----------

const Letra: React.FC<{ t: number; fps: number; frame: number }> = ({
  t,
  fps,
  frame,
}) => {
  const linha = LINHAS.find((l) => t >= l.t0 && t < l.t1);
  if (!linha) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        width: 840,
        top: 960,
        height: 520,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 6,
      }}
    >
      {linha.grupos.map((g, i) => {
        if (t < g.t) {
          return null;
        }
        const f0 = Math.round(g.t * fps);
        const s = spring({
          frame: frame - f0,
          fps,
          config: { damping: 16, stiffness: 190, mass: 0.7 },
        });
        const y = interpolate(s, [0, 1], [46, 0]);
        const serif = g.palavras[0].serif;
        const red = g.palavras[0].red;
        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateY(${y}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
              fontFamily: serif ? Playfair : Montserrat,
              fontStyle: serif ? "italic" : "normal",
              fontWeight: serif ? 600 : 800,
              fontSize: serif ? 140 : 112,
              lineHeight: 1.02,
              letterSpacing: serif ? -1 : -2,
              color: red ? RED : WHITE,
              textShadow: "0 6px 24px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            {g.palavras.map((p) => p.w).join(" ")}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Cartão de interface ----------

const Cartao: React.FC<{
  children: React.ReactNode;
  entrada: number; // 0..1
  saida: number; // 0..1
  altura?: number;
}> = ({ children, entrada, saida, altura = 560 }) => {
  const op = Math.min(entrada, 1 - saida);
  const y = interpolate(entrada, [0, 1], [60, 0]) - saida * 40;
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        width: 800,
        top: 330,
        height: altura,
        opacity: op,
        transform: `translateY(${y}px)`,
        background: CARD,
        border: `2px solid ${BORDER}`,
        borderRadius: 44,
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        overflow: "hidden",
        fontFamily: Inter,
        color: WHITE,
      }}
    >
      {children}
    </div>
  );
};

const Rotulo: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: Inter,
      fontWeight: 500,
      fontSize: 30,
      color: MUTED,
      letterSpacing: 2,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

// Ícone de alto-falante, com ou sem o risco de mudo.
const Speaker: React.FC<{ mudo: boolean; cor: string }> = ({ mudo, cor }) => (
  <svg width={120} height={120} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    {mudo ? (
      <>
        <line x1={22} y1={9} x2={16} y2={15} />
        <line x1={16} y1={9} x2={22} y2={15} />
      </>
    ) : (
      <>
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </>
    )}
  </svg>
);

// Cena 1a: toggle de som. Começa em mudo e liga em "pra quê".
const CenaSom: React.FC<{ t: number; fps: number; frame: number }> = ({ t, fps, frame }) => {
  const ligaEm = 1.7;
  const s = spring({ frame: frame - Math.round(ligaEm * fps), fps, config: { damping: 14, stiffness: 240 } });
  const ligado = t >= ligaEm ? s : 0;
  const knobX = interpolate(ligado, [0, 1], [8, 132]);
  const cor = ligado > 0.5 ? RED : "#3A3A3A";
  const entrada = prog(t, 0, 0.35);
  const saida = prog(t, 2.2, 2.45);
  return (
    <Cartao entrada={entrada} saida={saida}>
      <div style={{ padding: "54px 60px", display: "flex", flexDirection: "column", gap: 34, height: "100%", boxSizing: "border-box" }}>
        <Rotulo>Som</Rotulo>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Speaker mudo={ligado < 0.5} cor={ligado < 0.5 ? MUTED : WHITE} />
          <div style={{ width: 260, height: 136, borderRadius: 68, background: cor, position: "relative", transition: "none" }}>
            <div style={{ position: "absolute", top: 8, left: knobX, width: 120, height: 120, borderRadius: 60, background: WHITE, boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }} />
          </div>
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, color: ligado < 0.5 ? MUTED : WHITE }}>
          {ligado < 0.5 ? "silenciado" : "som ligado"}
        </div>
        <div style={{ height: 2, background: BORDER }} />
        <Rotulo style={{ fontSize: 26 }}>{ligado < 0.5 ? "ninguém escuta" : "alguém escuta"}</Rotulo>
      </div>
    </Cartao>
  );
};

// Cena 1b: busca por perto. Ondas de radar e um pino de ajuda.
const CenaPorPerto: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 2.375, 2.7);
  const saida = prog(t, 4.3, 4.55);
  const pinoIn = prog(t, 3.0, 3.35);
  const pinoS = Easing.out(Easing.back(1.8))(pinoIn);
  return (
    <Cartao entrada={entrada} saida={saida}>
      <div style={{ padding: "54px 60px", height: "100%", boxSizing: "border-box", position: "relative" }}>
        <Rotulo>Por perto</Rotulo>
        <div style={{ position: "absolute", left: 60, right: 60, top: 120, bottom: 54, borderRadius: 32, background: CARD2, overflow: "hidden" }}>
          {[0, 1, 2].map((i) => {
            const ciclo = ((t * 0.7 + i / 3) % 1 + 1) % 1;
            const r = interpolate(ciclo, [0, 1], [20, 420]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 340 - r,
                  top: 190 - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: "50%",
                  border: `3px solid rgba(204,0,0,${0.55 * (1 - ciclo)})`,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 328, top: 178, width: 24, height: 24, borderRadius: 12, background: WHITE }} />
          <div style={{ position: "absolute", left: 470, top: 50, transform: `translateY(${(1 - pinoS) * -40}px) scale(${pinoS})`, opacity: pinoIn, transformOrigin: "bottom center" }}>
            <svg width={72} height={96} viewBox="0 0 24 32" fill={RED}>
              <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" />
              <circle cx={12} cy={12} r={5} fill={WHITE} />
            </svg>
          </div>
          <div style={{ position: "absolute", left: 420, top: 160, opacity: prog(t, 3.3, 3.6), transform: `translateY(${(1 - prog(t, 3.3, 3.6)) * 16}px)`, background: WHITE, color: BG, fontWeight: 600, fontSize: 32, padding: "12px 24px", borderRadius: 24 }}>
            ajuda
          </div>
          <div style={{ position: "absolute", left: 420, top: 228, opacity: prog(t, 3.75, 4.0), fontSize: 26, color: MUTED, fontWeight: 500 }}>
            à vista
          </div>
        </div>
      </div>
    </Cartao>
  );
};

// Cena 2: barra que ninguém acreditava. Enche em "otimista".
const CenaBarra: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 4.529, 4.85);
  const saida = prog(t, 7.15, 7.4);
  const enche = Easing.out(Easing.cubic)(prog(t, 6.6, 7.3));
  const pct = Math.round(enche * 100);
  return (
    <Cartao entrada={entrada} saida={saida} altura={430}>
      <div style={{ padding: "54px 60px", display: "flex", flexDirection: "column", gap: 30, height: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Rotulo>{enche < 0.02 ? "quem acreditava" : "otimista"}</Rotulo>
          <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 74, color: enche < 0.02 ? MUTED : RED }}>{pct}%</div>
        </div>
        <div style={{ height: 44, borderRadius: 22, background: CARD2, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(enche * 100, 0)}%`, background: RED, borderRadius: 22 }} />
          {enche < 0.02 && (
            <div style={{ position: "absolute", inset: 0, borderRadius: 22, border: `2px dashed ${MUTED}`, boxSizing: "border-box" }} />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: MUTED, fontWeight: 500 }}>
          <span>ontem</span>
          <span>hoje</span>
        </div>
      </div>
    </Cartao>
  );
};

// Cena 3 e 4: player com visualizador de áudio e contador de rodadas.
const CenaPlayer: React.FC<{ t: number; frame: number; fps: number; barras: number[] }> = ({ t, frame, fps, barras }) => {
  const entrada = prog(t, 7.402, 7.75);
  const saida = prog(t, 22.15, 22.4);
  const total = 28;
  const mmss = (s: number) => `0:${("0" + Math.floor(s)).slice(-2)}`;
  const pulso = pulsoBatida(t);
  const rodadaAtiva = t >= 11.63;
  const periodo = (beats[4] ?? 1.858) * 1; // 4 batidas, em segundos
  const rodadaT = Math.max(0, t - 11.63);
  const rodadaN = Math.floor(rodadaT / periodo) + 1;
  const rodadaP = (rodadaT % periodo) / periodo;
  const R = 78;
  const C = 2 * Math.PI * R;
  const contadorIn = prog(t, 11.63, 12.0);
  return (
    <Cartao entrada={entrada} saida={saida} altura={600}>
      <div style={{ padding: "48px 60px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
          {rodadaAtiva ? (
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: 30,
                background: CARD2,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: contadorIn,
                transform: `scale(${interpolate(contadorIn, [0, 1], [0.7, 1])})`,
              }}
            >
              <svg width={190} height={190} style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)" }}>
                <circle cx={95} cy={95} r={R} fill="none" stroke="#2A2A2A" strokeWidth={10} />
                <circle cx={95} cy={95} r={R} fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - rodadaP)} />
              </svg>
              <div style={{ textAlign: "center", lineHeight: 1 }}>
                <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 78, color: WHITE }}>{rodadaN}</div>
                <div style={{ fontSize: 20, color: MUTED, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>rodada</div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: 30,
                background: `radial-gradient(circle at 30% 30%, #7a0000 0%, ${RED} 45%, #2a0000 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 ${20 + pulso * 40}px rgba(204,0,0,${0.35 + pulso * 0.4})`,
                transform: `scale(${1 + pulso * 0.025})`,
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: Playfair, fontStyle: "italic", fontWeight: 600, fontSize: 120, color: WHITE, lineHeight: 1 }}>B</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
            <Rotulo style={{ fontSize: 24 }}>Tocando agora</Rotulo>
            <div style={{ fontSize: 42, fontWeight: 600, whiteSpace: "nowrap" }}>Borderline, a intensa</div>
            <div style={{ fontSize: 30, color: MUTED, fontWeight: 500 }}>Borderline Sem Estigma</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {barras.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: Math.max(8, Math.min(120, v * 120)),
                borderRadius: 6,
                background: i % 5 === 2 ? RED : WHITE,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
        <div>
          <div style={{ height: 8, borderRadius: 4, background: CARD2, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(Math.min(t, total) / total) * 100}%`, background: WHITE, borderRadius: 4 }} />
            <div style={{ position: "absolute", top: -8, left: `calc(${(Math.min(t, total) / total) * 100}% - 12px)`, width: 24, height: 24, borderRadius: 12, background: WHITE }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 26, color: MUTED, fontWeight: 500 }}>
            <span>{mmss(t)}</span>
            <span>{mmss(total)}</span>
          </div>
        </div>
      </div>
    </Cartao>
  );
};

// Cena 5: notificações iguais empilhando. Cena 6: elas saem e entra o medidor.
const CenaNotificacoes: React.FC<{ t: number; fps: number; frame: number }> = ({ t, fps, frame }) => {
  const entrada = prog(t, 22.402, 22.75);
  const saida = prog(t, FIM_MUSICA - 0.15, FIM_MUSICA + 0.1);
  const chegadas = [22.75, 23.4, 24.0];
  const some = 26.072;
  const medidorIn = prog(t, 26.25, 26.65);
  const transborda = Easing.in(Easing.quad)(prog(t, 26.7, 27.6));
  return (
    <Cartao entrada={entrada} saida={saida} altura={620}>
      <div style={{ padding: "48px 60px", height: "100%", boxSizing: "border-box", position: "relative" }}>
        <Rotulo>{medidorIn > 0 ? "Nível" : "Notificações"}</Rotulo>
        <div style={{ position: "absolute", left: 60, right: 60, top: 118, display: "flex", flexDirection: "column", gap: 18 }}>
          {chegadas.map((c, i) => {
            const s = spring({ frame: frame - Math.round(c * fps), fps, config: { damping: 15, stiffness: 200 } });
            const sai = prog(t, some + i * 0.08, some + i * 0.08 + 0.3);
            if (t < c) {
              return null;
            }
            return (
              <div
                key={i}
                style={{
                  opacity: s * (1 - sai),
                  transform: `translateY(${(1 - s) * -40}px) translateX(${sai * 520}px)`,
                  background: CARD2,
                  borderRadius: 28,
                  padding: "26px 30px",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 32, background: "#2E2E2E", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 36, fontWeight: 600 }}>exagero</div>
                  <div style={{ fontSize: 24, color: MUTED, fontWeight: 500 }}>{["há 2 anos", "ontem", "agora"][i]}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 118,
            bottom: 48,
            opacity: medidorIn,
            transform: `translateY(${(1 - medidorIn) * 30}px)`,
            display: "flex",
            alignItems: "flex-end",
            gap: 40,
          }}
        >
          <div style={{ position: "relative", width: 160, height: "100%", background: CARD2, borderRadius: 28, overflow: "visible" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: `${interpolate(transborda, [0, 1], [35, 128])}%`,
                background: RED,
                borderRadius: 28,
                boxShadow: transborda > 0.8 ? `0 0 ${(transborda - 0.8) * 200}px rgba(204,0,0,0.6)` : "none",
              }}
            />
            {[0.25, 0.5, 0.75, 1].map((m) => (
              <div key={m} style={{ position: "absolute", left: -14, width: 14, height: 3, background: MUTED, bottom: `${m * 100}%` }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 10 }}>
            <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 92, color: transborda > 0.6 ? RED : WHITE, lineHeight: 1 }}>
              {Math.round(interpolate(transborda, [0, 1], [35, 128]))}%
            </div>
            <div style={{ fontSize: 30, color: MUTED, fontWeight: 500 }}>{transborda > 0.6 ? "o que me excede" : "o que eu sinto"}</div>
          </div>
        </div>
      </div>
    </Cartao>
  );
};

// Cartão final: a música corta e fica a chamada.
const CartaoFinal: React.FC<{ t: number; fps: number; frame: number }> = ({ t, fps, frame }) => {
  if (t < FIM_MUSICA) {
    return null;
  }
  const s = spring({ frame: frame - Math.round((FIM_MUSICA + 0.1) * fps), fps, config: { damping: 18, stiffness: 150 } });
  const s2 = spring({ frame: frame - Math.round((FIM_MUSICA + 0.6) * fps), fps, config: { damping: 18, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", padding: "0 100px 0 80px" }}>
      <div
        style={{
          opacity: s,
          transform: `translateY(${(1 - s) * 40}px)`,
          fontFamily: Montserrat,
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 1.04,
          letterSpacing: -2,
          color: WHITE,
          marginTop: -200,
        }}
      >
        Manda pra quem
        <br />
        te chamou de
        <br />
        <span style={{ fontFamily: Playfair, fontStyle: "italic", fontWeight: 600, color: RED, fontSize: 120, letterSpacing: 0 }}>exagero.</span>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1360, opacity: s2, fontFamily: Inter, fontWeight: 500, fontSize: 30, color: MUTED }}>
        Dr. Fabio Schmidt, médico, CRM-SP 183549
      </div>
    </AbsoluteFill>
  );
};

export const BorderlineIntensa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const [fontes, setFontes] = useState(false);

  useEffect(() => {
    loadFontesClipe().then(() => setFontes(true));
  }, []);

  const audioData = useAudioData(AUDIO);
  const barras = audioData
    ? visualizeAudio({ fps, frame, audioData, numberOfSamples: 32, smoothing: true })
        .slice(1, 25)
        .map((v, i) => Math.min(1, Math.pow(v * (6 + i * 1.4), 0.55)))
    : new Array(24).fill(0.08);

  // Zoom punch nas frases de impacto: BORDERLINE e EXCEDE.
  const punch = (a: number, b: number, max: number) => {
    if (t < a || t > b) {
      return 1;
    }
    const e = Easing.out(Easing.cubic)(prog(t, a, a + 0.25));
    return 1 + (max - 1) * e;
  };
  const zoom = Math.max(punch(7.4, 11.6, 1.08), punch(27.2, FIM_MUSICA, 1.12));

  // Flash branco curto na abertura; fade para preto nos últimos 0,1 s.
  const flash = interpolate(frame, [0, 3], [0.6, 0], { extrapolateRight: "clamp" });
  const fadeFim = interpolate(frame, [durationInFrames - 4, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulso = pulsoBatida(t);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: WHITE }}>
      <Audio src={AUDIO} />
      {/* leve brilho de fundo que respira com a batida */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 40% 30%, rgba(204,0,0,${0.06 + pulso * 0.06}) 0%, rgba(13,13,13,0) 60%)`,
        }}
      />
      {fontes && (
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 42%" }}>
          {t < 2.45 && <CenaSom t={t} fps={fps} frame={frame} />}
          {t >= 2.375 && t < 4.55 && <CenaPorPerto t={t} />}
          {t >= 4.529 && t < 7.4 && <CenaBarra t={t} />}
          {t >= 7.402 && t < 22.4 && <CenaPlayer t={t} frame={frame} fps={fps} barras={barras} />}
          {t >= 22.402 && t < FIM_MUSICA + 0.1 && <CenaNotificacoes t={t} fps={fps} frame={frame} />}
          <Letra t={t} fps={fps} frame={frame} />
          <CartaoFinal t={t} fps={fps} frame={frame} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ backgroundColor: WHITE, opacity: flash, pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeFim, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
