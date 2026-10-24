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
import { loadFontesClipe } from "../load-font";
import tempos from "./tempos-inicio.json";
import {
  BG,
  BORDER,
  Botao,
  CARD2,
  CARD3,
  Cartao,
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

// Clipe de 29 s para o começo da música "Borderline, a intensa": do refrão de
// abertura até "rainha da avalanche" (0:07 a 0:34 do original), mais um cartão
// final de envio. Cada verso vira uma tela de aplicativo: player, notificações,
// lista filtrada, gráfico antes e hoje com seletor de emoção, configurações e
// folha de compartilhamento. Toques na tela, abas e avisos dão o ritmo de interface.

const AUDIO = staticFile("musica/borderline-a-intensa-inicio.wav");
const beats: number[] = tempos.beats;
const FIM_MUSICA = 26.75;
const DURACAO_ORIGINAL = 104.36; // a barra do player mostra a posição real na música
const OFFSET_ORIGINAL = tempos.start;
const ALTURA = 700;
const { Inter, Montserrat, Playfair } = fontes;

const LINHAS: Linha[] = [
  { t0: 1.303, t1: 4.734, grupos: [{ t: 1.303, palavras: [{ w: "BORDERLINE,", red: true }] }, { t: 3.0, palavras: [{ w: "a intensa", serif: true }] }] },
  { t0: 4.734, t1: 8.245, grupos: [{ t: 4.734, palavras: [{ w: "SENTINDO" }] }, { t: 5.6, palavras: [{ w: "MAIS UMA" }] }, { t: 6.5, palavras: [{ w: "rodada", serif: true, red: true }] }] },
  { t0: 8.245, t1: 10.08, grupos: [{ t: 8.245, palavras: [{ w: "ME CHAMARAM" }] }, { t: 9.1, palavras: [{ w: "DE EXAGERO,", red: true }] }] },
  { t0: 10.08, t1: 12.074, grupos: [{ t: 10.08, palavras: [{ w: "HOJE EU SEI" }] }, { t: 10.8, palavras: [{ w: "O QUE ME" }] }, { t: 11.4, palavras: [{ w: "excede", serif: true, red: true }] }] },
  { t0: 12.074, t1: 13.75, grupos: [{ t: 12.074, palavras: [{ w: "SÓ FICA" }] }, { t: 12.85, palavras: [{ w: "DO MEU LADO" }] }] },
  { t0: 13.75, t1: 15.585, grupos: [{ t: 13.75, palavras: [{ w: "QUEM RESPEITA", red: true }] }, { t: 14.65, palavras: [{ w: "quando eu pede", serif: true }] }] },
  { t0: 15.585, t1: 17.5, grupos: [{ t: 15.585, palavras: [{ w: "NAS ANTIGA" }] }, { t: 16.45, palavras: [{ w: "ERA EXPLOSÃO,", red: true }] }] },
  { t0: 17.5, t1: 19.175, grupos: [{ t: 17.5, palavras: [{ w: "ERA GRITO," }] }, { t: 18.3, palavras: [{ w: "era queixa", serif: true }] }] },
  { t0: 19.175, t1: 20.931, grupos: [{ t: 19.175, palavras: [{ w: "HOJE EU DOU" }] }, { t: 19.95, palavras: [{ w: "nome à emoção", serif: true, red: true }] }] },
  { t0: 20.931, t1: 23.165, grupos: [{ t: 20.931, palavras: [{ w: "ANTES DE" }] }, { t: 21.45, palavras: [{ w: "SUBIR" }] }, { t: 21.95, palavras: [{ w: "na parede", serif: true, red: true }] }] },
  { t0: 23.165, t1: 25.0, grupos: [{ t: 23.165, palavras: [{ w: "SOU INTENSA" }] }, { t: 24.0, palavras: [{ w: "de fábrica,", serif: true, red: true }] }] },
  { t0: 25.0, t1: FIM_MUSICA, grupos: [{ t: 25.0, palavras: [{ w: "RAINHA" }] }, { t: 25.75, palavras: [{ w: "DA AVALANCHE", red: true }] }] },
];

const Avatar: React.FC<{ tam?: number; cor?: string }> = ({ tam = 64, cor = "#2E2E2E" }) => (
  <div style={{ width: tam, height: tam, borderRadius: tam / 2, background: cor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {Icones.pessoa("#5A5A5A", tam * 0.55)}
  </div>
);

const BarraTexto: React.FC<{ largura: number; alto?: number }> = ({ largura, alto = 18 }) => (
  <div style={{ width: largura, height: alto, borderRadius: alto / 2, background: CARD3 }} />
);

// Cena A: player. O toque no play liga o visualizador; a capa vira contador de rodadas.
const CenaPlayer: React.FC<{ t: number; frame: number; fps: number; barras: number[]; tocando: boolean }> = ({ t, frame, fps, barras, tocando }) => {
  const entrada = prog(t, 0, 0.35);
  const saida = prog(t, 8.0, 8.25);
  const pulso = pulsoBatida(t, beats);
  const rodadaInicio = 4.734;
  const rodadaAtiva = t >= rodadaInicio;
  const periodo = (beats[4] ?? 1.858) - (beats[0] ?? 0);
  const rodadaT = Math.max(0, t - rodadaInicio);
  const rodadaN = Math.floor(rodadaT / periodo) + 1;
  const rodadaP = (rodadaT % periodo) / periodo;
  const R = 70;
  const C = 2 * Math.PI * R;
  const contadorIn = suave(t, rodadaInicio, rodadaInicio + 0.35);
  const posicao = (OFFSET_ORIGINAL + (tocando ? t : 0.9)) / DURACAO_ORIGINAL;
  const mmss = (s: number) => `${Math.floor(s / 60)}:${("0" + Math.floor(s % 60)).slice(-2)}`;
  const playS = spring({ frame: frame - Math.round(0.9 * fps), fps, config: { damping: 12, stiffness: 260 } });
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Tocando agora" aba="casa">
      <div style={{ padding: "6px 60px 0", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {rodadaAtiva ? (
            <div style={{ width: 170, height: 170, borderRadius: 28, background: CARD2, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: contadorIn, transform: `scale(${interpolate(contadorIn, [0, 1], [0.7, 1])})` }}>
              <svg width={170} height={170} style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)" }}>
                <circle cx={85} cy={85} r={R} fill="none" stroke={CARD3} strokeWidth={9} />
                <circle cx={85} cy={85} r={R} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - rodadaP)} />
              </svg>
              <div style={{ textAlign: "center", lineHeight: 1 }}>
                <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 70, color: WHITE }}>{rodadaN}</div>
                <div style={{ fontSize: 18, color: MUTED, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>rodada</div>
              </div>
            </div>
          ) : (
            <div style={{ width: 170, height: 170, borderRadius: 28, background: `radial-gradient(circle at 30% 30%, #7a0000 0%, ${RED} 45%, #2a0000 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${16 + pulso * 36}px rgba(204,0,0,${0.3 + pulso * 0.4})`, transform: `scale(${1 + pulso * 0.025})`, flexShrink: 0 }}>
              <span style={{ fontFamily: Playfair, fontStyle: "italic", fontWeight: 600, fontSize: 108, color: WHITE, lineHeight: 1 }}>B</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 40, fontWeight: 600, whiteSpace: "nowrap" }}>Borderline, a intensa</div>
            <div style={{ fontSize: 28, color: MUTED, fontWeight: 500 }}>Borderline Sem Estigma</div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: MUTED, border: `2px solid ${BORDER}`, borderRadius: 14, padding: "4px 12px" }}>SINGLE</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: MUTED, border: `2px solid ${BORDER}`, borderRadius: 14, padding: "4px 12px" }}>1:44</div>
            </div>
          </div>
          {Icones.coracao(tocando ? RED : MUTED, 40)}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 90 }}>
          {barras.map((v, i) => (
            <div key={i} style={{ flex: 1, height: Math.max(6, Math.min(90, v * 90)), borderRadius: 5, background: i % 5 === 2 ? RED : WHITE, opacity: 0.9 }} />
          ))}
        </div>
        <div>
          <div style={{ height: 8, borderRadius: 4, background: CARD2, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${posicao * 100}%`, background: WHITE, borderRadius: 4 }} />
            <div style={{ position: "absolute", top: -7, left: `calc(${posicao * 100}% - 11px)`, width: 22, height: 22, borderRadius: 11, background: WHITE }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 24, color: MUTED, fontWeight: 500 }}>
            <span>{mmss(posicao * DURACAO_ORIGINAL)}</span>
            <span>{mmss(DURACAO_ORIGINAL)}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 54, marginTop: -4 }}>
          {Icones.anterior(WHITE, 44)}
          <div style={{ width: 96, height: 96, borderRadius: 48, background: tocando ? RED : WHITE, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tocando ? interpolate(playS, [0, 1], [0.8, 1]) : 1})` }}>
            {tocando ? Icones.pausa(WHITE, 48) : Icones.play(BG, 48)}
          </div>
          {Icones.proximo(WHITE, 44)}
        </div>
      </div>
      <Toque t={t} em={0.85} x={400} y={474} />
    </Cartao>
  );
};

// Cena B: notificações chegam, o sino conta, elas são varridas e entra o medidor.
const CenaNotificacoes: React.FC<{ t: number; fps: number; frame: number }> = ({ t, fps, frame }) => {
  const entrada = prog(t, 8.245, 8.55);
  const saida = prog(t, 11.85, 12.1);
  const chegadas = [8.5, 9.0, 9.5];
  const some = 10.08;
  const medidorIn = suave(t, 10.3, 10.65);
  const transborda = Easing.in(Easing.quad)(prog(t, 10.7, 11.85));
  const badge = t >= some ? 0 : chegadas.filter((c) => t >= c).length;
  const nivel = Math.round(interpolate(transborda, [0, 1], [35, 128]));
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo={medidorIn > 0 ? "Nível" : "Notificações"} aba="sino" badge={badge}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        {chegadas.map((c, i) => {
          if (t < c) {
            return null;
          }
          const s = spring({ frame: frame - Math.round(c * fps), fps, config: { damping: 15, stiffness: 200 } });
          const sai = prog(t, some + i * 0.08, some + i * 0.08 + 0.3);
          return (
            <div key={i} style={{ opacity: s * (1 - sai), transform: `translateY(${(1 - s) * -40}px) translateX(${sai * 560}px)`, background: CARD2, borderRadius: 26, padding: "22px 28px", display: "flex", alignItems: "center", gap: 22 }}>
              <Avatar />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <div style={{ fontSize: 34, fontWeight: 600 }}>exagero</div>
                <div style={{ fontSize: 22, color: MUTED, fontWeight: 500 }}>{["há 2 anos", "ontem", "agora"][i]}</div>
              </div>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: RED }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, bottom: 30, opacity: medidorIn, transform: `translateY(${(1 - medidorIn) * 30}px)`, display: "flex", alignItems: "flex-end", gap: 40 }}>
        <div style={{ position: "relative", width: 150, height: "100%", background: CARD2, borderRadius: 26 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${nivel}%`, background: RED, borderRadius: 26, boxShadow: transborda > 0.8 ? `0 0 ${(transborda - 0.8) * 200}px rgba(204,0,0,0.6)` : "none" }} />
          {[0.25, 0.5, 0.75, 1].map((m) => (
            <div key={m} style={{ position: "absolute", left: -14, width: 14, height: 3, background: MUTED, bottom: `${m * 100}%` }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 6 }}>
          <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 92, color: transborda > 0.6 ? RED : WHITE, lineHeight: 1 }}>{nivel}%</div>
          <div style={{ fontSize: 30, color: MUTED, fontWeight: 500 }}>{transborda > 0.6 ? "o que me excede" : "o que eu sinto"}</div>
          {transborda > 0.6 && (
            <div style={{ display: "inline-flex", alignSelf: "flex-start", gap: 10, alignItems: "center", background: "rgba(204,0,0,0.15)", border: `2px solid ${RED}`, borderRadius: 18, padding: "8px 16px", fontSize: 22, fontWeight: 600, color: WHITE }}>
              acima do limite
            </div>
          )}
        </div>
      </div>
    </Cartao>
  );
};

// Cena C: lista de pessoas. O filtro "respeita o que eu peço" tira quem não fica.
const CenaFiltro: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 12.074, 12.4);
  const saida = prog(t, 15.35, 15.6);
  const filtraEm = 13.75;
  const filtrado = suave(t, filtraEm + 0.05, filtraEm + 0.35);
  const pessoas = [
    { fica: false, largura: 220 },
    { fica: true, largura: 170 },
    { fica: false, largura: 250 },
    { fica: false, largura: 190 },
    { fica: true, largura: 230 },
  ];
  const ALT = 84;
  let ordemFica = 0;
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Do meu lado" aba="pessoa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", background: CARD2, borderRadius: 30, padding: 6, position: "relative" }}>
          <div style={{ position: "absolute", top: 6, bottom: 6, left: interpolate(filtrado, [0, 1], [6, 190]), width: interpolate(filtrado, [0, 1], [180, 484]), background: CARD3, borderRadius: 24 }} />
          <div style={{ width: 184, textAlign: "center", padding: "14px 0", fontSize: 26, fontWeight: 600, color: filtrado < 0.5 ? WHITE : MUTED, position: "relative" }}>todos</div>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 0", fontSize: 26, fontWeight: 600, color: filtrado < 0.5 ? MUTED : WHITE, position: "relative" }}>respeita o que eu peço</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Rotulo style={{ fontSize: 24 }}>{filtrado < 0.5 ? "5 pessoas" : "2 pessoas"}</Rotulo>
          <Rotulo style={{ fontSize: 24, color: filtrado < 0.5 ? MUTED : RED }}>{filtrado < 0.5 ? "sem filtro" : "filtrado"}</Rotulo>
        </div>
        <div style={{ position: "relative", height: 5 * ALT }}>
          {pessoas.map((p, i) => {
            const entraRow = suave(t, 12.25 + i * 0.07, 12.55 + i * 0.07);
            const sai = p.fica ? 0 : suave(t, filtraEm + 0.1 + i * 0.06, filtraEm + 0.45 + i * 0.06);
            const destino = p.fica ? ordemFica++ : i;
            const y = interpolate(filtrado, [0, 1], [i * ALT, destino * ALT]);
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: ALT - 14, opacity: entraRow * (1 - sai), transform: `translateX(${(1 - entraRow) * 30 + sai * 600}px)`, background: CARD2, borderRadius: 22, display: "flex", alignItems: "center", gap: 20, padding: "0 22px" }}>
                <Avatar tam={48} />
                <BarraTexto largura={p.largura} />
                <div style={{ flex: 1 }} />
                {p.fica && filtrado > 0.5 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: RED, fontSize: 24, fontWeight: 600, opacity: filtrado }}>
                    {Icones.check(RED, 30)} fica
                  </div>
                ) : (
                  <BarraTexto largura={60} alto={14} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Toque t={t} em={filtraEm} x={520} y={50} />
    </Cartao>
  );
};

// Cena D: gráfico. Antes: três picos até o teto. Hoje: nomeia a emoção e a linha para antes.
const CenaGrafico: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 15.585, 15.9);
  const saida = prog(t, 22.9, 23.17);
  const hojeEm = 19.175;
  const hoje = suave(t, hojeEm + 0.05, hojeEm + 0.35);
  const W = 680;
  const H = 250;
  const teto = 26;
  const base = H - 10;
  // Antes: linha vermelha com três picos, desenhada aos poucos.
  const antes = `M 0 ${base} L 70 ${base - 30} L 120 ${teto} L 170 ${base - 40} L 250 ${base - 20} L 320 ${teto} L 380 ${base - 50} L 460 ${base - 30} L 520 ${teto} L 580 ${base - 40} L ${W} ${base - 20}`;
  const antesP = suave(t, 15.7, 19.0);
  // Hoje: linha branca que sobe e dobra antes do teto.
  const hojeLinha = `M 0 ${base} C 120 ${base - 10}, 200 ${base - 60}, 300 ${base - 110} S 480 ${base - 150}, ${W} ${base - 140}`;
  const hojeP = suave(t, 20.6, 22.9);
  const marcadores = [
    { x: 120, em: 16.45, txt: "explosão" },
    { x: 320, em: 17.5, txt: "grito" },
    { x: 520, em: 18.3, txt: "queixa" },
  ];
  const chips = ["raiva", "medo", "vergonha", "tristeza", "ciúme"];
  const escolhe = 20.45;
  const paredeIn = salta(t, 21.95, 22.3);
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Histórico" aba="casa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 12 }}>
          {["antes", "hoje"].map((s, i) => {
            const ativo = i === 0 ? hoje < 0.5 : hoje >= 0.5;
            return (
              <div key={s} style={{ padding: "12px 28px", borderRadius: 24, background: ativo ? WHITE : CARD2, color: ativo ? BG : MUTED, fontSize: 26, fontWeight: 600 }}>
                {s}
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <Rotulo style={{ fontSize: 22, alignSelf: "center" }}>intensidade por hora</Rotulo>
        </div>
        <div style={{ position: "relative", width: W, height: H }}>
          <svg width={W} height={H} style={{ overflow: "visible" }}>
            <line x1={0} y1={base} x2={W} y2={base} stroke={CARD3} strokeWidth={3} />
            <line x1={0} y1={teto} x2={W} y2={teto} stroke={paredeIn > 0 ? RED : MUTED} strokeWidth={3} strokeDasharray="10 10" opacity={0.8} />
            <path d={antes} fill="none" stroke={RED} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - antesP} opacity={interpolate(hoje, [0, 1], [1, 0.25])} />
            <path d={hojeLinha} fill="none" stroke={WHITE} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - hojeP} />
          </svg>
          {marcadores.map((m) => {
            const s = salta(t, m.em, m.em + 0.3);
            if (t < m.em) {
              return null;
            }
            return (
              <div key={m.txt} style={{ position: "absolute", left: m.x - 60, top: teto - 54, width: 120, textAlign: "center", opacity: s * interpolate(hoje, [0, 1], [1, 0.3]), transform: `translateY(${(1 - s) * 14}px) scale(${s})`, background: WHITE, color: BG, fontSize: 22, fontWeight: 600, padding: "8px 0", borderRadius: 16 }}>
                {m.txt}
              </div>
            );
          })}
          <div style={{ position: "absolute", right: 0, top: teto + 10, opacity: paredeIn, transform: `scale(${paredeIn})`, transformOrigin: "right center", color: RED, fontSize: 24, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            parede
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "nowrap", opacity: hoje }}>
          {chips.map((c, i) => {
            const s = salta(t, hojeEm + 0.15 + i * 0.1, hojeEm + 0.45 + i * 0.1);
            const sel = c === "medo" && t >= escolhe;
            return (
              <div key={c} style={{ opacity: s, transform: `scale(${s})`, padding: "12px 24px", borderRadius: 24, background: sel ? RED : CARD2, border: `2px solid ${sel ? RED : BORDER}`, color: sel ? WHITE : MUTED, fontSize: 26, fontWeight: 600 }}>
                {c}
              </div>
            );
          })}
        </div>
      </div>
      <Toque t={t} em={hojeEm} x={210} y={30} />
      <Toque t={t} em={escolhe} x={250} y={392} />
    </Cartao>
  );
};

// Cena E: configurações. Intensidade vem de fábrica; o botão de restaurar não muda nada.
const CenaConfig: React.FC<{ t: number }> = ({ t }) => {
  const entrada = prog(t, 23.165, 23.5);
  const saida = prog(t, 26.55, 26.8);
  const ligaEm = 25.0;
  const liga = suave(t, ligaEm, ligaEm + 0.3);
  const tagIn = salta(t, 24.0, 24.35);
  const linhas = [
    { nome: "Intensidade", valor: 1 },
    { nome: "Sensibilidade", valor: 0.92 },
  ];
  return (
    <Cartao entrada={entrada} saida={saida} altura={ALTURA} titulo="Configurações" aba="pessoa">
      <div style={{ position: "absolute", left: 60, right: 60, top: 0, display: "flex", flexDirection: "column", gap: 26 }}>
        {linhas.map((l, i) => {
          const s = suave(t, 23.3 + i * 0.12, 23.6 + i * 0.12);
          return (
            <div key={l.nome} style={{ opacity: s, transform: `translateY(${(1 - s) * 20}px)`, background: CARD2, borderRadius: 26, padding: "22px 28px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 600 }}>{l.nome}</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {i === 0 && (
                    <div style={{ opacity: tagIn, transform: `scale(${tagIn})`, background: RED, color: WHITE, fontSize: 22, fontWeight: 600, padding: "6px 14px", borderRadius: 14 }}>
                      de fábrica
                    </div>
                  )}
                  <div style={{ fontFamily: Montserrat, fontWeight: 800, fontSize: 34, color: i === 0 ? RED : WHITE }}>{Math.round(l.valor * 100)}</div>
                </div>
              </div>
              <Slider valor={l.valor} cor={i === 0 ? RED : WHITE} />
            </div>
          );
        })}
        <div style={{ opacity: suave(t, 23.55, 23.85), background: CARD2, borderRadius: 26, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: liga > 0.5 ? RED : WHITE }}>Avalanche</div>
            <div style={{ fontSize: 22, color: MUTED, fontWeight: 500 }}>{liga > 0.5 ? "ativado" : "desativado"}</div>
          </div>
          <Switch ligado={liga} />
        </div>
        <div style={{ opacity: suave(t, 23.7, 24.0), display: "flex", justifyContent: "center" }}>
          <Botao>Restaurar padrão de fábrica</Botao>
        </div>
      </div>
      <Toque t={t} em={24.25} x={400} y={470} />
      <Toast t={t} em={24.35} dura={1.1}>
        {Icones.check(BG, 26)} já está no padrão
      </Toast>
      <Toque t={t} em={ligaEm} x={690} y={392} />
    </Cartao>
  );
};

// Cartão final: a música para e fica a folha de envio com a chamada.
const CartaoFinal: React.FC<{ t: number; fps: number; frame: number }> = ({ t, fps, frame }) => {
  if (t < FIM_MUSICA) {
    return null;
  }
  const s = spring({ frame: frame - Math.round((FIM_MUSICA + 0.1) * fps), fps, config: { damping: 18, stiffness: 150 } });
  const s2 = spring({ frame: frame - Math.round((FIM_MUSICA + 0.5) * fps), fps, config: { damping: 18, stiffness: 150 } });
  const enviaEm = FIM_MUSICA + 1.25;
  const enviado = suave(t, enviaEm + 0.1, enviaEm + 0.4);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 330, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, fontFamily: Montserrat, fontWeight: 800, fontSize: 92, lineHeight: 1.04, letterSpacing: -2, color: WHITE }}>
        Manda pra quem
        <br />
        te chamou de
        <br />
        <span style={{ fontFamily: Playfair, fontStyle: "italic", fontWeight: 600, color: RED, fontSize: 120, letterSpacing: 0 }}>exagero.</span>
      </div>
      <div style={{ position: "absolute", left: 100, width: 800, top: 760, opacity: s2, transform: `translateY(${(1 - s2) * 50}px)`, background: "#161616", border: `2px solid ${BORDER}`, borderRadius: 44, padding: "40px 60px", fontFamily: Inter, display: "flex", flexDirection: "column", gap: 28, boxShadow: "0 30px 80px rgba(0,0,0,0.55)" }}>
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
    </AbsoluteFill>
  );
};

export const BorderlineIntensaInicio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const [fontesOk, setFontesOk] = useState(false);

  useEffect(() => {
    loadFontesClipe().then(() => setFontesOk(true));
  }, []);

  const tocando = t >= 0.9;
  const audioData = useAudioData(AUDIO);
  const barras =
    audioData && tocando
      ? visualizeAudio({ fps, frame, audioData, numberOfSamples: 32, smoothing: true })
          .slice(1, 25)
          .map((v, i) => Math.min(1, Math.pow(v * (6 + i * 1.4), 0.55)))
      : new Array(24).fill(0.07);

  const punch = (a: number, b: number, max: number) => {
    if (t < a || t > b) {
      return 1;
    }
    return 1 + (max - 1) * suave(t, a, a + 0.25);
  };
  const zoom = Math.max(punch(1.303, 4.7, 1.08), punch(21.95, 23.1, 1.1), punch(25.75, FIM_MUSICA, 1.08));

  const flash = interpolate(frame, [0, 3], [0.6, 0], { extrapolateRight: "clamp" });
  const fadeFim = interpolate(frame, [durationInFrames - 4, durationInFrames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulso = tocando ? pulsoBatida(t, beats) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: WHITE }}>
      <Audio src={AUDIO} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 30%, rgba(204,0,0,${0.06 + pulso * 0.06}) 0%, rgba(13,13,13,0) 60%)` }} />
      {fontesOk && (
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 42%" }}>
          {t < 8.3 && <CenaPlayer t={t} frame={frame} fps={fps} barras={barras} tocando={tocando} />}
          {t >= 8.245 && t < 12.15 && <CenaNotificacoes t={t} fps={fps} frame={frame} />}
          {t >= 12.074 && t < 15.65 && <CenaFiltro t={t} />}
          {t >= 15.585 && t < 23.2 && <CenaGrafico t={t} />}
          {t >= 23.165 && t < FIM_MUSICA + 0.1 && <CenaConfig t={t} />}
          <Letra t={t} fps={fps} frame={frame} linhas={LINHAS} top={1030} />
          <CartaoFinal t={t} fps={fps} frame={frame} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ backgroundColor: WHITE, opacity: flash, pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeFim, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
