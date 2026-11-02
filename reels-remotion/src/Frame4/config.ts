// Tempos em segundos, alinhados com a narração na voz Fabio
// (videos/colagem-etapas/narracao/tempos.txt, bloco 4, fala começando em 0 s).
export const CONFIG_FRAME4 = {
  fps: 30,
  duracao: 11.1,
  cenas: {
    etapa2: { inicio: 0, fim: 2.4 },
    piorVersao: { inicio: 2.4, fim: 5.95 },
    etapa3: { inicio: 5.95, fim: 9.95 },
    grito: { inicio: 9.95, fim: 11.1 },
  },
  // Cena 1: [Se ninguém percebe, etapa dois.]
  etapa1Arranca: 0.55,
  etapa2Cola: 1.3, // etapa
  // Cena 2: [A cabeça escolhe a pior versão: não se importa comigo.]
  escritaInicio: 2.75,
  escritaFim: 5.6, // termina junto com a palavra comigo
  bolinhaTrancos: [3.3, 4.4],
  bolinhaEscalas: [1, 1.28, 1.58],
  // Cena 3: [Etapa três. O corpo acelera. Tem que resolver agora.]
  etapa2Arranca: 5.95,
  etapa3Cola: 6.1, // três
  recortes: {
    relogio: 6.55,
    seta1: 6.85,
    fita1: 7.05,
    seta2: 7.3,
    fita2: 7.5,
    seta3: 7.75,
    fita3: 7.95,
    fita4: 8.15,
  },
  agora: 9.2, // agora
  // Cena 4: [E aí vem o grito.]
  limpa: 9.95,
  limpaQuadros: 4,
  circulo: 10.45, // grito
  semTremorQuadrosFinais: 10,
  // Tremor de stop motion: troca de pose a cada N quadros
  passoNormal: 3, // igual a PASSO_PADRAO de Colagem/movimento
  passoAcelerado: 1,
};
