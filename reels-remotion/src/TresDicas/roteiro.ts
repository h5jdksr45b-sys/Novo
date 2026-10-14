// Roteiro e tempos do Reel. Tudo em segundos, contado do início do vídeo.
// Os tempos são estimados para uma fala de ritmo calmo. Quando a voz
// estiver pronta, a transcrição do Whisper substitui inicio e fim de cada
// fala, e a animação inteira acompanha.

export type Fala = {
  readonly inicio: number;
  readonly fim: number;
  readonly texto: string;
};

export const FALAS = {
  gancho1: { inicio: 0.3, fim: 1.6, texto: "Foi só uma brincadeira." },
  gancho2: { inicio: 1.8, fim: 2.8, texto: "E virou briga." },
  intro: {
    inicio: 3.3,
    fim: 7.0,
    texto:
      "Três coisas pequenas que pioram a convivência com quem tem borderline.",
  },

  d1Titulo: { inicio: 7.6, fim: 10.0, texto: "Um. Provocar pra ver até onde vai." },
  d1a: { inicio: 10.2, fim: 12.2, texto: "A brincadeira que pros outros passa," },
  d1b: { inicio: 12.2, fim: 14.6, texto: "pra essa pessoa pode soar como ataque." },
  d1c: { inicio: 15.0, fim: 16.6, texto: "Não é andar em ovos." },
  d1d: { inicio: 16.7, fim: 18.6, texto: "É não puxar briga à toa." },

  d2Titulo: { inicio: 19.3, fim: 21.2, texto: "Dois. Prometer sem ter certeza." },
  d2a: { inicio: 21.4, fim: 24.0, texto: "O medo de ser deixado já está perto." },
  d2b: {
    inicio: 24.2,
    fim: 27.0,
    texto: "Promessa quebrada, mesmo pequena, confirma esse medo.",
  },
  d2c: { inicio: 27.3, fim: 29.3, texto: "Se não tem certeza, não promete." },
  d2d: { inicio: 29.4, fim: 31.1, texto: "Se não der, avisa antes." },

  d3Titulo: { inicio: 31.8, fim: 33.5, texto: "Três. Responder com deboche." },
  d3a: {
    inicio: 33.7,
    fim: 37.6,
    texto: "Ironia com quem diz que está mal dói mais que o silêncio.",
  },
  d3b: { inicio: 38.0, fim: 38.7, texto: "Escuta." },
  d3c: {
    inicio: 38.9,
    fim: 41.3,
    texto: "Reconhece que está difícil, mesmo discordando.",
  },

  fecho1: {
    inicio: 42.0,
    fim: 44.7,
    texto: "Isso não te faz responsável por toda reação.",
  },
  fecho2: {
    inicio: 44.9,
    fim: 48.3,
    texto: "Só tira do caminho as brigas que não precisavam acontecer.",
  },
  cta: {
    inicio: 49.3,
    fim: 52.3,
    texto: "Manda pra pessoa que você queria que entendesse isso.",
  },
} as const satisfies Record<string, Fala>;

// Onde cada cena começa. A cena seguinte começa onde a anterior termina.
export const CENAS = {
  abertura: 0,
  dica1: 7.4,
  dica2: 19.1,
  dica3: 31.5,
  fecho: 41.7,
  resumo: 48.6,
  fim: 55,
} as const;

// Momento em que a palavra de índice i começa a ser dita, proporcional ao
// tamanho das palavras anteriores. Serve até a transcrição real chegar.
export const tempoDaPalavra = (fala: Fala, i: number): number => {
  const palavras = fala.texto.split(" ");
  const total = palavras.reduce((s, p) => s + p.length + 1, 0);
  const antes = palavras.slice(0, i).reduce((s, p) => s + p.length + 1, 0);
  return fala.inicio + (fala.fim - fala.inicio) * (antes / total);
};
