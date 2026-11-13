import React from "react";

// v10 (2026-11-11): anak panah di tingkat adegan (layar 1080x1920), untuk samurai pemanah.
// Gaya sama dengan pustaka karakter: garis hitam tebal, bulu putih-merah, tanpa darah.
// - PanahMelesat: satu panah terbang dari titik A ke B dalam `lama` detik, dengan garis kecepatan.
// - HujanPanah: banyak panah jatuh miring dari atas layar ke deretan titik sasaran, satu per satu.

const acak = (seed: number, i: number) => {
  const x = Math.sin(seed * 127.1 + i * 311.7 + 0.5) * 43758.5453;
  return x - Math.floor(x);
};

// Gambar satu panah dengan ekor di (0,0) dan ujung mengarah ke +x. s = skala.
const Panah: React.FC<{ x: number; y: number; sudut: number; s?: number; opacity?: number }> = ({ x, y, sudut, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${sudut.toFixed(1)}) scale(${s})`} opacity={opacity}>
    <line x1={-4} y1={0} x2={150} y2={0} stroke="#141414" strokeWidth={9} strokeLinecap="round" />
    <line x1={-4} y1={0} x2={148} y2={0} stroke="#B98A5A" strokeWidth={5} strokeLinecap="round" />
    <path d="M 146 -9 L 176 0 L 146 9 Z" fill="#DDE3E7" stroke="#141414" strokeWidth={4} strokeLinejoin="round" />
    <path d="M 0 0 L -18 -14 L 12 -14 L 26 0 Z M 0 0 L -18 14 L 12 14 L 26 0 Z" fill="#FFFFFF" stroke="#141414" strokeWidth={3.5} strokeLinejoin="round" />
    <line x1={6} y1={-10} x2={6} y2={10} stroke="#E8352B" strokeWidth={4} />
  </g>
);

const mulus = (k: number) => k * k * (3 - 2 * k);

export const PanahMelesat: React.FC<{
  t: number; mulai: number; lama?: number; dari: [number, number]; ke: [number, number]; s?: number; tetap?: boolean;
}> = ({ t, mulai, lama = 0.25, dari, ke, s = 1, tetap = true }) => {
  const d = t - mulai;
  if (d < 0) return null;
  const k = Math.min(1, d / lama);
  if (k >= 1 && !tetap) return null;
  const sudut = (Math.atan2(ke[1] - dari[1], ke[0] - dari[0]) * 180) / Math.PI;
  const x = dari[0] + (ke[0] - dari[0]) * k, y = dari[1] + (ke[1] - dari[1]) * k;
  // goyang sebentar setelah menancap
  const goyang = k >= 1 ? Math.exp(-(d - lama) * 14) * Math.sin((d - lama) * 60) * 5 : 0;
  const rad = (sudut * Math.PI) / 180;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {k < 1 && [0, 1, 2].map((i) => (
        <line key={i} x1={x - Math.cos(rad) * (40 + i * 30)} y1={y - Math.sin(rad) * (40 + i * 30) + (i - 1) * 12}
          x2={x - Math.cos(rad) * (140 + i * 40)} y2={y - Math.sin(rad) * (140 + i * 40) + (i - 1) * 12}
          stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7 - i * 0.2} />
      ))}
      <Panah x={x - Math.cos(rad) * 176 * s} y={y - Math.sin(rad) * 176 * s} sudut={sudut + goyang} s={s} />
    </svg>
  );
};

// Hujan panah: `jumlah` panah jatuh bergantian mulai `mulai` detik, tiap `jeda` detik, ke titik sasaran
// yang tersebar di sepanjang garis dari `sasaranKiri` ke `sasaranKanan` (layar px). `arah` = dari kiri (1) / kanan (-1).
export const HujanPanah: React.FC<{
  t: number; mulai: number; jumlah?: number; jeda?: number; lama?: number;
  sasaranKiri: [number, number]; sasaranKanan: [number, number]; arah?: 1 | -1; seed?: number; s?: number;
}> = ({ t, mulai, jumlah = 10, jeda = 0.09, lama = 0.32, sasaranKiri, sasaranKanan, arah = 1, seed = 1, s = 0.8 }) => {
  if (t < mulai) return null;
  return (
    <>
      {Array.from({ length: jumlah }, (_, i) => {
        const k = acak(seed, i);
        const ke: [number, number] = [sasaranKiri[0] + (sasaranKanan[0] - sasaranKiri[0]) * k, sasaranKiri[1] + (sasaranKanan[1] - sasaranKiri[1]) * k + (acak(seed, i + 40) - 0.5) * 30];
        const dari: [number, number] = [ke[0] - arah * (500 + acak(seed, i + 20) * 200), ke[1] - 1100];
        return <PanahMelesat key={i} t={t} mulai={mulai + i * jeda} lama={lama * (0.85 + acak(seed, i + 60) * 0.3)} dari={dari} ke={ke} s={s} />;
      })}
    </>
  );
};

export { mulus };
