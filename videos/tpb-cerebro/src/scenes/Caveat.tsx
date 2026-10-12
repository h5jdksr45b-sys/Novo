import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT } from '../theme';
import { KineticTitle, Tag, useIn } from '../ui';

const IconPerson = () => (
  <svg width={64} height={64} viewBox="0 0 64 64">
    <circle cx={32} cy={20} r={10} fill="none" stroke={C.ink} strokeWidth={4} />
    <path d="M 14 54 C 16 38 48 38 50 54" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
    <path d="M 8 8 L 56 56" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
const IconArrow = () => (
  <svg width={64} height={64} viewBox="0 0 64 64">
    <path d="M 10 32 L 50 32 M 38 20 L 50 32 L 38 44" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 8 8 L 56 56" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
const IconLoop = () => (
  <svg width={64} height={64} viewBox="0 0 64 64">
    <path d="M 50 26 A 19 19 0 1 0 51 38" fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
    <path d="M 52 12 L 51 27 L 37 25" fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Row: React.FC<{ icon: React.ReactNode; title: string; sub: string; delay: number }> = ({ icon, title, sub, delay }) => {
  const s = useIn(delay);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 34, opacity: s, transform: `translateX(${(1 - s) * 260}px)`, fontFamily: FONT }}>
      <div style={{ width: 120, height: 120, borderRadius: 30, background: C.bg2, border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 44, fontWeight: 700, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 30, color: C.muted, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

export const Caveat: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, padding: '170px 90px 0' }}>
    <Tag>Como ler esses achados</Tag>
    <div style={{ height: 22 }} />
    <KineticTitle text="Médias de grupo" size={112} color={C.gold} delay={4} />
    <div style={{ height: 160 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 70 }}>
      <Row icon={<IconPerson />} title="Não diagnosticam uma pessoa" sub="nenhum exame de imagem faz o diagnóstico" delay={14} />
      <Row icon={<IconArrow />} title="Não provam causa" sub="TEPT, depressão e medicação confundem" delay={22} />
      <Row icon={<IconLoop />} title="Podem mudar com tratamento" sub="amígdala menos reativa após DBT" delay={30} />
    </div>
    <div style={{ fontFamily: FONT, fontSize: 22, color: C.muted, marginTop: 70 }}>Goodman e col., 2014</div>
  </AbsoluteFill>
);
