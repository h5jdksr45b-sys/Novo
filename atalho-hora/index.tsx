import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atalho Hora | Quanto seu plantão paga de verdade" },
      {
        name: "description",
        content:
          "Calculadora gratuita: some deslocamento, espera, imposto e atraso e veja quanto vale de verdade a sua hora no plantão.",
      },
      { name: "theme-color", content: "#1E7A55" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@500;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap",
      },
    ],
  }),
  component: Index,
});

type Dados = {
  valor: number;
  horas: number;
  deslocMin: number;
  deslocCusto: number;
  extraMin: number;
  imposto: number;
  dias: number;
  juros: number;
};

// Valores de exemplo, para a primeira conta não aparecer vazia. Tudo é editável.
const EXEMPLO: Dados = { valor: 1500, horas: 12, deslocMin: 80, deslocCusto: 60, extraMin: 40, imposto: 15, dias: 60, juros: 1 };
const EXEMPLO_B: Dados = { ...EXEMPLO, valor: 1800, deslocMin: 180, deslocCusto: 150, extraMin: 60, dias: 120 };
// Link da lista de espera dos outros apps. Vazio = botão escondido.
const LISTA_URL = "";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function conta(d: Dados) {
  const anunciada = d.horas > 0 ? d.valor / d.horas : 0;
  const imposto = (d.valor * Math.min(d.imposto, 100)) / 100;
  const liquido = d.valor - imposto;
  const atraso = liquido * (d.juros / 100) * (d.dias / 30);
  const sobra = liquido - d.deslocCusto - atraso;
  const horasReais = d.horas + (d.deslocMin + d.extraMin) / 60;
  const real = horasReais > 0 ? sobra / horasReais : 0;
  return { anunciada, real, imposto, atraso, sobra, horasReais, desloc: d.deslocCusto, horas: d.horas, bruto: d.valor };
}
type Conta = ReturnType<typeof conta>;

function Campo(props: { rotulo?: string; dica?: string; antes?: string; depois?: string; valor: number; onChange: (v: number) => void; passo?: number }) {
  return (
    <div className="grupo">
      {props.rotulo && <label>{props.rotulo}</label>}
      {props.dica && <p className="dica">{props.dica}</p>}
      <div className="campo">
        {props.antes && <span>{props.antes}</span>}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={props.passo ?? 1}
          value={Number.isFinite(props.valor) ? props.valor : ""}
          onChange={(e) => props.onChange(Math.max(0, parseFloat(e.target.value.replace(",", ".")) || 0))}
        />
        {props.depois && <span className="fim">{props.depois}</span>}
      </div>
    </div>
  );
}

function Plantao(props: { nome: string; d: Dados; set: (d: Dados) => void; remover?: () => void }) {
  const { d, set } = props;
  const up = (k: keyof Dados) => (v: number) => set({ ...d, [k]: v });
  return (
    <section className="card plantao">
      <h2>
        <span>{props.nome}</span>
        {props.remover && (
          <button className="remover" type="button" onClick={props.remover}>
            remover
          </button>
        )}
      </h2>
      <Campo rotulo="Valor combinado" antes="R$" valor={d.valor} onChange={up("valor")} passo={10} />
      <Campo rotulo="Duração do plantão" depois="horas" valor={d.horas} onChange={up("horas")} />
      <div className="titulo-grupo">O que fica de fora da conta</div>
      <div className="duas">
        <Campo rotulo="Ida e volta" depois="min" valor={d.deslocMin} onChange={up("deslocMin")} passo={5} />
        <Campo rotulo="Custo" antes="R$" valor={d.deslocCusto} onChange={up("deslocCusto")} passo={5} />
      </div>
      <p className="dica">Combustível, estacionamento, aplicativo, pedágio.</p>
      <Campo
        rotulo="Tempo extra sem pagamento"
        dica="Chegar antes, passagem de plantão, esperar a troca."
        depois="min"
        valor={d.extraMin}
        onChange={up("extraMin")}
        passo={5}
      />
      <Campo
        rotulo="Imposto e taxas sobre o valor"
        dica="Use o percentual que você paga de fato, ou pergunte ao seu contador."
        depois="%"
        valor={d.imposto}
        onChange={up("imposto")}
        passo={0.5}
      />
      <div className="duas">
        <Campo rotulo="Dias até receber" depois="dias" valor={d.dias} onChange={up("dias")} passo={5} />
        <Campo rotulo="Rende no mês" depois="%" valor={d.juros} onChange={up("juros")} passo={0.1} />
      </div>
      <p className="dica">Quanto o dinheiro renderia por mês se já estivesse com você.</p>
    </section>
  );
}

function Bloco(props: { r: Conta; nome?: string }) {
  const { r } = props;
  const perdaPct = r.anunciada > 0 ? Math.round((1 - r.real / r.anunciada) * 100) : 0;
  const total = Math.max(1, r.imposto + r.desloc + r.atraso);
  const minExtra = Math.round((r.horasReais - r.horas) * 60);
  const barra = (rot: string, v: number, coral?: boolean) => (
    <>
      <div className="barra-rot">
        <span>{rot}</span>
        <span>{brl(v)}</span>
      </div>
      <div className="barra">
        <i className={coral ? "c" : ""} style={{ width: `${Math.min(100, (v / total) * 100)}%` }} />
      </div>
    </>
  );
  return (
    <div>
      {props.nome && <p className="titulo-grupo claro">{props.nome}</p>}
      <div className="linha-res">
        <span className="rot">Hora que parece</span>
        <span className="valor-anunciado">{brl(r.anunciada)}</span>
      </div>
      <div className="linha-res">
        <span className="rot">Hora real</span>
        <span className="valor-real">{brl(r.real)}</span>
      </div>
      <p className="perda">
        Sua hora vale <strong>{perdaPct > 0 ? `${perdaPct}% a menos` : "o que parece"}</strong>. Você trabalha{" "}
        <strong>{minExtra} min</strong> a mais do que o plantão paga e fica com <strong>{brl(Math.max(0, r.sobra))}</strong> dos{" "}
        {brl(r.bruto)} combinados.
      </p>
      <div className="barras">
        {barra("Imposto e taxas", r.imposto, true)}
        {barra("Deslocamento", r.desloc)}
        {barra("Esperar para receber", r.atraso)}
      </div>
    </div>
  );
}

function Index() {
  const [a, setA] = useState<Dados>(EXEMPLO);
  const [b, setB] = useState<Dados | null>(null);
  const ra = useMemo(() => conta(a), [a]);
  const rb = useMemo(() => (b ? conta(b) : null), [b]);

  async function compartilhar() {
    const texto = "Fiz a conta da hora real do meu plantão no Atalho Hora. Faz a sua:";
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: "Atalho Hora", text: texto, url });
      } catch {
        /* a pessoa fechou a janela de compartilhar */
      }
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(`${texto} ${url}`), "_blank");
    }
  }

  let comparacao: string | null = null;
  if (rb) {
    const melhor = ra.real >= rb.real ? "A" : "B";
    const pagaMais = ra.bruto >= rb.bruto ? "A" : "B";
    comparacao = `${brl(Math.abs(ra.real - rb.real))} a mais.${pagaMais !== melhor ? " Mesmo com o valor combinado menor." : ""}`;
    comparacao = `Por hora real, o Plantão ${melhor} paga ${comparacao}`;
  }

  return (
    <div className="atalho">
      <style>{CSS}</style>
      <div className="wrap">
        <header>
          <div className="marca">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect x="4" y="4" width="56" height="56" rx="14" fill="#F2EADB" />
              <path d="M32 13 L49 51 H41 L37.5 43 H26.5 L23 51 H15 Z M29 36 H35 L32 28.5 Z" fill="#1E7A55" />
              <path d="M24 36 H40 V32 L47 38 L40 44 V40 H24 Z" fill="#F4C542" />
            </svg>
            Atalho Hora
          </div>
          <h1>
            Quanto seu plantão paga <em>por hora de verdade?</em>
          </h1>
          <p className="sub">Some o deslocamento, a espera, o imposto e o atraso no pagamento. A conta leva 1&nbsp;minuto.</p>
        </header>

        <main>
          <Plantao nome="Plantão A" d={a} set={setA} />
          {b ? (
            <Plantao nome="Plantão B" d={b} set={setB} remover={() => setB(null)} />
          ) : (
            <button className="botao-sec" type="button" onClick={() => setB(EXEMPLO_B)}>
              + Comparar com outro plantão
            </button>
          )}

          <section className="card resultado" aria-live="polite">
            <h2>Resultado</h2>
            <Bloco r={ra} nome={rb ? "Plantão A" : undefined} />
            {rb && (
              <>
                <div style={{ height: 18 }} />
                <Bloco r={rb} nome="Plantão B" />
                <div className="comparacao">{comparacao}</div>
              </>
            )}
          </section>

          <div className="acoes">
            <button className="botao" type="button" onClick={compartilhar}>
              Mandar para um colega de plantão
            </button>
            {LISTA_URL && (
              <a className="botao claro" href={LISTA_URL}>
                Quero os outros apps do Atalho primeiro
              </a>
            )}
          </div>

          <p className="aviso">
            Simulação feita com os números que você informou. Não substitui a orientação do seu contador. Nada do que você digita sai
            do seu celular.
          </p>
        </main>
      </div>
    </div>
  );
}

const CSS = `
  .atalho { --verde:#1E7A55; --verde-escuro:#155a3f; --creme:#F2EADB; --papel:#FAF6EE; --amarelo:#F4C542; --tinta:#1C1816; --cinza:#6f675f; --linha:#e2d9c8; --coral:#E26050; --raio:18px;
    font-family:'Montserrat',system-ui,sans-serif; color:var(--tinta); background:var(--verde);
    background-image:radial-gradient(rgba(255,255,255,.035) 1px,transparent 1px); background-size:4px 4px; min-height:100vh; }
  html, body { background:#1E7A55; margin:0; }
  .atalho *, .atalho *::before, .atalho *::after { box-sizing:border-box; }
  .atalho .wrap { max-width:560px; margin:0 auto; padding:28px 16px 64px; }
  .atalho header { color:var(--creme); margin-bottom:22px; }
  .atalho .marca { display:flex; align-items:center; gap:10px; font-weight:700; font-size:14px; letter-spacing:.02em; opacity:.9; }
  .atalho .marca svg { width:28px; height:28px; }
  .atalho h1 { font-family:'Anton',sans-serif; font-weight:400; text-transform:uppercase; font-size:clamp(40px,11vw,58px); line-height:1.02; margin:18px 0 10px; }
  .atalho h1 em { font-family:'Playfair Display',serif; font-style:italic; font-weight:700; text-transform:none; color:var(--amarelo); }
  .atalho .sub { font-size:16px; line-height:1.45; margin:0; max-width:34ch; opacity:.95; }
  .atalho .card { background:var(--papel); border-radius:var(--raio); box-shadow:0 0 0 6px var(--creme),0 18px 40px rgba(0,0,0,.22); padding:22px 18px; margin:26px 6px 0; }
  .atalho .card h2 { font-size:15px; text-transform:uppercase; letter-spacing:.06em; margin:0 0 14px; color:var(--verde-escuro); display:flex; justify-content:space-between; align-items:center; }
  .atalho .remover { font:600 13px 'Montserrat',sans-serif; color:var(--cinza); background:none; border:0; text-decoration:underline; cursor:pointer; padding:6px; }
  .atalho .grupo { margin:0 0 16px; }
  .atalho .titulo-grupo { font-size:12px; font-weight:700; color:var(--cinza); text-transform:uppercase; letter-spacing:.07em; margin:18px 0 10px; }
  .atalho .titulo-grupo.claro { color:var(--creme); opacity:.7; margin-top:6px; }
  .atalho label { display:block; font-weight:700; font-size:15px; margin-bottom:6px; }
  .atalho .dica { font-weight:500; font-size:13px; color:var(--cinza); margin:-2px 0 8px; line-height:1.35; }
  .atalho .campo { display:flex; align-items:center; background:#fff; border:2px solid var(--linha); border-radius:12px; transition:border-color .15s; }
  .atalho .campo:focus-within { border-color:var(--verde); }
  .atalho .campo span { padding:0 0 0 14px; font-weight:700; color:var(--cinza); font-size:16px; white-space:nowrap; }
  .atalho .campo span.fim { padding:0 14px 0 0; }
  .atalho input { flex:1; min-width:0; width:100%; border:0; outline:0; background:transparent; font:700 20px 'Montserrat',sans-serif; color:var(--tinta); padding:13px 14px; -moz-appearance:textfield; }
  .atalho input::-webkit-outer-spin-button, .atalho input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
  .atalho .duas { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:12px; }
  .atalho .duas > div { min-width:0; }
  .atalho .duas .grupo { margin-bottom:8px; }
  .atalho .botao-sec { display:block; width:calc(100% - 12px); margin:18px 6px 0; padding:15px; border-radius:14px; border:2px dashed rgba(242,234,219,.7); background:transparent; color:var(--creme); font:700 15px 'Montserrat',sans-serif; cursor:pointer; }
  .atalho .resultado { background:var(--tinta); color:var(--creme); }
  .atalho .resultado h2 { color:var(--amarelo); }
  .atalho .linha-res { display:grid; grid-template-columns:1fr auto; align-items:baseline; gap:10px; padding:10px 0; border-bottom:1px solid rgba(242,234,219,.14); }
  .atalho .linha-res .rot { font-size:14px; opacity:.85; }
  .atalho .valor-anunciado { font:700 22px 'Montserrat',sans-serif; text-decoration:line-through; text-decoration-color:var(--coral); text-decoration-thickness:3px; opacity:.8; }
  .atalho .valor-real { font-family:'Anton',sans-serif; font-size:clamp(54px,16vw,76px); line-height:1; color:var(--amarelo); }
  .atalho .perda { margin:12px 0 4px; font-size:16px; line-height:1.45; }
  .atalho .perda strong { color:var(--amarelo); }
  .atalho .barras { margin-top:18px; }
  .atalho .barra-rot { display:flex; justify-content:space-between; font-size:13px; margin:10px 0 5px; opacity:.9; }
  .atalho .barra { height:12px; border-radius:6px; background:rgba(242,234,219,.14); overflow:hidden; }
  .atalho .barra i { display:block; height:100%; background:var(--amarelo); border-radius:6px; transition:width .35s ease; }
  .atalho .barra i.c { background:var(--coral); }
  .atalho .comparacao { margin-top:14px; padding:14px; border-radius:12px; background:rgba(244,197,66,.12); font-size:15px; line-height:1.45; color:var(--amarelo); font-weight:700; }
  .atalho .acoes { margin:26px 6px 0; display:grid; gap:12px; }
  .atalho .botao { display:flex; justify-content:center; align-items:center; text-decoration:none; padding:17px; border-radius:14px; border:0; cursor:pointer; font:800 16px 'Montserrat',sans-serif; background:var(--amarelo); color:var(--tinta); box-shadow:0 0 0 4px var(--creme); }
  .atalho .botao.claro { background:var(--creme); box-shadow:none; }
  .atalho .aviso { color:var(--creme); opacity:.8; font-size:13px; line-height:1.5; margin:28px 8px 0; }
  @media (prefers-reduced-motion: reduce) { .atalho * { transition:none !important; } }
`;
