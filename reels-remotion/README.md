# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Captioning

Replace the `sample-video.mp4` with your video file.
Caption all the videos in you `public` by running the following command:

```console
node sub.mjs
```

Only caption a specific video:

```console
node sub.mjs <path-to-video-file>
```

Only caption a specific folder:

```console
node sub.mjs <path-to-folder>
```

## Configure Whisper.cpp

Captioning will download Whisper.cpp and the 1.5GB big `medium.en` model. To configure which model is being used, you can configure the variables in `whisper-config.mjs`.

### Non-English languages

To support non-English languages, you need to change the `WHISPER_MODEL` variable in `whisper-config.mjs` to a model that does not have a `.en` sufix.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://remotion.dev/discord).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## Componentes extras

**Anime.js** (`animejs`) já vem instalado. Use sempre pelo hook `src/anime/useAnimeTimeline.ts`, que prende a animação ao quadro do vídeo. Chamar `animate()` direto faz o render final sair diferente do preview.

**ComparacaoLadoALado**: composição de exemplo (câmera parada, dois lados com rótulo, diferença crescendo). Troque rótulos e cor no painel de props do Studio.

**Imagens**: `public/icones-3d/` e `public/ilustracoes/` recebem os arquivos do 3dicons e do Kitbitz.

## ReelLegendas (legenda cinética)

Composição `ReelLegendas` em `src/ReelLegendas/`. As palavras entram uma a uma
no instante em que são faladas. A palavra falada ganha fundo vermelho. Fora
das ênfases a legenda é pequena e fica abaixo do queixo. Dentro das janelas
listadas em `enfases` (pares de ms: início, fim) a mesma legenda vira texto
grande.

As legendas ficam inline no nó `<LegendaCinetica>` em
`src/ReelLegendas/index.tsx`, então o editor de legendas do Studio consegue
corrigir palavras e tempos direto no código.

Para trocar o vídeo: coloque o arquivo em `public/`, gere o JSON de legendas
(`node sub.mjs public/arquivo.mp4`) e copie o conteúdo para o prop `captions`.

Se o Hugging Face estiver bloqueado (sessões em nuvem), use
`scripts/transcrever-parakeet.py`.

Para renderizar num ambiente sem o Chrome do Remotion, aponte o navegador:

```console
npx remotion render src/index.ts ReelLegendas out/reel-legendas.mp4 --browser-executable=/caminho/para/chrome
```
