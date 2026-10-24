import { Easing, interpolate, spring } from "remotion";
import { Inter, Montserrat, Playfair } from "../load-font";

// Peças de interface compartilhadas pelos clipes de "Borderline, a intensa".

export const RED = "#CC0000";
export const BG = "#0D0D0D";
export const CARD = "#161616";
export const CARD2 = "#1E1E1E";
export const CARD3 = "#262626";
export const BORDER = "rgba(255,255,255,0.09)";
export const MUTED = "#8A8A8A";
export const WHITE = "#FFFFFF";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const suave = (t: number, a: number, b: number) => Easing.out(Easing.cubic)(prog(t, a, b));
export const salta = (t: number, a: number, b: number) => Easing.out(Easing.back(1.7))(prog(t, a, b));

// Pulso que nasce em cada batida e decai em ~0,35 s.
export const pulsoBatida = (t: number, beats: number[]) => {
  let melhor = 0;
  for (const b of beats) {
    if (b <= t && t - b < 0.35) {
      melhor = Math.max(melhor, 1 - (t - b) / 0.35);
    }
  }
  return melhor * melhor;
};

export type Palavra = { w: string; serif?: boolean; red?: boolean };
export type Grupo = { t: number; palavras: Palavra[] };
export type Linha = { t0: number; t1: number; grupos: Grupo[] };

// Letra em grupos de até três palavras, cada grupo entra com mola.
export const Letra: React.FC<{
  t: number;
  fps: number;
  frame: number;
  linhas: Linha[];
  top?: number;
}> = ({ t, fps, frame, linhas, top = 980 }) => {
  const linha = linhas.find((l) => t >= l.t0 && t < l.t1);
  if (!linha) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        width: 840,
        top,
        height: 1520 - top,
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
        const s = spring({
          frame: frame - Math.round(g.t * fps),
          fps,
          config: { damping: 16, stiffness: 190, mass: 0.7 },
        });
        const serif = g.palavras[0].serif;
        const red = g.palavras[0].red;
        const texto = g.palavras.map((p) => p.w).join(" ");
        // Encolhe só o que não cabe em 840 px (largura média por letra estimada).
        const base = serif ? 140 : 112;
        const fontSize = Math.min(base, 840 / (texto.length * (serif ? 0.45 : 0.6)));
        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [46, 0])}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
              fontFamily: serif ? Playfair : Montserrat,
              fontStyle: serif ? "italic" : "normal",
              fontWeight: serif ? 600 : 800,
              fontSize,
              lineHeight: 1.02,
              letterSpacing: serif ? -1 : -2,
              color: red ? RED : WHITE,
              textShadow: "0 6px 24px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            {texto}
          </div>
        );
      })}
    </div>
  );
};

export const Rotulo: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: Inter,
      fontWeight: 500,
      fontSize: 28,
      color: MUTED,
      letterSpacing: 2,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

// Ícones de linha, simples, no estilo Lucide.
const Icone: React.FC<{ d: React.ReactNode; size?: number; cor?: string; fill?: string }> = ({
  d,
  size = 40,
  cor = MUTED,
  fill = "none",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={cor} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

export const Icones = {
  casa: (c: string, s?: number) => <Icone cor={c} size={s} d={<><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /></>} />,
  busca: (c: string, s?: number) => <Icone cor={c} size={s} d={<><circle cx={11} cy={11} r={7} /><path d="m20 20-3.5-3.5" /></>} />,
  sino: (c: string, s?: number) => <Icone cor={c} size={s} d={<><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>} />,
  pessoa: (c: string, s?: number) => <Icone cor={c} size={s} d={<><circle cx={12} cy={8} r={4} /><path d="M4 21a8 8 0 0 1 16 0" /></>} />,
  play: (c: string, s?: number) => <Icone cor={c} fill={c} size={s} d={<path d="M7 4v16l13-8z" />} />,
  pausa: (c: string, s?: number) => <Icone cor={c} fill={c} size={s} d={<><rect x={6} y={4} width={4} height={16} /><rect x={14} y={4} width={4} height={16} /></>} />,
  anterior: (c: string, s?: number) => <Icone cor={c} fill={c} size={s} d={<><path d="M19 5v14L8 12z" /><rect x={5} y={5} width={2} height={14} /></>} />,
  proximo: (c: string, s?: number) => <Icone cor={c} fill={c} size={s} d={<><path d="M5 5v14l11-7z" /><rect x={17} y={5} width={2} height={14} /></>} />,
  coracao: (c: string, s?: number) => <Icone cor={c} size={s} d={<path d="M12 21s-7-4.6-9.3-9A5.2 5.2 0 0 1 12 6.3 5.2 5.2 0 0 1 21.3 12C19 16.4 12 21 12 21z" />} />,
  menu: (c: string, s?: number) => <Icone cor={c} size={s} d={<><circle cx={5} cy={12} r={1.4} fill={c} /><circle cx={12} cy={12} r={1.4} fill={c} /><circle cx={19} cy={12} r={1.4} fill={c} /></>} />,
  check: (c: string, s?: number) => <Icone cor={c} size={s} d={<path d="m5 12 5 5L20 7" />} />,
  enviar: (c: string, s?: number) => <Icone cor={c} fill={c} size={s} d={<path d="M3 11.5 21 3l-7 18-3-7z" />} />,
  som: (c: string, s?: number) => <Icone cor={c} size={s} d={<><path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /></>} />,
  x: (c: string, s?: number) => <Icone cor={c} size={s} d={<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>} />,
};

export type Aba = "casa" | "busca" | "sino" | "pessoa";

// Cartão de interface com cabeçalho e barra de abas.
export const Cartao: React.FC<{
  children: React.ReactNode;
  entrada: number;
  saida: number;
  altura?: number;
  titulo?: string;
  aba?: Aba;
  badge?: number;
  top?: number;
}> = ({ children, entrada, saida, altura = 620, titulo, aba, badge = 0, top = 300 }) => {
  const op = Math.min(entrada, 1 - saida);
  const y = interpolate(entrada, [0, 1], [60, 0]) - saida * 40;
  const abas: Aba[] = ["casa", "busca", "sino", "pessoa"];
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        width: 800,
        top,
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
      {titulo !== undefined && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Rotulo>{titulo}</Rotulo>
          {Icones.menu(MUTED, 36)}
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: titulo !== undefined ? 100 : 0, bottom: aba ? 110 : 0 }}>{children}</div>
      {aba && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 110,
            borderTop: `2px solid ${BORDER}`,
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "0 40px",
          }}
        >
          {abas.map((a) => {
            const ativa = a === aba;
            return (
              <div key={a} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                {Icones[a](ativa ? WHITE : "#5A5A5A", 42)}
                <div style={{ width: 8, height: 8, borderRadius: 4, background: ativa ? RED : "transparent" }} />
                {a === "sino" && badge > 0 && (
                  <div style={{ position: "absolute", top: -10, right: -16, minWidth: 30, height: 30, borderRadius: 15, background: RED, color: WHITE, fontSize: 20, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
                    {badge}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Toque na tela: anel que cresce e some em 0,4 s, a partir do instante `em`.
export const Toque: React.FC<{ t: number; em: number; x: number; y: number }> = ({ t, em, x, y }) => {
  const p = prog(t, em, em + 0.4);
  if (t < em || p >= 1) {
    return null;
  }
  const r = interpolate(p, [0, 1], [22, 70]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: "50%",
        border: `4px solid rgba(255,255,255,${0.9 * (1 - p)})`,
        background: `rgba(255,255,255,${0.25 * (1 - p)})`,
        pointerEvents: "none",
      }}
    />
  );
};

// Aviso curto no topo do cartão.
export const Toast: React.FC<{ t: number; em: number; dura?: number; children: React.ReactNode }> = ({ t, em, dura = 1.6, children }) => {
  const entra = salta(t, em, em + 0.35);
  const sai = prog(t, em + dura, em + dura + 0.3);
  if (t < em || sai >= 1) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: -72,
        zIndex: 2,
        transform: `translateX(-50%) translateY(${(1 - entra) * -40 - sai * 30}px)`,
        opacity: Math.min(entra, 1 - sai),
        background: WHITE,
        color: BG,
        fontFamily: Inter,
        fontWeight: 600,
        fontSize: 26,
        padding: "14px 26px",
        borderRadius: 30,
        display: "flex",
        alignItems: "center",
        gap: 12,
        whiteSpace: "nowrap",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {children}
    </div>
  );
};

// Botão de pílula.
export const Botao: React.FC<{ children: React.ReactNode; cheio?: boolean; cor?: string; style?: React.CSSProperties }> = ({ children, cheio, cor = RED, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: "18px 32px",
      borderRadius: 32,
      background: cheio ? cor : "transparent",
      border: cheio ? "none" : `2px solid ${BORDER}`,
      color: WHITE,
      fontFamily: Inter,
      fontWeight: 600,
      fontSize: 28,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// Caixa de busca com texto digitado letra a letra e cursor piscando.
export const Busca: React.FC<{ t: number; texto: string; de: number; ate: number }> = ({ t, texto, de, ate }) => {
  const n = Math.round(prog(t, de, ate) * texto.length);
  const cursor = Math.floor(t * 2.5) % 2 === 0 || t < ate;
  return (
    <div style={{ height: 76, borderRadius: 38, background: CARD2, display: "flex", alignItems: "center", gap: 18, padding: "0 28px" }}>
      {Icones.busca(MUTED, 34)}
      <div style={{ fontFamily: Inter, fontWeight: 500, fontSize: 32, color: n > 0 ? WHITE : MUTED }}>
        {n > 0 ? texto.slice(0, n) : "buscar"}
        <span style={{ display: "inline-block", width: 3, height: 34, background: WHITE, marginLeft: 3, verticalAlign: "middle", opacity: cursor ? 1 : 0 }} />
      </div>
    </div>
  );
};

export const Slider: React.FC<{ valor: number; cor?: string }> = ({ valor, cor = RED }) => (
  <div style={{ position: "relative", height: 10, borderRadius: 5, background: CARD3 }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${valor * 100}%`, background: cor, borderRadius: 5 }} />
    <div style={{ position: "absolute", top: -11, left: `calc(${valor * 100}% - 16px)`, width: 32, height: 32, borderRadius: 16, background: WHITE, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }} />
  </div>
);

export const Switch: React.FC<{ ligado: number }> = ({ ligado }) => (
  <div style={{ width: 96, height: 54, borderRadius: 27, background: ligado > 0.5 ? RED : CARD3, position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 5, left: interpolate(ligado, [0, 1], [5, 47]), width: 44, height: 44, borderRadius: 22, background: WHITE }} />
  </div>
);

export const fontes = { Inter, Montserrat, Playfair };

export const Avatar: React.FC<{ tam?: number; cor?: string }> = ({ tam = 64, cor = "#2E2E2E" }) => (
  <div style={{ width: tam, height: tam, borderRadius: tam / 2, background: cor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {Icones.pessoa("#5A5A5A", tam * 0.55)}
  </div>
);

export const BarraTexto: React.FC<{ largura: number; alto?: number }> = ({ largura, alto = 18 }) => (
  <div style={{ width: largura, height: alto, borderRadius: alto / 2, background: CARD3 }} />
);

// Cartão final: chamada grande e folha de envio com o botão sendo tocado.
export const FolhaEnvio: React.FC<{
  t: number;
  fps: number;
  frame: number;
  em: number;
  linhas: [string, string, string];
}> = ({ t, fps, frame, em, linhas }) => {
  if (t < em) {
    return null;
  }
  const s = spring({ frame: frame - Math.round((em + 0.1) * fps), fps, config: { damping: 18, stiffness: 150 } });
  const s2 = spring({ frame: frame - Math.round((em + 0.5) * fps), fps, config: { damping: 18, stiffness: 150 } });
  const enviaEm = em + 1.25;
  const enviado = suave(t, enviaEm + 0.1, enviaEm + 0.4);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 80, top: 330, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, fontFamily: Montserrat, fontWeight: 800, fontSize: 92, lineHeight: 1.04, letterSpacing: -2, color: WHITE }}>
        {linhas[0]}
        <br />
        {linhas[1]}
        <br />
        <span style={{ fontFamily: Playfair, fontStyle: "italic", fontWeight: 600, color: RED, fontSize: 120, letterSpacing: 0 }}>{linhas[2]}</span>
      </div>
      <div style={{ position: "absolute", left: 100, width: 800, top: 760, opacity: s2, transform: `translateY(${(1 - s2) * 50}px)`, background: CARD, border: `2px solid ${BORDER}`, borderRadius: 44, padding: "40px 60px", fontFamily: Inter, display: "flex", flexDirection: "column", gap: 28, boxShadow: "0 30px 80px rgba(0,0,0,0.55)" }}>
        <Rotulo>Enviar para</Rotulo>
        <div style={{ display: "flex", gap: 26 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Avatar tam={92} cor={i === 1 ? "#3A3A3A" : "#2E2E2E"} />
                {i === 1 && enviado > 0 && (
                  <div style={{ position: "absolute", right: -6, bottom: -6, width: 38, height: 38, borderRadius: 19, background: RED, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${enviado})` }}>
                    {Icones.check(WHITE, 24)}
                  </div>
                )}
              </div>
              <BarraTexto largura={64} alto={12} />
            </div>
          ))}
        </div>
        <div style={{ height: 2, background: BORDER }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ flex: 1, height: 70, borderRadius: 35, background: CARD2, display: "flex", alignItems: "center", padding: "0 26px", fontSize: 26, color: MUTED, fontWeight: 500 }}>
            {enviado > 0.5 ? "enviado" : "escrever mensagem"}
          </div>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: RED, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.15 * Math.sin(Math.min(1, prog(t, enviaEm, enviaEm + 0.3)) * Math.PI)})` }}>
            {Icones.enviar(WHITE, 34)}
          </div>
        </div>
        <Toque t={t} em={enviaEm} x={705} y={303} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 1360, opacity: s2, fontFamily: Inter, fontWeight: 500, fontSize: 30, color: MUTED }}>
        Dr. Fabio Schmidt, médico, CRM-SP 183549
      </div>
    </div>
  );
};
