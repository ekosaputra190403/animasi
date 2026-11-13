import React from "react";
import { AbsoluteFill } from "remotion";
import { BOB_BLUE, Character, EJO_ORANGE, Expr, Head, INK, Who } from "./characters";

const FONT = "'Segoe UI', Arial, sans-serif";

const Tile: React.FC<{ who: Who; expr: Expr; label: string; x: number; y: number }> = ({ who, expr, label, x, y }) => (
  <g>
    <Head who={who} expr={expr} id={`hat-${who}-${expr}`} x={x} y={y} r={92} />
    <text x={x} y={y + 138} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={600} fill={INK}>
      {label}
    </text>
  </g>
);

const Name: React.FC<{ x: number; text: string; color: string; note: string }> = ({ x, text, color, note }) => (
  <g>
    <rect x={x - 110} y={1010} width={220} height={84} rx={42} fill={color} stroke={INK} strokeWidth={6} />
    <text x={x} y={1069} textAnchor="middle" fontFamily={FONT} fontSize={56} fontWeight={800} fill="#FFFFFF">
      {text}
    </text>
    <text x={x} y={1146} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={500} fill={INK}>
      {note}
    </text>
  </g>
);

export const Sheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FBF1DF" }}>
    <svg viewBox="0 0 1600 1880" width={1600} height={1880}>
      <rect x={0} y={880} width={1600} height={300} fill="#F0DDBE" />
      <path d="M 0 880 L 1600 880" stroke={INK} strokeWidth={5} opacity={0.25} />
      <Character who="bob" x={410} y={950} scale={1.22} />
      <Character who="ejo" x={1190} y={950} scale={1.22} />
      <Name x={410} text="BOB" color={BOB_BLUE} note="Spontan, gampang tergoda" />
      <Name x={1190} text="EJO" color={EJO_ORANGE} note="Tenang, mikir dulu" />

      <rect x={0} y={1180} width={1600} height={700} fill="#FFFFFF" />
      <path d="M 800 1220 L 800 1840" stroke={INK} strokeWidth={4} opacity={0.15} />
      <Tile who="bob" expr="senang" label="Senang" x={230} y={1345} />
      <Tile who="bob" expr="gaya" label="Gaya" x={590} y={1345} />
      <Tile who="bob" expr="kaget" label="Kaget" x={230} y={1670} />
      <Tile who="bob" expr="sedih" label="Sedih" x={590} y={1670} />
      <Tile who="ejo" expr="senang" label="Senang" x={1010} y={1345} />
      <Tile who="ejo" expr="mikir" label="Mikir" x={1370} y={1345} />
      <Tile who="ejo" expr="kaget" label="Kaget" x={1010} y={1670} />
      <Tile who="ejo" expr="sedih" label="Sedih" x={1370} y={1670} />
    </svg>
  </AbsoluteFill>
);
