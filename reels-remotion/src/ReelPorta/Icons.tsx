import React from "react";

// Ícones de linha, desenhados numa caixa de 64 x 64.
type IconProps = { readonly size: number; readonly color: string };

const Frame: React.FC<IconProps & { readonly children: React.ReactNode }> = ({
  size,
  color,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke={color}
    strokeWidth={3.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const BookIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <path d="M32 16 C 24 11 14 11 8 14 V 50 C 14 47 24 47 32 52 C 40 47 50 47 56 50 V 14 C 50 11 40 11 32 16 Z" />
    <path d="M32 16 V 52" />
  </Frame>
);

export const ArticleIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <path d="M16 8 H 40 L 50 18 V 56 H 16 Z" />
    <path d="M40 8 V 18 H 50" />
    <path d="M23 30 H 43 M23 38 H 43 M23 46 H 35" />
  </Frame>
);

export const VideoIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <rect x={8} y={14} width={48} height={36} rx={6} />
    <path d="M27 24 L 40 32 L 27 40 Z" />
  </Frame>
);

export const ForumIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <path d="M8 12 H 38 V 32 H 20 L 12 39 V 32 H 8 Z" />
    <path d="M44 22 H 56 V 42 H 52 V 49 L 44 42 H 26 V 38" />
  </Frame>
);

export const ClipboardCheckIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <rect x={14} y={12} width={36} height={46} rx={4} />
    <rect x={24} y={7} width={16} height={10} rx={2} />
    <path d="M23 37 L 30 44 L 42 30" />
  </Frame>
);

export const WaveIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <path d="M6 34 C 12 14 18 14 22 32 S 32 52 38 30 S 48 12 58 32" />
  </Frame>
);

export const HeartBubbleIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <path d="M8 10 H 56 V 44 H 26 L 14 54 V 44 H 8 Z" />
    <path d="M32 37 C 22 30 20 25 23 21 C 26 18 30 19 32 22 C 34 19 38 18 41 21 C 44 25 42 30 32 37 Z" />
  </Frame>
);

export const SearchIcon: React.FC<IconProps> = (p) => (
  <Frame {...p}>
    <circle cx={27} cy={27} r={15} />
    <path d="M38 38 L 54 54" />
  </Frame>
);
