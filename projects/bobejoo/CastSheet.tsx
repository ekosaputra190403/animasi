import React from "react";
import { AbsoluteFill } from "remotion";
import { Expr, Figure, FigureHead, FigureSpec, INK } from "./figure";

const FONT = "'Segoe UI', Arial, sans-serif";

const base = { headR: 70, torsoW: 118, torsoH: 245, leg: 235 };
const relaxed = { handL: [-14, 180] as [number, number], handR: [14, 180] as [number, number] };

const CAST: { label: string; x: number; row: number; s: FigureSpec }[] = [
  { label: "Pekerja kantoran", x: 200, row: 0, s: { ...base, ...relaxed, color: "#EAF0F7", accent: "#3E5C8A", hair: "pendek", outfit: "kemeja", expr: "netral" } },
  { label: "Karyawati", x: 600, row: 0, s: { ...base, torsoW: 108, torsoH: 270, leg: 205, ...relaxed, color: "#4A5D73", accent: "#F2E9DC", hair: "hijab", hairColor: "#B5716A", outfit: "blazer", expr: "senyum" } },
  { label: "Bos", x: 1000, row: 0, s: { ...base, torsoW: 164, torsoH: 255, leg: 215, handL: [-20, 170], handR: [22, 170], color: "#3A3F4B", accent: "#A23E3E", hair: "rapi", outfit: "jas", expr: "marah" } },
  { label: "Kurir", x: 1400, row: 0, s: { ...base, ...relaxed, color: "#2F7D6B", accent: "#E8B44C", hair: "topi", hairColor: "#2F7D6B", outfit: "jaket", expr: "senyum" } },
  { label: "Ibu warung", x: 200, row: 1, s: { ...base, torsoW: 138, torsoH: 280, leg: 180, ...relaxed, color: "#B86B4B", accent: "#F3E6D0", hair: "sanggul", outfit: "celemek", expr: "tawa" } },
  { label: "Bapak-bapak", x: 600, row: 1, s: { ...base, torsoW: 124, ...relaxed, color: "#7A5A3C", accent: "#D9B98A", hair: "uban", hairColor: "#C9C9CF", outfit: "batik", expr: "netral" } },
  { label: "Mahasiswa", x: 1000, row: 1, s: { ...base, headR: 68, torsoW: 104, torsoH: 235, leg: 225, ...relaxed, color: "#6B6F7A", accent: "#565A65", hair: "acak", outfit: "hoodie", expr: "pusing" } },
  { label: "Anak-anak", x: 1400, row: 1, s: { headR: 64, torsoW: 92, torsoH: 150, leg: 115, handL: [-12, 112], handR: [12, 112], color: "#E2A33B", accent: "#F4F0E6", hair: "anak", outfit: "kaus", expr: "senyum" } },
];

const FACES: { expr: Expr; label: string }[] = [
  { expr: "netral", label: "Biasa" },
  { expr: "senyum", label: "Senyum" },
  { expr: "tawa", label: "Tertawa" },
  { expr: "kaget", label: "Kaget" },
  { expr: "sedih", label: "Sedih" },
  { expr: "marah", label: "Kesal" },
  { expr: "pusing", label: "Pusing" },
];

const FLOORS = [760, 1490];

export const CastSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F4F1EA" }}>
    <svg viewBox="0 0 1600 1880" width={1600} height={1880}>
      {FLOORS.map((y) => (
        <rect key={y} x={0} y={y - 40} width={1600} height={130} fill="#E4DED1" />
      ))}
      {CAST.map((c, i) => (
        <g key={c.label}>
          <Figure s={c.s} x={c.x} y={FLOORS[c.row]} id={`torso-${i}`} />
          <text x={c.x} y={FLOORS[c.row] + 66} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={600} fill={INK}>
            {c.label}
          </text>
        </g>
      ))}
      <rect x={0} y={1590} width={1600} height={290} fill="#FFFFFF" />
      {FACES.map((f, i) => (
        <g key={f.expr}>
          <FigureHead hair="pendek" expr={f.expr} x={131 + i * 223} y={1705} r={78} />
          <text x={131 + i * 223} y={1835} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={600} fill={INK}>
            {f.label}
          </text>
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
