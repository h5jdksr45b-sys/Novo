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

// Fontes do clipe Borderline, a intensa: Montserrat ExtraBold (gancho),
// Playfair Display itálico (destaques serifados) e Inter (interface).
export const Montserrat = `Montserrat`;
export const Playfair = `Playfair Display`;
export const Inter = `Inter`;

let clipeLoaded = false;

export const loadFontesClipe = async (): Promise<void> => {
  if (clipeLoaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender("fontes do clipe");
  clipeLoaded = true;

  const fontes = [
    new FontFace(
      Montserrat,
      `url('${staticFile("fonts/montserrat-800.woff2")}') format('woff2')`,
      { weight: "800" },
    ),
    new FontFace(
      Playfair,
      `url('${staticFile("fonts/playfair-600-italic.woff2")}') format('woff2')`,
      { weight: "600", style: "italic" },
    ),
    new FontFace(
      Inter,
      `url('${staticFile("fonts/inter-var.woff2")}') format('woff2')`,
      { weight: "100 900" },
    ),
  ];

  await Promise.all(fontes.map((f) => f.load()));
  fontes.forEach((f) => document.fonts.add(f));

  continueRender(waitForFont);
};
