import { continueRender, delayRender, staticFile } from "remotion";

export const SERIFA = "Playfair Display";
export const SANS = "Inter";

let carregado: Promise<void> | null = null;

const carregar = async (familia: string, arquivo: string, descritores: FontFaceDescriptors) => {
  const face = new FontFace(familia, `url('${staticFile(arquivo)}') format('woff2')`, descritores);
  await face.load();
  document.fonts.add(face);
};

export const carregarFontes = (): Promise<void> => {
  if (carregado) return carregado;
  const handle = delayRender("fontes do reel");
  const promessa: Promise<void> = Promise.all([
    carregar(SERIFA, "fonts/PlayfairDisplay-400.woff2", { weight: "400 900", style: "normal" }),
    carregar(SERIFA, "fonts/PlayfairDisplay-400-italic.woff2", { weight: "400 900", style: "italic" }),
    carregar(SANS, "fonts/Inter-400.woff2", { weight: "100 900", style: "normal" }),
  ]).then(
    () => continueRender(handle),
    (erro) => {
      continueRender(handle);
      throw erro;
    },
  );
  carregado = promessa;
  return promessa;
};
