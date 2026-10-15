import { continueRender, delayRender, staticFile } from "remotion";

export const TheBoldFont = `TheBoldFont`;

let loaded = false;

export const loadFont = async (): Promise<void> => {
  if (loaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  loaded = true;

  const font = new FontFace(
    TheBoldFont,
    `url('${staticFile("theboldfont.ttf")}') format('truetype')`,
  );

  await font.load();
  document.fonts.add(font);

  continueRender(waitForFont);
};

// Anton: fonte condensada com acentos do português (ã, ç, é).
// TheBoldFont não tem esses caracteres.
export const Anton = `Anton`;

let antonLoaded = false;

export const loadAnton = async (): Promise<void> => {
  if (antonLoaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  antonLoaded = true;

  const font = new FontFace(
    Anton,
    `url('${staticFile("fonts/anton.woff2")}') format('woff2')`,
  );

  await font.load();
  document.fonts.add(font);

  continueRender(waitForFont);
};

// Inter: mesma fonte dos esquemas do artigo sobre comorbidades.
export const Inter = `InterReel`;

let interLoaded = false;

export const loadInter = async (): Promise<void> => {
  if (interLoaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  interLoaded = true;

  const pesos: [string, string][] = [
    ["Regular", "400"],
    ["SemiBold", "600"],
    ["Bold", "700"],
    ["ExtraBold", "800"],
  ];
  await Promise.all(
    pesos.map(async ([nome, peso]) => {
      const font = new FontFace(
        Inter,
        `url('${staticFile(`fonts/inter/Inter-${nome}.otf`)}') format('opentype')`,
        { weight: peso },
      );
      await font.load();
      document.fonts.add(font);
    }),
  );

  continueRender(waitForFont);
};
