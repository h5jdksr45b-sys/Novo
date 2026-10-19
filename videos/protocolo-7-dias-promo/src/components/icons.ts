// Caminhos copiados de public/icones/*.svg (viewBox 96x96).
// Circulos e retangulos do #base foram convertidos em paths para o evolvePath.
type Destaque =
  | {kind: 'stroke'; paths: string[]; width: number}
  | {kind: 'dots'; dots: [number, number, number][]}
  | {kind: 'ring'; cx: number; cy: number; r: number}
  | {kind: 'grow-rect'; x: number; y: number; w: number; h: number; rx: number};

type IconDef = {base: string[]; destaque: Destaque};

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const rrect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

export const ICONS = {
  'dia1-frase-fixa': {
    base: ['M16 20h64a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H40L26 76V64H16a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z'],
    destaque: {kind: 'stroke', paths: ['M30 42h36'], width: 5},
  },
  'dia2-limite-sem-briga': {
    base: [circle(26, 40, 9), 'M12 78a14 14 0 0 1 28 0', circle(70, 40, 9), 'M56 78a14 14 0 0 1 28 0'],
    destaque: {kind: 'stroke', paths: ['M48 18v64'], width: 5},
  },
  'dia3-pausa-20min': {
    base: [circle(48, 52, 30), 'M42 12h12', 'M48 12v10', 'M48 52V36'],
    destaque: {kind: 'stroke', paths: ['M48 22A30 30 0 0 1 73.98 67'], width: 6},
  },
  'dia4-roteiro-pos-crise': {
    base: [rrect(20, 16, 56, 66, 6), 'M38 12h20v10H38z', 'M46 40h20', 'M46 54h20', 'M46 68h20', 'M32 54h4', 'M32 68h4'],
    destaque: {kind: 'stroke', paths: ['M30 40l4 4 7-8'], width: 5},
  },
  'dia5-sair-dos-detalhes': {
    base: [circle(42, 42, 26), 'M61 61l21 21'],
    destaque: {kind: 'stroke', paths: ['M30 42h24'], width: 5},
  },
  'dia6-previsibilidade': {
    base: [rrect(14, 20, 68, 62, 6), 'M14 36h68', 'M32 14v12', 'M64 14v12', 'M28 68h4', 'M46 68h4', 'M64 68h4'],
    destaque: {kind: 'dots', dots: [[30, 53, 4], [48, 53, 4], [66, 53, 4]]},
  },
  'dia7-autocuidado': {
    base: [rrect(12, 30, 62, 36, 6), 'M82 42v12'],
    destaque: {kind: 'grow-rect', x: 20, y: 38, w: 22, h: 20, rx: 2},
  },
  'extra-dentro-de-casa': {
    base: ['M14 46L48 18l34 28', 'M24 40v40h48V40'],
    destaque: {kind: 'stroke', paths: ['M42 80V62h12v18'], width: 5},
  },
  'extra-sinais-antes-da-crise': {
    base: ['M10 58h18l6-12 6 12h12l8-28 8 44 6-16h12'],
    destaque: {kind: 'ring', cx: 34, cy: 46, r: 8},
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;
