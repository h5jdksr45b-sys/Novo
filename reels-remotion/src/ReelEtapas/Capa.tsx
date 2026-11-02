import React from "react";
import { AbsoluteFill } from "remotion";
import { CirculoVermelho, COR, Etiqueta, Fundo, Relogio, Seta } from "../Colagem/papel";
import { useAnton } from "../Colagem/movimento";

// Capa do Reel colagem etapas (1080x1920). Tudo que importa fica no recorte
// 3:4 do perfil (y de 240 a 1680) e fora dos 20% de baixo.
// Frase: O GRITO DO BORDERLINE COMEÇOU NO ATRASO DE 40 MINUTOS.
// Imagem: o relógio com +40 MIN ligado por uma seta ao círculo GRITO.

const Faixa: React.FC<{ texto: string; seed: string; cor?: string; corTexto?: string; w: number; h: number; tam: number; rot: number; y: number }> = ({
  texto,
  seed,
  cor = COR.preto,
  corTexto = COR.creme,
  w,
  h,
  tam,
  rot,
  y,
}) => (
  <div style={{ position: "absolute", left: 540, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)` }}>
    <Etiqueta w={w} h={h} seed={seed} cor={cor} corTexto={corTexto} texto={texto} tamanho={tam} fita={false} />
  </div>
);

export const CapaEtapas: React.FC = () => {
  useAnton();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <Fundo />
      <Faixa texto="O GRITO DO" seed="capa-1" w={560} h={130} tam={96} rot={-2} y={360} />
      <Faixa texto="BORDERLINE" seed="capa-2" cor={COR.vermelho} w={880} h={210} tam={178} rot={1.5} y={545} />
      <Faixa texto="COMEÇOU NO ATRASO" seed="capa-3" w={860} h={130} tam={96} rot={-1} y={725} />
      <Faixa texto="DE 40 MINUTOS" seed="capa-4" cor={COR.creme} corTexto={COR.preto} w={640} h={130} tam={96} rot={2} y={870} />

      <div style={{ position: "absolute", left: 300, top: 1210, transform: "translate(-50%, -50%) rotate(-6deg)" }}>
        <Relogio r={195} anguloHora={260} anguloMinuto={240} />
      </div>
      <div style={{ position: "absolute", left: 330, top: 1420, transform: "translate(-50%, -50%) rotate(-5deg)" }}>
        <Etiqueta w={300} h={110} seed="capa-40" cor={COR.vermelho} corTexto={COR.creme} texto="+40 MIN" tamanho={78} />
      </div>
      <div style={{ position: "absolute", left: 590, top: 1190, transform: "translate(-50%, -50%) rotate(-8deg)" }}>
        <Seta comprimento={210} haste={36} pontaLargura={100} pontaComprimento={86} seed="capa-seta" />
      </div>
      <div style={{ position: "absolute", left: 830, top: 1160, transform: "translate(-50%, -50%) rotate(3deg)" }}>
        <CirculoVermelho r={165} seed="capa-grito">
          <div style={{ position: "absolute", left: 165 - 130, top: 165 - 55, transform: "rotate(-4deg)" }}>
            <Etiqueta w={260} h={110} seed="capa-grito-et" texto="GRITO" tamanho={86} />
          </div>
        </CirculoVermelho>
      </div>
    </AbsoluteFill>
  );
};
