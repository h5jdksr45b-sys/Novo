export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Área segura: nada fora deste retângulo.
export const SEGURA = { esquerda: 90, direita: 90, topo: 220, base: 380 };
export const LARGURA_UTIL = W - SEGURA.esquerda - SEGURA.direita; // 900
export const ALTURA_UTIL = H - SEGURA.topo - SEGURA.base; // 1320

export const COR = {
  fundo: "#121314",
  superficie: "#1C1D1F",
  linha: "#34363A",
  texto: "#F2F0EB",
  apagado: "#9A9790",
  destaque: "#E9A55B",
};

export const FONTE = "InterLocal";

// Cenas em segundos: 4 + 6 + 6 + 7 + 6 = 29
export const CENAS = [
  { id: "abertura", inicio: 0, duracao: 4 },
  { id: "fluxo", inicio: 4, duracao: 6 },
  { id: "cards", inicio: 10, duracao: 6 },
  { id: "nuance", inicio: 16, duracao: 7 },
  { id: "sintese", inicio: 23, duracao: 6 },
] as const;

export const DURACAO_TOTAL = CENAS.reduce((s, c) => s + c.duracao, 0) * FPS;
