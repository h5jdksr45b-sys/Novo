import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ALERTA, CAPTIONS, ENFASES, GANCHO, LADO_BORDER, LADO_CONVIVE, MEDIDOR, SEGMENTOS } from "./plano";

// Linguagem editorial das referências que ele mandou em 04/11 (hex_creatives):
// serifada fina, romana + itálica, palavra entrando com desfoque,
// etiqueta vermelha sobre o ponto-chave, traço fino desenhado à mão, cor de cinema com grão.
const SERIF = "InstrumentSerif";
const VERMELHO = "#CC0000";
const SOMBRA = "0 2px 14px rgba(0,0,0,.6), 0 0 2px rgba(0,0,0,.45)";
const SOMBRA_FORTE = "0 4px 26px rgba(0,0,0,.7), 0 0 3px rgba(0,0,0,.5)";
const OUT = Easing.bezier(0.22, 1, 0.36, 1);
const IN = Easing.bezier(0.55, 0, 1, 0.45);
const TRACO = "drop-shadow(0 2px 6px rgba(0,0,0,.55))";

const ESQ = Math.round(1080 * 0.07);
const DIR = Math.round(1080 * 0.12);
const LARGURA = 1080 - ESQ - DIR;
const CX = ESQ + LARGURA / 2;

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ent = (t: number, a: number, d: number) => interpolate(t, [a, a + d], [0, 1], { ...cl, easing: OUT });
const sai = (t: number, b: number, d: number) => interpolate(t, [b - d, b], [1, 0], { ...cl, easing: IN });

let fontesCarregadas = false;
const carregarFontes = () => {
  if (fontesCarregadas) return;
  fontesCarregadas = true;
  const h = delayRender("fontes");
  Promise.all([
    new FontFace(SERIF, `url('${staticFile("fonts/instrument-serif-latin-400-normal.woff2")}') format('woff2')`).load(),
    new FontFace(SERIF, `url('${staticFile("fonts/instrument-serif-latin-400-italic.woff2")}') format('woff2')`, {
      style: "italic",
    }).load(),
  ]).then((fs) => {
    fs.forEach((f) => document.fonts.add(f));
    continueRender(h);
  });
};

// palavra entrando: desfoque para nítido, opacidade e subida curta
const entrada = (t: number, a: number, d = 0.22, sobe = 14): React.CSSProperties => {
  const k = ent(t, a, d);
  return {
    opacity: k,
    filter: `blur(${(1 - k) * 10}px)`,
    transform: `translateY(${(1 - k) * sobe}px)`,
  };
};

// ---------- base: zoom contínuo, cor de cinema, vinheta e grão ----------
const Base: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const seg = SEGMENTOS.find((s) => t >= s.ini && t < s.fim) ?? SEGMENTOS[SEGMENTOS.length - 1];
  const escala = interpolate(t, [seg.ini, seg.fim], [seg.de, seg.para], {
    ...cl,
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0D0D0D" }}>
      <OffthreadVideo
        src={staticFile("abraco-frio/base.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${escala})`,
          transformOrigin: "50% 38%",
          filter: "saturate(0.68) contrast(1.1) brightness(0.93) sepia(0.14)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 95% 70% at 50% 45%, rgba(0,0,0,0) 50%, rgba(10,6,4,.5) 100%), linear-gradient(180deg, rgba(0,0,0,.38) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 56%, rgba(0,0,0,.35) 80%, rgba(0,0,0,.12) 100%)",
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id="grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grao)" />
      </svg>
    </AbsoluteFill>
  );
};

// etiqueta vermelha (como as etiquetas das referências): a caixa abre da esquerda e o texto entra
const Etiqueta: React.FC<{ t: number; a: number; texto: string; tamanho: number; italico?: boolean }> = ({
  t,
  a,
  texto,
  tamanho,
  italico = true,
}) => {
  const kb = ent(t, a, 0.2);
  const kt = ent(t, a + 0.06, 0.2);
  return (
    <span style={{ position: "relative", display: "inline-block", padding: `0 ${tamanho * 0.18}px`, lineHeight: 1.08 }}>
      <span
        style={{
          position: "absolute",
          inset: `${tamanho * 0.08}px 0 ${tamanho * 0.02}px 0`,
          background: VERMELHO,
          borderRadius: 4,
          transform: `scaleX(${kb})`,
          transformOrigin: "left center",
          boxShadow: "0 6px 18px rgba(0,0,0,.35)",
        }}
      />
      <span
        style={{
          position: "relative",
          fontFamily: SERIF,
          fontStyle: italico ? "italic" : "normal",
          fontSize: tamanho,
          color: "#fff",
          opacity: kt,
          filter: `blur(${(1 - kt) * 6}px)`,
        }}
      >
        {texto}
      </span>
    </span>
  );
};

// ---------- gancho ----------
const Gancho: React.FC<{ t: number }> = ({ t }) => {
  if (t >= GANCHO.fim) return null;
  const s = interpolate(t, [0, 0.4], [1.03, 1], { ...cl, easing: OUT });
  return (
    <div style={{ position: "absolute", top: 170, left: ESQ, width: LARGURA, textAlign: "center", transform: `scale(${s})` }}>
      <div style={{ fontFamily: SERIF, fontSize: 118, lineHeight: 1, color: "#fff", textShadow: SOMBRA_FORTE, letterSpacing: -1 }}>
        Abraço frio.
      </div>
      <div style={{ marginTop: 14, whiteSpace: "nowrap", textShadow: SOMBRA_FORTE }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 84, color: "#fff" }}>o amor </span>
        <Etiqueta t={t} a={-1} texto="acabou?" tamanho={84} />
      </div>
    </div>
  );
};

// ---------- legenda ----------
const Legenda: React.FC<{ t: number }> = ({ t }) => {
  const idx = CAPTIONS.findIndex((p, i) => {
    const fim = p.fim ?? CAPTIONS[i + 1]?.palavras[0].t ?? 99;
    return t >= p.palavras[0].t && t < fim;
  });
  if (idx < 0) return null;
  const p = CAPTIONS[idx];
  const fim = p.fim ?? CAPTIONS[idx + 1]?.palavras[0].t ?? 99;
  const k = sai(t, fim, 0.08);
  const larguraEm =
    p.palavras.reduce((a, w) => a + w.w.length * (w.d ? 0.5 * 1.3 : 0.48) + (w.d === "box" ? 0.5 : 0), 0) +
    (p.palavras.length - 1) * 0.28;
  const corpo = Math.min(88, Math.floor(LARGURA / larguraEm));
  return (
    <div
      style={{
        position: "absolute",
        top: 1240,
        left: ESQ,
        width: LARGURA,
        height: 150,
        display: "flex",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: corpo * 0.24,
        opacity: k,
        filter: `blur(${(1 - k) * 4}px)`,
      }}
    >
      {p.palavras.map((w, i) => {
        if (w.d === "box") {
          return (
            <span key={i}>
              <Etiqueta t={t} a={w.t} texto={w.w} tamanho={Math.round(corpo * 1.18)} />
            </span>
          );
        }
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              ...entrada(t, w.t),
              fontFamily: SERIF,
              fontStyle: w.d ? "italic" : "normal",
              fontSize: w.d ? Math.round(corpo * 1.3) : corpo,
              lineHeight: 1,
              color: "#fff",
              textShadow: SOMBRA,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- traço desenhado à mão ----------
const Check: React.FC<{ t: number; a: number; tam?: number }> = ({ t, a, tam = 56 }) => {
  const k = ent(t, a, 0.3);
  return (
    <svg width={tam} height={tam} viewBox="0 0 56 56" style={{ filter: TRACO, flex: `0 0 ${tam}px` }}>
      <circle cx={28} cy={28} r={24} stroke="rgba(255,255,255,.75)" strokeWidth={2.5} fill="none" />
      <path
        d="M16 29 L25 38 L41 18"
        stroke={VERMELHO}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={50}
        strokeDashoffset={50 * (1 - k)}
      />
    </svg>
  );
};

const Risco: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ent(t, a, 0.28);
  return (
    <span
      style={{
        position: "absolute",
        left: "-3%",
        top: "52%",
        height: 6,
        width: `${k * 106}%`,
        background: VERMELHO,
        borderRadius: 3,
        transform: "rotate(-2deg)",
        transformOrigin: "left center",
        boxShadow: "0 2px 6px rgba(0,0,0,.45)",
      }}
    />
  );
};

// ---------- ênfase grande ----------
const Enfase: React.FC<{ t: number }> = ({ t }) => {
  const e = ENFASES.find((x) => t >= x.ini && t < x.fim);
  if (!e) return null;
  const out = sai(t, e.fim, 0.12);
  const deriva = interpolate(t, [e.ini, e.fim], [1, 1.035], cl);
  const tamanho = Math.min(220, Math.floor(LARGURA / (e.grande.length * 0.46)));
  return (
    <div
      style={{
        position: "absolute",
        top: e.centro ? 660 : 190,
        left: ESQ,
        width: LARGURA,
        textAlign: "center",
        opacity: out,
        transform: `scale(${deriva})`,
      }}
    >
      <div
        style={{
          ...entrada(t, e.ini, 0.28, 24),
          fontFamily: SERIF,
          fontSize: tamanho,
          lineHeight: 0.95,
          color: "#fff",
          textShadow: SOMBRA_FORTE,
          letterSpacing: -2,
          whiteSpace: "nowrap",
        }}
      >
        {e.grande}
      </div>
      {e.comp ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, marginTop: 6 }}>
          <div
            style={{
              position: "relative",
              ...entrada(t, e.compT!, 0.24),
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: e.comp.length > 20 ? 56 : 92,
              color: "#fff",
              textShadow: SOMBRA_FORTE,
              whiteSpace: "nowrap",
            }}
          >
            {e.comp}
            {e.risco ? <Risco t={t} a={e.risco} /> : null}
          </div>
          {e.check ? <Check t={t} a={e.check} tam={78} /> : null}
        </div>
      ) : null}
    </div>
  );
};

// ---------- medidor do sentir, em traço fino ----------
const valorEm = (t: number, chaves: [number, number][]) => {
  if (t <= chaves[0][0]) return chaves[0][1];
  for (let i = 0; i < chaves.length - 1; i++) {
    const [t0, v0] = chaves[i];
    const [t1, v1] = chaves[i + 1];
    if (t < t1) return interpolate(t, [t0, t1], [v0, v1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  }
  return chaves[chaves.length - 1][1];
};

const Medidor: React.FC<{ t: number }> = ({ t }) => {
  const m = MEDIDOR.find((x) => t >= x.ini && t < x.fim);
  if (!m) return null;
  const k = ent(t, m.ini, 0.35);
  const o = sai(t, m.fim, 0.18);
  const desenho = ent(t, m.ini, 0.55);
  const v = valorEm(t, m.chaves);
  const W = 600;
  const cx = W / 2;
  const cy = 250;
  const r = 230;
  const ponto = (val: number, rr = r) => {
    const th = Math.PI * (1 - val / 100);
    return [cx + rr * Math.cos(th), cy - rr * Math.sin(th)];
  };
  const [x0, y0] = ponto(0);
  const [x1, y1] = ponto(100);
  const [xv, yv] = ponto(Math.max(0.5, v));
  const [xn, yn] = ponto(v, r - 40);
  const rot = [...m.rotulos].reverse().find((l) => t >= l.t)!;
  // no corte com zoom (14,17 s) o rosto sobe: o desenho encolhe e sobe junto, sem cobrir os olhos
  const doca = m.ini < 14 ? ent(t, 14.1667, 0.22) : 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: CX - W / 2,
        width: W,
        textAlign: "center",
        opacity: k * o,
        transform: `translateY(${(1 - k) * 30 - 40 * doca}px) scale(${1 - 0.28 * doca})`,
        transformOrigin: "50% 0%",
      }}
    >
      <svg width={W} height={290} style={{ overflow: "visible", filter: TRACO }}>
        <path
          d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`}
          stroke="rgba(255,255,255,.8)"
          strokeWidth={3}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - desenho}
        />
        <path d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${xv} ${yv}`} stroke={VERMELHO} strokeWidth={9} fill="none" strokeLinecap="round" />
        {[0, 25, 50, 75, 100].map((tk) => {
          const [a, b] = ponto(tk, r - 14);
          const [c, d] = ponto(tk, r - 34);
          return <line key={tk} x1={a} y1={b} x2={c} y2={d} stroke="rgba(255,255,255,.75)" strokeWidth={2.5} opacity={desenho} />;
        })}
        <line x1={cx} y1={cy} x2={xn} y2={yn} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={10} fill="#fff" />
        <text x={x0 - 6} y={cy + 46} fill="#fff" fontFamily={SERIF} fontStyle="italic" fontSize={36}>
          desligado
        </text>
        <text x={x1 + 6} y={cy + 46} fill="#fff" fontFamily={SERIF} fontStyle="italic" fontSize={36} textAnchor="end">
          intenso
        </text>
      </svg>
      <div style={{ marginTop: -36, height: 110 }}>
        {rot.serif ? (
          <Etiqueta t={t} a={rot.t} texto={rot.texto.toLowerCase()} tamanho={92} />
        ) : (
          <span style={{ ...entrada(t, rot.t), display: "inline-block", fontFamily: SERIF, fontSize: 72, color: "#fff", textShadow: SOMBRA }}>
            {rot.texto.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
};

// ---------- lado de quem tem borderline (em cima, no rosto) ----------
const LadoBorder: React.FC<{ t: number }> = ({ t }) => {
  const c = LADO_BORDER;
  if (t < c.ini || t >= c.fim) return null;
  const o = sai(t, c.fim, 0.16);
  return (
    <div style={{ position: "absolute", top: 120, left: ESQ, width: LARGURA, textAlign: "center", opacity: o }}>
      <Etiqueta t={t} a={c.ini} texto="se você tem borderline" tamanho={66} />
      <div
        style={{
          ...entrada(t, c.texto, 0.26),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginTop: 18,
        }}
      >
        <Check t={t} a={c.marca} tam={84} />
        <div style={{ fontFamily: SERIF, fontSize: 76, lineHeight: 1.0, color: "#fff", textShadow: SOMBRA_FORTE, textAlign: "left" }}>
          um dia sem sentir
          <br />
          <span style={{ fontStyle: "italic" }}>não apaga o afeto</span>
        </div>
      </div>
    </div>
  );
};

// ---------- lado de quem convive (na parede, seta até a janela) ----------
const LadoConvive: React.FC<{ t: number }> = ({ t }) => {
  const c = LADO_CONVIVE;
  if (t < c.ini || t >= c.fim) return null;
  const o = sai(t, c.fim, 0.12);
  const seta = ent(t, c.ini + 0.1, 0.45);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", filter: TRACO }}>
        <path
          d="M 610 832 C 660 780, 640 700, 548 646"
          stroke="#fff"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - seta}
        />
        <path
          d="M 548 646 L 578 648 M 548 646 L 560 674"
          stroke="#fff"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          opacity={seta > 0.95 ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 790,
          left: 0,
          width: 1080,
          height: 380,
          background: "radial-gradient(ellipse 50% 50% at 46% 50%, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 100%)",
          opacity: ent(t, c.ini, 0.3),
        }}
      />
      <div style={{ position: "absolute", top: 836, left: ESQ, width: LARGURA, textAlign: "center" }}>
        <Etiqueta t={t} a={c.ini} texto="se você convive" tamanho={62} />
        {c.itens.map((it, i) => (
          <div key={i} style={{ marginTop: i ? 10 : 22 }}>
            <span
              style={{
                position: "relative",
                display: "inline-block",
                ...entrada(t, it.t, 0.24),
                fontFamily: SERIF,
                fontStyle: i ? "italic" : "normal",
                fontSize: 60,
                color: "#fff",
                textShadow: SOMBRA_FORTE,
                whiteSpace: "nowrap",
              }}
            >
              {it.texto}
              {it.risco ? <Risco t={t} a={it.risco} /> : null}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- linha do tempo do alerta ----------
const Alerta: React.FC<{ t: number }> = ({ t }) => {
  const a = ALERTA;
  if (t < a.ini || t >= a.fim) return null;
  const o = sai(t, a.fim, 0.16);
  const k = ent(t, a.ini, 0.3);
  const f = interpolate(t, [a.encheDe, a.encheAte], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const L = 640;
  return (
    <div style={{ position: "absolute", top: 120, left: CX - L / 2, width: L, textAlign: "center", opacity: o }}>
      <div style={{ display: "flex", justifyContent: "space-between", ...entrada(t, a.ini, 0.3) }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 52, color: "#fff", textShadow: SOMBRA }}>1 dia</span>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 52, color: f > 0.97 ? "#fff" : "rgba(255,255,255,.7)", textShadow: SOMBRA }}>
          semanas
        </span>
      </div>
      <svg width={L} height={40} style={{ overflow: "visible", filter: TRACO, marginTop: 4 }}>
        <line x1={10} y1={20} x2={10 + (L - 20) * k} y2={20} stroke="rgba(255,255,255,.75)" strokeWidth={3} />
        <line x1={10} y1={20} x2={10 + (L - 20) * f} y2={20} stroke={VERMELHO} strokeWidth={9} strokeLinecap="round" />
        <circle cx={10} cy={20} r={9} fill="#fff" opacity={k} />
        <circle cx={10 + (L - 20) * f} cy={20} r={13} fill={VERMELHO} stroke="#fff" strokeWidth={3} opacity={f > 0.02 ? 1 : 0} />
      </svg>
      <div style={{ ...entrada(t, a.alerta, 0.26), marginTop: 22, fontFamily: SERIF, fontSize: 60, color: "#fff", textShadow: SOMBRA_FORTE }}>
        ou algum <span style={{ fontStyle: "italic" }}>sinal de alerta</span>
      </div>
      <div style={{ marginTop: 16 }}>{t >= a.ajuda ? <Etiqueta t={t} a={a.ajuda} texto="procure ajuda" tamanho={84} /> : null}</div>
    </div>
  );
};

export const AbracoFrio: React.FC = () => {
  carregarFontes();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const dur = durationInFrames / fps;
  const flash = interpolate(t, [6.4667, 6.5, 6.5667], [0.85, 0.5, 0], cl);
  const preto = interpolate(t, [dur - 0.1, dur - 1 / fps], [0, 1], cl);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0D0D" }}>
      <Base t={t} frame={frame} />
      <Gancho t={t} />
      <Medidor t={t} />
      <LadoBorder t={t} />
      <LadoConvive t={t} />
      <Alerta t={t} />
      <Enfase t={t} />
      <Legenda t={t} />
      {t >= 6.4667 && t < 6.5667 ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} /> : null}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: preto }} />
    </AbsoluteFill>
  );
};
