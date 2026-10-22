// Roteiro do Reel "1961" (Marsha Linehan). Cada cena é UM plano.
// A fala é contínua: as cenas só dizem onde a imagem corta.
// O corte acontece na primeira palavra da fala da cena, nunca no meio de uma palavra.

export type Plano = "aberto" | "fechado";

type Base = { id: string; fala: string };

export type CenaFala = Base & {
  tipo: "fala";
  plano: Plano;
};

export type CenaBroll = Base & {
  tipo: "broll";
  imagem: string; // caminho dentro de public/
  descricaoImagem: string; // o que buscar/gerar para esse plano
  movimento: "aproxima" | "afasta";
  posicaoTexto: "alto" | "baixo";
  destaques?: string[]; // palavras com caixa de destaque
  grandes?: string[]; // palavras que sobem de corpo (momento de ênfase)
  flashNaEntrada?: boolean; // 2 frames de flash invertido no corte
  impacto?: boolean; // SFX grave no corte
  rotulo?: { texto: string; x: number; y: number; setaPara?: { x: number; y: number } };
};

export type CenaEsquema = Base & { tipo: "esquema" };

export type CenaAssinatura = Base & { tipo: "assinatura"; duracaoMs: number };

export type Cena = CenaFala | CenaBroll | CenaEsquema | CenaAssinatura;

export const TITULO = "1961";

export const ASSINATURA = {
  nome: "Dr. Fabio Schmidt",
  registro: "CRM-SP 183549",
  titulo: "Médico, pós-graduado em psiquiatria",
  rodape: "Conteúdo educativo. Fontes na legenda.",
};

export const CENAS: Cena[] = [
  {
    id: "s01",
    tipo: "fala",
    plano: "aberto",
    fala: "Se você já pensou que a sua cabeça não tem conserto, guarda esse nome: Marsha Linehan.",
  },
  {
    id: "s02",
    tipo: "broll",
    fala: "Hartford, 1961. Uma menina de 17 anos é internada num hospital psiquiátrico.",
    imagem: "linehan/01-hartford-1961.jpg",
    descricaoImagem:
      "Fachada ou corredor de hospital psiquiátrico dos anos 1960, preto e branco, vazio, luz dura de janela.",
    movimento: "aproxima",
    posicaoTexto: "alto",
    destaques: ["17 anos"],
    flashNaEntrada: true,
    impacto: true,
  },
  {
    id: "s03",
    tipo: "broll",
    fala: "Ela se machucava, e ninguém sabia dizer por quê.",
    imagem: "linehan/02-janela.jpg",
    descricaoImagem:
      "Janela alta com grade fina vista de dentro, contraluz, parede lisa. Sem pessoa em quadro.",
    movimento: "afasta",
    posicaoTexto: "baixo",
    grandes: ["ninguém"],
  },
  {
    id: "s04",
    tipo: "broll",
    fala: "Mais de dois anos lá dentro, na ala dos pacientes mais graves. Boa parte num quarto de isolamento.",
    imagem: "linehan/03-quarto-isolamento.jpg",
    descricaoImagem:
      "Quarto vazio com porta pesada e visor pequeno, piso refletindo luz fria. Enquadramento frontal, simétrico.",
    movimento: "aproxima",
    posicaoTexto: "alto",
    destaques: ["dois anos"],
    grandes: ["isolamento."],
  },
  {
    id: "s05",
    tipo: "broll",
    fala: "O diagnóstico no prontuário era esquizofrenia.",
    imagem: "linehan/04-prontuario.jpg",
    descricaoImagem:
      "Folha datilografada em close, máquina de escrever desfocada ao fundo, papel amarelado convertido para P&B.",
    movimento: "afasta",
    posicaoTexto: "baixo",
    rotulo: { texto: "esquizofrenia", x: 540, y: 1180 },
  },
  {
    id: "s06",
    tipo: "fala",
    plano: "fechado",
    fala: "Hoje o nome provável seria transtorno de personalidade borderline. Em 1961 esse nome nem existia no manual.",
  },
  {
    id: "s07",
    tipo: "fala",
    plano: "aberto",
    fala: "Lá dentro ela fez uma promessa: sair daquele inferno e voltar pra tirar os outros.",
  },
  {
    id: "s08",
    tipo: "esquema",
    fala: "Ela saiu. Virou psicóloga. E o tratamento que ela criou tem dois movimentos que parecem opostos. Aceitar: a sua dor é real e faz sentido. Mudar: do jeito que está, você continua sofrendo. Quase todo tratamento escolhia um lado. Ela juntou os dois. Dialética quer dizer isso: dois lados ao mesmo tempo. É a terapia comportamental dialética.",
  },
  {
    id: "s09",
    tipo: "broll",
    fala: "Em 1991 saiu o primeiro estudo controlado. Um ano de tratamento.",
    imagem: "linehan/05-universidade-1991.jpg",
    descricaoImagem:
      "Prédio de universidade americana nos anos 1990 ou arquivo com pastas de papel, P&B, grão forte.",
    movimento: "aproxima",
    posicaoTexto: "alto",
    flashNaEntrada: true,
    impacto: true,
  },
  {
    id: "s10",
    tipo: "broll",
    fala: "Menos episódios de autolesão. Menos dias de internação.",
    imagem: "linehan/06-corredor-vazio.jpg",
    descricaoImagem:
      "Corredor de hospital vazio com luz no fim, simétrico, chão brilhando. A mesma linguagem do plano 03.",
    movimento: "afasta",
    posicaoTexto: "baixo",
    grandes: ["Menos", "Menos"],
  },
  {
    id: "s11",
    tipo: "broll",
    fala: "Em 2011, aos 68 anos, ela voltou ao mesmo hospital e contou em público: a paciente era ela.",
    imagem: "linehan/07-auditorio-2011.jpg",
    descricaoImagem:
      "Auditório visto do palco, cadeiras vazias ou plateia desfocada, um foco de luz. P&B.",
    movimento: "aproxima",
    posicaoTexto: "alto",
    destaques: ["68 anos"],
    grandes: ["ela."],
    flashNaEntrada: true,
    impacto: true,
    rotulo: { texto: "Marsha Linehan", x: 540, y: 1250 },
  },
  {
    id: "s12",
    tipo: "fala",
    plano: "fechado",
    fala: "O tratamento com mais estudos para borderline não nasceu de quem olhava a dor de fora. Nasceu de quem passou mais de dois anos trancada com ela.",
  },
  {
    id: "s13",
    tipo: "fala",
    plano: "aberto",
    fala: "Se alguém que você ama acha que não tem conserto, manda esse vídeo pra essa pessoa.",
  },
  {
    id: "s14",
    tipo: "assinatura",
    fala: "",
    duracaoMs: 2800,
  },
];
