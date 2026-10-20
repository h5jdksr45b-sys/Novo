import { continueRender, delayRender, staticFile } from "remotion";

// Instrument Serif (itálico) e Inter Tight: o par serifada e sem serifa
// das referências. Arquivos em public/identidade/fonts (licença OFL).
export const SERIF = "Instrument Serif";
export const SANS = "Inter Tight";

const fontes: [string, string, FontFaceDescriptors][] = [
  [SERIF, "instrument-serif-latin-400-italic.woff2", { style: "italic", weight: "400" }],
  [SERIF, "instrument-serif-latin-400-normal.woff2", { style: "normal", weight: "400" }],
  [SANS, "inter-tight-latin-500-normal.woff2", { weight: "500" }],
  [SANS, "inter-tight-latin-700-normal.woff2", { weight: "700" }],
  [SANS, "inter-tight-latin-800-normal.woff2", { weight: "800" }],
  [SANS, "inter-tight-latin-900-normal.woff2", { weight: "900" }],
];

let carregadas = false;

export const loadIdentidadeFonts = async (): Promise<void> => {
  if (carregadas) {
    return;
  }
  carregadas = true;
  const espera = delayRender("fontes do reel identidade");
  await Promise.all(
    fontes.map(async ([familia, arquivo, desc]) => {
      const fonte = new FontFace(
        familia,
        `url('${staticFile(`identidade/fonts/${arquivo}`)}') format('woff2')`,
        desc,
      );
      await fonte.load();
      document.fonts.add(fonte);
    }),
  );
  continueRender(espera);
};
