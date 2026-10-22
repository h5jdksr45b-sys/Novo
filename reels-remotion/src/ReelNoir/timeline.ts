import type { Caption } from "@remotion/captions";
import type { Cena } from "./roteiro";

export type Palavra = {
  texto: string; // como aparece na tela (com pontuação)
  inicioMs: number;
  fimMs: number;
};

export type CenaNoTempo = Cena & {
  inicioMs: number;
  fimMs: number;
  palavras: Palavra[]; // tempos absolutos
};

export type Timeline = {
  origem: "estimada" | "alinhada";
  duracaoMs: number;
  cenas: CenaNoTempo[];
  palavras: Palavra[];
};

export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

const separarPalavras = (fala: string) =>
  fala.split(/\s+/).filter((p) => p.length > 0);

// Estimativa de duração por palavra para pré-visualizar sem gravação.
// Não substitui a transcrição: serve só para ver o movimento.
const estimarDuracao = (palavra: string) => {
  const letras = normalizar(palavra).length;
  let ms = 105 + letras * 42;
  if (/[,;]$/.test(palavra)) ms += 170;
  if (/[.!?]$/.test(palavra)) ms += 380;
  if (/:$/.test(palavra)) ms += 240;
  return ms;
};

export const estimarTimeline = (cenas: Cena[], inicioMs = 400): Timeline => {
  let t = inicioMs;
  const todas: Palavra[] = [];
  const cenasNoTempo: CenaNoTempo[] = cenas.map((cena) => {
    const inicio = t;
    const palavras: Palavra[] = [];
    if (cena.tipo === "assinatura") {
      t += cena.duracaoMs;
    } else {
      for (const p of separarPalavras(cena.fala)) {
        const d = estimarDuracao(p);
        palavras.push({ texto: p, inicioMs: t, fimMs: t + d });
        t += d;
      }
    }
    todas.push(...palavras);
    return { ...cena, inicioMs: inicio, fimMs: t, palavras };
  });
  return {
    origem: "estimada",
    duracaoMs: t + 300,
    cenas: cenasNoTempo,
    palavras: todas,
  };
};

// Alinha o roteiro com a transcrição real (Whisper, uma palavra por item).
// Resultado: cada palavra do roteiro recebe o tempo em que foi dita.
// Os cortes passam a cair exatamente no início da primeira palavra da cena.
export const alinharComLegendas = (cenas: Cena[], captions: Caption[]): Timeline => {
  const tokens = captions
    .map((c) => ({ chave: normalizar(c.text), inicioMs: c.startMs, fimMs: c.endMs }))
    .filter((c) => c.chave.length > 0);

  const roteiro: { cenaIdx: number; texto: string; chave: string }[] = [];
  cenas.forEach((cena, cenaIdx) => {
    if (cena.tipo === "assinatura") return;
    separarPalavras(cena.fala).forEach((texto) =>
      roteiro.push({ cenaIdx, texto, chave: normalizar(texto) }),
    );
  });

  const tempos: (Palavra | null)[] = new Array(roteiro.length).fill(null);
  let j = 0;
  const JANELA = 8;
  for (let i = 0; i < roteiro.length; i++) {
    const alvo = roteiro[i].chave;
    let achou = -1;
    for (let k = j; k < Math.min(tokens.length, j + JANELA); k++) {
      const t = tokens[k].chave;
      const iguais = t === alvo;
      const prefixo =
        alvo.length >= 4 && t.length >= 4 && (t.startsWith(alvo.slice(0, 4)) || alvo.startsWith(t.slice(0, 4)));
      if (iguais || (prefixo && Math.abs(t.length - alvo.length) <= 2)) {
        achou = k;
        break;
      }
    }
    if (achou >= 0) {
      tempos[i] = { texto: roteiro[i].texto, inicioMs: tokens[achou].inicioMs, fimMs: tokens[achou].fimMs };
      j = achou + 1;
    }
  }

  // Palavras não encontradas: interpola entre vizinhas conhecidas.
  const primeiroConhecido = tempos.findIndex((t) => t !== null);
  const inicioPadrao = primeiroConhecido >= 0 ? tempos[primeiroConhecido]!.inicioMs : 0;
  let ultimoFim = inicioPadrao;
  for (let i = 0; i < tempos.length; i++) {
    if (tempos[i]) {
      ultimoFim = tempos[i]!.fimMs;
      continue;
    }
    let fim = i + 1;
    while (fim < tempos.length && !tempos[fim]) fim++;
    const proximoInicio = fim < tempos.length ? tempos[fim]!.inicioMs : ultimoFim + (fim - i) * 320;
    const faltam = fim - i;
    const passo = Math.max(60, (proximoInicio - ultimoFim) / faltam);
    for (let k = 0; k < faltam; k++) {
      const ini = ultimoFim + passo * k;
      tempos[i + k] = { texto: roteiro[i + k].texto, inicioMs: ini, fimMs: ini + passo };
    }
    ultimoFim = proximoInicio;
    i = fim - 1;
  }

  const palavras = tempos as Palavra[];
  const porCena: Palavra[][] = cenas.map(() => []);
  roteiro.forEach((r, i) => porCena[r.cenaIdx].push(palavras[i]));

  let cursor = 0;
  const cenasNoTempo: CenaNoTempo[] = cenas.map((cena, idx) => {
    const ps = porCena[idx];
    let inicio: number;
    let fim: number;
    if (cena.tipo === "assinatura") {
      inicio = cursor;
      fim = cursor + cena.duracaoMs;
    } else {
      inicio = idx === 0 ? Math.max(0, ps[0].inicioMs - 300) : ps[0].inicioMs;
      fim = ps[ps.length - 1].fimMs;
    }
    cursor = fim;
    return { ...cena, inicioMs: inicio, fimMs: fim, palavras: ps };
  });
  // Corte seco: cada cena termina onde a próxima começa.
  for (let i = 0; i < cenasNoTempo.length - 1; i++) {
    cenasNoTempo[i].fimMs = cenasNoTempo[i + 1].inicioMs;
  }

  return {
    origem: "alinhada",
    duracaoMs: cenasNoTempo[cenasNoTempo.length - 1].fimMs + 300,
    cenas: cenasNoTempo,
    palavras,
  };
};

// Tempo em que uma palavra do roteiro é dita (n-ésima ocorrência dentro da cena).
export const tempoDaPalavra = (palavras: Palavra[], alvo: string, ocorrencia = 0) => {
  const chave = normalizar(alvo);
  let n = 0;
  for (const p of palavras) {
    if (normalizar(p.texto) === chave) {
      if (n === ocorrencia) return p.inicioMs;
      n++;
    }
  }
  return null;
};
