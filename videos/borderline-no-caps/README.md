# Borderline no CAPS: animação de colagem (Remotion)

Animação de 25 s, 30 qps, sem áudio, para o livro Borderline no CAPS (@drfabioschmidt).

- `BorderlineNoCapsVertical`: 1080x1920
- `BorderlineNoCapsHorizontal`: 1920x1080, mesmo conteúdo reorganizado

## Cenas

| Tempo | Cena | Componente |
|---|---|---|
| 0 a 6 s | Ficha de prontuário, quatro carimbos (ACOLHIMENTO, PS, RETORNO, PS), visitas riscadas e a quinta circulada | `scenes/Scene1Ficha.tsx` |
| 6 a 12 s | Porta giratória vista de cima; o mesmo boneco entra e sai duas vezes | `scenes/Scene2Porta.tsx` |
| 12 a 20 s | Funil UBS, GRUPO, CAPS, CRISE; dez bonecos caem (5, 3, 1, 1) | `scenes/Scene3Funil.tsx` |
| 20 a 25 s | Capa do livro pousa, leva carimbo vermelho, entra @drfabioschmidt; últimos 2 s parados | `scenes/Scene4Livro.tsx` |

Componentes reutilizáveis em `src/components/`: `PaperCutout`, `Stamp`, `Tape`, `PaperFigure`, `GrainOverlay`, além de `KraftBackground`, `PenArrow`, `TitleStrips`, `PaperWipe` e `Typed`.

## Regras de movimento

- Stop motion a 12 qps (`src/lib/stop.ts`): posição, rotação e tremor mudam a cada 2,5 quadros.
- Tremor leve em todo recorte (`useJitter`) e tranco da cena quando um carimbo bate (`useShake`).
- Transição: corte seco com uma folha de papel atravessando a tela em três quadros (`PaperWipe`).
- Final: a partir de 23 s, tremor e grão param (`FrozenCtx`).
- Margem segura de 120 px em todas as bordas.

## Áudio

Prop opcional `audioSrc` (arquivo em `public/` ou URL):

```bash
npx remotion render BorderlineNoCapsVertical out/v.mp4 --props='{"audioSrc":"trilha.mp3"}'
```

## Fontes

Anton e Special Elite, do Google Fonts (licença OFL). Por padrão o projeto carrega os arquivos guardados em `public/fonts/`, porque o Chrome do renderizador nesta nuvem não confia no certificado do proxy e não baixa do fonts.gstatic.com. Num computador comum, `REMOTION_FONTS=google` carrega pelo `@remotion/google-fonts`.

## Renderizar

```bash
npm install
npm run render:v   # out/borderline-no-caps-vertical.mp4
npm run render:h   # out/borderline-no-caps-horizontal.mp4
./check-frames.sh Vertical 170 340 590 740   # quadros de checagem em frames/
```

Nesta nuvem, o download do Chrome do Remotion é bloqueado. Antes de renderizar:

```bash
export REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
```
