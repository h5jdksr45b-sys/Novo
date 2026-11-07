import React from "react";
import { C, TYPE_FONT } from "../lib/theme";

/** Texto de apoio em fonte de maquina de escrever. */
export const Typed: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 40,
  color = C.ink,
  style,
  children,
}) => (
  <div style={{ fontFamily: TYPE_FONT, fontSize: size, color, lineHeight: 1.2, whiteSpace: "nowrap", ...style }}>{children}</div>
);
