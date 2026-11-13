import React from "react";
import { Pose, W, H, project } from "./kamera";

export type JenisLatar = "dek_malam" | "dek_siang" | "bawah_dek" | "kabin";

// Helper menggambar poligon 3D (quad/triangle) yang diproyeksikan ke layar 2D
const Poly3D: React.FC<{
  kam: Pose;
  pts: [number, number, number][];
  fill: string;
  stroke?: string;
  tebal?: number;
  opacity?: number;
}> = ({ kam, pts, fill, stroke = "#141414", tebal = 3, opacity = 1 }) => {
  const proj = pts.map(([x, y, z]) => project(kam, x, y, z));
  if (proj.some((p) => !p.visible)) return null;
  const d = proj.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
  return <path d={d} fill={fill} stroke={stroke} strokeWidth={tebal} strokeLinejoin="round" opacity={opacity} />;
};

// Helper menggambar garis 3D (seperti tali layar dan sambungan papan dek)
const Line3D: React.FC<{
  kam: Pose;
  a: [number, number, number];
  b: [number, number, number];
  stroke?: string;
  tebal?: number;
}> = ({ kam, a, b, stroke = "#1E130A", tebal = 3 }) => {
  const pa = project(kam, a[0], a[1], a[2]);
  const pb = project(kam, b[0], b[1], b[2]);
  if (!pa.visible || !pb.visible) return null;
  return <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={stroke} strokeWidth={tebal} strokeLinecap="round" />;
};

export const Set3D: React.FC<{
  kam: Pose;
  latar?: JenisLatar;
  t?: number;
  papanTerjun?: boolean;
  kapalJauhZ?: number;
  kapalKabur?: number;
  petiTerbuka?: number;
}> = ({ kam, latar = "dek_malam", t = 0, papanTerjun = false, kapalJauhZ = -18, kapalKabur = 0, petiTerbuka = -1 }) => {
  const malam = latar === "dek_malam";
  const cakrawala = project(kam, 0, 0, -60);
  const yLaut = Math.max(250, Math.min(1150, cakrawala.y));

  // Warna-warna atmosfer sesuai waktu
  const langitAtas =
    latar === "dek_malam" ? "#060D1A" :
    latar === "bawah_dek" ? "#0D0704" :
    latar === "kabin" ? "#1C1008" : "#2980B9";
  const langitBawah =
    latar === "dek_malam" ? "#162B4D" :
    latar === "bawah_dek" ? "#1F1209" :
    latar === "kabin" ? "#382010" : "#85D7FF";

  const warnaDek = malam ? "#4A301B" : "#8C5A32";
  const warnaDekGelap = malam ? "#2E1C0E" : "#5C381B";
  const warnaPagar = malam ? "#362010" : "#6E4423";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="langitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={langitAtas} />
          <stop offset="100%" stopColor={langitBawah} />
        </linearGradient>
        <linearGradient id="lautGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={malam ? "#0A223D" : "#1B6CA8"} />
          <stop offset="100%" stopColor={malam ? "#040E1C" : "#0F4C81"} />
        </linearGradient>
      </defs>

      {/* Latar Langit / Dinding Dasar */}
      <rect x={0} y={0} width={W} height={H} fill="url(#langitGrad)" />

      {(latar === "dek_malam" || latar === "dek_siang") && (
        <>
          {/* Bintang & Bulan di Malam Hari */}
          {malam && (
            <g>
              <circle cx={880} cy={220} r={55} fill="#FFF8D6" opacity={0.9} />
              <circle cx={860} cy={205} r={48} fill={langitAtas} />
              {[
                [150, 140], [320, 210], [520, 120], [720, 260], [210, 340], [940, 380], [640, 180]
              ].map(([bx, by], i) => (
                <circle key={i} cx={bx} cy={by} r={3 + (i % 2)} fill="#FFFFFF" opacity={0.5 + 0.4 * Math.sin(t * 3 + i)} />
              ))}
            </g>
          )}

          {/* Samudra & Ombak */}
          <rect x={0} y={yLaut} width={W} height={H - yLaut} fill="url(#lautGrad)" />
          {Array.from({ length: 6 }).map((_, i) => {
            const wy = yLaut + 50 + i * 75;
            const wx = Math.sin(t * 2 + i) * 35;
            return (
              <path
                key={i}
                d={`M ${100 + wx} ${wy} Q ${300 + wx} ${wy - 15} ${500 + wx} ${wy} T ${950 + wx} ${wy}`}
                stroke={malam ? "#1E4875" : "#56B4E9"}
                strokeWidth={5}
                fill="none"
                opacity={0.45}
              />
            );
          })}

          {/* Kapal Dagang di Kejauhan (Beat 5, 7, 9) */}
          {(() => {
            const kp = project(kam, 1.8 + kapalKabur * 4.5, 0.2, kapalJauhZ);
            if (!kp.visible) return null;
            const miring = kapalKabur * 18;
            return (
              <g transform={`translate(${kp.x}, ${kp.y}) rotate(${miring}) scale(0.85)`}>
                {/* Lambung Kapal Musuh */}
                <polygon points="-140,0 140,0 110,70 -110,70" fill="#6E4423" stroke="#141414" strokeWidth={6} />
                {/* Tiang & Layar Kapal Musuh */}
                <line x1={0} y1={0} x2={0} y2={-190} stroke="#3E2410" strokeWidth={10} />
                <rect x={-95} y={-170} width={190} height={115} rx={8} fill="#F5EEDC" stroke="#141414" strokeWidth={5} />
              </g>
            );
          })()}

          {/* Sirip Hiu Berputar di Laut Sebelah Kiri (Beat 1) */}
          {papanTerjun && (() => {
            const hp = project(kam, -3.5 + Math.cos(t * 2.5) * 0.6, -0.6, 0.8 + Math.sin(t * 2.5) * 0.5);
            if (!hp.visible) return null;
            return (
              <g transform={`translate(${hp.x}, ${hp.y})`}>
                <ellipse cx={0} cy={15} rx={55} ry={16} fill="none" stroke="#85D7FF" strokeWidth={4} strokeDasharray="12 8" />
                <path d="M -25 10 L 5 -45 L 28 10 Z" fill="#3A4A58" stroke="#141414" strokeWidth={6} strokeLinejoin="round" />
              </g>
            );
          })()}

          {/* Lantai Dek Kapal 3D */}
          <Poly3D
            kam={kam}
            pts={[[-4.2, 0, -8], [4.2, 0, -8], [4.2, 0, 5], [-4.2, 0, 5]]}
            fill={warnaDek}
            tebal={5}
          />
          {/* Garis Papan-Papan Lantai Dek Perspektif 3D */}
          {Array.from({ length: 13 }).map((_, i) => {
            const x = -3.6 + i * 0.6;
            return <Line3D key={i} kam={kam} a={[x, 0, -8]} b={[x, 0, 5]} stroke={warnaDekGelap} tebal={3} />;
          })}

          {/* Pagar Lambung Kiri & Kanan 3D */}
          <Poly3D
            kam={kam}
            pts={[[-4.2, 0, -8], [-4.2, 1.05, -8], [-4.2, 1.05, 5], [-4.2, 0, 5]]}
            fill={warnaPagar}
            tebal={5}
          />
          <Poly3D
            kam={kam}
            pts={[[4.2, 0, -8], [4.2, 1.05, -8], [4.2, 1.05, 5], [4.2, 0, 5]]}
            fill={warnaPagar}
            tebal={5}
          />
          {/* Dinding Dek Belakang (Stern) */}
          <Poly3D
            kam={kam}
            pts={[[-4.2, 0, -6.5], [4.2, 0, -6.5], [4.2, 1.5, -6.5], [-4.2, 1.5, -6.5]]}
            fill={warnaPagar}
            tebal={5}
          />

          {/* Papan Terjun ke Laut (Beat 1) */}
          {papanTerjun && (
            <Poly3D
              kam={kam}
              pts={[[-4.8, 0.85, 0.8], [-1.3, 0.85, 0.8], [-1.3, 0.85, 1.45], [-4.8, 0.85, 1.45]]}
              fill="#9C6635"
              tebal={5}
            />
          )}

          {/* Tiang Utama Kapal (Mast) & Tali Rigging */}
          <Poly3D
            kam={kam}
            pts={[[-0.35, 0, -2.2], [0.35, 0, -2.2], [0.28, 6.5, -2.2], [-0.28, 6.5, -2.2]]}
            fill={malam ? "#2B1B0E" : "#5C3A1E"}
            tebal={6}
          />
          <Line3D kam={kam} a={[-4.0, 1.0, -2.0]} b={[-0.25, 5.2, -2.2]} stroke="#141414" tebal={4} />
          <Line3D kam={kam} a={[4.0, 1.0, -2.0]} b={[0.25, 5.2, -2.2]} stroke="#141414" tebal={4} />
          <Line3D kam={kam} a={[-4.0, 1.0, -1.2]} b={[-0.25, 4.8, -2.2]} stroke="#141414" tebal={3} />
          <Line3D kam={kam} a={[4.0, 1.0, -1.2]} b={[0.25, 4.8, -2.2]} stroke="#141414" tebal={3} />

          {/* Meriam Kiri & Kanan */}
          {[-2.8, 1.8].map((mx, i) => {
            const mp = project(kam, mx, 0.35, -1.2);
            if (!mp.visible) return null;
            return (
              <g key={i} transform={`translate(${mp.x}, ${mp.y})`}>
                <rect x={-45} y={-20} width={90} height={42} rx={10} fill="#262A30" stroke="#141414" strokeWidth={6} />
                <circle cx={-25} cy={25} r={16} fill="#4A2E16" stroke="#141414" strokeWidth={5} />
                <circle cx={25} cy={25} r={16} fill="#4A2E16" stroke="#141414" strokeWidth={5} />
              </g>
            );
          })}

          {/* Peti Harta Karun Besar di Tengah Dek (Beat 8 & 9) */}
          {petiTerbuka >= 0 && (() => {
            const pp = project(kam, 0, 0.35, 0.6);
            if (!pp.visible) return null;
            return (
              <g transform={`translate(${pp.x}, ${pp.y})`}>
                {/* Cahaya Emas Saat Peti Dibuka */}
                {petiTerbuka > 0.2 && (
                  <circle cx={0} cy={-40} r={130 * petiTerbuka} fill="#FFE066" opacity={0.35} />
                )}
                {/* Badan Peti */}
                <rect x={-115} y={-45} width={230} height={115} rx={12} fill="#6E3B16" stroke="#141414" strokeWidth={8} />
                {/* Sabuk Emas Peti */}
                <rect x={-115} y={-10} width={230} height={24} fill="#F5B800" stroke="#141414" strokeWidth={6} />
                <rect x={-22} y={-22} width={44} height={48} rx={6} fill="#FFD700" stroke="#141414" strokeWidth={6} />
                {/* Tutup Peti Terangkat */}
                <g transform={`translate(0, ${-45 - petiTerbuka * 45}) scale(1, ${1 - petiTerbuka * 0.35})`}>
                  <rect x={-120} y={-45} width={240} height={48} rx={14} fill="#8A4B1C" stroke="#141414" strokeWidth={8} />
                </g>
              </g>
            );
          })()}
        </>
      )}

      {latar === "bawah_dek" && (
        <>
          {/* Dinding Kayu Bawah Dek */}
          <rect x={0} y={0} width={W} height={1150} fill="#1B0F07" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={0} y1={140 * i} x2={W} y2={140 * i} stroke="#0F0804" strokeWidth={6} />
          ))}
          {/* Lantai Bawah Dek */}
          <Poly3D
            kam={kam}
            pts={[[-4.5, 0, -5], [4.5, 0, -5], [4.5, 0, 5], [-4.5, 0, 5]]}
            fill="#2B180C"
            tebal={5}
          />
          {/* Meja Makan Kayu Panjang */}
          <Poly3D
            kam={kam}
            pts={[[-1.8, 0.72, -0.2], [1.8, 0.72, -0.2], [1.8, 0.72, 1.1], [-1.8, 0.72, 1.1]]}
            fill="#523218"
            tebal={6}
          />
        </>
      )}

      {latar === "kabin" && (
        <>
          {/* Dinding Kabin Kapten */}
          <rect x={0} y={0} width={W} height={1120} fill="#361F10" />
          {/* Jendela Bulat Kabin Menghadap Laut */}
          <circle cx={540} cy={460} r={145} fill="#58B4FF" stroke="#241308" strokeWidth={24} />
          <line x1={395} y1={460} x2={685} y2={460} stroke="#241308" strokeWidth={14} />
          <line x1={540} y1={315} x2={540} y2={605} stroke="#241308" strokeWidth={14} />
          {/* Lantai Kabin */}
          <Poly3D
            kam={kam}
            pts={[[-4.5, 0, -5], [4.5, 0, -5], [4.5, 0, 5], [-4.5, 0, 5]]}
            fill="#4A2B16"
            tebal={5}
          />
          {/* Meja Juru Tulis / Kapten */}
          <Poly3D
            kam={kam}
            pts={[[-1.5, 0.75, 0.2], [1.5, 0.75, 0.2], [1.5, 0.75, 1.2], [-1.5, 0.75, 1.2]]}
            fill="#6E411F"
            tebal={6}
          />
        </>
      )}
    </svg>
  );
};
