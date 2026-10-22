// Roteiro do Reel "Borderline mente" (memória depois da briga). Cada cena é UM plano.
// A fala é o take gravado pelo Fabio (public/reel-noir/fala.mp4). As cenas só dizem onde a imagem corta.
// O corte acontece na primeira palavra da fala da cena, nunca no meio de uma palavra.

export type Plano = "aberto" | "fechado";

type Base = { id: string; fala: string };

export type CenaFala = Base & {
  tipo: "fala";
  plano: Plano;
  // Texto grande no momento de ênfase: entra quando a palavra-gatilho é dita.
  enfase?: { texto: string; gatilho: string; posicao?: "alto" | "baixo" };
};

export type CenaBroll = Base & {
  tipo: "broll";
  imagem: string; // caminho dentro de public/
  video?: string; // versão animada do mesmo plano (mp4 em public/); usada se o arquivo existir
  descricaoImagem: string; // o que buscar/gerar para esse plano
  movimento: "aproxima" | "afasta";
  posicaoTexto: "alto" | "baixo";
  destaques?: string[]; // palavras com caixa de destaque
  grandes?: string[]; // palavras que sobem de corpo (momento de ênfase)
  flashNaEntrada?: boolean; // 2 frames de flash invertido no corte
  impacto?: boolean; // SFX grave no corte
  rotulo?: {
    texto: string;
    x: number;
    y: number;
    setaPara?: { x: number; y: number };
  };
  fundo?: string; // palavra gigante atrás da imagem
};

export type CenaEsquema = Base & { tipo: "esquema"; fundo?: string };

export type CenaAssinatura = Base & { tipo: "assinatura"; duracaoMs: number };

export type Cena = CenaFala | CenaBroll | CenaEsquema | CenaAssinatura;

export const TITULO = "Borderline mente";

export const ETIQUETAS = {
  esquerda: "BORDERLINE SEM ESTIGMA",
  direita: "MEMÓRIA · DEPOIS DA BRIGA",
  rodape: "CRM-SP 183549",
};

export const ASSINATURA = {
  nome: "Dr. Fabio Schmidt",
  registro: "CRM-SP 183549",
  titulo: "Médico, pós-graduado em psiquiatria",
  rodape: "Conteúdo educativo.",
};

export const CENAS: Cena[] = [
  {
    id: "s01",
    tipo: "fala",
    plano: "aberto",
    fala: "Borderline mente. Quantas vezes que você ouviu isso num dia depois da briga?",
    enfase: {
      texto: "Borderline mente.",
      gatilho: "Borderline",
      posicao: "alto",
    },
  },
  {
    id: "s02",
    tipo: "fala",
    plano: "aberto",
    fala: "Você lembra exatamente o que viu, mas o outro jura que não foi assim.",
  },
  {
    id: "s03",
    tipo: "fala",
    plano: "aberto",
    fala: "Ter chamado de mentiroso por algo que você viveu com tanta certeza dói demais.",
  },
  {
    id: "s04",
    tipo: "esquema",
    fundo: "ATENÇÃO",
    fala: "Só que quanto mais fissurado a gente fica nisso, mais estreitos ficam a nossa atenção e o nosso foco. A gente grava com detalhe o que pareceu ameaça e quase nada do resto. Isso acontece com qualquer pessoa.",
  },
  {
    id: "s05",
    tipo: "broll",
    fala: "É como um cachorro bravo latindo e correndo na sua direção.",
    imagem: "reel-noir/01-cachorro-dentes.jpg",
    video: "reel-noir/01-cachorro-dentes.mp4",
    fundo: "AMEAÇA",
    descricaoImagem:
      "Close extremo dos dentes de um cachorro bravo, fundo escuro, P&B de contraste alto.",
    movimento: "aproxima",
    posicaoTexto: "baixo",
    flashNaEntrada: true,
    impacto: true,
    grandes: ["bravo"],
  },
  {
    id: "s06",
    tipo: "broll",
    fala: "Você lembra de detalhes do dente, mas não da cor da coleira que ele estava usando.",
    imagem: "reel-noir/02-coleira.jpg",
    video: "reel-noir/02-coleira.mp4",
    fundo: "RESTO",
    descricaoImagem:
      "Coleira de couro com plaquinha, muito perto e fora de foco, tons de cinza.",
    movimento: "afasta",
    posicaoTexto: "alto",
    destaques: ["dente"],
    grandes: ["coleira"],
  },
  {
    id: "s07",
    tipo: "broll",
    fala: "Você guardou a palavra, o outro guardou o tom de voz.",
    imagem: "reel-noir/03-palavra.jpg",
    video: "reel-noir/03-palavra.mp4",
    fundo: "PALAVRA",
    descricaoImagem:
      "Uma palavra escrita à mão numa folha pautada, circulada a lápis, luz de janela, P&B.",
    movimento: "aproxima",
    posicaoTexto: "baixo",
    destaques: ["palavra,", "tom de voz."],
  },
  {
    id: "s08",
    tipo: "broll",
    fala: "Os dois podem estar contando pedaços verdadeiros de uma mesma cena.",
    imagem: "reel-noir/04-duas-poltronas.jpg",
    video: "reel-noir/04-duas-poltronas.mp4",
    fundo: "CENA",
    descricaoImagem:
      "Sala vazia com duas poltronas de frente uma para a outra, luz baixa de fim de tarde, P&B.",
    movimento: "afasta",
    posicaoTexto: "alto",
    grandes: ["verdadeiros"],
    flashNaEntrada: true,
    impacto: true,
  },
  {
    id: "s09",
    tipo: "fala",
    plano: "aberto",
    fala: "Lembrar uma coisa diferente não faz disso uma mentira.",
    enfase: {
      texto: "Lembrar diferente não é mentir.",
      gatilho: "não",
      posicao: "alto",
    },
  },
  {
    id: "s10",
    tipo: "fala",
    plano: "aberto",
    fala: "Da próxima vez, antes de disputar quem que lembra certo, pergunte: o que mais te marcou?",
    enfase: {
      texto: "O que mais te marcou?",
      gatilho: "pergunte:",
      posicao: "alto",
    },
  },
  {
    id: "s11",
    tipo: "fala",
    plano: "aberto",
    fala: "Manda pra aquela pessoa que você acaba sempre caindo na mesma discussão.",
  },
  {
    id: "s12",
    tipo: "assinatura",
    fala: "",
    duracaoMs: 2600,
  },
];
