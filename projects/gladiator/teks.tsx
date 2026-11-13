import React from "react";

// Tulisan & papan di layar (v2, 2026-11-10): pemilik minta tulisan tidak terlihat seperti "AI slop".
// Aturan: tanpa emoji; ikon digambar dengan garis hitam tebal seperti karakter; huruf gaya komik timbul
// (isian gradasi + garis tepi tebal + bayangan 3D bertumpuk + kilau tipis); bentuk papan mengikuti dunia cerita
// (papan kayu, perisai, label perunggu) — bukan kotak polos.
// Semua komponen menggambar di dalam <svg> 1080x1920 yang disediakan pemanggil.

let _id = 0;
const uid = (p: string) => `${p}${++_id}`;

// Huruf komik timbul.
export const TeksKomik: React.FC<{
  x: number; y: number; teks: string; ukuran: number;
  atas?: string; bawah?: string; sisi?: string; tepi?: string; rot?: number; jarak?: number; font?: string;
}> = ({ x, y, teks, ukuran, atas = "#FFF3A6", bawah = "#F5B800", sisi = "#8A5A00", tepi = "#141414", rot = 0, jarak = 1, font = "'Segoe UI Black', 'Arial Black', 'Segoe UI', sans-serif" }) => {
  const g = React.useMemo(() => uid("gr"), []);
  const tebal = Math.max(3, ukuran * 0.07);
  const dalam = Math.max(4, ukuran * 0.07); // tebal bayangan 3D
  const gaya = { fontFamily: font, fontWeight: 900, fontSize: ukuran, letterSpacing: ukuran * 0.02 * jarak } as const;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <linearGradient id={g} x1="0" y1="-0.8" x2="0" y2="0.2" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor={atas} />
          <stop offset="1" stopColor={bawah} />
        </linearGradient>
      </defs>
      {/* bayangan jatuh lembut */}
      <text x={dalam * 1.6} y={dalam * 2.2} textAnchor="middle" {...gaya} fill="rgba(0,0,0,0.35)" stroke="rgba(0,0,0,0.35)" strokeWidth={tebal * 2.2} strokeLinejoin="round">{teks}</text>
      {/* badan 3D: lapisan bertumpuk ke bawah-kanan */}
      {Array.from({ length: 5 }, (_, i) => {
        const d = (dalam * (5 - i)) / 5;
        return <text key={i} x={d * 0.6} y={d} textAnchor="middle" {...gaya} fill={sisi} stroke={tepi} strokeWidth={tebal * 2} strokeLinejoin="round" paintOrder="stroke">{teks}</text>;
      })}
      {/* muka depan */}
      <text x={0} y={0} textAnchor="middle" {...gaya} fill={`url(#${g})`} stroke={tepi} strokeWidth={tebal * 2} strokeLinejoin="round" paintOrder="stroke">{teks}</text>
      {/* kilau tipis di bagian atas huruf */}
      <text x={-ukuran * 0.02} y={-ukuran * 0.03} textAnchor="middle" {...gaya} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={Math.max(1.5, ukuran * 0.018)} strokeDasharray={`${ukuran * 0.25} ${ukuran * 0.6}`}>{teks}</text>
    </g>
  );
};

// Ikon vila Romawi kecil + pohon zaitun (garis hitam tebal).
const IkonVila: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} strokeLinejoin="round">
    <ellipse cx={0} cy={44} rx={92} ry={10} fill="rgba(0,0,0,0.18)" />
    {/* pohon zaitun */}
    <path d="M 62 44 Q 60 10 66 -4" stroke="#5D3A1F" strokeWidth={8} fill="none" strokeLinecap="round" />
    <circle cx={66} cy={-16} r={22} fill="#7FA34A" stroke="#141414" strokeWidth={5} />
    <circle cx={50} cy={-4} r={14} fill="#6E9440" stroke="#141414" strokeWidth={5} />
    <circle cx={60} cy={-20} r={4} fill="#3E2A4A" /><circle cx={74} cy={-10} r={4} fill="#3E2A4A" />
    {/* bangunan */}
    <rect x={-70} y={-6} width={110} height={50} rx={4} fill="#F4ECDC" stroke="#141414" strokeWidth={5} />
    <path d="M -80 -4 L -15 -42 L 50 -4 Z" fill="#C0472E" stroke="#141414" strokeWidth={5} />
    <path d="M -64 -10 L -15 -36 L 34 -10" stroke="#E07A5F" strokeWidth={3} fill="none" />
    {[-56, -36].map((x) => <rect key={x} x={x} y={0} width={8} height={44} fill="#E8DCC4" stroke="#141414" strokeWidth={3} />)}
    <path d="M -20 44 L -20 14 Q -10 4 0 14 L 0 44 Z" fill="#7A4E2D" stroke="#141414" strokeWidth={4} />
    <rect x={10} y={8} width={20} height={16} rx={2} fill="#9FD3F0" stroke="#141414" strokeWidth={4} />
  </g>
);

// Ikon dua pedang bersilang (gladius).
const PedangSilang: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const pedang = (rot: number) => (
    <g transform={`rotate(${rot})`}>
      <path d="M -7 -10 L -7 -118 L 0 -134 L 7 -118 L 7 -10 Z" fill="#E3E8EB" stroke="#141414" strokeWidth={5} strokeLinejoin="round" />
      <line x1={0} y1={-16} x2={0} y2={-118} stroke="#AEB7BD" strokeWidth={3} />
      <rect x={-20} y={-14} width={40} height={10} rx={4} fill="#E0B400" stroke="#141414" strokeWidth={4} />
      <rect x={-6} y={-4} width={12} height={30} rx={4} fill="#6D4C41" stroke="#141414" strokeWidth={4} />
      <circle cx={0} cy={30} r={8} fill="#E0B400" stroke="#141414" strokeWidth={4} />
    </g>
  );
  return <g transform={`scale(${s})`}>{pedang(-35)}{pedang(35)}</g>;
};

// Papan kayu bertiang dengan tulisan + ikon vila (pilihan "PENSIUN").
export const PapanPensiun: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-12} y={60} width={24} height={150} fill="#6D4528" stroke="#141414" strokeWidth={6} />
    <path d="M -195 -150 L 195 -150 L 205 70 L -205 70 Z" fill="#B7814A" stroke="#141414" strokeWidth={8} strokeLinejoin="round" />
    {/* serat kayu */}
    {[-110, -60, -10, 40].map((yy, i) => <path key={i} d={`M -190 ${yy} Q -60 ${yy + (i % 2 ? 8 : -8)} 60 ${yy} T 198 ${yy + 4}`} stroke="#94632F" strokeWidth={4} fill="none" />)}
    <path d="M -195 -150 L 195 -150 L 196 -132 L -196 -132 Z" fill="#D49A5C" />
    {[[-180, -134], [180, -134], [-188, 52], [188, 52]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={8} fill="#7A7A7A" stroke="#141414" strokeWidth={3} />)}
    <g transform="translate(0 -76)"><IkonVila s={0.78} /></g>
    <TeksKomik x={0} y={36} teks="PENSIUN" ukuran={74} atas="#FFFFFF" bawah="#F2E3C2" sisi="#5A3A1C" />
  </g>
);

// Perisai merah berbingkai emas dengan pedang bersilang (pilihan "DUEL LAGI").
export const PerisaiDuel: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g transform="translate(0 -20)"><PedangSilang s={1.35} /></g>
    <path d="M -170 -140 Q 0 -175 170 -140 L 165 40 Q 140 140 0 180 Q -140 140 -165 40 Z" fill="#B3261E" stroke="#141414" strokeWidth={8} strokeLinejoin="round" />
    <path d="M -146 -118 Q 0 -148 146 -118 L 142 36 Q 120 122 0 156 Q -120 122 -142 36 Z" fill="none" stroke="#E0B400" strokeWidth={10} />
    <path d="M -150 -120 Q -170 20 -120 110" stroke="#7E1A14" strokeWidth={10} fill="none" />
    <circle cx={0} cy={-62} r={26} fill="#E0B400" stroke="#141414" strokeWidth={6} />
    <circle cx={-8} cy={-70} r={8} fill="#FFF3A6" />
    <TeksKomik x={0} y={40} teks="DUEL" ukuran={86} />
    <TeksKomik x={0} y={118} teks="LAGI!" ukuran={70} />
  </g>
);

// Karangan daun salam (hiasan penghitung 1×–4×).
export const DaunSalam: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-1, 1].map((sd) =>
      Array.from({ length: 7 }, (_, i) => {
        const a = Math.PI / 2 + sd * (0.5 + i * 0.32);
        const px = Math.cos(a) * r, py = Math.sin(a) * r * 0.8;
        return <ellipse key={`${sd}${i}`} cx={px} cy={py} rx={r * 0.16} ry={r * 0.07} fill={i % 2 ? "#7FA34A" : "#5B8C2E"} stroke="#141414" strokeWidth={4} transform={`rotate(${(a * 180) / Math.PI + 90 * sd} ${px} ${py})`} />;
      }),
    )}
  </g>
);

// Label harga perunggu bertali (untuk "MAHAL").
export const LabelPerunggu: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} strokeLinejoin="round">
    <path d="M 0 -150 Q 6 -110 -2 -78" stroke="#7A4E2D" strokeWidth={6} fill="none" />
    <path d="M -110 -78 L 80 -78 L 128 -12 L 80 54 L -110 54 Q -124 54 -124 40 L -124 -64 Q -124 -78 -110 -78 Z" fill="#C9922E" stroke="#141414" strokeWidth={7} />
    <path d="M -104 -64 L 74 -64 L 112 -12 L 74 40 L -104 40 Z" fill="none" stroke="#F2C766" strokeWidth={4} />
    <circle cx={94} cy={-12} r={12} fill="#3A2A1A" stroke="#141414" strokeWidth={4} />
    {/* tumpukan koin */}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={-78} cy={20 - i * 12} rx={22} ry={8} fill="#E0B400" stroke="#141414" strokeWidth={4} />)}
    <TeksKomik x={14} y={2} teks="MAHAL" ukuran={40} jarak={0.5} atas="#FFE6E0" bawah="#E8473A" sisi="#5E1410" />
  </g>
);
