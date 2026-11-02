// Tempos em segundos, alinhados com a narração na voz Fabio
// (videos/colagem-etapas/narracao/tempos.txt, bloco 3, fala começando em 0,45 s).
export const CONFIG_FRAME3 = {
  fps: 30,
  duracao: 14.5,
  cenas: {
    mergulho: { inicio: 0, fim: 2.45 },
    relogio: { inicio: 2.45, fim: 6.8 },
    aperto: { inicio: 6.8, fim: 9.2 },
    semNome: { inicio: 9.2, fim: 11.4 },
    branco: { inicio: 11.4, fim: 14.5 },
  },
  // Cena 1: [Etapa um. O primeiro aperto.]
  mergulhoFim: 0.85,
  discoRaioFinal: 400,
  discoCentro: { x: 540, y: 900 },
  faixaEtapa1: 0.9, // um
  subtitulo: 1.9, // aperto
  // Cena 2: [A pessoa chega quarenta minutos atrasada e diz que pegou trânsito.]
  sobeTopo: 2.45,
  sobeTopoDuracao: 0.45,
  discoSai: 2.45,
  relogioCola: 2.85,
  ponteirosParam: 5.6,
  mais40: 3.55, // quarenta
  // Cena 3: [Alguma coisa aperta por dentro.]
  relogioSai: 6.8,
  folhaCola: 6.95,
  trancosAmassado: [7.45, 7.95, 8.45],
  // Cena 4: [Ainda não tem raiva. Não tem briga.]
  raiva: 9.85, // raiva
  briga: 10.9, // briga
  riscoAtraso: 0.13,
  riscoDuracao: 0.25,
  // Cena 5: [É um incômodo tão rápido que você nem dá nome.]
  raivaSai: 11.4,
  brigaSai: 11.5,
  etiquetaBranca: 12.0, // incômodo
  tudoPara: 14.2,
};
