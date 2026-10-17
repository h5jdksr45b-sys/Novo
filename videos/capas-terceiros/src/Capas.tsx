import '@fontsource/anton/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/800.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const ANTON = 'Anton, sans-serif';
const INTER = 'Inter, sans-serif';
const SERIF = '"Playfair Display", serif';
const VERMELHO = '#D23A2C';

const Assinatura: React.FC<{cor: string; style?: React.CSSProperties}> = ({cor, style}) => (
  <div style={{position: 'absolute', left: 80, bottom: 60, fontFamily: INTER, fontWeight: 500, fontSize: 26, color: cor, letterSpacing: 1, ...style}}>@drfabioschmidt</div>
);

const Sticker: React.FC<{nome: string; style: React.CSSProperties}> = ({nome, style}) => (
  <Img src={staticFile(`stickers/${nome}.png`)} style={{position: 'absolute', filter: 'drop-shadow(6px 10px 0 rgba(0,0,0,0.35))', ...style}} />
);

// 1. Fundo amarelo, tipografia pesada, alvo desenhado
export const Capa1 = () => (
  <AbsoluteFill style={{background: '#E3E07A'}}>
    <svg width="420" height="420" style={{position: 'absolute', right: -70, bottom: -40}} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke="#111" strokeWidth="5" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#111" strokeWidth="5" />
      <circle cx="50" cy="50" r="12" fill={VERMELHO} />
    </svg>
    <div style={{position: 'absolute', left: 80, right: 80, top: 330, fontFamily: ANTON, fontSize: 168, lineHeight: 0.98, color: '#111'}}>
      SUA MENTE<br />PREFERE<br /><span style={{color: VERMELHO}}>O PIOR</span><br />A NÃO SABER.
    </div>
    <Assinatura cor="#111" />
  </AbsoluteFill>
);

// 2. Editorial escuro, serifa, a pausa como espaço vazio
export const Capa2 = () => (
  <AbsoluteFill style={{background: '#0F0E0D'}}>
    <div style={{position: 'absolute', left: 90, right: 90, top: 250, fontFamily: INTER, fontWeight: 500, fontSize: 54, color: '#CFC7BA'}}>
      Ele disse que me amava.
    </div>
    <div style={{position: 'absolute', left: 90, top: 470, display: 'flex', gap: 34}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 34, height: 34, borderRadius: 17, background: i === 2 ? VERMELHO : '#4a4540'}} />
      ))}
    </div>
    <div style={{position: 'absolute', left: 90, right: 70, top: 600, fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, lineHeight: 1.0, color: '#F2ECE1'}}>
      Eu só ouvi<br /><span style={{color: VERMELHO}}>a pausa.</span>
    </div>
    <Assinatura cor="#8b847a" />
  </AbsoluteFill>
);

// 3. Colagem em papel kraft
export const Capa3 = () => (
  <AbsoluteFill style={{background: '#D9C7A6'}}>
    <AbsoluteFill style={{opacity: 0.18, backgroundImage: 'radial-gradient(#5a4630 1px, transparent 1.2px)', backgroundSize: '6px 6px'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 120, fontFamily: ANTON, fontSize: 112, lineHeight: 1.12, color: '#1b1612'}}>
      E SE O QUE VOCÊ CHAMA DE <span style={{background: '#1b1612', color: '#D9C7A6', padding: '0 14px', lineHeight: 1, display: 'inline-block'}}>AMOR</span> FOR MEDO DE <span style={{color: VERMELHO}}>FICAR SÓ?</span>
    </div>
    <Sticker nome="coracao" style={{left: 110, top: 840, width: 300, transform: 'rotate(-10deg)'}} />
    <Sticker nome="mulher_cabeca" style={{right: 70, top: 790, width: 470, transform: 'rotate(3deg)'}} />
    <Assinatura cor="#1b1612" style={{left: 'auto', right: 80}} />
  </AbsoluteFill>
);

// 4. Tela de conversa
export const Capa4 = () => (
  <AbsoluteFill style={{background: '#EDEBE6'}}>
    <div style={{position: 'absolute', left: 80, top: 120, fontFamily: INTER, fontWeight: 800, fontSize: 30, color: '#8a8780', letterSpacing: 3}}>HOJE 22:47</div>
    <div style={{position: 'absolute', left: 80, top: 190, background: '#FFFFFF', borderRadius: 44, padding: '26px 54px', fontFamily: INTER, fontWeight: 500, fontSize: 64, color: '#111', boxShadow: '0 6px 0 rgba(0,0,0,0.08)'}}>ok</div>
    <div style={{position: 'absolute', left: 80, top: 330, fontFamily: INTER, fontWeight: 500, fontSize: 28, color: '#8a8780'}}>Visto às 22:47</div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 520, fontFamily: INTER, fontWeight: 800, fontSize: 62, color: '#111', lineHeight: 1.1}}>
      Ele respondeu ok.<br />Você leu:
    </div>
    <div style={{position: 'absolute', left: 70, top: 700, fontFamily: ANTON, fontSize: 300, lineHeight: 1, color: VERMELHO}}>ACABOU.</div>
    <Assinatura cor="#8a8780" />
  </AbsoluteFill>
);

// 5. Vermelho com faixa preta e crença riscada
export const Capa5 = () => (
  <AbsoluteFill style={{background: VERMELHO}}>
    <div style={{position: 'absolute', left: 80, right: 80, top: 190, fontFamily: INTER, fontWeight: 800, fontSize: 112, lineHeight: 1.04, color: '#111', letterSpacing: -2}}>
      Se eu sinto,<br /><span style={{textDecoration: 'line-through', textDecorationThickness: 16, textDecorationColor: '#111'}}>é verdade.</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 640, height: 400, background: '#111', transform: 'rotate(-2deg)'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 700, fontFamily: INTER, fontWeight: 500, fontSize: 70, lineHeight: 1.15, color: '#F2ECE1', transform: 'rotate(-2deg)'}}>
      O sentimento é real.<br /><span style={{fontWeight: 800, color: VERMELHO}}>A leitura pode falhar.</span>
    </div>
    <Assinatura cor="#111" />
  </AbsoluteFill>
);

// 6. Notificação de celular sobre fundo claro
export const Capa6 = () => (
  <AbsoluteFill style={{background: '#F3D9D3'}}>
    <div style={{position: 'absolute', left: 70, right: 70, top: 130, background: 'rgba(255,255,255,0.92)', borderRadius: 40, padding: '34px 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: INTER, fontWeight: 800, fontSize: 30, color: '#6d6461'}}>
        <div style={{width: 46, height: 46, borderRadius: 12, background: '#3DBB5C'}} />MENSAGENS<span style={{marginLeft: 'auto', fontWeight: 500}}>agora</span>
      </div>
      <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 40, color: '#1b1716', marginTop: 18, lineHeight: 1.25}}>
        Reservei uma mesa pra hoje à noite. Não vejo a hora de te ver.
      </div>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 610, fontFamily: ANTON, fontSize: 140, lineHeight: 1.0, color: '#1b1716'}}>
      FALTOU O EMOJI E VOCÊ JÁ ESPERA <span style={{color: VERMELHO}}>O TÉRMINO.</span>
    </div>
    <Assinatura cor="#6d6461" />
  </AbsoluteFill>
);

// Rodada 2

// 1B. Preto com interrogação gigante
export const Capa7 = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <div style={{position: 'absolute', right: -40, top: -120, fontFamily: SERIF, fontWeight: 700, fontSize: 1100, lineHeight: 1, color: '#1f1f1f'}}>?</div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 520, fontFamily: INTER, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: '#F2ECE1', letterSpacing: -2}}>
      Não saber dói tanto que <span style={{color: VERMELHO}}>o pior vira certeza.</span>
    </div>
    <Assinatura cor="#77706a" />
  </AbsoluteFill>
);

// 2B. Tela dividida na diagonal
export const Capa8 = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <div style={{position: 'absolute', inset: 0, background: '#F3E9DC', clipPath: 'polygon(0 0, 100% 0, 100% 38%, 0 62%)'}} />
    <div style={{position: 'absolute', left: 80, top: 150, fontFamily: ANTON, fontSize: 190, lineHeight: 1, color: '#111'}}>DO AMOR</div>
    <div style={{position: 'absolute', right: 80, top: 880, fontFamily: ANTON, fontSize: 190, lineHeight: 1, color: VERMELHO, textAlign: 'right'}}>AO TÉRMINO</div>
    <div style={{position: 'absolute', left: 80, top: 1090, fontFamily: INTER, fontWeight: 800, fontSize: 48, color: '#F3E9DC'}}>em 3 segundos. Na minha cabeça.</div>
    <Assinatura cor="#77706a" style={{left: 'auto', right: 80}} />
  </AbsoluteFill>
);

// 3B. Papel quadriculado com sticker
export const Capa9 = () => (
  <AbsoluteFill style={{background: '#F4F1EA'}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(#d9d3c7 2px, transparent 2px), linear-gradient(90deg, #d9d3c7 2px, transparent 2px)', backgroundSize: '54px 54px', opacity: 0.8}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 130, fontFamily: ANTON, fontSize: 150, lineHeight: 1.0, color: '#111'}}>
      NÃO É SAUDADE DA PESSOA.
    </div>
    <div style={{position: 'absolute', left: 60, top: 470, width: 980}}>
      <Sticker nome="fita_vermelha" style={{left: -20, top: 0, width: 990, height: 300, transform: 'rotate(-2deg)'}} />
      <div style={{position: 'relative', left: 40, top: 78, fontFamily: ANTON, fontSize: 92, lineHeight: 1.2, color: '#F4F1EA', transform: 'rotate(-2deg)'}}>É PÂNICO SEM ELA.</div>
    </div>
    <Sticker nome="silencio" style={{right: 90, bottom: 60, width: 400, transform: 'rotate(4deg)'}} />
    <Assinatura cor="#555" />
  </AbsoluteFill>
);

// 4B. Ditado reescrito, tipografia de livro em papel kraft
export const Capa10 = () => (
  <AbsoluteFill style={{background: '#CBB48E'}}>
    <AbsoluteFill style={{opacity: 0.2, backgroundImage: 'radial-gradient(#4a3a26 1px, transparent 1.2px)', backgroundSize: '5px 5px'}} />
    <div style={{position: 'absolute', left: 90, right: 90, top: 300, fontFamily: SERIF, fontWeight: 700, fontSize: 112, lineHeight: 1.08, color: '#1d1610'}}>
      Longe dos olhos,
    </div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 470, fontFamily: SERIF, fontStyle: 'italic', fontSize: 104, lineHeight: 1.08, color: '#1d1610'}}>
      longe da <span style={{color: '#A3281E'}}>certeza de ser amado.</span>
    </div>
    <Assinatura cor="#1d1610" />
  </AbsoluteFill>
);

// 5B. Branco, brutal, sublinhado vermelho
export const Capa11 = () => (
  <AbsoluteFill style={{background: '#FAFAF7'}}>
    <div style={{position: 'absolute', left: 80, right: 80, top: 180, fontFamily: ANTON, fontSize: 228, lineHeight: 1.1, color: '#111'}}>
      SENTIR NÃO É <span style={{textDecoration: 'underline', textDecorationColor: VERMELHO, textDecorationThickness: 20, textUnderlineOffset: 18}}>PROVAR.</span>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1110, fontFamily: INTER, fontWeight: 500, fontSize: 46, lineHeight: 1.25, color: '#333'}}>
      O que você sente é válido. A conclusão pode não ser.
    </div>
    <Assinatura cor="#777" />
  </AbsoluteFill>
);

// 6B. Lilás, dois estados lado a lado
export const Capa12 = () => (
  <AbsoluteFill style={{background: '#D9D2F0'}}>
    <div style={{position: 'absolute', left: 80, right: 80, top: 180, fontFamily: INTER, fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: '#1b1730', letterSpacing: -2}}>
      Tudo bem na relação.
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 440, fontFamily: INTER, fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: VERMELHO, letterSpacing: -2}}>
      Menos na sua cabeça.
    </div>
    <Sticker nome="coracao" style={{left: 380, top: 760, width: 340, transform: 'rotate(-6deg)'}} />
    <Sticker nome="rabisco" style={{left: 400, top: 800, width: 320, transform: 'rotate(10deg)'}} />
    <Assinatura cor="#1b1730" />
  </AbsoluteFill>
);
