// Plano de edição do Reel "Abraço frio" (gravação do Dr. Fabio, 38,5 s).
// Tempos em segundos, tirados da transcrição com tempo por palavra.

type Palavra = { w: string; t: number; d?: boolean };
type Pagina = { palavras: Palavra[]; fim?: number };

const P = (...xs: [string, number, boolean?][]): Pagina => ({
  palavras: xs.map(([w, t, d]) => ({ w, t, d })),
});

// Cortes que já existem na gravação e o zoom de cada trecho.
// Punch (1,12) só nos três trechos mais fortes: anestesia, ficar por perto, fechamento.
export const SEGMENTOS = [
  { ini: 0, fim: 6.4667, de: 1.0, para: 1.05 }, // b-roll abraço de costas
  { ini: 6.4667, fim: 9.3, de: 1.0, para: 1.06 },
  { ini: 9.3, fim: 10.4333, de: 1.02, para: 1.06 }, // b-roll rosto dela
  { ini: 10.4333, fim: 14.1667, de: 1.0, para: 1.06 },
  { ini: 14.1667, fim: 17.5667, de: 1.12, para: 1.16 }, // punch ANESTESIA
  { ini: 17.5667, fim: 18.9333, de: 1.0, para: 1.05 }, // b-roll mãos nas costas
  { ini: 18.9333, fim: 24.8, de: 1.0, para: 1.07 },
  { ini: 24.8, fim: 25.4667, de: 1.04, para: 1.06 },
  { ini: 25.4667, fim: 28.6333, de: 1.0, para: 1.06 }, // b-roll janela
  { ini: 28.6333, fim: 29.7333, de: 1.12, para: 1.15 }, // punch FICAR POR PERTO
  { ini: 29.7333, fim: 33.9667, de: 1.0, para: 1.06 },
  { ini: 33.9667, fim: 38.5, de: 1.1, para: 1.14 }, // punch fechamento
];

// Texto de abertura: não repete o gancho falado, cria a pergunta que o vídeo responde.
export const GANCHO = {
  fim: 6.4667,
  linhas: [
    { texto: "ABRAÇO FRIO.", vermelho: false },
    { texto: "O AMOR ACABOU?", vermelho: true },
  ],
};

// Ênfase grande: é a fala daquele instante, na ordem dita.
export const ENFASES = [
  { ini: 9.86, fim: 10.4333, grande: "AINDA AMO?", centro: true },
  { ini: 14.16, fim: 15.6, grande: "ANESTESIA" },
  { ini: 17.76, fim: 18.9333, grande: "NÃO SINTO", comp: "eu não amo", compT: 18.08, centro: true },
  { ini: 23.18, fim: 24.8, grande: "NÃO APAGA", comp: "todo o seu afeto", compT: 23.92 },
  { ini: 28.96, fim: 29.7333, grande: "FICAR", comp: "por perto", compT: 29.24 },
  { ini: 35.9, fim: 36.9, grande: "TE AMA" },
];

// Legenda: até 3 palavras por vez. d = palavra-chave em vermelho.
export const CAPTIONS: Pagina[] = [
  P(["Tem", 0.0], ["dia", 0.13], ["que", 0.26]),
  P(["o", 0.4], ["borderline", 0.48, true], ["vem,", 0.84]),
  P(["abraça", 1.32], ["e", 1.78], ["parece", 1.9]),
  P(["que", 2.14], ["não", 2.36], ["sentiu", 2.48]),
  P(["nada.", 2.84, true]),
  P(["Então", 3.34], ["você", 3.56]),
  P(["já", 4.72], ["decide", 4.86]),
  P(["que", 5.16], ["é", 5.36], ["o fim.", 5.44, true]),
  P(["O", 6.0], ["que", 6.12], ["parece", 6.22]),
  P(["frieza", 6.44, true]),
  P(["é", 6.84], ["uma", 7.18], ["pergunta", 7.36]),
  P(["sincera", 7.74, true]),
  P(["pra", 8.34], ["si", 8.62], ["mesmo:", 8.8]),
  P(["será", 9.38], ["que", 9.58], ["eu", 9.76]),
  P(["ainda", 9.86], ["amo?", 10.06, true]),
  P(["Depois", 10.52], ["de", 10.74], ["muita", 10.88]),
  P(["emoção,", 11.02, true]),
  P(["é", 11.68], ["normal", 11.76], ["que", 12.0]),
  P(["o", 12.22], ["sentir", 12.28]),
  P(["se", 12.6], ["desligue", 12.96, true]),
  P(["por", 13.46], ["um", 13.6], ["tempo.", 13.68]),
  P(["Anestesia.", 14.16, true]),
  P(["E", 14.74], ["a", 15.16], ["própria", 15.24]),
  P(["pessoa", 15.4], ["tome", 15.84]),
  P(["esse", 16.16], ["silêncio", 16.26, true]),
  P(["como", 16.68], ["prova:", 17.02]),
  P(["se", 17.58], ["eu", 17.68], ["não sinto,", 17.76, true]),
  P(["eu", 18.08], ["não amo.", 18.34, true]),
  P(["Costuma", 18.9], ["passar", 19.18]),
  P(["e", 19.48], ["o", 19.76], ["que", 19.82]),
  P(["tava", 19.9], ["ali", 20.16]),
  P(["volta.", 20.5, true]),
  P(["Se", 21.22], ["você", 21.28], ["tem", 21.44]),
  P(["borderline,", 21.62, true]),
  P(["um", 22.34], ["dia", 22.4], ["sem", 22.6]),
  P(["sentir", 22.76]),
  P(["não", 23.18], ["apaga", 23.5, true]),
  P(["todo", 23.92], ["o", 24.14], ["seu", 24.34]),
  P(["afeto.", 24.4, true]),
  P(["Se", 24.8], ["você", 24.86], ["convive,", 25.0, true]),
  P(["não", 25.72], ["cobre", 25.84, true]),
  P(["declarações", 26.34], ["de", 27.08], ["amor", 27.28]),
  P(["nesse", 27.5], ["dia.", 27.7]),
  P(["Só", 28.08], ["fala", 28.18], ["que", 28.42]),
  P(["você", 28.58], ["vai", 28.82]),
  P(["ficar", 28.96], ["por", 29.24], ["perto.", 29.4, true]),
  P(["Claro", 29.62], ["que", 30.0], ["se", 30.14]),
  P(["durar", 30.22], ["semanas", 30.5, true]),
  P(["ou", 30.84], ["tiver", 31.2], ["algum", 31.46]),
  P(["sinal", 31.64], ["de", 31.9], ["alerta,", 31.98, true]),
  P(["tem", 32.44], ["que", 32.52], ["procurar", 32.62]),
  P(["ajuda", 33.02, true], ["imediata.", 33.18, true]),
  P(["Abraça", 34.02], ["sem", 34.46]),
  P(["sentir", 34.7], ["nada", 35.0, true]),
  P(["e", 35.36], ["ainda", 35.74]),
  P(["te", 35.9], ["ama.", 36.12, true]),
  P(["Manda", 36.4], ["pra", 36.64], ["quem", 36.72]),
  P(["você", 36.84], ["queria", 37.0], ["que", 37.22]),
  P(["entendesse", 37.34, true]),
  { palavras: [{ w: "nesse", t: 37.76 }, { w: "dia.", t: 37.9 }], fim: 38.45 },
];

// Efeitos sonoros: tempo do pico, arquivo e pico alvo em dBFS.
export const SFX = [
  { t: 6.43, f: "whoosh-short", pico: -22 },
  { t: 9.26, f: "whoosh", pico: -20 },
  { t: 14.14, f: "click-soft", pico: -21 },
  { t: 17.53, f: "whoosh", pico: -20 },
  { t: 23.17, f: "pop", pico: -23 },
  { t: 25.43, f: "whoosh", pico: -20 },
  { t: 28.6, f: "click-soft", pico: -21 },
  { t: 33.94, f: "click-soft", pico: -21 },
  { t: 35.89, f: "pop", pico: -23 },
];
