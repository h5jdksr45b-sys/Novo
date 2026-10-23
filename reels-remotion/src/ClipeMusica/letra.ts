// Letra transcrita do áudio enviado, com tempos aproximados em segundos.
// A transcrição foi feita por janelas sobrepostas do Whisper, sem marcação
// palavra a palavra. Para ajustar a sincronia, mude início e fim aqui.
// duvida: true marca versos que a transcrição não ouviu com clareza.

export type Verso = {
  inicio: number;
  fim: number;
  texto: string;
  duvida?: boolean;
};

export const LETRA: Verso[] = [
  { inicio: 1.6, fim: 2.9, texto: "Eu falo com vocês, irmãos," },
  { inicio: 2.9, fim: 4.4, texto: "que dão ouvido pro outro" },
  { inicio: 4.4, fim: 5.6, texto: "mesmo largado no chão." },
  { inicio: 5.6, fim: 6.8, texto: "Pra quem tá se afogando," },
  { inicio: 6.8, fim: 7.9, texto: "a mão é muito pouco.", duvida: true },
  { inicio: 7.9, fim: 9.4, texto: "Peço ajuda e", duvida: true },
  { inicio: 9.4, fim: 10.3, texto: "me chamam de louco." },
  {
    inicio: 10.3,
    fim: 12.6,
    texto: "Me mostro certa, que serve pra qualquer um,",
  },
  {
    inicio: 12.6,
    fim: 15.0,
    texto: "porque o meu jeito de sentir não cabe no comum.",
  },
  { inicio: 15.0, fim: 16.0, texto: "Basta um silêncio", duvida: true },
  { inicio: 16.0, fim: 17.6, texto: "e eu já me perco no pensamento," },
  { inicio: 17.6, fim: 18.6, texto: "explodo no segundo." },
  { inicio: 18.6, fim: 19.8, texto: "A culpa é um tormento." },
  { inicio: 19.8, fim: 21.2, texto: "Pronto, passei do ponto" },
  { inicio: 21.2, fim: 22.6, texto: "e nem vi a sua mão." },
  { inicio: 22.6, fim: 23.8, texto: "E agora é a vergonha" },
  { inicio: 23.8, fim: 25.4, texto: "que me deixa de cara no chão." },
  { inicio: 25.4, fim: 26.8, texto: "Não quero sermão" },
  { inicio: 26.8, fim: 27.8, texto: "nem conselho." },
  { inicio: 27.8, fim: 30.0, texto: "Só me diz então..." },
];

// Momentos de texto grande. Fora deles, só a legenda pequena.
export const ENFASES: { inicio: number; fim: number; texto: string }[] = [
  { inicio: 4.4, fim: 5.6, texto: "largado no chão" },
  { inicio: 9.4, fim: 10.3, texto: "louco" },
  { inicio: 17.6, fim: 18.6, texto: "explodo" },
  { inicio: 22.6, fim: 23.8, texto: "vergonha" },
];
