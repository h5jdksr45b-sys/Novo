import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { z } from "zod";
import { Abertura, Dica1, Dica2, Dica3, Fecho, Resumo } from "./cenas";
import { Cena, Papel, Sfx } from "./pecas";
import { CENAS, FALAS, tempoDaPalavra } from "./roteiro";

// Reel: três coisas pequenas que pioram a convivência com quem tem borderline.
// Público: parceiros e familiares. Função: alcance.

export const tresDicasSchema = z.object({
  // Caminho da voz dentro de public/, por exemplo voz/tres-dicas.mp3.
  // Vazio: o vídeo sai só com os efeitos.
  voz: z.string(),
});

const F = FALAS;

export const TresDicas: React.FC<z.infer<typeof tresDicasSchema>> = ({ voz }) => (
  <Papel>
    <Cena nome="Abertura" inicio={CENAS.abertura} fim={CENAS.dica1}>
      <Abertura />
    </Cena>
    <Cena nome="Dica 1" inicio={CENAS.dica1} fim={CENAS.dica2}>
      <Dica1 />
    </Cena>
    <Cena nome="Dica 2" inicio={CENAS.dica2} fim={CENAS.dica3}>
      <Dica2 />
    </Cena>
    <Cena nome="Dica 3" inicio={CENAS.dica3} fim={CENAS.fecho}>
      <Dica3 />
    </Cena>
    <Cena nome="Fecho" inicio={CENAS.fecho} fim={CENAS.resumo}>
      <Fecho />
    </Cena>
    <Cena nome="Resumo" inicio={CENAS.resumo} fim={CENAS.fim}>
      <Resumo />
    </Cena>

    {voz ? <Audio src={staticFile(voz)} /> : null}

    {/* Abertura */}
    <Sfx som="papel" em={F.gancho1.inicio - 0.1} volume={0.5} />
    <Sfx som="pop" em={F.gancho1.inicio - 0.1} />
    <Sfx som="impacto" em={F.gancho2.inicio} volume={0.8} />
    <Sfx som="pop" em={tempoDaPalavra(F.intro, 0)} volume={0.45} />
    <Sfx som="pop" em={tempoDaPalavra(F.intro, 0) + 0.16} volume={0.45} />
    <Sfx som="pop" em={tempoDaPalavra(F.intro, 0) + 0.32} volume={0.45} />

    {/* Dica 1 */}
    <Sfx som="whoosh" em={CENAS.dica1} />
    <Sfx som="clique" em={F.d1Titulo.inicio} />
    <Sfx som="papel" em={F.d1a.inicio - 0.1} volume={0.5} />
    <Sfx som="pop" em={F.d1a.inicio - 0.1} />
    <Sfx som="clique" em={F.d1c.inicio} />
    <Sfx som="risco" em={F.d1d.fim - 0.3} volume={0.5} />

    {/* Dica 2 */}
    <Sfx som="whoosh" em={CENAS.dica2} />
    <Sfx som="clique" em={F.d2Titulo.inicio} />
    <Sfx som="papel" em={F.d2a.inicio - 0.1} volume={0.5} />
    <Sfx som="pop" em={F.d2a.inicio - 0.1} />
    <Sfx som="clique" em={tempoDaPalavra(F.d2b, 0)} />
    <Sfx som="estalo" em={tempoDaPalavra(F.d2b, 1) + 0.15} volume={0.7} />
    <Sfx som="clique" em={F.d2c.inicio} />
    <Sfx som="risco" em={F.d2d.fim - 0.3} volume={0.5} />

    {/* Dica 3 */}
    <Sfx som="whoosh" em={CENAS.dica3} />
    <Sfx som="clique" em={F.d3Titulo.inicio} />
    <Sfx som="pop" em={tempoDaPalavra(F.d3a, 0) + 0.2} />
    <Sfx som="risco" em={F.d3a.fim - 0.5} volume={0.6} />
    <Sfx som="impacto" em={F.d3b.inicio} volume={0.55} />
    <Sfx som="papel" em={F.d3c.inicio - 0.1} volume={0.5} />
    <Sfx som="pop" em={F.d3c.inicio - 0.1} />

    {/* Fecho e resumo */}
    <Sfx som="whoosh" em={CENAS.fecho} />
    <Sfx som="pop" em={F.fecho1.inicio - 0.1} />
    <Sfx som="clique" em={F.fecho2.inicio} />
    <Sfx som="whoosh" em={CENAS.resumo} />
    <Sfx som="pop" em={CENAS.resumo + 0.25} volume={0.5} />
    <Sfx som="pop" em={CENAS.resumo + 0.43} volume={0.5} />
    <Sfx som="pop" em={CENAS.resumo + 0.61} volume={0.5} />
    <Sfx som="papel" em={F.cta.inicio - 0.1} volume={0.5} />
    <Sfx som="ding" em={F.cta.fim + 0.1} volume={0.5} />
  </Papel>
);
