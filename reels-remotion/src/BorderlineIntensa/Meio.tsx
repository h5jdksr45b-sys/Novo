import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFontesClipe } from "../load-font";
import tempos from "./tempos-meio.json";
import {
  Avatar,
  BarraTexto,
  BG,
  CARD2,
  CARD3,
  Cartao,
  FolhaEnvio,
  Icones,
  Letra,
  Linha,
  MUTED,
  RED,
  Rotulo,
  Slider,
  Switch,
  Toast,
  Toque,
  WHITE,
  fontes,
  prog,
  pulsoBatida,
  salta,
  suave,
} from "./comum";

// Clipe de 28 s para o meio da música "Borderline, a intensa": de "Se desmarca
// nosso encontro" até "que eu sinto em alta corrente" (0:33 a 0:59 do original),
// mais a folha de envio no final. Telas: agenda com encontro desmarcado, terapia
// com dois anos e balança, respiração, gastos, grupo, rotina da noite e aviso de
// alta corrente.

const AUDIO = staticFile("musica/borderline-a-intensa-meio.wav");
const beats: number[] = tempos.beats;
const FIM_MUSICA = 26.2;
const ALTURA = 700;
const { Montserrat } = fontes;

const LINHAS: Linha[] = [
  { t0: 0.413, t1: 2.248, grupos: [{ t: 0.413, palavras: [{ w: "SE DESMARCA" }] }, { t: 1.3, palavras: [{ w: "NOSSO ENCONTRO," }] }] },
  { t0: 2.248, t1: 4.004, grupos: [{ t: 2.248, palavras: [{ w: "JÁ ME VEJO" }] }, { t: 3.1, palavras: [{ w: "andar na prancha", serif: true, red: true }] }] },
  { t0: 4.004, t1: 5.919, grupos: [{ t: 4.004, palavras: [{ w: "DOIS ANOS" }] }, { t: 4.9, palavras: [{ w: "DE TERAPIA", red: true }] }] },
  { t0: 5.919, t1: 7.754, grupos: [{ t: 5.919, palavras: [{ w: "PRA SAIR" }] }, { t: 6.75, palavras: [{ w: "dessa balança", serif: true }] }] },
  { t0: 7.754, t1: 9.589, grupos: [{ t: 7.754, palavras: [{ w: "POR ISSO" }] }, { t: 8.4, palavras: [{ w: "QUE NÓS" }] }, { t: 9.0, palavras: [{ w: "respira", serif: true, red: true }] }] },
  { t0: 9.589, t1: 11.424, grupos: [{ t: 9.589, palavras: [{ w: "POR ISSO" }] }, { t: 10.2, palavras: [{ w: "QUE NÓS" }] }, { t: 10.8, palavras: [{ w: "descansa", serif: true, red: true }] }] },
  { t0: 11.424, t1: 13.02, grupos: [{ t: 11.424, palavras: [{ w: "DÁ PRA PAGAR" }] }, { t: 12.2, palavras: [{ w: "UM ALUGUEL" }] }] },
  { t0: 13.02, t1: 15.334, grupos: [{ t: 13.02, palavras: [{ w: "SÓ COM MEU" }] }, { t: 13.8, palavras: [{ w: "GASTO", red: true }] }, { t: 14.5, palavras: [{ w: "de repente", serif: true }] }] },
  { t0: 15.334, t1: 16.929, grupos: [{ t: 15.334, palavras: [{ w: "É O BONDE" }] }, { t: 16.1, palavras: [{ w: "das intensas", serif: true, red: true }] }] },
  { t0: 16.929, t1: 18.764, grupos: [{ t: 16.929, palavras: [{ w: "SÓ PATROA" }] }, { t: 17.8, palavras: [{ w: "CONSCIENTE", red: true }] }] },
  { t0: 18.764, t1: 20.6, grupos: [{ t: 18.764, palavras: [{ w: "BRINDE COM" }] }, { t: 19.6, palavras: [{ w: "chá de cidreira", serif: true }] }] },
  { t0: 20.6, t1: 22.435, grupos: [{ t: 20.6, palavras: [{ w: "MEU DIÁRIO" }] }, { t: 21.5, palavras: [{ w: "VAI NA FRENTE", red: true }] }] },
  { t0: 22.435, t1: 24.27, grupos: [{ t: 22.435, palavras: [{ w: "MUITO CUIDADO" }] }, { t: 23.4, palavras: [{ w: "COMIGO" }] }] },
  { t0: 24.27, t1: FIM_MUSICA, grupos: [{ t: 24.27, palavras: [{ w: "QUE EU SINTO" }] }, { t: 25.1, palavras: [{ w: "em alta corrente", serif: true, red: true }] }] },
];

// Cena A: agenda. O encontro é desmarcado e a sensação corre até o fim da prancha.
const CenaAgenda: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 0, 0.35);
  const saida = prog(t, 3.75, 4.0);
  const cancelaEm = 1.3;
  const cancelado = suave(t, cancelaEm + 0.05, cancelaEm + 0.35);
  const sensacaoIn = suave(t, 2.248, 2.6);
  const valor = interpolate(Easing.in(Easing.cubic)(prog(t, 2.5, 3.7)), [0, 1], [0.12, 1]);
  const fimIn = salta(t, 3.1, 3.4);
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Agenda" aba="casa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ background: CARD2, borderRadius: 26, padding: "26px 28px", display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 110, height: 110, borderRadius: 22, background: CARD3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 20, color: MUTED, fontWeight: 600, letterSpacing: 2 }}>SÁB</div>
            <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 40, color: cancelado > 0.5 ? MUTED : WHITE }}>20h</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 600, color: cancelado > 0.5 ? MUTED : WHITE, textDecoration: cancelado > 0.5 ? "line-through" : "none" }}>Encontro</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar tam={34} />
              <BarraTexto largura={140} alto={14} />
            </div>
          </div>
          <div style={{ padding: "10px 20px", borderRadius: 18, background: cancelado > 0.5 ? RED : CARD3, color: cancelado > 0.5 ? WHITE : MUTED, fontSize: 24, fontWeight: 600, transform: `scale(${1 + 0.12 * Math.sin(cancelado * Math.PI)})` }}>
            {cancelado > 0.5 ? "desmarcado" : "confirmado"}
          </div>
        </div>
        <div style={{ opacity: sensacaoIn, transform: `translateY(${(1 - sensacaoIn) * 24}px)`, background: CARD2, borderRadius: 26, padding: "26px 28px 34px", display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Rotulo style={{ fontSize: 24 }}>Sensação</Rotulo>
            <div style={{ opacity: fimIn, transform: `scale(${fimIn})`, color: RED, fontSize: 24, fontWeight: 600 }}>no fim da prancha</div>
          </div>
          <Slider valor={valor} cor={valor > 0.8 ? RED : WHITE} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: MUTED, fontWeight: 500 }}>
            <span>tudo bem</span>
            <span>fim</span>
          </div>
        </div>
      </div>
      <Toque t={t} em={cancelaEm} x={640} y={55} />
      <Toast t={t} em={cancelaEm + 0.15} dura={1.0}>
        {Icones.x(BG, 26)} convite cancelado
      </Toast>
    </Cartao>
  );
};

// Cena B: terapia. Vinte e quatro meses acendem; a balança para de oscilar.
const CenaTerapia: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 4.004, 4.35);
  const saida = prog(t, 7.5, 7.75);
  const meses = 24;
  const balancaIn = suave(t, 5.919, 6.25);
  // Oscila forte e vai parando no centro.
  const amp = interpolate(Easing.in(Easing.quad)(prog(t, 6.0, 7.6)), [0, 1], [0.42, 0]);
  const pos = 0.5 + amp * Math.sin((t - 6.0) * 9.5);
  const parou = amp < 0.03;
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Terapia" aba="pessoa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ background: CARD2, borderRadius: 26, padding: "26px 28px", display: "flex", gap: 30, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 190 }}>
            <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 64, color: RED, lineHeight: 1 }}>{Math.round(interpolate(suave(t, 4.1, 5.6), [0, 1], [0, 2]))} anos</div>
            <div style={{ fontSize: 24, color: MUTED, fontWeight: 500 }}>em acompanhamento</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10, flex: 1 }}>
            {Array.from({ length: meses }).map((_, i) => {
              const s = salta(t, 4.1 + i * 0.062, 4.4 + i * 0.062);
              return <div key={i} style={{ height: 26, borderRadius: 8, background: s > 0 ? RED : CARD3, opacity: s > 0 ? 0.35 + 0.65 * s : 1, transform: `scale(${0.6 + 0.4 * s})` }} />;
            })}
          </div>
        </div>
        <div style={{ opacity: balancaIn, transform: `translateY(${(1 - balancaIn) * 24}px)`, background: CARD2, borderRadius: 26, padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Rotulo style={{ fontSize: 24 }}>Balança</Rotulo>
            <div style={{ color: parou ? RED : MUTED, fontSize: 24, fontWeight: 600 }}>{parou ? "estável" : "oscilando"}</div>
          </div>
          <div style={{ position: "relative", height: 70 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 31, height: 8, borderRadius: 4, background: CARD3 }} />
            <div style={{ position: "absolute", left: "50%", top: 18, width: 4, height: 34, background: MUTED, transform: "translateX(-2px)" }} />
            <div style={{ position: "absolute", top: 8, left: `calc(${pos * 100}% - 27px)`, width: 54, height: 54, borderRadius: 27, background: parou ? RED : WHITE, boxShadow: "0 6px 16px rgba(0,0,0,0.5)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: MUTED, fontWeight: 600 }}>
            <span>8</span>
            <span>80</span>
          </div>
        </div>
      </div>
    </Cartao>
  );
};

// Cena C: respirar. O círculo enche; depois esvazia e o modo descanso liga.
const CenaRespirar: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 7.754, 8.1);
  const saida = prog(t, 11.2, 11.45);
  const inspira = Easing.inOut(Easing.sin)(prog(t, 7.9, 9.5));
  const solta = Easing.inOut(Easing.sin)(prog(t, 9.7, 11.2));
  const escala = interpolate(inspira - solta, [0, 1], [0.55, 1]);
  const descansa = t >= 9.589;
  const ligaEm = 10.8;
  const liga = suave(t, ligaEm, ligaEm + 0.3);
  const pulso = pulsoBatida(t, beats);
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Respirar" aba="casa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, bottom: 0 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 10, height: 330, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[1.35, 1.15].map((k, i) => (
            <div key={i} style={{ position: "absolute", width: 300 * escala * k, height: 300 * escala * k, borderRadius: "50%", border: `2px solid rgba(204,0,0,${0.25 - i * 0.08})` }} />
          ))}
          <div style={{ width: 300 * escala, height: 300 * escala, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #9a0000 0%, ${RED} 55%, #5a0000 100%)`, boxShadow: `0 0 ${30 + pulso * 30}px rgba(204,0,0,0.5)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 34 * Math.max(0.7, escala), fontWeight: 600, color: WHITE, letterSpacing: 2, textTransform: "uppercase" }}>{descansa ? "solta" : "inspira"}</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, background: CARD2, borderRadius: 26, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: suave(t, 9.589, 9.9) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={liga > 0.5 ? RED : MUTED} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 30, fontWeight: 600 }}>Modo descanso</div>
              <div style={{ fontSize: 22, color: MUTED, fontWeight: 500 }}>{liga > 0.5 ? "ligado até amanhã" : "desligado"}</div>
            </div>
          </div>
          <Switch ligado={liga} />
        </div>
      </div>
      <Toque t={t} em={ligaEm} x={690} y={400} />
    </Cartao>
  );
};

// Cena D: gastos. Compras de repente empilham até a barra alcançar o aluguel.
const CenaGastos: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 11.424, 11.75);
  const saida = prog(t, 15.1, 15.35);
  const chegadas = [13.05, 13.3, 13.55, 13.8, 14.05];
  const horas = ["22:14", "22:15", "22:17", "22:18", "22:19"];
  const cresce = suave(t, 13.1, 15.0);
  const igualou = cresce > 0.97;
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Gastos do mês" aba="busca">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", gap: 26 }}>
        <div style={{ width: 250, background: CARD2, borderRadius: 26, padding: "22px 24px", display: "flex", gap: 22, alignItems: "flex-end", height: 400, boxSizing: "border-box" }}>
          {[
            { nome: "aluguel", h: 1, cor: WHITE, p: suave(t, 11.6, 12.3) },
            { nome: "de repente", h: cresce, cor: RED, p: 1 },
          ].map((b) => (
            <div key={b.nome} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: "100%", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", height: `${Math.max(2, b.h * b.p * 78)}%`, background: b.cor, borderRadius: 12 }} />
              <div style={{ fontSize: 20, color: MUTED, fontWeight: 600, whiteSpace: "nowrap" }}>{b.nome}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 6px" }}>
            <Rotulo style={{ fontSize: 22 }}>hoje à noite</Rotulo>
            <div style={{ fontSize: 22, fontWeight: 600, color: igualou ? RED : MUTED }}>{igualou ? "igual ao aluguel" : `${chegadas.filter((c) => t >= c).length} compras`}</div>
          </div>
          {chegadas.map((c, i) => {
            const s = salta(t, c, c + 0.3);
            if (t < c) {
              return null;
            }
            return (
              <div key={i} style={{ opacity: s, transform: `translateX(${(1 - s) * 60}px)`, background: CARD2, borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: CARD3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: RED }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>compra</div>
                  <div style={{ fontSize: 18, color: MUTED, fontWeight: 500 }}>{horas[i]}</div>
                </div>
                <BarraTexto largura={70} alto={16} />
              </div>
            );
          })}
        </div>
      </div>
    </Cartao>
  );
};

// Cena E: grupo. As intensas entram; o selo consciente aparece em cada uma.
const CenaGrupo: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 15.334, 15.65);
  const saida = prog(t, 18.5, 18.76);
  const entradas = [15.55, 15.75, 15.95, 16.15, 16.35];
  const seloEm = 17.8;
  const selo = salta(t, seloEm, seloEm + 0.35);
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Grupo" aba="pessoa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, paddingBottom: 4 }}>
          <div style={{ width: 86, height: 86, borderRadius: 43, background: `radial-gradient(circle at 30% 30%, #7a0000 0%, ${RED} 50%, #2a0000 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {Icones.pessoa(WHITE, 48)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 600 }}>bonde das intensas</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 22, color: MUTED, fontWeight: 500 }}>{entradas.filter((e) => t >= e).length} participantes</div>
              <div style={{ opacity: selo, transform: `scale(${selo})`, display: "flex", alignItems: "center", gap: 6, background: RED, color: WHITE, fontSize: 20, fontWeight: 600, padding: "4px 12px", borderRadius: 12 }}>
                {Icones.check(WHITE, 18)} só consciente
              </div>
            </div>
          </div>
        </div>
        {entradas.map((e, i) => {
          const s = salta(t, e, e + 0.3);
          if (t < e) {
            return null;
          }
          return (
            <div key={i} style={{ opacity: s, transform: `translateY(${(1 - s) * 20}px)`, background: CARD2, borderRadius: 18, padding: "8px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar tam={42} />
              <BarraTexto largura={[150, 200, 120, 180, 160][i]} alto={14} />
              <div style={{ flex: 1 }} />
              <div style={{ fontSize: 20, color: MUTED, fontWeight: 500 }}>entrou</div>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: t >= seloEm + i * 0.08 ? RED : CARD3, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${salta(t, seloEm + i * 0.08, seloEm + 0.3 + i * 0.08) || 0.8})` }}>
                {t >= seloEm + i * 0.08 && Icones.check(WHITE, 18)}
              </div>
            </div>
          );
        })}
      </div>
    </Cartao>
  );
};

// Cena F: rotina da noite. Marca o chá; o diário sobe para o primeiro lugar.
const CenaRotina: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 18.764, 19.1);
  const saida = prog(t, 22.2, 22.44);
  const chaEm = 19.6;
  const sobeEm = 20.7;
  const sobe = suave(t, sobeEm, sobeEm + 0.6);
  const itens = ["banho", "chá de cidreira", "diário", "dormir"];
  const ALT = 92;
  const ordem = (i: number) => {
    // diário (índice 2) vai para o topo; banho e chá descem uma posição.
    if (i === 2) {
      return interpolate(sobe, [0, 1], [2, 0]);
    }
    if (i < 2) {
      return interpolate(sobe, [0, 1], [i, i + 1]);
    }
    return i;
  };
  const primeiroIn = salta(t, 21.5, 21.85);
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Rotina da noite" aba="casa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 18 }}>
          <Rotulo style={{ fontSize: 24 }}>{t >= chaEm ? "1 de 4 feito" : "0 de 4 feito"}</Rotulo>
          <div style={{ opacity: primeiroIn, transform: `scale(${primeiroIn})`, color: RED, fontSize: 24, fontWeight: 600 }}>diário em primeiro</div>
        </div>
        <div style={{ position: "relative", height: 4 * ALT }}>
          {itens.map((nome, i) => {
            const s = suave(t, 18.9 + i * 0.08, 19.2 + i * 0.08);
            const feito = i === 1 && t >= chaEm;
            const ehDiario = i === 2;
            const levanta = ehDiario ? Math.sin(sobe * Math.PI) : 0;
            return (
              <div key={nome} style={{ position: "absolute", left: 0, right: 0, top: ordem(i) * ALT, height: ALT - 14, opacity: s, transform: `translateX(${(1 - s) * 30}px) scale(${1 + levanta * 0.04})`, zIndex: ehDiario ? 2 : 1, background: ehDiario && sobe > 0 ? CARD3 : CARD2, borderRadius: 22, display: "flex", alignItems: "center", gap: 20, padding: "0 22px", boxShadow: levanta > 0 ? `0 ${levanta * 20}px ${levanta * 40}px rgba(0,0,0,0.6)` : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, border: `3px solid ${feito ? RED : MUTED}`, background: feito ? RED : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {feito && Icones.check(WHITE, 26)}
                </div>
                <div style={{ fontSize: 30, fontWeight: 600, color: feito ? MUTED : WHITE, textDecoration: feito ? "line-through" : "none" }}>{nome}</div>
                <div style={{ flex: 1 }} />
                {ehDiario && sobe >= 1 && <div style={{ fontSize: 22, color: RED, fontWeight: 600 }}>1º</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[0, 1, 2].map((k) => <div key={k} style={{ width: 26, height: 3, background: "#4A4A4A", borderRadius: 2 }} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Toque t={t} em={chaEm} x={80} y={60 + ALT + 36} />
      <Toque t={t} em={sobeEm - 0.1} x={650} y={60 + 2 * ALT + 36} />
    </Cartao>
  );
};

// Cena G: aviso. O ponteiro sobe até a faixa vermelha de alta corrente.
const CenaAviso: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 22.435, 22.8);
  const saida = prog(t, FIM_MUSICA - 0.15, FIM_MUSICA + 0.1);
  const cuidadoIn = salta(t, 22.7, 23.05);
  const nivel = interpolate(Easing.inOut(Easing.cubic)(prog(t, 23.6, 25.4)), [0, 1], [0.08, 0.93]);
  const alta = nivel > 0.72;
  const pulso = pulsoBatida(t, beats);
  // Arco de 180 graus, raio 240, centro em (340, 270).
  const cx = 340;
  const cy = 270;
  const r = 230;
  const ang = Math.PI * (1 - nivel);
  const px = cx + r * Math.cos(ang) * 0.82;
  const py = cy - r * Math.sin(ang) * 0.82;
  const arco = (a0: number, a1: number) => {
    const x0 = cx + r * Math.cos(Math.PI * (1 - a0));
    const y0 = cy - r * Math.sin(Math.PI * (1 - a0));
    const x1 = cx + r * Math.cos(Math.PI * (1 - a1));
    const y1 = cy - r * Math.sin(Math.PI * (1 - a1));
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Aviso" aba="sino" badge={alta ? 1 : 0}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, bottom: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: cuidadoIn, transform: `scale(${cuidadoIn})`, transformOrigin: "left center", display: "flex", alignItems: "center", gap: 10, border: `2px solid ${RED}`, color: RED, fontSize: 24, fontWeight: 600, padding: "10px 18px", borderRadius: 18, letterSpacing: 1, textTransform: "uppercase" }}>
          cuidado
        </div>
        <svg width={680} height={300} style={{ position: "absolute", left: 0, top: 30, overflow: "visible" }}>
          <path d={arco(0, 0.72)} fill="none" stroke={CARD3} strokeWidth={26} strokeLinecap="round" />
          <path d={arco(0.72, 1)} fill="none" stroke={alta ? RED : "#4A1010"} strokeWidth={26} strokeLinecap="round" style={{ filter: alta ? `drop-shadow(0 0 ${10 + pulso * 14}px rgba(204,0,0,0.8))` : "none" }} />
          <line x1={cx} y1={cy} x2={px} y2={py} stroke={WHITE} strokeWidth={8} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={16} fill={WHITE} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "space-between", fontSize: 22, color: MUTED, fontWeight: 600, padding: "0 10px" }}>
          <span>baixa</span>
          <span style={{ color: alta ? RED : MUTED }}>alta</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 372, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Rotulo style={{ fontSize: 24 }}>corrente</Rotulo>
          <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 48, color: alta ? RED : WHITE, letterSpacing: 2 }}>{alta ? "ALTA" : nivel > 0.4 ? "MÉDIA" : "BAIXA"}</div>
        </div>
      </div>
    </Cartao>
  );
};

export const BorderlineIntensaMeio: React.FC<{ capa?: boolean }> = ({ capa = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const [fontesOk, setFontesOk] = useState(false);

  useEffect(() => {
    loadFontesClipe().then(() => setFontesOk(true));
  }, []);

  const punch = (a: number, b: number, max: number) => {
    if (t < a || t > b) {
      return 1;
    }
    return 1 + (max - 1) * suave(t, a, a + 0.25);
  };
  const zoom = Math.max(punch(3.1, 4.0, 1.08), punch(25.1, FIM_MUSICA, 1.12));

  const flash = interpolate(frame, [0, 3], [0.6, 0], { extrapolateRight: "clamp" });
  const fadeFim = interpolate(frame, [durationInFrames - 4, durationInFrames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulso = t < FIM_MUSICA ? pulsoBatida(t, beats) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: WHITE }}>
      <Audio src={AUDIO} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 30%, rgba(204,0,0,${0.06 + pulso * 0.06}) 0%, rgba(13,13,13,0) 60%)` }} />
      {fontesOk && (
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 42%" }}>
          {t < 4.05 && <CenaAgenda t={t} />}
          {t >= 4.004 && t < 7.8 && <CenaTerapia t={t} />}
          {t >= 7.754 && t < 11.5 && <CenaRespirar t={t} />}
          {t >= 11.424 && t < 15.4 && <CenaGastos t={t} />}
          {t >= 15.334 && t < 18.8 && <CenaGrupo t={t} />}
          {t >= 18.764 && t < 22.5 && <CenaRotina t={t} />}
          {t >= 22.435 && t < FIM_MUSICA + 0.1 && <CenaAviso t={t} />}
          {capa ? (
            <Letra t={t} fps={fps} frame={frame} top={1030} linhas={[{ t0: 0, t1: 999, grupos: [{ t: 0, palavras: [{ w: "BORDERLINE,", red: true }] }, { t: 0, palavras: [{ w: "a intensa", serif: true }] }] }]} />
          ) : (
            <>
              <Letra t={t} fps={fps} frame={frame} linhas={LINHAS} top={1030} />
              <FolhaEnvio t={t} fps={fps} frame={frame} em={FIM_MUSICA} linhas={["Manda pra quem", "ainda acha que", "não tem jeito."]} />
            </>
          )}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ backgroundColor: WHITE, opacity: flash, pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeFim, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
